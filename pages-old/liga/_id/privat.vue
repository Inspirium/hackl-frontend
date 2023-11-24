<template>
  <div class="member">
    <div class="member__info liga__header is-red">
      <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10">{{ $t('korak3PopisIgraa') }}</div>
    </div>
    <hero :options="heroImage" class="liga__hero--options">
      <h1 class="has-text-white">{{ liga.name }}</h1>
      <div class="buttons m-t-10">
        <b-button
          class="softshadow m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="times-circle"
          rounded
          @click="deleteLiga"
        >
          {{ $t('obriiLigu') }}
        </b-button>
        <b-button
          tag="nuxt-link"
          :to="localePath('/liga/' + $route.params.id + '/edit')"
          class="softshadow m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="user-edit"
          rounded
        >
          {{ $t('urediLigu') }}
        </b-button>
      </div>
    </hero>

    <div class="x-container registration">
      <div class="fw600 has-text-centered m-b--10 m-t-15 is-size-65 has-text-lightblue">
        {{ $t('brojMjestaULigi', { expr: liga.number_of_groups * liga.players_in_groups }) }}
      </div>
      <div v-if="!players.length" class="fw600 has-text-centered m-b-5 m-t-15 is-size-5 line-height-16">
        {{ $t('odaberiNatjecateljeLige') }}
      </div>
      <div v-else class="fw600 has-text-centered m-b-5 m-t-15 is-size-5 line-height-16">
        {{ $t('brojNatjecatelja2', { length: players.length }) }}
      </div>
      <membersSearch v-if="Object.keys(liga).length" :is-doubles="liga.is_doubles" @update="playerList"></membersSearch>
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
import League from '@/models/League'
import hero from '~/components/Hero'
import membersSearch from '~/components/membersSearch'

export default {
  name: 'LigaPlayers',
  components: {
    hero,
    membersSearch,
  },
  async fetch() {
    await this.$nextTick(() => {
      this.getLeague()
    })
  },
  data() {
    return {
      heroImage: '/liga.jpg',
      players: [],
      liga: {
        players: [],
        status: '1',
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
    }
  },
  computed: {
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
      this.$root.$loading.start()
      League.include(['players', 'admins'])
        .find(this.$route.params.id)
        .then((res) => {
          this.liga = res
          this.$root.$loading.finish()
        })
    },
    playerList(data) {
      this.players = data
    },
    submit() {
      this.$buefy.toast.open({
        message: this.$t('Ovo može potrajati... Pričekajte'),
        type: 'is-primary',
      })
      this.loading = true
      const l = new League({ id: this.liga.id, status: 1 })
      l.save()
      l.players()
        .attach({ players: this.players })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste dodali igrače u ligu'),
            type: 'is-success',
          })
          this.loading = false
          this.$router.push(this.localePath('/liga/' + this.$route.params.id + '/liga_create'))
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
      this.loading = true
      // prvo promijenimo status postojećoj ligi koja ima ovaj id
      const l = new League({ id: this.liga.id, status: 1 })
      l.save()
      // zatim toj ligi dodamo igrače
      l.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Liga je obrisana'),
            type: 'is-success',
          })
          this.loading = false
          this.$router.push(this.localePath('/liga'))
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
