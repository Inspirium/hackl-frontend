<template>
  <div class="cups">
    <div class="member__info liga__header is-red">
      <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10">
        {{ activeTab === 0 ? $t('Korak 1') : $t('Korak 2') }}
      </div>
    </div>
    <hero
      :options="heroImage"
      :second="{
        name: $t('Lige'),
        link: '/liga',
      }"
    >
      <h1 class="has-text-white">{{ newLiga.name === '' ? $t('Novo natjecanje') : newLiga.name }}</h1>
    </hero>
    <div class="activity x-container p-b-100">
      <b-tabs v-model="activeTab" position="is-centered" class="hide_tab_navigation">
        <b-tab-item>
          <div class="tab__navigation m-b-20 m-t--40">
            <div :class="['tab__navigation__arrow__left', activeTab === 0 ? 'inactive' : '']" @click="activeTab--">
              <b-icon icon="chevron-left" pack="fal"> </b-icon>
            </div>
            <div
              :class="['tab__navigation__arrow__right', newLiga.rounds_of_play === null ? 'inactive' : '']"
              @click="activeTab++"
            >
              <b-icon icon="chevron-right" pack="fal"> </b-icon>
            </div>
          </div>
          <indicator
            class="m-t--20 m-b-20"
            :options="indicator"
            :active-step="activeStep"
            :active-tab="activeTab"
          ></indicator>

          <b-steps v-if="!loading" v-model="activeStep" :has-navigation="false" :animated="true" class="m-t-15">
            <b-step-item step="1" :label="$t('Naziv')" class="m-t-10" :clickable="true">
              <div class="activity x-container">
                <div class="activity__reservation">
                  <b-field class="has-text-centered m-t--20">
                    <b-input
                      v-model="newLiga.name"
                      wrap="hard"
                      custom-class="input__title"
                      :placeholder="$t('upiiNazivLige')"
                    ></b-input>
                  </b-field>
                </div>
              </div>
            </b-step-item>
            <b-step-item step="2" :label="$t('eloLiga')" class="m-t-10" :clickable="true">
              <ValidationProvider name="Rok za završetak lige" rules="required">
                <div class="fw600 is-size-55 m-l-5 m-t--10 m-b-10">{{ $t('rokZaZavretakLige') }}</div>
                <b-field>
                  <b-datepicker
                    v-model="newLiga.finish_date"
                    :placeholder="$t('klikniOvdjeZaOdabir')"
                    :first-day-of-week="1"
                    :open-on-focus="false"
                    trap-focus
                    rounded
                  >
                  </b-datepicker>
                </b-field>
              </ValidationProvider>

              <div class="help__text m-t-20">
                <span>{{ $t('objanjenje') }} </span>{{ $t('rokUKojemSeSviMeeviMorajuOdigrati') }}
              </div>
              <div class="fw600 is-size-55 m-l-5 m-t-20 m-b-10">{{ $t('pojedinaniTurnirIliTurnirParova') }}</div>

              <ValidationProvider v-slot="{ errors, valid }" name="Spol" rules="required" class="radio__box">
                <div class="block">
                  <b-radio
                    v-model="newLiga.is_doubles"
                    :type="valid ? 'is-success' : 'is-danger'"
                    :native-value="false"
                  >
                    {{ $t('pojedinci') }}
                  </b-radio>
                  <b-radio v-model="newLiga.is_doubles" :type="valid ? 'is-success' : 'is-danger'" :native-value="true">
                    {{ $t('parovi') }}
                  </b-radio>
                </div>
              </ValidationProvider>

              <template v-if="isAdmin">
                <div class="fw600 is-size-55 m-l-5 m-t-20 m-b-10">{{ $t('prijavaIgraaULigu') }}</div>
                <ValidationProvider v-slot="{ errors, valid }" name="Spol" rules="required" class="radio__box">
                  <div class="block">
                    <b-radio v-model="newLiga.type" :type="valid ? 'is-success' : 'is-danger'" native-value="open">
                      {{ $t('otvorenePrijave') }}
                    </b-radio>
                    <b-radio v-model="newLiga.type" :type="valid ? 'is-success' : 'is-danger'" native-value="private">
                      {{ $t('privatnaLiga') }}
                    </b-radio>
                  </div>
                </ValidationProvider>
                <ValidationProvider v-if="newLiga.type === 'open'" name="Rok za završetak prijava" rules="required">
                  <div class="label">{{ $t('rokZaZavretakPrijava') }}</div>
                  <b-field>
                    <b-datepicker
                      v-model="newLiga.finish_onboarding"
                      :placeholder="$t('klikniOvdjeZaOdabir')"
                      :first-day-of-week="1"
                      :open-on-focus="false"
                      trap-focus
                      rounded
                    >
                    </b-datepicker>
                  </b-field>
                </ValidationProvider>

                <div class="help__text m-t-20">
                  <span>{{ $t('objanjenje') }} </span>{{ $t('uOtvorenuLiguSeMoguPrijavitiSviIgraiDoOdreenogDatu') }}
                </div>
              </template>
              <template>
                <div class="divider-line-1 m-t-20"></div>
                <div class="fw600 is-size-55 m-l-5 m-t-15 m-b-7">{{ $t('Prikaz natjecanja na Tenis.plus') }}</div>

                <ValidationProvider v-slot="{ errors, valid }" name="Showing" rules="required" class="radio__box">
                  <div class="block">
                    <b-radio
                      v-model="newLiga.show_on_tenisplus"
                      :type="valid ? 'is-success' : 'is-danger'"
                      :native-value="true"
                    >
                      {{ $t('Prikaži') }}
                    </b-radio>
                    <b-radio
                      v-model="newLiga.show_on_tenisplus"
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
                    <b-radio
                      v-model="newLiga.show_in_club"
                      :type="valid ? 'is-success' : 'is-danger'"
                      :native-value="true"
                    >
                      {{ $t('Prikaži') }}
                    </b-radio>
                    <b-radio
                      v-model="newLiga.show_in_club"
                      :type="valid ? 'is-success' : 'is-danger'"
                      :native-value="false"
                    >
                      {{ $t('sakrij') }}
                    </b-radio>
                  </div>
                </ValidationProvider>
                <div class="help__text m-t-15">
                  <span>{{ $t('objanjenje') }} </span
                  >{{ $t('Prikaz vašeg natjecanja na listi natjecanja u klupskoj aplikaciji') }}
                </div>
              </template>

              <div class="help__text m-t-15">
                <span>{{ $t('objanjenje') }} </span>{{ $t('prikazVaegTurniraNaListiSvihTurniraNaAplikaciji') }}
              </div>
            </b-step-item>
            <b-step-item step="3" :label="$t('detaljnije')" class="m-t-10" :clickable="true">
              <div class="activity__header--center m-b-5">
                <div class="fw600 is-size-5 m-b-10">{{ $t('detaljnijeOEloLigi') }}</div>
              </div>
              <tinymce-editor v-model="newLiga.description" class="" />
            </b-step-item>
          </b-steps>
          <div class="buttons m-t-10 is-fixed">
            <b-button
              v-if="activeStep !== 0"
              :class="['m-l-10', 'fw600']"
              type="is-danger"
              pack="fal"
              icon-left="chevron-left"
              rounded
              @click.prevent="activeStep--"
            >
              {{ $t('nazad') }}
            </b-button>
            <b-button
              v-if="activeStep !== 2"
              :class="['m-l-10', 'fw600', nextArrow ? 'blur_button' : '']"
              type="is-primary"
              pack="fal"
              icon-right="chevron-right"
              rounded
              @click.prevent="activeStep++"
            >
              {{ $t('dalje') }}
            </b-button>
            <b-button
              v-else
              :class="['m-l-10', 'fw600', nextArrowTwo ? 'blur_button' : '']"
              type="is-primary"
              pack="fal"
              icon-right="check"
              rounded
              :loading="loading"
              @click.prevent="createLiga"
            >
              {{ $t('spremiLigu') }}
            </b-button>
          </div>
        </b-tab-item>
        <b-tab-item>
          <div class="tab__navigation m-b-20 m-t--40">
            <div :class="['tab__navigation__arrow__left', activeTab === 0 ? 'inactive' : '']" @click="activeTab--">
              <b-icon icon="chevron-left" pack="fal"> </b-icon>
            </div>
            <div :class="['tab__navigation__arrow__right', 'inactive']" @click="activeTab++">
              <b-icon icon="chevron-right" pack="fal"> </b-icon>
            </div>
          </div>
          <b-steps v-model="activeStepTwo" :has-navigation="false" :animated="true" class="m-t-15">
            <b-step-item step="1" :label="$t('unosDokumenata')" class="m-t-10" :clickable="true">
              <div class="fw600 has-text-black80 is-size-55 is-text-center">
                {{ $t('ovdjeMoeteSpremitiDokumenteVezaneZaLiguPravilniciR') }}
              </div>
              <div class="fw600 is-size-65 m-t-10 m-b-15 is-text-center">
                {{ $t('dokumentiEBitiVidljiviSvimLanovima') }}
              </div>
              <documentUpload :options="newLiga" type="'league'" @reload="getLeague"></documentUpload>
            </b-step-item>
          </b-steps>
          <div class="buttons m-t-10 is-fixed">
            <b-button
              v-if="activeStepTwo === 0"
              :class="['m-l-10', 'fw600']"
              type="is-danger"
              pack="fal"
              icon-left="chevron-left"
              rounded
              @click.prevent="activeTab--"
            >
              {{ $t('prethodniKorak') }}
            </b-button>

            <b-button
              v-else
              :class="['m-l-10', 'fw600']"
              type="is-danger"
              pack="fal"
              icon-left="chevron-left"
              rounded
              @click.prevent="activeStepTwo--"
            >
              {{ $t('nazad') }}
            </b-button>
            <b-button
              :class="['m-l-10', 'fw600', nextArrowTwo ? 'blur_button' : '']"
              type="is-primary"
              pack="fal"
              icon-right="chevron-right"
              rounded
              :loading="loading"
              @click.prevent="
                $router.push(localePath('/liga/elo/' + newLiga.id + (newLiga.type === 'open' ? '/open' : '/privat')))
              "
            >
              {{ $t('dalje') }}
            </b-button>
          </div>
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import League from '@/models/League'
import hero from '~/components/Hero'
import indicator from '~/components/IndicatorSteps'
import documentUpload from '~/components/documentUpload'

