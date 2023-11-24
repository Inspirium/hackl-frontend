<template>
  <div v-if="Object.keys(liga).length" class="cups">
    <div class="member__info liga__header is-red">
      <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10">{{ $t('ureivanjeLige') }}</div>
    </div>
    <hero :options="heroImage" :back="true" class="liga__hero">
      <h1 class="has-text-white">{{ liga.name }}</h1>
    </hero>
    <div class="buttons m-t-20 m-b--20">
      <b-button
        class="softshadow m-t-10 invert-small-button"
        type="is-small noborder is-danger has-text-white"
        pack="fal"
        icon-right="times-circle"
        rounded
        @click="isModalActive = true"
      >
        {{ $t('obriiLigu') }}
      </b-button>
    </div>

    <div class="activity x-container p-b-100">
      <ValidationObserver v-slot="{}">
        <form v-if="!loading" class="p-b-100" @submit.prevent="submit">
          <div class="activity__header m-b--10 m-t-10">
            <div class="fw600 is-size-3">{{ $t('osnovniPodaci') }}</div>
          </div>
          <ValidationProvider v-slot="{ errors, valid }" name="Naziv lige" rules="required">
            <b-field
              :label="$t('nazivLige')"
              class="login__input__container"
              :type="valid ? 'is-success' : 'is-danger'"
              :message="errors"
            >
              <b-input v-model="liga.name" :placeholder="$t('upiiNazivLige')" type="text" rounded> </b-input>
            </b-field>
          </ValidationProvider>

          <adminEdit :options="liga"></adminEdit>
          <template v-if="liga.type !== 'private' && liga.status !== '4'">
            <ValidationProvider name="Rok za prijave" rules="required">
              <div class="label">{{ $t('rokZaPrijave') }}</div>
              <b-field>
                <b-datepicker
                  v-model="liga.finish_onboarding"
                  :placeholder="$t('klikniOvdjeZaOdabir')"
                  :open-on-focus="false"
                  :first-day-of-week="1"
                  trap-focus
                  rounded
                >
                </b-datepicker>
              </b-field>
            </ValidationProvider>
          </template>
          <ValidationProvider name="Rok za završetak lige" rules="required">
            <div class="label">{{ $t('rokZaZavretakLige') }}</div>
            <b-field>
              <b-datepicker
                v-model="liga.finish_date"
                :placeholder="$t('klikniOvdjeZaOdabir')"
                :open-on-focus="false"
                :first-day-of-week="1"
                trap-focus
                rounded
              >
              </b-datepicker>
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            v-if="liga.type !== 'private' && liga.status !== '4'"
            name="Broj prijava"
            rules="required"
          >
            <div class="label">{{ $t('brojPrijava') }}</div>
            <div class="radio__box">
              <div class="block">
                <b-radio v-model="liga.boarding_type" :native-value="0"> {{ $t('neogranien') }} </b-radio>
                <b-radio v-model="liga.boarding_type" :native-value="1">
                  {{ $t('limitIgraa', { expr: liga.number_of_groups * liga.players_in_groups }) }}
                </b-radio>
              </div>
            </div>
          </ValidationProvider>
          <template>
            <div class="divider-line-1 m-t-20"></div>
            <div class="fw600 is-size-55 m-l-5 m-t-15 m-b-7">{{ $t('Prikaz natjecanja na Tenis.plus') }}</div>

            <ValidationProvider v-slot="{ errors, valid }" name="Showing" rules="required" class="radio__box">
              <div class="block">
                <b-radio
                  v-model="liga.show_on_tenisplus"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :native-value="true"
                >
                  {{ $t('Prikaži') }}
                </b-radio>
                <b-radio
                  v-model="liga.show_on_tenisplus"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :native-value="false"
                >
                  {{ $t('sakrij') }}
                </b-radio>
              </div>
            </ValidationProvider>
            <div class="help__text m-t-15">
              <span>{{ $t('objanjenje') }} </span>{{ $t('prikazVaegTurniraNaListiSvihTurniraNaAplikaciji') }}
            </div>
            <div class="fw600 is-size-55 m-l-5 m-t-15 m-b-7">
              {{ $t('Prikaz natjecanja na klupskoj aplikaciji') }}
            </div>

            <ValidationProvider v-slot="{ errors, valid }" name="Showing" rules="required" class="radio__box">
              <div class="block">
                <b-radio v-model="liga.show_in_club" :type="valid ? 'is-success' : 'is-danger'" :native-value="true">
                  {{ $t('Prikaži') }}
                </b-radio>
                <b-radio v-model="liga.show_in_club" :type="valid ? 'is-success' : 'is-danger'" :native-value="false">
                  {{ $t('sakrij') }}
                </b-radio>
              </div>
            </ValidationProvider>
            <div class="help__text m-t-15">
              <span>{{ $t('objanjenje') }} </span
              >{{ $t('Prikaz vašeg natjecanja na listi natjecanja u klupskoj aplikaciji') }}
            </div>
          </template>

          <div class="activity__header m-b--10 m-t-30">
            <div class="fw600 is-size-3">{{ $t('postavkeLige') }}</div>
          </div>
          <template v-if="liga.status !== '4' && liga.status !== '1'">
            <!--            <ValidationProvider name="Broj setova" rules="required">-->
            <!--              <b-field :label="$t('brojSetova')">-->
            <!--                <b-numberinput-->
            <!--                  v-model="liga.playing_sets"-->
            <!--                  min="1"-->
            <!--                  max="10"-->
            <!--                  type="is-white"-->
            <!--                  size="is-small"-->
            <!--                  controls-rounded-->
            <!--                  rounded-->
            <!--                ></b-numberinput>-->
            <!--              </b-field>-->
            <!--            </ValidationProvider>-->
          </template>
          <ValidationProvider name="Napomene" rules="required">
            <div class="label">{{ $t('napomene') }}</div>
            <tinymce-editor v-model="liga.description" class="" />
          </ValidationProvider>
          <div class="m-b-10 m-t-20">
            <div class="fw600 is-size-3">{{ $t('dokumenti') }}</div>
          </div>
          <div class="fw600 has-text-black80 is-size-55 is-text-center">
            {{ $t('ovdjeMoeteSpremitiDokumenteVezaneZaLiguPravilniciR') }}
          </div>
          <div class="fw600 is-size-65 m-t-10 m-b-15 is-text-center">
            {{ $t('dokumentiEBitiVidljiviSvimLanovima') }}
          </div>
          <documentUpload :options="liga" type="league" @reload="getLeague"></documentUpload>
          <div v-if="!dataLoaded" class="buttons m-t-10 is-fixed">
            <b-button
              class="fw600"
              type="is-danger"
              pack="fal"
              icon-right="times"
              rounded
              @click="$router.push(localePath('/liga/elo/' + $route.params.id))"
            >
              {{ $t('otkai') }}
            </b-button>
            <b-button
              class="m-l-10 fw600"
              type="is-primary"
              pack="fal"
              icon-right="check"
              rounded
              :loading="loading"
              @click="submit()"
            >
              {{ $t('spremiIzmjene') }}
            </b-button>
          </div>
        </form>
      </ValidationObserver>
    </div>
    <b-modal :active.sync="isModalActive" :width="640" scroll="clip" class="modal__confirmation">
      <modalConfirmation
        :title="`Potvrdom ćete obrisati turnir ${liga.name}`"
        :subtitle="$t('Jeste li sigurni?')"
        @update="deleteLiga"
      ></modalConfirmation>
    </b-modal>
  </div>
