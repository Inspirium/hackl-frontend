<template>
  <div>
    <div class="hero noimage is-danger">
      <div class="content has-text-white has-text-centered m-t-20">
        <b-icon icon="cog" size="is-large" pack="fal"> </b-icon>
      </div>
      <h1 class="has-text-white">{{ $t('upravljanjeKlubovima') }}</h1>
    </div>
    <div class="x-container registration">
      <div class="tablelist">
        <div class="buttons m-t-20">
          <b-button
            class="fw600 m-t-20"
            type="is-primary"
            pack="fal"
            icon-right="plus-circle"
            rounded
            tag="nuxt-link"
            :to="localePath('/superadmin/new')"
          >
            {{ $t('noviKlub') }}
          </b-button>
        </div>
        <div class="fw600 is-size-55 m-l-5 m-t-10 m-b-10">{{ $t('popisKlubova') }}</div>
        <b-table :data="clubs" :mobile-cards="false" :bordered="false" class="p-b-75">
          <b-table-column
            v-slot="props"
            :td-attrs="(row) => ({ class: row.id === user.id ? 'active list__image-col' : 'list__image-col' })"
          >
            <nuxt-link :to="localePath('/superadmin/' + props.row.id)" class="fw600">
              <div v-if="props.row.logo" class="list__img">
                <TennisImage :size="[42, 42]" :src="props.row.logo" class="user_image" alt="" />
              </div>
              <div class="list__content">
                <h4 class="fw600 is-size-5 m-t--2">
                  {{ props.row.name }}
                </h4>
                <h3 class="fw600 has-text-lightblue is-size-65">{{ props.row.subdomain }}.tenis.plus</h3>
              </div>
            </nuxt-link>
          </b-table-column>
        </b-table>
      </div>
    </div>
  </div>
</template>
<script>
// import _ from 'lodash'
import Club from '@/models/Club'
import TennisImage from '@/components/TennisImage.vue'

export default {
  name: 'Superadmin',
  components: { TennisImage },
  async fetch() {
    await this.getClubs()
  },
  data() {
    return {
      clubs: [],
      isModalActive: false,
      paymentList: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
  },
  methods: {
    schoolMembers(data) {
      this.$set(this.newSchoolGroup, 'users', data)
    },
    getClubs() {
      Club.limit(100)
        .get()
        .then((res) => {
          this.clubs = res.data
        })
    },
  },
}
</script>
