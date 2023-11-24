<template>
  <div class="p-b-75">
    <hero
      :options="heroImage"
      :back="true"
      :second="{
        name: $t('Uredi terene'),
        link: '/admin/courts',
      }"
    >
      <h1 class="has-text-white">{{ court.name }}</h1>
    </hero>
    <div class="home-menu">
      <div class="home-menu-middle is-tab-menu">
        <div :class="[activeTab === 0 ? 'active-menu-item' : 'menu-item']" @click="activeTab = 0">
          <div class="has-text-black80 flex flex__column align__centar__y">
            <b-icon class="m-b-5" pack="fal" icon="circle-info" type="is-black50"> </b-icon>
            <div class="is-size-6 fw600 has-text-centered lh12 m-t-5">{{ $t('osnovniPodaci') }}</div>
          </div>
        </div>
        <div v-if="true" :class="[activeTab === 1 ? 'active-menu-item' : 'menu-item']" @click="activeTab = 1">
          <div class="has-text-black80 flex flex__column align__centar__y">
            <b-icon class="m-b-5" pack="fal" icon="timer" type="is-black50"> </b-icon>
            <div class="is-size-6 fw600 has-text-centered lh12 m-t-5">{{ $t('radnoVrijemeICijene') }}</div>
          </div>
        </div>
        <div :class="[activeTab === 2 ? 'active-menu-item' : 'menu-item']" @click="activeTab = 2">
          <div class="has-text-black80 flex flex__column align__centar__y" @click="activeTab = 2">
            <b-icon class="m-b-5" pack="fal" icon="stars" type="is-black50"> </b-icon>
            <div class="is-size-6 fw600 has-text-centered lh12 m-t-5">{{ $t('posebniTermini') }}</div>
          </div>
        </div>
      </div>
    </div>

    <b-tabs v-model="activeTab" size="is-medium" position="is-centered" class="hide_tab_navigation_impt">
      <b-tab-item :label="$t('podaci')">
        <transition name="fade">
          <div v-if="loading" class="align__centar__x loading_z_spinner m-t-30">
            <b-icon
              class="comment-send m-b-20"
              custom-class="rotating"
              icon="spinner"
              size="is-large"
              type="is-white"
              pack="far"
            ></b-icon>
          </div>
        </transition>

        <div class="x-container registration p-b-100">
          <div v-if="court.hero_image" class="align__centar__all flex__column m-t-20">
            <img :src="court.hero_image" class="m-b-15 softshadow radius__5" alt="" />
            <b-button class="is-smaller" type="is-danger" rounded @click="court.hero_image = null">
              {{ $t('ukloniSliku') }}
            </b-button>
          </div>
          <photoUpload
            v-else
            stencil="rectangle-stencil"
            :aspect-ratio="2.35"
            class="m-t-10"
            @update="saveMedia($event)"
          ></photoUpload>

          <form @submit.prevent="submit">
            <ValidationProvider v-slot="{ errors, valid }" name="Naziv terena" rules="required">
              <b-field
                :label="$t('nazivTerena')"
                class="login__input__container"
                :type="valid ? 'is-success' : 'is-danger'"
                :message="errors"
              >
                <b-input v-model="court.name" size="is-medium" :placeholder="$t('upiiNazivTerena')" type="text" rounded>
                </b-input>
              </b-field>
            </ValidationProvider>
            <div class="label">{{ $t('terenUFunkciji') }}</div>
            <ValidationProvider v-slot="{ errors, valid }" name="Funkcija" class="radio__box" rules="required">
              <div class="block">
                <b-radio
                  v-model="court.is_active"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                  :native-value="true"
                >
                  {{ $t('uFunkciji') }}
                </b-radio>
                <b-radio
                  v-model="court.is_active"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                  :native-value="false"
                >
                  {{ $t('nijeUFunkciji') }}
                </b-radio>
              </div>
            </ValidationProvider>
            <div class="label">{{ $t('Teren mogu rezervirati članovi') }}</div>
            <ValidationProvider v-slot="{ errors, valid }" name="Rezervacija" class="radio__box" rules="required">
              <div class="block">
                <b-radio
                  v-model="court.member_reservation"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                  :native-value="true"
                >
                  {{ $t('da') }}
                </b-radio>
                <b-radio
                  v-model="court.member_reservation"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                  :native-value="false"
                >
                  {{ $t('ne') }}
                </b-radio>
              </div>
            </ValidationProvider>
            <div class="label">{{ $t('vrstaTerena') }}</div>
            <ValidationProvider v-slot="{ errors, valid }" name="Vrsta terena" class="radio__box">
              <div class="block">
                <b-radio
                  v-model="court.type"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                  native-value="open"
                  rules="required"
                >
                  {{ $t('vanjskiTeren') }}
                </b-radio>
                <b-radio
                  v-model="court.type"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                  native-value="closed"
                  rules="required"
                >
                  {{ $t('natkrivenTeren') }}
                </b-radio>
              </div>
            </ValidationProvider>
            <div class="label">{{ $t('reflektori') }}</div>
            <ValidationProvider v-slot="{ errors, valid }" name="Reflektori" class="radio__box" rules="required">
              <div class="block">
                <b-radio
                  v-model="court.lights"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                  :native-value="true"
                >
                  {{ $t('da') }}
                </b-radio>
                <b-radio
                  v-model="court.lights"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                  :native-value="false"
                >
                  {{ $t('ne') }}
                </b-radio>
              </div>
            </ValidationProvider>
            <div class="label">{{ $t('rezervacije') }}</div>
            <ValidationProvider v-slot="{ errors, valid }" name="Rezervacije" class="radio__box" rules="required">
              <div class="block">
                <b-radio
                  v-model="court.reservation_duration"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                  :native-value="30"
                >
                  {{ $t('na30Minuta') }}
                </b-radio>

                <b-radio
                  v-model="court.reservation_duration"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                  :native-value="60"
                >
                  {{ $t('naPuniSat') }}
                </b-radio>
                <b-radio
                  v-model="court.reservation_duration"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                  :native-value="90"
                >
                  {{ $t('na90Minuta') }}
                </b-radio>
              </div>
            </ValidationProvider>
            <template v-if="court.reservation_duration === 30">
              <div class="label">{{ $t('polusatnaRupa') }}</div>
              <ValidationProvider v-slot="{ errors, valid }" name="Rezervacije" class="radio__box" rules="required">
                <div class="block">
                  <b-radio
                    v-model="court.reservation_hole"
                    :type="valid ? 'is-success' : 'is-danger'"
                    :message="errors"
                    :native-value="1"
                  >
                    {{ $t('mogua') }}
                  </b-radio>
                  <b-radio
                    v-model="court.reservation_hole"
                    :type="valid ? 'is-success' : 'is-danger'"
                    :message="errors"
                    :native-value="0"
                  >
                    {{ $t('onemogui') }}
                  </b-radio>
                </div>
              </ValidationProvider>
            </template>
            <div class="label">{{ $t('potvrdaRezervacije') }}</div>
            <ValidationProvider v-slot="{ errors, valid }" name="Rezervacije" class="radio__box" rules="required">
              <div class="block">
                <b-radio
                  v-model="court.reservation_confirmation"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                  :native-value="true"
                >
                  {{ $t('da') }}
                </b-radio>
                <b-radio
                  v-model="court.reservation_confirmation"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                  :native-value="false"
                >
                  {{ $t('ne') }}
                </b-radio>
              </div>
            </ValidationProvider>
            <div class="label">{{ $t('prikazTerenaNaTenisplusStranici') }}</div>
            <ValidationProvider v-slot="{ errors, valid }" name="Prikaz" class="radio__box" rules="required">
              <div class="block">
                <b-radio
                  v-model="court.show_on_tenisplus"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                  :native-value="true"
                >
                  {{ $t('da') }}
                </b-radio>
                <b-radio
                  v-model="court.show_on_tenisplus"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                  :native-value="false"
                >
                  {{ $t('ne') }}
                </b-radio>
              </div>
            </ValidationProvider>
            <div v-if="sports.length && Object.keys(court).length" class="activity__reservation">
              <div class="label">{{ $t('tipTerena') }}</div>
              <div v-if="true" class="activity__box action__buttons">
                <div
                  v-for="(sport, index) in sports"
                  :key="index"
                  :class="court.sports === undefined ? '' : getClassType(sport)"
                  class="action__item__small fw600"
                  @click="selectType(sport)"
                >
                  {{ sport.name }}
                </div>
              </div>
            </div>

            <div class="label">{{ $t('vrstaPodloge') }}</div>
            <div class="activity__reservation">
              <transition name="fade">
                <div class="activity__box action__buttons">
                  <div
                    v-for="surface in surfaces"
                    :key="surface.id"
                    :class="court.surface.id === surface.id ? 'active' : ''"
                    class="action__item__small fw600"
                    @click="court.surface = surface"
                  >
                    {{ $t(surface.title) }}
                  </div>
                </div>
              </transition>
            </div>
            <div v-if="$auth.user.is_admin && touched > 1" class="buttons is-fixed m-t-20">
              <b-button type="is-primary" icon-right="check" pack="far" :loading="loading" rounded @click="saveCourt()">
                {{ $t('spremiIzmjene') }}
              </b-button>
            </div>

            <div v-if="$auth.user.is_admin" class="buttons m-t-20">
              <b-button
                class="softshadow m-t-10 m-b-20 invert-small-button"
                type="is-small noborder is-danger has-text-white"
                pack="fal"
                icon-right="times-circle"
                rounded
                @click="isModalCourtDeleteActive = true"
              >
                {{ $t('obriiTeren') }}
              </b-button>
            </div>
          </form>
        </div>
      </b-tab-item>
      <b-tab-item :label="$t('cijene')">
        <b-steps v-model="activeStep" :has-navigation="hasNavigation" :animated="true">
          <b-step-item has-navigation="false" step="1" :label="$t('radnoVrijemeICijene')" class="m-t-0 x-container">
            <template v-if="court.working_hours.length < 1">
              <div class="divider-line-1 m-b-20 m-t-20"></div>
              <div class="fw600 has-text-centered has-text-black80 m-b-15 m-t--5">
                {{ $t('unesiteCijeneIRadnoVrijemeTerenaZaSveOsnovneKorisn') }}
              </div>
            </template>
            <div class="x-container registration">
              <div v-if="courts.length > 1" class="buttons">
                <b-button
                  class="m-t-10 m-b-30 softshadow"
                  type="is-small noborder"
                  pack="fal"
                  icon-right="copy"
                  rounded
                  @click="
                    selectedMembershipId = null
                    isModaSelectActive = true
                  "
                >
                  {{ $t('kopirajPodatkeDrugogTerena') }}
                </b-button>
              </div>
            </div>

            <div class="divider-line-1 m-b-30"></div>
            <div class="activity__reservation p-b-75">
              <div class="header-negative-mem-price">
                <div class="fw600 is-size-7 m-b--2">
                  {{ $t('osnovnoRadnoVrijemeICijene') }}
                </div>
                <span class="is-size-5 fw600">{{ basicMembership?.name }}</span>
              </div>

              <!--              <div v-if="court.working_hours?.length > 0" class="activity__header">-->
              <!--                <div class="m-t-20 has-text-centered w100">-->
              <!--                  <div class="fw600 is-size-6">{{ $t('osnovnoRadnoVrijemeICijene') }}</div>-->
              <!--                  <div class="fw600 is-size-4 m-b-10 has-text-primary">{{ basicMembership?.name }}</div>-->
              <!--                </div>-->
              <!--              </div>-->

              <div class="activity__box action__buttons m-b-15 m-t-10">
                <div
                  v-for="(item, index) in court.working_hours"
                  v-show="item.membership_id === null"
                  :key="index"
                  class="action__item fw600"
                >
                  {{ item.cron | parseCron('days') }}, {{ item.cron | parseCron('hours') }} h
                  <span class="x-tag primary-light m-l-auto m-r-5"
                    >{{ item.price | currency }} / {{ court.reservation_duration }} min</span
                  >
                  <div
                    class=""
                    @click="
                      itemId = item.id
                      isModalActive = true
                    "
                  >
                    <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-5"> </b-icon>
                  </div>
                </div>
              </div>
              <div class="buttons m-t-30 m-b-10">
                <b-button
                  v-if="filterByMembershipNull() > 1"
                  class="softshadow invert-small-button"
                  type="noborder is-small is-danger has-text-white"
                  pack="fal"
                  icon-right="times"
                  rounded
                  @click.prevent="
                    membershipIdNull = true
                    isModalActiveBulk = true
                  "
                >
                  {{ $t('Obriši sve') }}
                </b-button>

                <b-button
                  class="softshadow"
                  type="is-small noborder"
                  pack="fal"
                  icon-right="plus-circle"
                  rounded
                  @click.prevent="activeStep++"
                >
                  {{ $t('unesiCijene') }}
                </b-button>
              </div>

              <!--              <div-->
              <!--                v-if="memberships.length > 1"-->
              <!--                class="align__centar__all flex__column is-primary has-text-white p-t-10 p-b-10 profile-black-header radius__5 m-t-30 p-l-10 p-r-10"-->
              <!--              >-->
              <!--                <div class="divider"></div>-->
              <!--                <div class="fw600 has-text-centered is-size-4">{{ $t('radnoVrijemeICijeneZaLanove') }}</div>-->
              <!--                <div class="fw600 has-text-centered is-size-6">-->
              <!--                  {{ $t('unesiteCijeneIRadnoVrijemeTerenaZaLanoveKluba') }}-->
              <!--                </div>-->
              <!--              </div>-->
              <div v-if="memberships.length < 2" class="has-text-centered m-t-30">
                <b-icon icon="circle-info" pack="fal" type="is-primary" class="is-large m-t-5"> </b-icon>
                <div class="fw600 has-text-centered is-size-4">{{ $t('Možete imati više vrsta tipova članstva') }}</div>
                <div class="fw600 has-text-centered is-size-6">
                  {{ $t('Za svaku vrstu članova imate opciju unosa različitih cijena i radnog vremena') }}
                </div>
                <div class="buttons m-t-20">
                  <b-button
                    tag="nuxt-link"
                    :to="localePath('/admin/membership/')"
                    class="is-smaller"
                    type="is-primary"
                    pack="fal"
                    icon-right="chevron-right"
                    rounded
                  >
                    {{ $t('Izradi novi tip članstva') }}
                  </b-button>
                </div>
              </div>
              <div class="">
                <div
                  v-for="(membershipOne, i) in memberships"
                  v-show="membershipOne.basic !== true"
                  :key="i"
                  class="m-b-10 m-t-30"
                >
                  <div class="header-negative-mem-price">
                    <div class="fw600 is-size-7 m-b--2">
                      {{ $t('lanstvo') }}
                    </div>
                    <span class="is-size-5 fw600">{{ membershipOne.name }}</span>
                  </div>
                  <div class="activity__box action__buttons m-t-10">
                    <div
                      v-for="(item, index) in court.working_hours"
                      v-show="item.membership_id === membershipOne.id"
                      :key="index"
                      class="action__item fw600"
                    >
                      {{ item.cron | parseCron('days') }}, {{ item.cron | parseCron('hours') }} h
                      <span class="x-tag primary-light m-l-auto m-r-5"
                        >{{ item.price | currency }} / {{ court.reservation_duration }} min</span
                      >
                      <div
                        class=""
                        @click="
                          itemId = item.id
                          isModalActive = true
                        "
                      >
                        <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-5"> </b-icon>
                      </div>
                    </div>
                  </div>
                  <div class="buttons m-t-30 m-b-10">
                    <b-button
                      v-if="filterByMembershipId(membershipOne) > 1"
                      class="softshadow invert-small-button"
                      type="noborder is-small is-danger has-text-white"
                      pack="fal"
                      icon-right="times"
                      rounded
                      @click.prevent="
                        membershipId = membershipOne.id
                        isModalActiveBulk = true
                      "
                    >
                      {{ $t('Obriši sve') }}
                    </b-button>

                    <b-button
                      class="softshadow"
                      type="is-small noborder"
                      pack="fal"
                      icon-right="plus-circle"
                      rounded
                      @click.prevent="
                        activeStep++
                        membershipId = membershipOne.id
                      "
                    >
                      {{ $t('unesiCijene') }}
                    </b-button>
                  </div>
                </div>
              </div>
            </div>
          </b-step-item>
          <b-step-item
            has-navigation="false"
            step="2"
            :label="$t('odaberiDane')"
            class="m-t-10 x-container"
            :clickable="true"
          >
            <div class="activity__reservation">
              <div class="fw600 has-text-centered m-b-15">
                {{ $t('oznaiteDaneKojiEDijelitiIstuCijenuIRadnoVrijeme') }}
              </div>
              <div class="buttons m-t-20">
                <b-button
                  class="softshadow m-b-10"
                  type="is-small noborder"
                  pack="fal"
                  rounded
                  @click="selected_days = ['1', '2', '3', '4', '5', '6', '7']"
                >
                  {{ $t('odaberiSveDane') }}
                </b-button>
              </div>

              <div class="activity__box action__buttons">
                <div
                  v-for="(day, key) in days"
                  :key="key"
                  :class="getClassDay(key)"
                  class="action__item__small fw600"
                  @click="selectDay(key)"
                >
                  {{ day }}
                </div>
              </div>
            </div>
          </b-step-item>

          <b-step-item step="3" :label="$t('odaberiVrijeme')" class="x-container">
            <div class="activity__reservation">
              <div class="fw600 has-text-centered m-b-15">{{ $t('oznaiteSateKojiEImatiJednakuCijenu') }}</div>
              <div class="activity__box action__buttons">
                <div
                  v-for="(hour, index) in hours"
                  :key="index"
                  :class="getClassHour(hour)"
                  class="action__item__small fw600"
                  @click="selectHour(hour)"
                >
                  {{ hour | parseTime() }}
                </div>
              </div>
            </div>
          </b-step-item>

          <b-step-item step="4" :label="$t('Cijena')" class="x-container">
            <div class="fw600 has-text-centered m-b-15">
              {{
                $t('upiiteCijenuRezervacijeZa', {
                  expr:
                    court.reservation_duration === 30
                      ? $t('30Minuta')
                      : court.reservation_duration === 60
                      ? $t('60Minuta')
                      : $t('90Minuta'),
                })
              }}
            </div>

            <ValidationProvider v-slot="{ errors, valid }" name="Cijena" rules="required">
              <b-field
                class="login__input__container"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input v-model="price" placeholder="0" class="form-control" type="number" rounded />
              </b-field>
            </ValidationProvider>
          </b-step-item>

          <div v-if="activeStep !== 0" class="buttons m-t-30 is-fixed">
            <b-button
              class="m-l-10 fw600"
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
              class="m-l-10 fw600"
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
              class="m-l-10 fw600"
              type="is-primary"
              pack="fal"
              icon-right="check"
              rounded
              @click.prevent="submitWorkingHours"
            >
              {{ $t('spremi') }}
            </b-button>
          </div>
        </b-steps>
      </b-tab-item>
      <b-tab-item :label="$t('atraktivni')">
        <div class="fw600 has-text-lightblue has-text-centered is-size-4 m-t-20">{{ $t('Uskoro') }}</div>
        <b-steps v-if="false" v-model="activeStepAttractive" :has-navigation="hasNavigation" :animated="true">
          <b-step-item has-navigation="false" step="1" :label="$t('posebniTermini')" class="m-t-0 x-container">
            <div class="x-container registration">
              <div class="buttons">
                <b-button
                  class="m-t-0 m-b-20 softshadow"
                  type="is-small noborder"
                  pack="fal"
                  icon-right="copy"
                  rounded
                  @click="isModaSelectActive = true"
                >
                  {{ $t('kopirajPodatkeDrugogTerena') }}
                </b-button>
              </div>
            </div>
            <reservationCategories :court="court" />
          </b-step-item>
          <div v-if="activeStepAttractive !== 0" class="buttons m-t-30 is-fixed">
            <b-button
              class="m-l-10 fw600"
              type="is-danger"
              pack="fal"
              icon-left="chevron-left"
              rounded
              @click.prevent="activeStepAttractive--"
            >
              {{ $t('nazad') }}
            </b-button>
            <b-button
              v-if="activeStepAttractive !== 2"
              class="m-l-10 fw600"
              type="is-primary"
              pack="fal"
              icon-right="chevron-right"
              rounded
              @click.prevent="activeStepAttractive++"
            >
              {{ $t('dalje') }}
            </b-button>
            <b-button
              v-else
              class="m-l-10 fw600"
              type="is-primary"
              pack="fal"
              icon-right="check"
              rounded
              @click.prevent="submitWorkingHours"
            >
              {{ $t('spremi') }}
            </b-button>
          </div>
        </b-steps>
      </b-tab-item>
    </b-tabs>
    <b-modal :active.sync="isModalActive" :width="640" scroll="clip" class="modal__confirmation">
      <modalConfirmation
        :title="$t('potvrdomEteObrisatiUnos')"
        :subtitle="$t('Uvijek možete dodati nova radna vremena i cijene')"
        @update="deleteWorkingHour()"
      ></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalActiveBulk" :width="640" scroll="clip" class="modal__confirmation">
      <modalConfirmation
        :title="$t('potvrdomEteObrisatiUnos')"
        :subtitle="$t('Uvijek možete dodati nova radna vremena i cijene')"
        @update="deleteWorkingHourBulk()"
      ></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalCourtDeleteActive" :width="640" scroll="clip" class="modal__confirmation z200">
      <modalConfirmation :title="$t('potvrdomEteObrisatiTeren')" @update="deleteCourt()"></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModaSelectActive" :width="640" scroll="clip" class="modal__members">
      <modalSelect
        :options="courts"
        :title="$t('popisTerena')"
        :subtitle="$t('Odaberite teren čije podatke želite kopirati')"
        @update="deleteAllAndCopy($event)"
      ></modalSelect>
    </b-modal>
  </div>
