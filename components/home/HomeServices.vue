<template>
  <div v-if="liga.length" class="home__cups tablelist">
    <div class="activity x-container">
      <div class="activity__results">
        <div class="activity__header m-b-10">
          <div class="fw600 is-size-35">{{ $t('usluge') }}</div>
        </div>
        <div v-if="loading1">
          <b-skeleton :count="5" width="100%" height="60px" :animated="true"></b-skeleton>
        </div>
        <div class="home-menu">
          <div class="home-menu-middle radius__12 softshadow">
            <div class="">
              <nuxt-link :to="localePath('/services/stringing/preview')" class="has-text-black50">
                <font-awesome-icon class="m-b-5" icon="fa-light fa-racquet" />
                <div class="nav__menu">{{ $t('pananjeReketa') }}</div>
              </nuxt-link>
            </div>
            <!--            <div class="">-->
            <!--              <nuxt-link :to="localePath('/services/lending')" class="has-text-black50">-->
            <!--                <font-awesome-icon class="m-b-5" icon="fa-light fa-toolbox" />-->
            <!--                <div class="nav__menu">Najam opreme</div>-->
            <!--              </nuxt-link>-->
            <!--            </div>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import League from '@/models/League'

export default {
  name: 'HomeLiga',
  components: {},
  async fetch() {
    await this.getLeague()
  },
  data() {
    return {
      loading1: false,
      isCardModalActive: false,
      hasMobileCards: false,
      isBordered: false,
      liga: [],
      auth: {
        id: 7,
        name: 'Ivan Ivanković Auth',
        user_image: require('../../assets/img/user.jpg'),
        elo: 1603,
        age: 23,
        rank: 4,
      },
      total_reservation: 1221,
      total_user_reservation: 1221,
      services: [{ name: 'Špananje reketa' }],
    }
  },
  methods: {
    link(s, tr) {
      switch (s) {
        case '0':
          return tr === 'private' ? 'privat' : 'open'
        case '1':
          return 'liga_create'
        case '2':
          return 'open'
        case '3':
          return 'open-onboarding'
        case '4':
          return ''
        case '5':
          return 'finish'
      }
      return ''
    },
    status(s) {
      switch (s) {
        case '0': // Kreirana liga
          return 'U izradi'
        case '1': // Ždrijeb
          return 'Ždrijebanje'
        case '2': // Otvorena liga - priprema prijave
          return 'U izradi'
        case '3': // Otvorena liga - otvorene prijave
          return 'Prijave'
        case '4':
          return 'Aktivna'
        case '5':
          return 'Završena'
      }
      return ''
    },
    tagColor(s) {
      switch (s) {
        case '0':
          return 'backgroundColor:#cccccc'
        case '1':
          return 'backgroundColor:#F18F01'
        case '2':
          return 'backgroundColor:#ff3860'
        case '3':
          return 'backgroundColor:#9acd32'
        case '4':
          return 'backgroundColor:#209CEE'
        case '5':
          return 'backgroundColor:#444444'
      }
      return ''
    },
    isElo(e) {
      if (e === 'elo') {
        return 'elo/'
      }
      return ''
    },
    getLeague() {
      if (this.$store.state.club.id) {
        this.loading1 = true
        League.whereIn('status', ['3', '4'])
          .where('club', this.$store.state.club.id)
          .limit(3)
          .get()
          .then((res) => {
            this.liga = res.data
            this.loading1 = false
          })
      }
    },
  },
}
</script>
