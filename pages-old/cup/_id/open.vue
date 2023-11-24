<template>
  <div class="member">
    <div class="member__info liga__header" :class="ligaHeaderColor">
      <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10">{{ $t('korak3OpcijeZaPrijavuIgraa') }}</div>
    </div>
    <hero :options="heroImage" :back="true" class="liga__hero--options">
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
    <section v-if="liga.number_of_players" class="x-container registration m-t-20 m-b-20">
      <template>
        <div class="activity__header m-b-5 m-t-5">
          <div class="fw600 is-size-6">{{ $t('brojPrijava') }}</div>
        </div>

        <div class="radio__box">
          <div class="block">
            <b-radio v-model="liga.boarding_type" :native-value="0"> {{ $t('neogranien') }} </b-radio>
            <b-radio v-model="liga.boarding_type" :native-value="1">
              {{ $t('limitIgraa2', { number_of_players: liga.number_of_players }) }}
            </b-radio>
          </div>
        </div>
        <div class="help__text m-t-15">
          <span>{{ $t('objanjenje') }} </span>{{ $t('neogranienePrijaveTrajuDoZadanogDatumaTeSeMoePrija') }}
        </div>
      </template>
      <!--      <div class="activity__header m-b-5 m-t-15">-->
      <!--        <div class="fw600 is-size-6">Rok za završetak kupa</div>-->
      <!--      </div>-->
      <!--      <b-field>-->
      <!--        <b-datepicker-->
      <!--          v-model="liga.active_to"-->
      <!--          -->
      <!--          placeholder="Klikni ovdje za odabir"-->
      <!--          :open-on-focus="false"-->
      <!--          trap-focus-->
      <!--        >-->
      <!--        </b-datepicker>-->
      <!--      </b-field>-->
    </section>

    <div class="x-container registration">
      <div class="p-b-100">
        <div class="activity__header m-b-10 m-t-10">
          <div class="fw600 is-size-3">{{ $t('osnovniPodaci') }}</div>
        </div>
        <adminEdit class="m-t--10" :options="liga"></adminEdit>
        <div class="display-data__box m-t-10">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('nazivKupa') }}</div>
          <div class="fw600 is-size-5">{{ liga.name }}</div>
        </div>
        <div class="m-t-10 display-data__box m-b-10">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('datumZavretkaPrijava') }}</div>
          <div class="fw600 is-size-5">
            {{ $moment(liga.application_deadline).format('dddd' + ', ' + 'DD' + '.' + 'MM' + '.') }}
          </div>
        </div>
        <div class="m-t-10 display-data__box m-b-10">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('pocetak turnira') }}</div>
          <div class="fw600 is-size-5">
            {{ $moment(liga.active_from).format('dddd' + ', ' + 'DD' + '.' + 'MM' + '.') }}
          </div>
        </div>
        <div class="m-t-10 display-data__box m-b-10">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('datumZavretkaKupa') }}</div>
          <div class="fw600 is-size-5">
            {{ $moment(liga.active_to).format('dddd' + ', ' + 'DD' + '.' + 'MM' + '.') }}
          </div>
        </div>
        <section class="liga__open__info__box">
          <div class="display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('brojSetova') }}</div>
            <div class="fw600 is-size-5">
              {{ liga.playing_sets }}
            </div>
          </div>
          <div class="display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('gemovaPoSetu') }}</div>
            <div class="fw600 is-size-5">
              {{ liga.game_in_set }}
            </div>
          </div>
          <div class="display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('zadnjaIgra') }}</div>
            <div class="fw600 is-size-5">
              {{ $t(`tennis.cups.options.lastGame.${liga.last_set}`) }}
            </div>
          </div>
        </section>
        <div v-if="liga.description" class="m-t-15 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('napomene') }}</div>
          <!-- eslint-disable-next-line -->
          <div class="has-text-left is-size-6 content-tiny m-t-10" v-html="liga.description"></div>
        </div>
      </div>
    </div>
    <div class="buttons m-t-10 is-fixed">
      <b-button
        class="fw600"
        type="is-danger"
        pack="fal"
        icon-right="times"
        rounded
        @click="$router.push(localePath('/cup'))"
      >
        {{ $t('otkai') }}
      </b-button>
      <b-button
        class="m-l-10 fw600"
        type="is-primary"
        pack="fal"
        icon-right="chevron-right"
        rounded
        :loading="loading1"
        @click="submit()"
      >
        {{ $t('objaviKup') }}
      </b-button>
    </div>
  </div>
</template>

<script>
import Tournament from '@/models/Tournament'
import hero from '~/components/Hero'
import adminEdit from '~/components/cup/adminEdit'

export default {
  name: 'LigaPlayers',
  components: {
    hero,
    adminEdit,
  },
  data() {
    return {
      loading: false,
      loading1: false,
      activeTab: 0,
      heroImage: '/liga.jpg',
      liga: {
        finish_onboarding: new Date(),
        finish_date: new Date(),
        boarding_type: 0,
      },
      newLiga: {
        boarding_type: 0,
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
        description: 'Za dodatna pojašnjenja kontaktirajte administratora',
        type: 'open', // open or privat
        players: [],
        ligaFinishDate: new Date(),
        ligaFinishOnboarding: new Date(),
        admin: {
          id: 1,
          display_name: 'Stjepan Administrator',
          image: '/hero_courts.jpg',
        },
      },
    }
  },
  computed: {
    ligaHeaderColor() {
      switch (this.liga.status) {
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
  mounted() {
    this.getLeague()
  },
  methods: {
    getLeague() {
      Tournament.include(['players', 'admins'])
        .find(this.$route.params.id)
        .then((res) => {
          res.active_to = new Date(Date.parse(res.active_to))
          res.active_from = new Date(Date.parse(res.active_from))
          res.finish_onboarding = new Date(Date.parse(res.finish_onboarding))
          res.application_deadline = new Date(Date.parse(res.application_deadline))
          res.boarding_type = res.boarding_type === null ? 0 : res.boarding_type
          this.liga = res
        })
    },
    submit() {
      this.loading1 = true
      this.liga.application_deadline = this.$moment(this.liga.application_deadline).format('YYYY-MM-DD')
      this.liga.active_to = this.$moment(this.liga.active_to).format('YYYY-MM-DD')
      this.liga.active_from = this.$moment(this.liga.active_from).format('YYYY-MM-DD')
      this.liga.status = 3
      const l = new Tournament(this.liga)
      l.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Prijave u kup su otvorene'),
            type: 'is-success',
          })
          this.loading2 = false
          this.$router.push(this.localePath('/cup/'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
          })
          this.loading1 = false
        })
    },
    deleteLiga() {
      this.loading = true
      const l = new Tournament({ id: this.liga.id })
      l.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Kup je obrisana'),
            type: 'is-success',
          })
          this.loading = false
          this.$router.push(this.localePath('/cup'))
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
