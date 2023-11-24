<template>
  <div class="member">
    <div class="member__info liga__header" :class="ligaHeaderColor">
      <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10">{{ $t('korak3PopisIgraa') }}</div>
    </div>
    <hero :options="heroImage" class="liga__hero--options">
      <h1 class="has-text-white">{{ newCup.name }}</h1>
      <div class="buttons m-t-10">
        <b-button
          class="softshadow m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="times-circle"
          rounded
          :loading="loading"
          @click="deleteLiga"
        >
          {{ $t('obriiKup') }}
        </b-button>
        <b-button
          tag="nuxt-link"
          :to="localePath('edit')"
          class="softshadow m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="user-edit"
          rounded
        >
          {{ $t('urediKup') }}
        </b-button>
      </div>
    </hero>
    <div class="buttons m-t-30">
      <b-button
        class="softshadow m-b-0"
        type="is-small noborder"
        pack="fal"
        icon-right="users"
        size="is-large"
        rounded
        @click="$router.push({ path: localePath('/player/bulk'), query: { id: newCup.id } })"
      >
        {{ $t('Skupna registracija') }}
      </b-button>
    </div>

    <div class="x-container registration">
      <div class="fw600 has-text-centered m-b--10 m-t-0 is-size-65 has-text-lightblue">
        {{ $t('brojMjestaUKupu', { number_of_players: newCup.number_of_players }) }}
      </div>
      <div v-if="!players.length" class="fw600 has-text-centered m-b-5 m-t-15 is-size-5 line-height-16">
        {{ $t('odaberiNatjecateljeKupa') }}
      </div>
      <div v-else class="fw600 has-text-centered m-b-5 m-t-15 is-size-5 line-height-16">
        {{ $t('brojNatjecatelja2', { length: players.length }) }}
      </div>
      <membersSearch :is-doubles="newCup.is_doubles ? true : false" @update="playerList"></membersSearch>
    </div>
    <div class="buttons m-t-10 is-fixed">
      <b-button class="fw600" type="is-danger" pack="fal" icon-right="times" rounded> {{ $t('otkai') }} </b-button>
      <b-button
        class="m-l-10 fw600"
        type="is-primary"
        pack="fal"
        icon-right="chevron-right"
        rounded
        :loading="loading"
        @click="submit()"
      >
        {{ $t('spremi2', { length: players.length }) }}
      </b-button>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import Tournament from '@/models/Tournament'
import hero from '~/components/Hero'
import membersSearch from '~/components/membersSearch'

export default {
  name: 'LigaPlayers',
  components: {
    hero,
    membersSearch,
  },
  async fetch() {
    await this.getLeague()
  },
  data() {
    return {
      heroImage: '/liga.jpg',
      players: [],
      newCup: {
        name: '',
        access_level: 'private',
        application_deadline: new Date(),
        active_to: new Date(),
        active_from: new Date(),
        players_in_groups: 0,
        number_of_players: null,
        playing_sets: null,
        price: 0,
        game_in_set: null,
        last_set: null,
        description: '',
        status: '0',
      },
      newLiga: {
        id: 1,
        name: 'Liga nacija',
        groups: 2,
        playersInGroups: 8,
        roundsOfPlay: 2,
        points: 2,
        moveUp: 2,
        moveDown: 3,
        playingSets: 2,
        gemInSet: null,
        lastSet: null,
        cupInfo: 'Za dodatna pojašnjenja kontaktirajte administratora',
        type: 'privat', // open or privat
        players: [],
        ligaFinishDate: new Date(),
        admin: {
          id: 1,
          display_name: 'Stjepan Administrator',
          image: '/hero_courts.jpg',
        },
      },
      loading: false,
      loading1: false,
    }
  },
  computed: {
    ligaHeaderColor() {
      switch (this.newCup.status) {
        case '0': // Kreirana liga
          return 'primary-light'
        case '1': // Ždrijeb
          return 'primary-light'
        case '2': // Privatna liga - priprema prijave
          return 'primary-light'
        case '3': // Otvorena liga - otvorene prijave
          return 'green'
        case '4':
          return 'green'
        case '5':
          return 'is-red'
      }
      return ''
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
  },
  watch: {},
  methods: {
    getLeague() {
      Tournament.include(['admins'])
        .find(this.$route.params.id)
        .then((res) => {
          this.newCup = res
        })
    },
    playerList(data) {
      this.players = data
    },
    updateStatus() {},
    submit() {
      this.loading = true
      this.$buefy.toast.open({
        message: this.$t('Aktiviranje turnira može potrajati nešto više vremena. Pričekajte...'),
        type: 'is-primary',
        duration: 5000,
      })
      const l = new Tournament({ id: this.newCup.id })
      l.players()
        .attach({ players: this.players })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste dodali igrače u kup'),
            type: 'is-success',
          })
          this.loading = false
          this.newCup.status = '1'
          this.newCup.save()
          this.$router.push(this.localePath('/cup/' + this.$route.params.id + '/liga_create'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading = false
        })
    },
    deleteLiga() {
      this.loading1 = true
      const l = new Tournament({ id: this.newCup.id, status: 1 })
      l.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Kup je obrisan'),
            type: 'is-success',
          })
          this.loading1 = false
          this.$router.push(this.localePath('/cup'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading1 = false
        })
    },
  },
}
</script>