export default {
  name: 'NewLiga',
  components: {
    hero,
    indicator,
    documentUpload,
  },
  data() {
    return {
      heroImage: '/liga.jpg',
      isModalMembersActive: false,
      selectedGroup: null,
      selectedPlace: null,
      activeTab: 0,
      activeStep: 0,
      activeStepTwo: 0,
      newDocument: {},
      indicator: {
        steps: 4,
      },
      indicatorTwo: {
        steps: 1,
      },
      newLiga: {
        name: '',
        classification: 'elo',
        is_doubles: false,
        type: 'private',
        finish_onboarding: new Date(),
        finish_date: new Date(),
        description: '',
        status: '0',
        groupList: [],
        // delete
        number_of_groups: 1,
        players_in_groups: 3,
        rounds_of_play: 1,
        playing_sets: 1,
        game_in_set: 1,
        last_set: 1,
        points: 1,
        points_loser: 1,
        show_on_tenisplus: true,
        show_in_club: true,
      },
      loading: false,
      prepopulatedPlayerList: [],
      playerList: [],
      tabTitle: ['1. Osnovni podaci', '2. Osnovna pravila', '3. Prijava', '4. Odabir igrača', '5. Ždrijeb'],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    statusChoice() {
      return this.newLiga.type === 'open' ? '3' : '1'
    },
    nextArrow() {
      if (this.activeStep === 0 && this.newLiga.name === '') {
        return true
      }
      if (this.activeStep === 7 && this.playerList.length > 0) {
        return true
      } else {
        return false
      }
    },
    nextArrowTwo() {
      if (this.activeStepTwo === 0 && this.newLiga.name === '') {
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
    newLiga: {
      immediate: true,
      deep: true,
      handler() {
        this.populatePlayers()
      },
    },
    defaultPlayerList: {
      handler() {
        if (this.defaultPlayerList.length > 0) {
          for (let i = 0; i < this.defaultPlayerList.length; i++) {
            this.defaultPlayerList[i].order = i
          }
        }
      },
    },
  },
  methods: {
    getLeague() {
      this.$root.$loading.start()
      League.include(['admins', 'documents'])
        .find(this.newLiga.id)
        .then((res) => {
          res.finish_date = new Date(Date.parse(res.finish_date))
          res.finish_onboarding = new Date(Date.parse(res.finish_onboarding))
          res.playing_sets = parseInt(res.playing_sets)
          res.game_in_set = parseInt(res.game_in_set)
          res.boarding_type = res.boarding_type === null ? 0 : res.boarding_type
          this.$root.$loading.finish()
          this.newLiga = res
        })
    },
    populateGroup() {
      for (let i = 1; i <= this.newLiga.number_of_groups; i++) {
        this.newLiga.groupList.push({
          name: 'Grupa' + ' ' + i,
          order: null,
          players_in_groups: this.newLiga.players_in_groups,
          move_up: this.newLiga.move_up,
          move_down: this.newLiga.move_down,
          players: this.prepopulatedPlayerList,
        })
      }
    },
    populatePlayers() {
      this.prepopulatedPlayerList = []
      for (let i = 0; i < this.newLiga.players_in_groups; i++) {
        this.prepopulatedPlayerList.push({ display_name: '', order: 0 })
      }
    },
    createLiga() {
      this.populateGroup()
      this.loading = true
      this.newLiga.status = this.newLiga.type === 'open' ? '2' : '0'
      const l = new League(this.newLiga)
      l.save()
        .then((res) => {
          const li = new League({ id: res.id })
          li.players().attach({ admins: [this.$store.state.auth.user] })
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili novu ligu'),
            type: 'is-success',
          })
          res.finish_date = new Date(Date.parse(res.finish_date))
          res.finish_onboarding = new Date(Date.parse(res.finish_onboarding))

          this.newLiga = res
          this.activeTab = 1
          // this.activeStepTwo = 6
          this.loading = false
          // this.$router.push(this.localePath('/liga/' + res.id + (this.newLiga.type === 'open' ? '/open' : '/privat')))
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
