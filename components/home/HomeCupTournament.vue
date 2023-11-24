<template>
  <div v-if="liga.length" class="home__cups tablelist">
    <div class="activity x-container">
      <div class="activity__results">
        <div class="activity__header m-b-10">
          <nuxt-link :to="localePath('/cup')" class="fw600">{{ $t('turniri') }} </nuxt-link>
        </div>
        <div v-if="loading1">
          <b-skeleton :count="5" width="100%" height="60px" :animated="true"></b-skeleton>
        </div>
        <!--            Igrač/Posjetitelj: Prikaži sve lige koje su otvorene prijave, aktivne i završene-->
        <!--            AdminLige: Prikaži sve lige koje su otvorene prijave, aktivne i završene te sve one kojima sam adimin i koje su u izradi-->
        <b-table v-else :data="liga" :mobile-cards="false" :bordered="false" class="overflow-hidden softshadow br10">
          <b-table-column v-slot="props" cell-class="active list__image-col" field="first_name">
            <nuxt-link
              :to="
                localePath(
                  '/cup/' +
                    isElo(props.row.classification) +
                    props.row.id +
                    '/' +
                    link(props.row.status, props.row.type)
                )
              "
              class="fw600"
            >
              <div class="list__content">
                <!--                        <div class="align__centar__y">-->
                <!--                          <h4 class="has-text-grey-light fw600 is-size-7 is-uppercase">-->
                <!--                            <span class="">{{ props.row.type === 'private' ? 'Privatna liga' : 'Otvorena liga' }}</span>-->
                <!--                          </h4>-->
                <!--                        </div>-->
                <h4 class="fw600 is-size-5 m-t--2">
                  {{ props.row.name }}
                </h4>
                <h3 class="fw600 has-text-lightblue is-size-65">
                  {{ $t('brojIgraa') }} {{ props.row.number_of_players }}
                </h3>
              </div>
              <div class="x-tag--xl m-l-auto nowrap" :style="tagColor(props.row.status)">
                {{ status(props.row.status) }}
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
import Tournament from '@/models/Tournament'

export default {
  name: 'HomeCupTournament',
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
          return 'U tijeku'
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
        Tournament.whereIn('status', ['4'])
          .where('club', this.$store.state.club.id)
          .limit(4)
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
