<template>
  <div v-if="true" class="">
    <PageHeader :title="$t('Poslovne jedinice')" :background="'is-primary'" />
    <div class="p-x-16">
      <div class="buttons m-t-20">
        <b-button
          class="fw600"
          type="is-danger"
          pack="fal"
          icon-right="plus-circle"
          rounded
          tag="nuxt-link"
          :to="localePath('/admin/business/new')"
        >
          {{ $t('izradiNovo') }}
        </b-button>
      </div>
      <div class="activity__box action__buttons m-b-15">
        <nuxt-link
          v-for="item in business_data"
          :key="item.id"
          class="action__item fw600"
          :to="localePath('/admin/business/' + item.id)"
        >
          <span class="is-size-55 has-text-black80 m-r-5">{{ item.name }}</span>
          <span v-if="item.is_default" class="x-tag primary-light m-l-auto m-r-5">{{ $t('Osnovno') }}</span>
          <span>
            <b-icon icon="chevron-right" type="is-black80" pack="fal" class="m-l-5"> </b-icon>
          </span>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import PageHeader from '~/components/headers/blankBack'
import BusinessUnit from '~/models/BusinessUnit'

export default {
  name: 'BusinessUnits',
  components: {
    PageHeader,
  },
  data() {
    return {
      isModalMembersActiveAssignee: false,
      business_data: [],
      loading: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    club() {
      return this.$store.state.club
    },
    invoiceNumber() {
      return this.invoice_number_structure
        .replace('%invoice_number%', 1)
        .replace('%business_data.unit%', this.business_data.business_data.unit)
        .replace('%business_data.device%', this.business_data.business_data.device)
    },
  },
  mounted() {
    this.getBusinessUnit()
  },
  methods: {
    getBusinessUnit() {
      BusinessUnit.where('club', this.club.id)
        .get()
        .then((res) => {
          this.business_data = res.data
        })
    },
    submit() {
      this.loading = true
      const tc = new BusinessUnit(this.business_data)
      tc.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili izmjene'),
            type: 'is-success',
          })
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
  },
}
</script>
