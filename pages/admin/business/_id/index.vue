<template>
  <div v-if="true" class="p-b-300">
    <PageHeader :title="$t('Podaci o računu')" :background="'is-primary'" />

    <div class="p-x-16">
      <div class="m-t-20">
        <div class="fw600 p-x-16 is-size-65 has-text-centered has-text-black80 subscription-title m-b-20">
          {{ $t('Ovdje možete urediti osnovne podate o poslovnoj jedinici i izgled broja računa') }}
        </div>
        <div class="divider-line-1 m-t-10 m-b-20"></div>

        <ValidationProvider v-slot="{ errors, valid }" name="name" rules="required|max:20">
          <b-field
            :label="$t('Ime poslovne jedinice')"
            class="login__input__container"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors"
          >
            <b-input v-model="business_data.name" type="text" rounded></b-input>
          </b-field>
        </ValidationProvider>
        <ValidationProvider v-slot="{ errors, valid }" name="unit" rules="required|max:20">
          <b-field
            :label="$t('Poslovna jedinica')"
            class="login__input__container"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors"
          >
            <b-input v-model="business_data.business_data.unit" type="text" rounded></b-input>
          </b-field>
        </ValidationProvider>
        <ValidationProvider v-slot="{ errors, valid }" name="unit" rules="required|max:10">
          <b-field
            :label="$t('Uređaj')"
            class="login__input__container"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors"
          >
            <b-input v-model="business_data.business_data.device" type="text" rounded></b-input>
          </b-field>
        </ValidationProvider>
        <template v-if="business_data.operator">
          <div class="label">{{ $t('Operater') }}</div>
          <div class="activity__box action__buttons br100 m-t-5">
            <div class="action__item__small fw600 br100">
              <div v-if="Object.keys(business_data.operator).length" class="align__centar__all w100">
                <TennisImage
                  :size="[42, 42]"
                  :src="business_data.operator.image"
                  class="user_image m-r-10 m-l--5"
                  alt=""
                />
                <div class="list__content">
                  <h3>{{ business_data.operator.display_name }}</h3>
                </div>
                <div
                  @click="
                    business_data.operator = {}
                    business_data.operatorOib = null
                  "
                >
                  <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto m-r-10"> </b-icon>
                </div>
              </div>
              <div v-else class="activity__header" @click="isModalMembersActiveAssignee = true">
                <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
                <div class="list__content">
                  <div class="has-text-black80 fw600 is-size-6">{{ $t('Dodaj osobu') }}</div>
                </div>
              </div>
            </div>
          </div>
          <ValidationProvider
            v-if="Object.keys(business_data.operator).length"
            v-slot="{ errors, valid }"
            name="unit"
            rules="required"
          >
            <b-field
              :label="$t('OIB operatera')"
              class="login__input__container"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-input v-model="business_data.operatorOib" type="number" rounded></b-input>
            </b-field>
          </ValidationProvider>
        </template>

        <div class="label">{{ $t('Aktivan') }}</div>

        <ValidationProvider name="Freeze" rules="required" class="radio__box">
          <div class="block">
            <b-radio v-model="business_data.is_active" :native-value="true"> {{ $t('da') }} </b-radio>
            <b-radio v-model="business_data.is_active" :native-value="false"> {{ $t('ne') }} </b-radio>
          </div>
        </ValidationProvider>
        <div class="label">{{ $t('Osnovni') }}</div>

        <ValidationProvider name="Freeze" rules="required" class="radio__box">
          <div class="block">
            <b-radio v-model="business_data.is_default" :native-value="true"> {{ $t('da') }} </b-radio>
            <b-radio v-model="business_data.is_default" :native-value="false"> {{ $t('ne') }} </b-radio>
          </div>
        </ValidationProvider>
        <b-field :label="$t('Napomene')" class="login__input__container">
          <b-input v-model="business_data.notes" type="textarea" rounded></b-input>
        </b-field>
      </div>
      <div v-if="business_data.business_data.unit" class="empty__box m-t-30 has-text-centered">
        <div class="fw600 p-x-16 is-size-6 has-text-black80 subscription-title m-b-10">
          {{ $t('Primjer izgleda broja računa') }}
        </div>
        <div class="fw600 is-size-5 has-text-primary">
          {{ '1-' + business_data.business_data.unit + '-' + business_data.business_data.device }}
        </div>
      </div>
      <div class="buttons m-t-30 m-b-5">
        <b-button
          class="softshadow m-t-10 m-b-20 invert-small-button"
          type="noborder is-small is-danger has-text-white"
          pack="fal"
          icon-right="times-circle"
          rounded
          :loading="loading_delete"
          @click="deleteIt()"
        >
          {{ $t('Obriši') }}
        </b-button>

        <b-button
          class="softshadow m-t-10 m-b-20 invert-small-button"
          type="noborder is-small is-primary has-text-white"
          pack="fal"
          icon-right="check"
          rounded
          :loading="loading"
          @click="submit()"
        >
          {{ $t('spremi') }}
        </b-button>
      </div>
    </div>
    <b-modal :active.sync="isModalMembersActiveAssignee" :width="640" scroll="clip">
      <modalMembers
        :title="$t('Operater')"
        :show-tennis-school="false"
        :is-player="true"
        @player="business_data.operator = $event"
      />
    </b-modal>
  </div>
</template>

<script>
// import _ from 'lodash'
import PageHeader from '~/components/headers/blankBack'
import BusinessUnit from '~/models/BusinessUnit'
import modalMembers from '~/components/modal/ModalMembersAll'

export default {
  name: 'BusinessUnits',
  components: {
    PageHeader,
    modalMembers,
  },
  data() {
    return {
      isModalMembersActiveAssignee: false,
      loading_delete: false,
      business_data: {
        name: '',
        id: null,
        business_data: {
          unit: null,
          device: '1',
        },
        is_active: true,
        is_default: true,
        operator: {},
        operatorOib: null,
        notes: '',
        invoice_number_structure: '%invoice_number%-%business_data.unit%-%business_data.device%',
      },
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
      BusinessUnit.include('operator')
        .find(this.$route.params.id)
        .then((res) => {
          this.business_data = res
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
          this.$router.push(this.localePath('/admin/business'))
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
    deleteIt() {
      this.loading_delete = true
      const bu = new BusinessUnit({ id: this.business_data.id })
      bu.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste napravili izmjene'),
            type: 'is-success',
          })
          this.loading_delete = false
          this.$router.push(this.localePath('/admin/business'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading_delete = false
        })
    },
  },
}
</script>