</template>

<script>
import League from '@/models/League'
import hero from '~/components/Hero'
import documentUpload from '~/components/documentUpload'
import adminEdit from '~/components/liga/adminEdit'
import modalConfirmation from '~/components/modal/ModalConfirmation'

export default {
  name: 'LigaEdit',
  components: {
    documentUpload,
    adminEdit,
    hero,
    modalConfirmation,
  },
  async fetch() {
    await this.getLeague()
  },
  data() {
    return {
      heroImage: '/liga.jpg',
      isModalActive: false,
      admin: [
        {
          id: 2,
          email: 'stjepan@inspirium.hr',
          first_name: 'Stjepan',
          last_name: 'Drmić',
          phone: '0914502752',
          address: 'Z. Lozancica 4',
          postal_code: null,
          city: 'Zapresic',
          county: null,
          country: null,
          gender: 'M',
          image: 'https://api.tenis.plus/storage/avatars/2020/10/1603047356_5f8c8fbc96e04.png',
          birthyear: 1978,
          rating: 1481.8305950613,
          power_club: 50.31,
          power_global: 41.9,
          rank_club: 40,
          rank_global: 860,
          primary_club_id: null,
          birth_date: '1978-06-19',
          score: 1482,
          range: '40-50',
          link: '/player/2',
          power: 42.51,
          display_name: 'Stjepan Drmić',
          rounded_power: 50,
          pivot: { league_id: 47, user_id: 2, admin: null, player: 1, rank: null, score: null },
        },
      ],
      loading: false,
      dataLoaded: false,
      isModalMembersActive: false,
      selectedGroup: null,
      selectedPlace: null,
      templiga: {
        boarding_type: 0,
        players_in_groups: 10,
      },
      liga: {
        name: '',
        admin: this.$store.state.auth.user,
        type: 'open',
        number_of_groups: 1,
        players_in_groups: 4,
        rounds_of_play: 1,
        move_up: 1,
        move_down: 1,
        playing_sets: null,
        game_in_set: null,
        last_set: null,
        description: '',
        points: null,
        points_loser: null,
        groupList: [],
        show_on_tenisplus: true,
        show_in_club: true,
      },
      playerList: [],
    }
  },
  computed: {
    nextArrow() {
      if (this.activeStep === 0 && this.liga.name === '') {
        return true
      }
      if (this.activeStep === 7 && this.playerList.length > 0) {
        return true
      } else {
        return false
      }
    },
    nextArrowTwo() {
      if (this.activeStepTwo === 0 && this.liga.name === '') {
        return true
      }
      if (this.activeStepTwo === 5 && this.playerList.length > 0) {
        return true
      } else {
        return false
      }
    },
  },
  watch: {
    liga: {
      immediate: true,
      deep: true,
      handler() {
        this.dataLoaded = false
      },
    },
  },
  methods: {
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
    getLeague() {
      // this.$root.$loading.start()
      League.include(['admins', 'documents'])
        .find(this.$route.params.id)
        .then((res) => {
          res.finish_date = new Date(Date.parse(res.finish_date))
          res.finish_onboarding = new Date(Date.parse(res.finish_onboarding))
          res.playing_sets = parseInt(res.playing_sets)
          res.game_in_set = parseInt(res.game_in_set)
          res.move_up = 0
          res.move_down = 0
          res.boarding_type = res.boarding_type === null ? 0 : res.boarding_type
          this.$root.$loading.finish()
          this.liga = res
          this.$nextTick(() => {
            this.dataLoaded = true
          })
        })
    },
    submit() {
      this.loading = true
      this.liga.finish_onboarding = this.$moment().format('YYYY-MM-DD')
      this.liga.finish_date = this.$moment(this.liga.finish_date).format('YYYY-MM-DD')
      this.liga
        .save()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili promjene'),
            type: 'is-success',
          })
          this.$router.go(-1)
          this.liga.finish_date = new Date(Date.parse(res.finish_date))
          this.liga.finish_onboarding = new Date(Date.parse(res.finish_onboarding))
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t(
              'Došlo je do greške. Provjerite jeste li upisali sve potrebne podatke te pokušajte ponovno'
            ),
            type: 'is-danger',
            duration: 5000,
          })
          this.loading = false
        })
    },
  },
}
</script>
<style scoped>
.has-text-white >>> .icon {
  color: white !important;
}
.tab__navigation {
  opacity: 0;
}
</style>
