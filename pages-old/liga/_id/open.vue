<template>
  <div class="member">
    <div class="member__info liga__header is-red">
      <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10">{{ $t('korak3OpcijeZaPrijavuIgraa') }}</div>
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
    <section class="x-container registration m-t-20 m-b-20">
      <div class="activity__header x-container m-b-10 m-t-10">
        <div class="fw600 is-size-3">{{ $t('prijavniPodaci') }}</div>
      </div>
      <div class="activity__header m-b-5 m-t-5">
        <div class="fw600 is-size-6">{{ $t('rokZaPrijavu') }}</div>
      </div>
      <b-field>
        <b-datepicker
          v-model="liga.finish_onboarding"
          :placeholder="$t('klikniOvdjeZaOdabir')"
          :first-day-of-week="1"
          :open-on-focus="false"
          trap-focus
        >
        </b-datepicker>
      </b-field>
      <div class="activity__header m-b-5 m-t-5">
        <div class="fw600 is-size-6">{{ $t('brojPrijava') }}</div>
      </div>

      <div class="radio__box">
        <div class="block">
          <b-radio v-model="liga.boarding_type" :native-value="0"> {{ $t('neogranien') }} </b-radio>
          <b-radio v-model="liga.boarding_type" :native-value="1">
            {{ $t('limitIgraa', { expr: liga.players_in_groups * liga.number_of_groups }) }}
          </b-radio>
        </div>
      </div>

      <div class="activity__header m-b-5 m-t-15">
        <div class="fw600 is-size-6">{{ $t('rokZaZavretakLige') }}</div>
      </div>
      <b-field>
        <b-datepicker
          v-model="liga.finish_date"
          :placeholder="$t('klikniOvdjeZaOdabir')"
          :first-day-of-week="1"
          :open-on-focus="false"
          trap-focus
        >
        </b-datepicker>
      </b-field>
      <div class="help__text m-t-15">
        <span>{{ $t('objanjenje') }} </span>{{ $t('neogranienePrijaveTrajuDoZadanogDatumaTeSeMoePrija') }}
      </div>
    </section>

    <div class="x-container registration">
      <div class="p-b-100">
        <div class="activity__header m-b-10 m-t-10">
          <div class="fw600 is-size-3">{{ $t('osnovniPodaci') }}</div>
        </div>
        <adminEdit class="m-t--10" :options="liga"></adminEdit>
        <div class="display-data__box m-t-10">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('nazivLige') }}</div>
          <div class="fw600 is-size-5">{{ liga.name }}</div>
        </div>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('datumZavretkaLige') }}</div>
          <div class="fw600 is-size-5">
            {{ $moment(liga.finish_date).format('dddd' + ', ' + 'DD' + '.' + 'MM' + '.') }}
          </div>
        </div>
        <div class="m-t-10 m-b-15 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
            {{ $t('trenutniBrojNatjecatelja') }}
          </div>
          <div v-if="liga.players !== undefined" class="fw600 is-size-5">
            {{ liga.players.length ? liga.players.length : $t('Nema prijavljenih') }}
          </div>
        </div>
        <div v-if="liga.boarding_type === 0" class="activity__header m-b-5">
          <div class="fw600 is-size-6 has-text-danger">{{ $t('ovisnoOKonanomBrojuPrijavljenih') }}</div>
        </div>
        <section class="liga__open__info__box">
          <div class="display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
              {{ $t('brojNatjecateljskihGrupa') }}
            </div>
            <div class="fw600 is-size-5">
              {{ liga.number_of_groups }}
            </div>
          </div>
          <div class="display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('brojIgraaUGrupi') }}</div>
            <div class="fw600 is-size-5">
              {{ liga.players_in_groups }}
            </div>
          </div>
          <div class="display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('brojMeusobnihOgleda') }}</div>
            <div class="fw600 is-size-5">
              {{ liga.rounds_of_play }}
            </div>
          </div>
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
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
              {{ $t('brojNapredovanjaUGrupi') }}
            </div>
            <div class="fw600 is-size-5">
              {{ liga.move_up }}
            </div>
          </div>
          <div class="display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('brojIspadanjaUGrupi') }}</div>
            <div class="fw600 is-size-5">
              {{ liga.move_down }}
            </div>
          </div>
          <div class="display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('brojBodovaZaPobjedu') }}</div>
            <div class="fw600 is-size-5">
              {{ liga.points }}
            </div>
          </div>
          <div class="display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
              {{ $t('brojBodovaZaOsvojeniSet') }}
            </div>
            <div class="fw600 is-size-5">
              {{ liga.points_loser === null ? $t('Nema bodova') : liga.points_loser }}
            </div>
          </div>
          <div class="display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
              {{ $t('brojBodovaZaOdigraniMe') }}
            </div>
            <div class="fw600 is-size-5">
              {{ liga.points_match === null ? $t('Nema bodova') : liga.points_match }}
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
        @click="$router.push(localePath('/liga'))"
      >
        {{ $t('otkai') }}
      </b-button>
      <b-button
        class="m-l-10 fw600"
        type="is-primary"
        pack="fal"
        icon-right="chevron-right"
        rounded
        :loading="loading"
        @click="submit()"
      >
        {{ $t('objaviLigu') }}
      </b-button>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import League from '@/models/League'
import hero from '~/components/Hero'
import adminEdit from '~/components/liga/adminEdit'

export default {
  name: 'LigaPlayers',
  components: {
    hero,
    adminEdit,
  },
  async fetch() {
    await this.getLeague()
  },
  data() {
    return {
      loading: false,
      activeTab: 0,
      heroImage: '/liga.jpg',
      liga: {
        finish_onboarding: new Date(),
        finish_date: new Date(),
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
      League.include(['players', 'admins'])
        .find(this.$route.params.id)
        .then((res) => {
          res.finish_date = new Date(Date.parse(res.finish_date))
          res.finish_onboarding = new Date(Date.parse(res.finish_onboarding))
          res.boarding_type = res.boarding_type === null ? 0 : res.boarding_type
          this.liga = res
        })
    },
    submit() {
      this.loading = true
      const l = new League({
        id: this.liga.id,
        status: 3,
        finish_date: this.liga.finish_date,
        finish_onboarding: this.liga.finish_onboarding,
        boarding_type: this.liga.boarding_type,
      })
      l.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Prijave u ligu su otvorene'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/liga/'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
          })
        })
      this.loading = false
    },
    deleteLiga() {
      this.loading = true
      const l = new League({ id: this.liga.id })
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
