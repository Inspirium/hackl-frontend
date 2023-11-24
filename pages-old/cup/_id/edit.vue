<template>
  <div v-if="Object.keys(liga).length" class="cups">
    <div class="member__info liga__header is-red">
      <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10">{{ $t('ureivanjeKupa') }}</div>
    </div>
    <hero :options="heroImage" :back="true" class="liga__hero">
      <h1 class="has-text-white">{{ liga.name }}</h1>
    </hero>
    <div v-if="isLigaAdmin.length > 0 || isAdmin" class="buttons m-t-20 m-b--20">
      <b-button
        class="softshadow m-t-10 invert-small-button"
        type="is-small noborder is-danger has-text-white"
        pack="fal"
        icon-right="times-circle"
        rounded
        @click="isModalActive = true"
      >
        {{ $t('obriiTurnir') }}
      </b-button>
      <b-button
        v-if="(liga.status === '4' || liga.status === '1') && liga.access_level !== 'private'"
        class="softshadow m-t-10"
        type="is-small noborder"
        pack="fal"
        rounded
        @click="submit('onboarding')"
      >
        {{ $t('prebaciNatjecanjeNaPrijave') }}
      </b-button>
    </div>
    <template v-if="liga.status !== '1'">
      <div v-if="liga.status !== '5'" class="buttons m-t-30">
        <b-button
          class="fw600"
          size="is-medium"
          type="is-primary"
          pack="far"
          icon-right="check"
          rounded
          :loading="loading2"
          @click="submit('close')"
        >
          {{ $t('zavriTurnir') }}
        </b-button>
      </div>
      <!--      <div v-else class="buttons m-t-30">-->
      <!--        <b-button-->
      <!--          class="fw600"-->
      <!--          size="is-medium"-->
      <!--          type="is-primary"-->
      <!--          pack="far"-->
      <!--          icon-right="undo-alt"-->
      <!--          rounded-->
      <!--          :loading="loading2"-->
      <!--          @click="submit('restart')"-->
      <!--        >-->
      <!--          Aktiviraj turnir-->
      <!--        </b-button>-->
      <!--      </div>-->
    </template>
    <div v-if="liga.status === '5'" class="activity x-container m-t-10">
      <div class="activity__header m-b--10">
        <div class="fw600 is-size-3">{{ $t('podaciOPobjedniku') }}</div>
      </div>
      <div class="fw600 has-text-black80 is-size-6 is-text-center m-t-10 m-b-10">
        {{ $t('unesiteFotografijuPobjednikaKupa') }}
      </div>
      <div v-if="liga.winner.image" class="align__centar__all flex__column m-b-20 m-t-20">
        <img :src="liga.winner.image" :class="{ softshadow: true, 'm-b-15': true, inactive: loading }" alt="" />
        <b-button class="is-smaller" :loading="loading" type="is-danger" rounded @click="reset">
          {{ $t('ukloniSliku') }}
        </b-button>
      </div>
      <photoUpload
        v-else
        stencil="rectangle-stencil"
        :aspect-ratio="1.5"
        @update="liga.winner.new_image = $event"
      ></photoUpload>
      <b-field v-if="liga.winner !== undefined" :label="$t('opisFotografije')" class="login__input__container">
        <b-input v-model="liga.winner.description" :placeholder="$t('opiiFotografiju')" type="text" rounded> </b-input>
      </b-field>
    </div>
    <div class="activity x-container p-b-100 m-t--20">
      <ValidationObserver v-slot="{}">
        <form class="p-b-100" @submit.prevent="submit">
          <div class="activity__header m-b--10">
            <div class="fw600 is-size-3">{{ $t('osnovniPodaci') }}</div>
          </div>
          <ValidationProvider v-slot="{ errors }" name="Naziv lige" rules="required">
            <b-field :label="$t('nazivLige')" class="login__input__container" :message="errors">
              <b-input v-model="liga.name" :placeholder="$t('upiiNazivKupa')" type="text" rounded> </b-input>
            </b-field>
          </ValidationProvider>

          <adminEdit :options="liga"></adminEdit>
          <template v-if="!loading">
            <template v-if="liga.access_level !== 'private' && liga.status !== '4' && liga.status !== '5'">
              <template>
                <div class="fw600 has-text-centered m-b-10 m-t-20">{{ $t('upiiteCijenuKotizacije') }}</div>
                <ValidationProvider v-slot="{ errors, valid }" name="Kotizacija" rules="required">
                  <b-field
                    class="login__input__container"
                    :type="{ 'is-danger': errors[0], 'is-success': valid }"
                    :message="errors"
                  >
                    <b-numberinput
                      v-model="liga.price"
                      :placeholder="liga.price ? liga.price : 'besplatno'"
                      step="5"
                      min="0"
                      type="is-white"
                      rounded
                      controls-rounded
                    ></b-numberinput>
                  </b-field>
                </ValidationProvider>
                <div class="is-size-65 has-text-centered fw600">
                  {{ $t('Cijena je izražena u eurima') }}
                </div>
              </template>

              <ValidationProvider name="Rok za prijave" rules="required">
                <div class="label">{{ $t('rokZaPrijave') }}</div>
                <b-field>
                  <b-datepicker
                    v-model="liga.application_deadline"
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
            <ValidationProvider name="Početak turnira" rules="required">
              <div class="label">{{ $t('pocetak turnira') }}</div>
              <b-field>
                <b-datepicker
                  v-model="liga.active_from"
                  :placeholder="$t('klikniOvdjeZaOdabir')"
                  :open-on-focus="false"
                  :first-day-of-week="1"
                  trap-focus
                  rounded
                >
                </b-datepicker>
              </b-field>
            </ValidationProvider>

            <ValidationProvider name="Rok za završetak kupa" rules="required">
              <div class="label">{{ $t('rokZaZavretakTurnira') }}</div>
              <b-field>
                <b-datepicker
                  v-model="liga.active_to"
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
          <!--          <ValidationProvider-->
          <!--            v-if="liga.access_level !== 'private' && liga.status !== '4'"-->
          <!--            name="Broj prijava"-->
          <!--            rules="required"-->
          <!--          >-->
          <!--            <div class="label">Broj prijava</div>-->
          <!--            <div class="radio__box">-->
          <!--              <div class="block">-->
          <!--                <b-radio v-model="liga.boarding_type" :native-value="0"> Neograničen </b-radio>-->
          <!--                <b-radio v-model="liga.boarding_type" :native-value="1">-->
          <!--                  Limit: {{ liga.number_of_players }} igrača-->
          <!--                </b-radio>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </ValidationProvider>-->
          <div class="activity__header m-b--10 m-t-30">
            <div class="fw600 is-size-3">{{ $t('postavkeKupa') }}</div>
          </div>
          <template v-if="liga.status !== '5'">
            <div class="radio__box m-t-20 m-b-20">
              <div class="block">
                <b-radio v-model="liga.is_doubles" :native-value="false"> {{ $t('pojedinci') }} </b-radio>
                <b-radio v-model="liga.is_doubles" :native-value="true"> {{ $t('parovi') }} </b-radio>
              </div>
            </div>
            <transition name="fade">
              <div v-show="hasChanged" class="is-size-65 has-text-danger fw600 p-t-15 p-b-10">
                {{ $t('izmjenomBrojaNatjecateljaVaESeDrijebPonovnoIzradit') }}
              </div>
            </transition>
            <div :label="$t('eljeniBrojIgraaUTurniru')" class="m-t-10">
              <div class="activity__reservation">
                <transition name="fade">
                  <div class="activity__box action__buttons">
                    <div
                      v-for="item in [0, 4, 8, 16, 32, 64, 128, 256]"
                      :key="item"
                      :class="liga.number_of_players === item ? 'active' : ''"
                      class="action__item__small fw600"
                      @click="
                        $set(liga, 'number_of_players', item)
                        hasChanged = true
                      "
                    >
                      {{ item === 0 ? $t('Ovisno o broju prijava') : item + ' ' + $t('natjecatelja') }}
                    </div>
                  </div>
                </transition>
              </div>
            </div>

            <div class="label">{{ $t('brojDobivenihSetova') }}</div>
            <div class="activity__reservation">
              <transition name="fade">
                <div class="activity__box action__buttons">
                  <div
                    v-for="(item, key) in macthRules.playingSets"
                    :key="key"
                    :class="liga.playing_sets === parseInt(key) ? 'active' : ''"
                    class="action__item__small fw600"
                    @click="liga.playing_sets = parseInt(key)"
                  >
                    {{ $t(item) }}
                  </div>
                </div>
              </transition>
            </div>
            <div class="label">{{ $t('brojGemovaUSetu') }}</div>
            <div class="activity__reservation">
              <transition name="fade">
                <div class="activity__box action__buttons">
                  <div
                    v-for="(item, key) in macthRules.gameInSet"
                    :key="key"
                    :class="liga.game_in_set === parseInt(key) ? 'active' : ''"
                    class="action__item__small fw600"
                    @click="liga.game_in_set = parseInt(key)"
                  >
                    {{ $t(item) }}
                  </div>
                </div>
              </transition>
            </div>
            <div class="label">{{ $t('posljednjaIgra') }}</div>
            <div class="activity__reservation__small">
              <transition name="fade">
                <div class="activity__box action__buttons">
                  <div
                    v-for="(item, key) in macthRules.lastGame"
                    :key="key"
                    :class="liga.last_set === key ? 'active' : ''"
                    class="action__item__small fw600"
                    @click="liga.last_set = key"
                  >
                    {{ $t(item) }}
                  </div>
                </div>
              </transition>
            </div>

            <!--            <ValidationProvider name="Opcija igranja seta" rules="required">-->
            <!--              <b-field label="Opcija igranja seta">-->
            <!--                <b-numberinput-->
            <!--                  v-model="liga.game_in_set"-->
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
          <template>
            <div class="fw600 is-size-55 has-text-black80 m-b-20 m-t-30 has-text-centered">
              {{ $t('odaberiJainuTurnira') }}
            </div>
            <div class="buttons m-t--10">
              <b-button
                :class="{ softshadow: true, 'invert-small-button': liga.cup_scoring === 1000 }"
                :type="{
                  'is-small': true,
                  noborder: true,
                  'is-primary has-text-white': liga.cup_scoring === 1000,
                }"
                pack="fal"
                rounded
                @click="liga.cup_scoring = 1000"
              >
                {{ $t('atpMasters1000') }}
              </b-button>
              <b-button
                :class="{ softshadow: true, 'invert-small-button': liga.cup_scoring === 500 }"
                :type="{
                  'is-small': true,
                  noborder: true,
                  'is-primary has-text-white': liga.cup_scoring === 500,
                }"
                pack="fal"
                rounded
                @click="liga.cup_scoring = 500"
              >
                {{ $t('atp500') }}
              </b-button>
              <b-button
                :class="{ softshadow: true, 'invert-small-button': liga.cup_scoring === 250 }"
                :type="{
                  'is-small': true,
                  noborder: true,
                  'is-primary has-text-white': liga.cup_scoring === 250,
                }"
                pack="fal"
                rounded
                @click="liga.cup_scoring = 250"
              >
                {{ $t('atp250') }}
              </b-button>
              <b-button
                :class="{ softshadow: true, 'invert-small-button': liga.cup_scoring === 125 }"
                :type="{
                  'is-small': true,
                  noborder: true,
                  'is-primary has-text-white': liga.cup_scoring === 125,
                }"
                pack="fal"
                rounded
                @click="liga.cup_scoring = 125"
              >
                {{ $t('challenger125') }}
              </b-button>
              <!--                  <div class="buttons m-t-20 w100">-->
              <!--                    <b-button-->
              <!--                      :class="{ softshadow: true, 'invert-small-button': points === 0 }"-->
              <!--                      :type="{-->
              <!--                        'is-small': true,-->
              <!--                        noborder: true,-->
              <!--                        'is-primary has-text-white': points === 0,-->
              <!--                      }"-->
              <!--                      pack="fal"-->
              <!--                      rounded-->
              <!--                      @click="points = 0"-->
              <!--                    >-->
              <!--                      Unesi vlastito bodovanje-->
              <!--                    </b-button>-->
              <!--                  </div>-->
            </div>
          </template>
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

          <documentUpload :options="liga" :type="'tournament'" @reload="getLeague"></documentUpload>

          <div v-if="!dataLoaded" class="buttons m-t-10 is-fixed">
            <b-button class="fw600" type="is-danger" pack="fal" icon-right="times" rounded @click="$router.go(-1)">
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
        :title="`Potvrdom ćete obrisati kup ${liga.name}`"
        :subtitle="$t('Jeste li sigurni?')"
        @update="deleteLiga"
      ></modalConfirmation>
    </b-modal>
  </div>
