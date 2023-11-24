<template>
  <div class="cups p-b-300">
    <div class="member__info liga__header is-red">
      <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10">
        {{ activeTab === 0 ? $t('Korak 1') : $t('Korak 2') }}
      </div>
    </div>
    <hero
      :options="heroImage"
      :second="{
        name: $t('Turnir'),
        link: '/cup',
      }"
    >
      <h1 class="has-text-white">{{ newCup.name === '' ? $t('Novo natjecanje') : newCup.name }}</h1>
    </hero>
    <div class="activity x-container p-b-300">
      <b-tabs v-model="activeTab" position="is-centered" class="hide_tab_navigation">
        <b-tab-item>
          <div class="tab__navigation m-b-20 m-t--40">
            <div :class="['tab__navigation__arrow__left', activeTab === 0 ? 'inactive' : '']" @click="activeTab--">
              <b-icon icon="chevron-left" pack="fal"> </b-icon>
            </div>
            <div
              :class="['tab__navigation__arrow__right', newCup.rounds_of_play === null ? 'inactive' : '']"
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
          <b-steps v-if="!loading" v-model="activeStep" :has-navigation="false" :animated="true" class="m-t-15 p-b-300">
            <b-step-item step="1" :label="$t('Naziv')" class="m-t-10" :clickable="true">
              <div class="activity__reservation">
                <b-field class="has-text-centered m-t--10 m-b-30">
                  <b-input
                    v-model="newCup.name"
                    wrap="hard"
                    custom-class="input__title"
                    :placeholder="$t('upiiNazivTurnira')"
                  ></b-input>
                </b-field>
              </div>
              <template>
                <template v-if="!isLigaCup">
                  <div class="fw600 is-size-55 m-l-5 m-t--10 m-b-10">{{ $t('pojedinaniTurnirIliTurnirParova') }}</div>
                  <ValidationProvider v-slot="{ errors, valid }" name="Spol" rules="required" class="radio__box">
                    <div class="block">
                      <b-radio
                        v-model="newCup.is_doubles"
                        :type="valid ? 'is-success' : 'is-danger'"
                        :native-value="false"
                      >
                        {{ $t('pojedinci') }}
                      </b-radio>
                      <b-radio
                        v-model="newCup.is_doubles"
                        :type="valid ? 'is-success' : 'is-danger'"
                        :native-value="true"
                      >
                        {{ $t('parovi') }}
                      </b-radio>
                    </div>
                  </ValidationProvider>
                  <div class="fw600 is-size-55 m-l-5 m-t-20 m-b-10">{{ $t('prijavaIgraaUTurnir') }}</div>
                  <ValidationProvider v-slot="{ errors, valid }" name="Spol" rules="required" class="radio__box">
                    <div class="block">
                      <b-radio
                        v-model="newCup.access_level"
                        :type="valid ? 'is-success' : 'is-danger'"
                        native-value="private"
                      >
                        {{ $t('privatniTurnir') }}
                      </b-radio>
                      <b-radio
                        v-model="newCup.access_level"
                        :type="valid ? 'is-success' : 'is-danger'"
                        native-value="open"
                      >
                        {{ $t('otvorenePrijave') }}
                      </b-radio>
                    </div>
                  </ValidationProvider>
                  <ValidationProvider
                    v-if="newCup.access_level === 'open'"
                    name="Rok za završetak prijava"
                    rules="required"
                  >
                    <div class="fw600 is-size-55 m-l-5 m-t-20 m-b-10">{{ $t('rokZaZavretakPrijava') }}</div>
                    <b-field>
                      <b-datepicker
                        v-model="newCup.application_deadline"
                        :first-day-of-week="1"
                        :placeholder="$t('klikniOvdjeZaOdabir')"
                        :open-on-focus="false"
                        trap-focus
                        rounded
                      >
                      </b-datepicker>
                    </b-field>
                  </ValidationProvider>
                  <div class="help__text m-t-15">
                    <span>{{ $t('objanjenje') }} </span>{{ $t('uOtvoreniTurnirMoguSePrijavitiSviIgraiDoOdreenogDa2') }}
                  </div>
                  <ValidationProvider name="Početak turnira" rules="required">
                    <div class="fw600 is-size-55 m-l-5 m-t-20 m-b-10">{{ $t('pocetak turnira') }}</div>
                    <b-field>
                      <b-datepicker
                        v-model="newCup.active_from"
                        :placeholder="$t('klikniOvdjeZaOdabir')"
                        :open-on-focus="false"
                        :first-day-of-week="1"
                        trap-focus
                        rounded
                      >
                      </b-datepicker>
                    </b-field>
                  </ValidationProvider>
                  <ValidationProvider name="Kraj turnira" rules="required">
                    <div class="fw600 is-size-55 m-l-5 m-t-20 m-b-10">{{ $t('rokZaZavretakTurnira') }}</div>
                    <b-field>
                      <b-datepicker
                        v-model="newCup.active_to"
                        :placeholder="$t('klikniOvdjeZaOdabir')"
                        :open-on-focus="false"
                        :first-day-of-week="1"
                        trap-focus
                        rounded
                      >
                      </b-datepicker>
                    </b-field>
                  </ValidationProvider>
                  <template>
                    <div class="divider-line-1 m-t-20"></div>
                    <div class="fw600 is-size-55 m-l-5 m-t-15 m-b-7">{{ $t('Prikaz natjecanja na Tenis.plus') }}</div>

                    <ValidationProvider v-slot="{ errors, valid }" name="Showing" rules="required" class="radio__box">
                      <div class="block">
                        <b-radio
                          v-model="newCup.show_on_tenisplus"
                          :type="valid ? 'is-success' : 'is-danger'"
                          :native-value="true"
                        >
                          {{ $t('Prikaži') }}
                        </b-radio>
                        <b-radio
                          v-model="newCup.show_on_tenisplus"
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
                          v-model="newCup.show_in_club"
                          :type="valid ? 'is-success' : 'is-danger'"
                          :native-value="true"
                        >
                          {{ $t('Prikaži') }}
                        </b-radio>
                        <b-radio
                          v-model="newCup.show_in_club"
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
                </template>
              </template>
            </b-step-item>
            <b-step-item step="2" :label="$t('bodovanjeTurnira')" class="m-t-10" :clickable="true">
              <ValidationProvider name="Bodovanje" class="radio__box__center m-b-20" rules="required">
                <div class="block">
                  <b-radio v-model="cupWithPoints" :native-value="0"> {{ $t('bezBodova') }} </b-radio>
                  <b-radio v-model="cupWithPoints" :native-value="1"> {{ $t('sBodovima') }} </b-radio>
                </div>
              </ValidationProvider>

              <template v-if="cupWithPoints === 1">
                <div class="fw600 is-size-55 has-text-black80 m-b-20 has-text-centered">
                  {{ $t('odaberiJainuTurnira') }}
                </div>
                <div class="buttons m-t--10">
                  <b-button
                    :class="{ softshadow: true, 'invert-small-button': newCup.cup_scoring === 1000 }"
                    :type="{
                      'is-small': true,
                      noborder: true,
                      'is-primary has-text-white': newCup.cup_scoring === 1000,
                    }"
                    pack="fal"
                    rounded
                    @click="newCup.cup_scoring = 1000"
                  >
                    {{ $t('atpMasters1000') }}
                  </b-button>
                  <b-button
                    :class="{ softshadow: true, 'invert-small-button': newCup.cup_scoring === 500 }"
                    :type="{
                      'is-small': true,
                      noborder: true,
                      'is-primary has-text-white': newCup.cup_scoring === 500,
                    }"
                    pack="fal"
                    rounded
                    @click="newCup.cup_scoring = 500"
                  >
                    {{ $t('atp500') }}
                  </b-button>
                  <b-button
                    :class="{ softshadow: true, 'invert-small-button': newCup.cup_scoring === 250 }"
                    :type="{
                      'is-small': true,
                      noborder: true,
                      'is-primary has-text-white': newCup.cup_scoring === 250,
                    }"
                    pack="fal"
                    rounded
                    @click="newCup.cup_scoring = 250"
                  >
                    {{ $t('atp250') }}
                  </b-button>
                  <b-button
                    :class="{ softshadow: true, 'invert-small-button': newCup.cup_scoring === 125 }"
                    :type="{
                      'is-small': true,
                      noborder: true,
                      'is-primary has-text-white': newCup.cup_scoring === 125,
                    }"
                    pack="fal"
                    rounded
                    @click="newCup.cup_scoring = 125"
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
                <template v-if="newCup.cup_scoring">
                  <div class="fw600 is-size-4 has-text-black80 m-b-10 has-text-centered">
                    {{ $t('raspodijelaBodova') }}
                  </div>
                  <div
                    v-for="(item, i) in points_default[selectedPoints]"
                    :key="i"
                    class="is-white p-t-10 p-b-10 p-l-15 p-r-15 rounded-md m-t-5"
                  >
                    <div class="flex justify-between align__centar__y">
                      <h3 class="is-size-55 has-text-black80 fw600">
                        {{ points_name[i] }}
                      </h3>
                      <h3 class="is-size-55 has-text-black80 fw600">
                        {{ item }}
                      </h3>
                    </div>
                  </div>
                </template>
                <template v-if="newCup.cup_scoring === 0">
                  <div class="fw600 is-size-4 has-text-black80 m-b-10 has-text-centered">
                    {{ $t('raspodijeliBodove') }}
                  </div>
                  <div v-for="(item, i) in 8" :key="i" class="is-white p-t-5 p-b-5 p-l-15 p-r-5 rounded-md m-t-5">
                    <div class="flex justify-between align__centar__y">
                      <h3 class="is-size-55 has-text-black80 fw600">
                        {{ points_name[i] }}
                      </h3>
                      <b-field class="input__table--small">
                        <b-input
                          v-model="points_custom[i]"
                          class=""
                          :placeholder="$t('bodovi3')"
                          type="is-white number"
                          rounded
                          controls-rounded
                        ></b-input>
                      </b-field>
                    </div>
                  </div>
                </template>

                <div class="help__text m-t-15">
                  <span>{{ $t('objanjenje') }} </span>{{ $t('nakonZavretkaNatjecanjaSvimIgraimaNatjecanjaEBitiP') }}
                </div>
              </template>
            </b-step-item>
            <b-step-item step="3" :label="$t('kotizacija')" class="m-t-10" :clickable="true">
              <ValidationProvider name="Kotizacija" class="radio__box__center" rules="required">
                <div class="block">
                  <b-radio v-model="showPriceInput" :native-value="0"> {{ $t('besplatno') }} </b-radio>
                  <b-radio v-model="showPriceInput" :native-value="1"> {{ $t('unesiCijenu') }} </b-radio>
                </div>
              </ValidationProvider>
              <template v-if="showPriceInput">
                <div class="fw600 has-text-centered m-b-10 m-t-20">{{ $t('upiiteCijenuKotizacije') }}</div>
                <ValidationProvider v-slot="{ errors, valid }" name="Kotizacija" rules="required">
                  <b-field
                    class="login__input__container"
                    :type="{ 'is-danger': errors[0], 'is-success': valid }"
                    :message="errors"
                  >
                    <b-numberinput
                      v-model="newCup.price"
                      :placeholder="newCup.price ? newCup.price : 'besplatno'"
                      step="5"
                      min="0"
                      type="is-white"
                      rounded
                      controls-rounded
                    ></b-numberinput>
                  </b-field>
                </ValidationProvider>
                <div class="is-size-65 has-text-centered fw600">
                  {{ newCup.price ? $t('Cijena je izražena u eurima') : $t('Natjecanje će biti besplatno') }}
                </div>
                <div class="fw600 has-text-centered m-b-10 m-t-20">{{ $t('onlinePlaanjeKotizacije') }}</div>
                <ValidationProvider name="Online plaćanje kotizacije" class="radio__box__center">
                  <div class="block">
                    <b-radio v-model="newCup.online_payment" :native-value="0"> {{ $t('nijeMogue') }} </b-radio>
                    <b-radio v-model="newCup.online_payment" :native-value="1"> {{ $t('mogue') }} </b-radio>
                  </div>
                </ValidationProvider>
              </template>
            </b-step-item>
            <b-step-item
              v-if="!isLigaCup"
              step="4"
              :label="$t('eljeniBrojIgraaUTurniru')"
              class="m-t-10"
              :clickable="true"
            >
              <div class="activity__reservation">
                <transition name="fade">
                  <div class="activity__box action__buttons">
                    <div
                      v-for="item in [0, 4, 8, 16, 32, 64, 128, 256]"
                      :key="item"
                      :class="newCup.number_of_players === item ? 'active' : ''"
                      class="action__item__small fw600"
                      @click="$set(newCup, 'number_of_players', item)"
                    >
                      {{ item === 0 ? $t('Ovisno o broju prijava') : item + ' ' + $t('natjecatelja') }}
                    </div>
                  </div>
                </transition>
              </div>
              <div class="help__text m-t-15">
                <span>{{ $t('objanjenje') }} </span>{{ $t('brojIgraaIOstaliPostavkeTurniraMoguSeNaknadnoMijen') }}
              </div>
            </b-step-item>
            <b-step-item v-else step="4" :label="$t('eljeniBrojIgraaUTurniru')" class="m-t-10" :clickable="true">
              <div class="activity__reservation">
                <transition name="fade">
                  <div class="activity__box action__buttons">
                    <div
                      :class="newCup.number_of_players === 0 ? 'active' : ''"
                      class="action__item__small fw600"
                      @click="$set(newCup, 'number_of_players', 0)"
                    >
                      {{ $t('ovisnoOBrojuIgraaUZavrenojLigi') }}
                    </div>
                  </div>
                </transition>
              </div>
              <div class="help__text m-t-15">
                <span>{{ $t('objanjenje') }} </span>{{ $t('brojIgraaIOstaliPostavkeTurniraMoguSeNaknadnoMijen') }}
              </div>
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
              v-if="activeStep !== 3"
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
              :class="['m-l-10', 'fw600', nextArrow ? 'blur_button' : '']"
              type="is-primary"
              pack="fal"
              icon-right="chevron-right"
              rounded
              @click.prevent="activeTab++"
            >
              {{ $t('sljedeiKorak') }}
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
          <indicator
            class="m-t--20 m-b-20"
            :options="indicatorTwo"
            :active-step="activeStepTwo"
            :active-tab="activeTab"
          ></indicator>

          <b-steps v-model="activeStepTwo" :has-navigation="false" :animated="true" class="m-t-15">
            <b-step-item step="1" :label="$t('brojSetova')" class="m-t-10" :clickable="true">
              <div class="fw600 is-size-55 m-l-5 m-b-10">{{ $t('brojDobivenihSetova') }}</div>
              <div class="activity__reservation">
                <transition name="fade">
                  <div class="activity__box action__buttons">
                    <div
                      v-for="(item, key) in macthRules.playingSets"
                      :key="key"
                      :class="newCup.playing_sets === parseInt(key) ? 'active' : ''"
                      class="action__item__small fw600"
                      @click="newCup.playing_sets = parseInt(key)"
                    >
                      {{ $t(item) }}
                    </div>
                  </div>
                </transition>
              </div>
              <div class="help__text m-t-15">
                <span>{{ $t('objanjenje') }} </span>{{ $t('brojDobivenihSetovaKojeIgraMoraOsvojitiDaBiDobioMe') }}
              </div>
            </b-step-item>
            <b-step-item step="2" :label="$t('brojGemova')" class="m-t-10" :clickable="true">
              <div class="fw600 is-size-55 m-l-5 m-b-10">{{ $t('brojGemovaUSetu') }}</div>
              <div class="activity__reservation">
                <transition name="fade">
                  <div class="activity__box action__buttons">
                    <div
                      v-for="(item, key) in macthRules.gameInSet"
                      :key="key"
                      :class="newCup.game_in_set === parseInt(key) ? 'active' : ''"
                      class="action__item__small fw600"
                      @click="newCup.game_in_set = parseInt(key)"
                    >
                      {{ $t(item) }}
                    </div>
                  </div>
                </transition>
              </div>
            </b-step-item>
            <b-step-item step="3" :label="$t('posljednjaIgra')" class="m-t-10" :clickable="true">
              <div class="activity__reservation__small">
                <transition name="fade">
                  <div class="activity__box action__buttons">
                    <div
                      v-for="(item, key) in macthRules.lastGame"
                      :key="key"
                      :class="newCup.last_set === key ? 'active' : ''"
                      class="action__item__small fw600"
                      @click="newCup.last_set = key"
                    >
                      {{ $t(item) }}
                    </div>
                  </div>
                </transition>
              </div>

              <div class="help__text m-t-15">
                <span>{{ $t('objanjenje') }} </span>{{ $t('nainNaKojiESeOdigratiPosljednjiSetUSluajuIzjednaen') }}
              </div>
            </b-step-item>
            <b-step-item step="4" :label="$t('detaljnije')" class="m-t-10" :clickable="true">
              <div class="activity__header--center m-b-5">
                <div class="fw600 is-size-5 m-b-10">{{ $t('detaljnijeOTurniru') }}</div>
              </div>
              <tinymce-editor v-model="newCup.description" class="" />
            </b-step-item>
            <b-step-item step="5" :label="$t('unosDokumenata')" class="m-t-10" :clickable="true">
              <div class="fw600 has-text-black80 is-size-55 is-text-center">
                {{ $t('ovdjeMoeteSpremitiDokumenteVezaneZaTurnirPravilnic') }}
              </div>

              <div class="fw600 is-size-65 m-t-10 m-b-15 is-text-center">
                {{ $t('dokumentiEBitiVidljiviSvimIgraima') }}
              </div>

              <documentUpload
                :options="Object.keys(cup1).length ? cup1 : cup"
                :type="'tournament'"
                @update="newDocument = $event"
                @new="newDocument = $event"
                @delete="newDocument = $event"
                @reload="getLeague()"
              ></documentUpload>
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
              {{ $t('nazad') }}
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
              v-if="activeStepTwo !== 3 && activeStepTwo !== 4"
              :class="['m-l-10', 'fw600', nextArrowTwo ? 'blur_button' : '']"
              type="is-primary"
              pack="fal"
              icon-right="chevron-right"
              rounded
              @click.prevent="activeStepTwo++"
            >
              {{ $t('dalje') }}
            </b-button>
            <b-button
              v-if="activeStepTwo === 3"
              :class="['m-l-10', 'fw600', nextArrowTwo ? 'blur_button' : '']"
              type="is-primary"
              pack="fal"
              icon-right="check"
              rounded
              :loading="loading"
              @click.prevent="createLiga"
            >
              {{ $t('spremiKup') }}
            </b-button>
            <b-button
              v-if="activeStepTwo === 4"
              :class="['m-l-10', 'fw600', nextArrowTwo ? 'blur_button' : '']"
              type="is-primary"
              pack="fal"
              icon-right="check"
              rounded
              :loading="loading"
              @click.prevent="
                $router.push(
                  '/cup/' +
                    tournamentId +
                    (newCup.access_level === 'open' ? '/open' : newCup.league_id ? '/liga_create' : '/privat')
                )
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
import Tournament from '@/models/Tournament'
import hero from '~/components/Hero'
import indicator from '~/components/IndicatorSteps'
import documentUpload from '~/components/documentUpload'

