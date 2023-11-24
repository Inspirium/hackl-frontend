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
      <b-button
        class="softshadow m-t-10 invert-small-button"
        type="is-small noborder is-primary has-text-white"
        pack="fal"
        icon-right="times-circle"
        rounded
        tag="nuxt-link"
        :to="localePath('/liga/' + liga.id + '/tv')"
      >
        {{ $t('Prikaži na TV') }}
      </b-button>
    </div>

    <div v-if="!loading" class="activity x-container p-b-100">
      <ValidationObserver v-slot="{}">
        <form class="p-b-100" @submit.prevent="submit">
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
            <div class="label">{{ $t('poetakLige') }}</div>
            <b-field>
              <b-datepicker
                v-model="liga.start_date"
                :placeholder="$t('klikniOvdjeZaOdabir')"
                :first-day-of-week="1"
                :open-on-focus="false"
                trap-focus
                rounded
              >
              </b-datepicker>
            </b-field>

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
          <div class="fw600 is-size-55 m-l-5 m-t-20 m-b-7">{{ $t('zamrzavanjeStatusa') }}</div>
          <ValidationProvider v-slot="{ errors, valid }" name="Freeze" rules="required" class="radio__box">
            <div class="block">
              <b-radio v-model="liga.freeze" :type="valid ? 'is-success' : 'is-danger'" :native-value="1">
                {{ $t('omogui') }}
              </b-radio>
              <b-radio v-model="liga.freeze" :type="valid ? 'is-success' : 'is-danger'" :native-value="0">
                {{ $t('nemojOmoguiti') }}
              </b-radio>
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

          <div class="fw600 is-size-55 m-l-5 m-t-20 m-b-7">{{ $t('razliitaBodovanjeZaSvakuGrupu') }}</div>
          <ValidationProvider v-slot="{ errors, valid }" name="Bodovanje" rules="required" class="radio__box">
            <div class="block">
              <b-radio v-model="liga.groups_custom_points" :type="valid ? 'is-success' : 'is-danger'" :native-value="0">
                {{ $t('ne') }}
              </b-radio>

              <b-radio v-model="liga.groups_custom_points" :type="valid ? 'is-success' : 'is-danger'" :native-value="1">
                {{ $t('da') }}
              </b-radio>
            </div>
          </ValidationProvider>

          <div class="activity__header m-b--10 m-t-30">
            <div class="fw600 is-size-3">{{ $t('postavkeLige') }}</div>
          </div>
          <ValidationProvider v-if="liga.status !== '5'" name="Broj natjecateljskih grupa" rules="required">
            <b-field :label="$t('brojNatjecateljskihGrupa')">
              <b-numberinput
                v-model="liga.number_of_groups"
                :placeholder="$t('nema')"
                min="0"
                max="30"
                type="is-white"
                size="is-small"
                controls-rounded
                rounded
              ></b-numberinput>
            </b-field>
          </ValidationProvider>
          <template v-if="liga.status !== '5' && liga.status !== '1'">
            <ValidationProvider name="Broj međusobnih ogleda" rules="required">
              <b-field :label="$t('brojMeusobnihOgleda')">
                <b-numberinput
                  v-model="liga.rounds_of_play"
                  min="1"
                  max="10"
                  type="is-white"
                  size="is-small"
                  controls-rounded
                  rounded
                ></b-numberinput>
              </b-field>
            </ValidationProvider>
            <ValidationProvider name="Broj setova" rules="required">
              <b-field :label="$t('brojSetova')">
                <b-numberinput
                  v-model="liga.playing_sets"
                  min="1"
                  max="10"
                  type="is-white"
                  size="is-small"
                  controls-rounded
                  rounded
                ></b-numberinput>
              </b-field>
            </ValidationProvider>
            <ValidationProvider name="Opcija igranja seta" rules="required">
              <b-field :label="$t('opcijaIgranjaSeta')">
                <b-numberinput
                  v-model="liga.game_in_set"
                  min="1"
                  max="10"
                  type="is-white"
                  size="is-small"
                  controls-rounded
                  rounded
                ></b-numberinput>
              </b-field>
            </ValidationProvider>
            <div class="activity__header m-b--10 m-t-30">
              <div class="fw600 is-size-3">{{ $t('bodovanje') }}</div>
            </div>
            <ValidationProvider name="Broj bodova za pobjedu" rules="required">
              <b-field :label="$t('brojBodovaZaPobjedu')">
                <b-numberinput
                  v-model="liga.points"
                  min="1"
                  max="10"
                  type="is-white"
                  size="is-small"
                  controls-rounded
                  rounded
                ></b-numberinput>
              </b-field>
            </ValidationProvider>

            <ValidationProvider name="Broj bodova za osvojeni set">
              <b-field :label="$t('brojBodovaZaOsvojeniSet')">
                <b-numberinput
                  v-model="liga.points_loser"
                  placeholder="0"
                  min="0"
                  :max="liga.points - 1"
                  type="is-white"
                  size="is-small"
                  controls-rounded
                  rounded
                ></b-numberinput>
              </b-field>
            </ValidationProvider>
            <template v-if="liga.points_loser > 0">
              <div class="activity__header--center m-b-5 m-t-15">
                <div class="fw600 is-size-6">{{ $t('Oduzimanje bodova pobjedniku') }}</div>
              </div>
              <ValidationProvider name="Spol" rules="required" class="radio__box--small m-t-5">
                <div class="block">
                  <b-radio v-model="liga.points_set_winner" :native-value="0">
                    {{ $t('Nemoj oduzeti') }}
                  </b-radio>
                  <b-radio v-model="liga.points_set_winner" :native-value="1">
                    {{ $t('Oduzmi') }}
                  </b-radio>
                </div>
              </ValidationProvider>
              <template v-if="liga.points_set_winner > 0">
                <div class="activity__header--center m-b-5 m-t-15">
                  <div class="fw600 is-size-6">{{ $t('Koliko se bodova oduzima pobjedniku') }}</div>
                </div>
                <ValidationProvider name="Broj bodova za pobjedu" rules="required">
                  <b-field>
                    <b-numberinput
                      v-model="liga.points_set_winner"
                      min="0"
                      :max="liga.points_loser"
                      type="is-white"
                      size="is-small"
                      controls-rounded
                      rounded
                    ></b-numberinput>
                  </b-field>
                </ValidationProvider>
              </template>

              <div class="help__text m-t-15">
                <span>{{ $t('objanjenje') }} </span>{{ $t('Ako pobjednik meča izgubi set, mogu mu se oduzeti bodovi') }}
              </div>
              <div class="divider-line-1 m-t-10"></div>
            </template>
            <ValidationProvider name="Broj bodova za odigrani meč">
              <b-field :label="$t('brojBodovaZaOdigraniMe')">
                <b-numberinput
                  v-model="liga.points_match"
                  placeholder="0"
                  min="0"
                  :max="liga.points - 1"
                  type="is-white"
                  size="is-small"
                  controls-rounded
                  rounded
                ></b-numberinput>
              </b-field>
            </ValidationProvider>
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
          <documentUpload type="league" :options="liga" @reload="getLeague"></documentUpload>
          <div v-if="!dataLoaded" class="buttons m-t-10 is-fixed">
            <b-button
              class="fw600"
              type="is-danger"
              pack="fal"
              icon-right="times"
              rounded
              @click="$router.push(localePath('/liga/' + $route.params.id))"
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
        :title="`Potvrdom ćete obrisati ligu ${liga.name}`"
        :subtitle="$t('Jeste li sigurni?')"
        @update="deleteLiga()"
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
      isModalActive: false,
      heroImage: '/liga.jpg',
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
        move_up: null,
        move_down: null,
        playing_sets: null,
        game_in_set: null,
        start_date: null,
        groups_custom_points: 0,
        last_set: null,
        description: '',
        points: null,
        points_loser: null,
        points_set_winner: 0,
        groupList: [],
        freeze: 1,
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
          if (res.start_date === null) {
            res.start_date = new Date()
          }
          if (res.finish_onboarding === null) {
            res.finish_onboarding = new Date()
          }
          res.finish_date = new Date(Date.parse(res.finish_date))
          res.start_date = new Date(Date.parse(res.start_date))
          res.finish_onboarding = new Date(Date.parse(res.finish_onboarding))
          res.playing_sets = parseInt(res.playing_sets)
          res.game_in_set = parseInt(res.game_in_set)
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
      if (this.liga.type === 'open') {
        this.liga.finish_onboarding = this.$moment(this.liga.finish_onboarding).format('YYYY-MM-DD')
      }
      this.liga.finish_date = this.$moment(this.liga.finish_date).format('YYYY-MM-DD')
      this.liga.start_date = this.$moment(this.liga.start_date).format('YYYY-MM-DD')
      this.liga
        .save()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili promjene'),
            type: 'is-success',
          })
          this.$router.go(-1)
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