</template>
<script>
import _ from 'lodash'
import Sport from '@/models/Sport'
import WorkingHours from '@/models/WorkingHours'
import Media from '~/models/Media'
import photoUpload from '~/components/photoUpload'
import hero from '~/components/Hero'
import Court from '~/models/Court'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import modalSelect from '~/components/modal/ModalSelectCourtCopyData'
import reservationCategories from '~/components/court/reservationCategoriesSpecial'

export default {
  name: 'CourtEdit',
  components: {
    hero,
    photoUpload,
    modalSelect,
    modalConfirmation,
    reservationCategories,
  },
  filters: {
    parseTime(hours) {
      return hours + ':00 - ' + (hours + 1) + ':00' + ' h'
    },
  },
  async fetch() {
    await this.getSurfaces()
    await this.getCourts()
    await this.getCourt()
    await this.getSports()
  },
  data() {
    return {
      loading: false,
      selected_membership: {},
      isModalActiveBulk: false,
      membershipIdNull: false,
      isModalActive: false,
      isModalCourtDeleteActive: false,
      isModaSelectActive: false,
      hasNavigation: false,
      activeStep: 0,
      activeStepAttractive: 0,
      activeTab: 0,
      surfaces: [],
      courts: [],
      name: '',
      id: null,
      new_image: '',
      court: {
        name: '',
        id: null,
        reservation_duration: null,
        reservation_confirmation: false,
        reservation_hole: 0,
        show_on_tenisplus: 1,
        surface: {},
        is_active: '',
        member_reservation: true,
        hero_image: '',
        image: '',
        new_image: '',
        type: '',
        lights: '',
        working_hours: [],
      },
      touched: 0,
      loaded: false,
      days: { 1: 'Ponedjeljak', 2: 'Utorak', 3: 'Srijeda', 4: 'Četvrtak', 5: 'Petak', 6: 'Subota', 7: 'Nedjelja' },
      hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      selected_days: [],
      selected_hours: [],
      price: null,
      disabled: true,
      itemId: null,
      priceForMemmerships: true,
      membershipId: null,
      membership: {},
      courtTypes: [],
      sports: [],
    }
  },
  computed: {
    heroImage() {
      return this.court.hero_image ? this.court.hero_image : '/hero_courts.jpg'
    },
    club() {
      return this.$store.state.club
    },
    memberships() {
      return this.$store.state.club.memberships
    },
    sortedSelectedHours() {
      return _.sortBy(this.selected_hours)
    },
    basicMembership() {
      return this.memberships.find((membership) => membership.basic)
    },
  },
  watch: {
    court: {
      deep: true,
      handler() {
        this.touched++
      },
    },
  },
  methods: {
    filterByMembershipId(item) {
      const x = this.court.working_hours.filter((wh) => wh.membership_id === item.id)
      return x.length
    },
    filterByMembershipNull() {
      const x = this.court.working_hours.filter((wh) => wh.membership_id === null)
      return x.length
    },
    getSports() {
      Sport.get().then((res) => {
        this.sports = res
      })
    },
    deleteAllAndCopy(data) {
      this.deleteWorkingHourBulkAll()
      this.copyData(data)
    },
    copyData(data) {
      Object.assign(this.court.working_hours, data.working_hours)
      for (let i = 1; i < this.court.working_hours.length; i++) {
        delete this.court.working_hours[i].id
        this.court.working_hours[i].membership = { id: this.court.working_hours[i].membership_id }
      }
      const court = new Court(this.court)
      const hours = new WorkingHours({ working_hours: this.court.working_hours }).for(court)
      hours
        .save()
        .then(() => {
          this.getCourt()
          this.selected_days = []
          this.selected_hours = []
          this.price = 0
          this.activeStep = 0
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste unijeli cijene'),
            type: 'is-success',
          })
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
        })

      this.$buefy.toast.open({
        message: this.$t('uspjenoSteKopiraliPodatkeTerena', { name: data.name }),
        type: 'is-success',
      })
      this.disabled = false
      this.id = this.court.id
      this.name = this.court.name
      Object.assign(this.court, data)
      this.court.id = this.id
      this.court.name = this.name
    },
    getCourt() {
      Court.include('sports')
        .find(this.$route.params.id)
        .then((res) => {
          this.court = res
          this.loaded = true
        })
    },
    getCourts() {
      Court.get().then((res) => {
        this.courts = res.data
      })
    },
    saveMedia(media) {
      this.loading = true
      const n = new Media({ media, title: this.court.name, description: this.court.name })
      n.save()
        .then((res) => {
          this.court.hero_image = res.link
          this.loading = false
          this.saveCourt()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    saveCourt() {
      this.loading = true
      const court = new Court(this.court)
      court
        .save()
        .then((res) => {
          this.court = res
          this.disabled = false
          this.touched = 0
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili novi teren'),
            type: 'is-success',
          })
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Popunite sva polja i pokušajte ponovo.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    selectDay(item) {
      if (_.indexOf(this.selected_days, item) > -1) {
        this.selected_days.splice(_.indexOf(this.selected_days, item), 1)
      } else {
        this.selected_days.push(item)
      }
    },
    getClassDay(item) {
      return {
        active: _.indexOf(this.selected_days, item) > -1,
      }
    },
    selectType(item) {
      const index = this.court.sports.findIndex((selectedItem) => selectedItem.id === item.id)
      if (index > -1) {
        this.court.sports.splice(index, 1)
      } else {
        this.court.sports.push(item)
      }
    },
    getClassType(item) {
      let activeClass = ''
      this.court.sports.forEach((obj1) => {
        if (obj1.id === item.id) {
          activeClass = 'active'
        }
      })
      return activeClass
    },
    selectHour(item) {
      const inRangeSelectedHour = _.inRange(
        item,
        this.sortedSelectedHours[0],
        this.sortedSelectedHours[this.sortedSelectedHours.length - 1]
      )
      if (inRangeSelectedHour) {
        this.selected_hours.pop()
      }
      if (_.indexOf(this.selected_hours, item) > -1) {
        this.selected_hours.splice(_.indexOf(this.selected_hours, item), 1)
      } else {
        this.selected_hours.push(item)
      }
    },
    getClassHour(item) {
      const inRangeSelectedHour = _.inRange(
        item,
        this.sortedSelectedHours[0],
        this.sortedSelectedHours[this.sortedSelectedHours.length - 1]
      )
      return {
        active: _.indexOf(this.selected_hours, item) > -1 || inRangeSelectedHour,
      }
    },
    submitWorkingHours() {
      const court = new Court(this.court)
      const hours = new WorkingHours({
        days: this.selected_days,
        hours: this.selected_hours,
        price: this.price,
        membership: { id: this.membershipId },
      }).for(court)
      hours
        .save()
        .then(() => {
          this.getCourt()
          this.selected_days = []
          this.selected_hours = []
          this.membershipId = null
          this.price = 0
          this.activeStep = 0
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste unijeli cijene'),
            type: 'is-success',
          })
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
        })
    },
    deleteCourt() {
      const r = new Court(this.court)
      r.delete().then(() => {
        this.$router.push(this.localePath('/admin/courts/'))
        this.$buefy.toast.open({
          message: this.$t('Uspješno ste obrisali novi teren'),
          type: 'is-success',
        })
      })
    },
    deleteWorkingHour() {
      const court = new Court(this.court)
      const id = this.itemId
      const hours = new WorkingHours({ id }).for(court)
      hours
        .delete()
        .then(() => {
          // TODO: refactor
          this.court.working_hours = _.filter(this.court.working_hours, (h) => {
            return h.id !== id
          })
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali unos'),
            type: 'is-success',
          })
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
        })
    },
    deleteWorkingHourBulk() {
      const court = new Court(this.court)
      const selectedMembershipId = this.membershipId

      const workingHourIdsToDelete = this.court.working_hours
        .filter((hour) => hour.membership_id === selectedMembershipId)
        .map((hour) => hour.id)

      // Use Promise.all to delete all selected working hours
      const deletePromises = workingHourIdsToDelete.map((hourId) => {
        const hours = new WorkingHours({ id: hourId }).for(court)
        return hours.delete().catch(() => {
          // Handle errors if necessary
          console.error(`Error deleting working hour with ID: ${hourId}`)
        })
      })

      Promise.all(deletePromises).then(() => {
        // Display a success message after all working hours are deleted
        this.$buefy.toast.open({
          message: this.$t('Bulk delete successful'),
          type: 'is-success',
        })
        // Filter the working hours array to remove working hours with the selected membership_id
        this.court.working_hours = this.court.working_hours.filter((hour) => {
          return hour.membership_id !== selectedMembershipId
        })
      })
    },
    deleteWorkingHourBulkAll() {
      const court = new Court(this.court)
      const workingHourIdsToDelete = this.court.working_hours
        .filter((hour) => this.selectedMembershipId === null || hour.membership_id === this.selectedMembershipId)
        .map((hour) => hour.id)

      // Use Promise.all to delete all selected working hours
      const deletePromises = workingHourIdsToDelete.map((hourId) => {
        const hours = new WorkingHours({ id: hourId }).for(court)
        return hours.delete().catch(() => {
          // Handle errors if necessary
          console.error(`Error deleting working hour with ID: ${hourId}`)
        })
      })

      Promise.all(deletePromises).then(() => {
        // Display a success message after all working hours are deleted
        this.$buefy.toast.open({
          message: this.$t('Bulk delete successful'),
          type: 'is-success',
        })
        // Filter the working hours array to remove working hours with the selected membership_id
        if (this.selectedMembershipId !== null) {
          this.court.working_hours = this.court.working_hours.filter((hour) => {
            return hour.membership_id !== this.selectedMembershipId
          })
        } else {
          // If selectedMembershipId is null, clear the working_hours array completely
          this.court.working_hours = []
        }
      })
    },
    getSurfaces() {
      this.$axios.get('surfaces').then((res) => {
        this.surfaces = res.data
      })
    },
    getCourtTypes() {
      this.$axios.get('surfaces').then((res) => {
        this.courtTypes = res.data
      })
    },
  },
}
</script>