</template>

<script>
import Tournament from '@/models/Tournament'
import _ from 'lodash'
import hero from '~/components/Hero'
import documentUpload from '~/components/documentUpload'
import adminEdit from '~/components/cup/adminEdit'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import photoUpload from '~/components/photoUpload'

export default {
  name: 'CupEdit',
  components: {
    documentUpload,
    adminEdit,
    photoUpload,
    hero,
    modalConfirmation,
  },
  async fetch() {
    await this.getLeague()
  },
  data() {
    return {
      hasChanged: false,
      showhide: false,
      crop_image: null,
      coordinates: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
      isModalActive: false,
      heroImage: '/liga.jpg',
      loading: false,
      loading2: false,
      loading3: false,
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
        documents: [],
        is_doubles: false,
        number_of_players: 4,
        number_of_groups: 1,
        players_in_groups: 4,
        rounds_of_play: 1,
        move_up: null,
        move_down: null,
        playing_sets: null,
        game_in_set: null,
        last_set: null,
        description: '',
        points: null,
        points_loser: null,
        groupList: [],
        image: null,
        cup_scoring: null,
        show_on_tenisplus: true,
        show_in_club: true,
        winner: {
          description: null,
          image: null,
          new_image: null,
        },
        playerList: [],
      },
      macthRules: {
        playingSets: {
          1: '1 set',
          2: '2 seta',
          3: '3 seta',
        },
        gameInSet: {
          4: 'Set do 4 gema (Nextgen)',
          6: 'Set do 6 gemova (Klasično)',
          8: 'Set do 8 gemova',
          10: 'Set do 10 gemova',
        },
        lastGame: {
          classic: 'Klasičan (6 gemova)',
          advantage: 'Prednost 2 gema',
          tie7: 'Tie-break 7',
          tie10: 'Tie-break 10',
        },
      },
    }
  },
  computed: {
    isLigaAdmin() {
      return _.filter(this.liga.admins, (item) => {
        return item.id === this.user.id
      })
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
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
      const l = new Tournament({ id: this.liga.id })
      l.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Kup je obrisan'),
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
    getLeague() {
      // this.$root.$loading.start()
      Tournament.include(['admins', 'documents'])
        .find(this.$route.params.id)
        .then((res) => {
          if (res.winner === undefined) {
            res.winner = { description: '', image: null, new_image: null }
          }
          res.application_deadline = new Date(Date.parse(res.application_deadline))
          res.active_from = new Date(Date.parse(res.active_from))
          res.active_to = new Date(Date.parse(res.active_to))
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
    change({ coordinates, canvas }) {},
    reset() {
      this.liga.winner.image = null
      this.liga.winner.new_image = null
    },
    crop() {
      const { coordinates, canvas } = this.$refs.cropper.getResult()
      this.coordinates = coordinates
      this.liga.winner.new_image = canvas.toDataURL()
      this.liga.winner.image = canvas.toDataURL()
      this.crop_image = null
    },
    uploadImage(event) {
      this.$root.$loading.start()
      const input = event.target
      if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.crop_image = e.target.result
        }
        reader.readAsDataURL(input.files[0])
        this.$root.$loading.finish()
      }
    },
    submit(onboarding) {
      if (this.hasChanged) {
        this.liga.createGames = true
      }
      if (onboarding === 'onboarding') {
        this.liga.status = '3'
      }
      this.loading = true
      this.liga.application_deadline = this.$moment(this.liga.application_deadline).format('YYYY-MM-DD')
      this.liga.active_to = this.$moment(this.liga.active_to).format('YYYY-MM-DD')
      this.liga.active_from = this.$moment(this.liga.active_from).format('YYYY-MM-DD')
      this.liga
        .save()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili promjene'),
            type: 'is-success',
          })
          this.liga.application_deadline = new Date(Date.parse(res.application_deadline))
          this.liga.active_to = new Date(Date.parse(res.active_to))
          this.liga.active_from = new Date(Date.parse(res.active_from))
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
