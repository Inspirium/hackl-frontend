<template>
  <div v-if="isAdmin" class="p-b-200">
    <hero :page="'player'" :back="true">
      <h1 class="has-text-white">{{ $t('Skupna registracija') }}</h1>
    </hero>
    <div class="p-x-16">
      <div class="player_new p-l-15 p-r-15 m-t-30">
        <div class="fw600 has-text-centered m-t-10 is-size-3 has-text-lightblue m-b-10">{{ $t('1Korak') }}</div>
        <div class="fw600 has-text-centered m-t-10 is-size-5">{{ $t('Bulk uvod') }}</div>
        <div class="fw600 has-text-centered m-t-10 is-size-65">{{ $t('Bulk uvod objašnjenje') }}</div>
      </div>
      <div class="buttons m-t-30">
        <b-button
          class="softshadow m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="file-excel"
          size="is-medium"
          rounded
          tag="a"
          href="/BulkPlayerRegistration.xlsx"
        >
          {{ $t('Preuzmi excel') }}
        </b-button>
      </div>
      <template v-if="isSuccess === 0 || isSuccess === 2">
        <div class="divider-line-1"></div>
        <div class="player_new p-l-15 p-r-15 m-t-30">
          <div class="fw600 has-text-centered m-t--10 is-size-3 has-text-lightblue m-b-10">{{ $t('2Korak') }}</div>
          <div class="fw600 has-text-centered m-t--10 is-size-6">{{ $t('Bulk učitaj') }}</div>
        </div>
        <div class="buttons flex flex__column m-t-30">
          <b-field class="file is-primary" :class="{ 'has-name': !!file }">
            <b-upload v-model="file" class="file-label">
              <span class="file-cta">
                <b-icon class="" icon="upload"></b-icon>
                <span class="file-label">{{ $t('Učitaj korisnike') }}</span>
              </span>
            </b-upload>
          </b-field>
          <div v-if="file" class="file-name block">
            {{ file.name }}
          </div>
        </div>
      </template>
      <div class="divider-line-1 m-t-30"></div>
      <template v-if="isSuccess === 1">
        <section class="has-text-centered m-t-20">
          <b-icon icon="circle-check" type="is-success" size="is-large" pack="fal"></b-icon>
        </section>
        <div class="fw600 has-text-centered is-size-5">{{ $t('Bulk uspješno') }}</div>
        <div class="buttons m-t-30">
          <b-button
            class="softshadow m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-right="users"
            size="is-medium"
            rounded
            @click="$router.push(localePath('/player'))"
          >
            {{ $t('popisIgraa2') }}
          </b-button>
        </div>
      </template>
      <section v-if="isSuccess === 2" class="section has-text-centered">
        <b-icon icon="exclamation-square" type="is-danger" size="is-large" pack="fal"></b-icon>
        <div class="fw600 is-size-45 has-text-centered has-text-black80 m-b-10 m-t-0">
          {{ $t('Došlo je do greške pri unosu. Provjerite unesene podatke u Excelu u pokušajte ponovno.') }}
        </div>
      </section>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import hero from '~/components/Hero'
import ReservationCount from '~/models/ReservationCount'

export default {
  name: 'BulkPlayerRegistration',
  components: { hero },
  data() {
    return {
      file: null,
      image: null,
      newMembers: [],
      loading: false,
      loading2: false,
      isSuccess: 0,
      cup: {
        name: '',
        is_doubles: false,
        price: null,
        online_payment: 0,
        access_level: 'private',
        application_deadline: new Date(),
        active_to: new Date(),
        active_from: new Date(),
        players_in_groups: 0,
        number_of_players: null,
        league_id: null,
        playing_sets: 1,
        game_in_set: 6,
        last_set: 'classic',
        description: '',
        status: 2,
        cup_scoring: null,
        show_on_tenisplus: true,
        show_in_club: true,
      },
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    isForTournament() {
      return this.$route.query.id !== undefined
    },
  },
  watch: {
    file() {
      this.loading = true
      const formData = new FormData()
      formData.append('file', this.file)
      if (this.$route.query.id) formData.append('tournament', this.$route.query.id)
      this.$axios
        .post('v2/import/users', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste učitali novu listu igrača'),
            type: 'is-success',
          })
          this.loading = false
          this.isSuccess = 1
          if (this.isForTournament) {
            this.$router.push(this.localePath('/cup/' + this.$route.query.id + '/liga_create'))
          }
        })
        .catch((res) => {
          this.$buefy.toast.open({
            message: this.$t(
              'Došlo je do greške. Provjerite jeste li upisali sve potrebne podatke te pokušajte ponovno'
            ),
            type: 'is-danger',
            duration: 5000,
          })
          this.loading = false
          this.isSuccess = 2
        })
    },
  },
  mounted() {
    this.getReservations()
  },
  methods: {
    getReservations() {
      this.loading = true
      const rc = new ReservationCount()
      rc.get().then((res) => {
        this.newMembers = res
        this.loading = false
      })
    },
  },
}
</script>