export default {
  name: 'NewCup',
  components: {
    hero,
    indicator,
    documentUpload,
  },
  data() {
    return {
      tournamentId: null,
      showPriceInput: 0,
      heroImage: '/cup.jpg',
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
        steps: 4,
      },
      cup: {},
      cup1: {},
      newCup: {
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
        playing_sets: null,
        game_in_set: null,
        last_set: null,
        description: '',
        status: '0',
        cup_scoring: null,
        show_on_tenisplus: true,
        show_in_club: true,
      },
      loading: false,
      prepopulatedPlayerList: [],
      playerList: [],
      tabTitle: ['1. Osnovni podaci', '2. Osnovna pravila', '3. Prijava', '4. Odabir igrača', '5. Ždrijeb'],
      cupWithPoints: 0,
      points: null,
      points_name: [
        'Pobjednik',
        'Finale',
        'Polufinale',
        'Četvrtfinale',
        'Osmina finala',
        'Šesnaestfinale',
        '1/32',
        '1/64',
      ],
      points_default: [
        [1000, 600, 360, 180, 90, 45, 25, 10],
        [500, 300, 180, 90, 45, 20, 10, 5],
        [250, 150, 90, 45, 20, 10, 5, 2],
        [125, 75, 45, 25, 10, 5, 2, 1],
      ],
      points_custom: [],
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
    selectedPoints() {
      switch (this.newCup.cup_scoring) {
        case 1000:
          return 0
        case 500:
          return 1
        case 250:
          return 2
        case 125:
          return 3
        case 0:
          return 4
      }
      return null
    },
    isLigaCup() {
      return !!this.$route.query.name
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    statusChoice() {
      return this.newCup.access_level === 'open' ? '3' : '1'
    },
    nextArrow() {
      if (this.activeStep === 0 && this.newCup.name === '') {
        return true
      }
      if (this.activeStep === 5 && this.playerList.length > 0) {
        return true
      } else {
        return false
      }
    },
    nextArrowTwo() {
      if (this.activeStepTwo === 0 && this.newCup.name === '') {
        return true
      }
      if (this.activeStepTwo === 3 && this.playerList.length > 0) {
        return true
      } else {
        return false
      }
    },
  },
  watch: {
    newCup: {
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
  mounted() {
    if (this.isLigaCup) {
      this.newCup.name = this.$route.query.name + ' — Turnir'
      this.newCup.number_of_players = 0
      this.newCup.league_id = this.$route.query.id
    }
  },
  methods: {
    populateGroup() {
      for (let i = 1; i <= this.newCup.number_of_groups; i++) {
        this.newCup.groupList.push({
          name: 'Grupa' + ' ' + i,
          order: null,
          players_in_groups: this.newCup.players_in_groups,
          move_up: this.newCup.move_up,
          move_down: this.newCup.move_down,
          players: this.prepopulatedPlayerList,
        })
      }
    },
    populatePlayers() {
      this.prepopulatedPlayerList = []
      for (let i = 0; i < this.newCup.players_in_groups; i++) {
        this.prepopulatedPlayerList.push({ display_name: '', order: 0 })
      }
    },
    getLeague() {
      Tournament.include(['admins', 'players', 'rounds', 'documents'])
        .find(this.cup.id)
        .then((res) => {
          this.cup1 = res
        })
    },
    createLiga() {
      this.loading = true
      this.newCup.status = this.newCup.access_level === 'open' ? '2' : '0'
      this.newCup.application_deadline = this.$moment(this.newCup.application_deadline).format('YYYY-MM-DD')
      this.newCup.active_to = this.$moment(this.newCup.active_to).format('YYYY-MM-DD')
      this.newCup.active_from = this.$moment(this.newCup.active_from).format('YYYY-MM-DD')
      const c = new Tournament(this.newCup)
      c.save()
        .then((res) => {
          const li = new Tournament({ id: res.id })
          li.players().attach({ admins: [this.$store.state.auth.user] })
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili novi kup'),
            type: 'is-success',
          })
          this.newCup.application_deadline = new Date(Date.parse(res.application_deadline))
          this.newCup.active_to = new Date(Date.parse(res.active_to))
          this.newCup.active_from = new Date(Date.parse(res.active_from))
          this.loading = false
          this.tournamentId = res.id
          this.activeStepTwo = 4
          this.cup = res
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
