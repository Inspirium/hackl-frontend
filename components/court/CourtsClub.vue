<template>
  <div>
    <!-- Table list -->
    <b-tabs v-model="activeTab" size="is-medium" position="is-centered" class="p-b-200 hide_tab_navigation">
      <b-tab-item>
        <div class="bodyWrap">
          <hero :page="'courts'" :class="[!club.weather ? '' : 'noafter']" :options="heroImage">
            <h1 class="has-text-white navigation__title">
              <div class="">
                <div
                  :class="{ 'rotate-icon': showDatePicked }"
                  class="align__centar__x m-t-10"
                  @click="showDatePicked = !showDatePicked"
                >
                  <div class="is-size-2 m-r-10 m-t--2">
                    {{ selected_date | moment('DD.MM.') }}
                  </div>
                  <b-icon
                    style="transition: 0.25s all"
                    icon="chevron-down"
                    size="is-larger"
                    type="is-white"
                    pack="fal"
                  ></b-icon>
                </div>
              </div>
              <div class="is-size-6 m-t-5">{{ selected_date | moment('dddd') }}</div>
            </h1>
            <div v-if="club.weather" class="notification_box">
              <cloud class="m-t-10" />
            </div>
          </hero>
          <transition name="slidea">
            <div
              v-if="!checkIfAllowed"
              class="is-red fw600 is-size-5 has-text-centered has-text-white radius__full p-r-30 p-l-30 p-t-10 p-b-10 is-fixed-floating align-transform m-t-20"
            >
              {{ $t('Jedna rezervacija može biti maksimalno 2 sata') }}
            </div>
          </transition>

          <section v-if="showDatePicked" class="courtDatePicker" :class="{ courtDatePickerAdminShowYear: isAdmin }">
            <b-field>
              <b-datepicker
                v-model="datePicked"
                :day-names="$t('datepicker.days')"
                :placeholder="$t('klikniOvdjeZaOdabir')"
                :open-on-focus="false"
                trap-focus
                :min-date="minDate"
                :max-date="maxDate"
                :close-on-click="true"
                inline
                :first-day-of-week="1"
                :mobile-native="false"
              >
              </b-datepicker>
            </b-field>
          </section>
          <div
            v-touch:swipe="swipeHandler"
            class="x-container activity"
            :class="{ 'datepicker-active': showDatePicked }"
          >
            <div class="tab__navigation m-b-20 m-t--40">
              <div
                :class="['tab__navigation__arrow__left', inactive ? (isAdmin ? '' : 'inactive') : '']"
                @click="prevDay"
              >
                <b-icon v-if="!loading1" icon="chevron-left" pack="fal"></b-icon>
                <b-icon v-else icon="spinner" pack="far" custom-class="rotating"> </b-icon>
              </div>
              <div :class="['tab__navigation__arrow__right', inactiveNext ? '' : 'inactive']" @click="nextDay">
                <b-icon v-if="!loading" icon="chevron-right" pack="fal"> </b-icon>
                <b-icon v-else icon="spinner" pack="far" custom-class="rotating"> </b-icon>
              </div>
            </div>
            <div class="m-t--20">
              <!--Prikaži samo ako je admin objavio prekid igre zbog atmosferlija-->
              <!-- <template v-if="club.canceled !== undefined">
                <div v-if="club.canceled[selected_date]" class="align__centar__all m-b-15">
                  <b-icon icon="cloud-showers-heavy" pack="fal" type="is-danger" size="is-large" class="m-r-15">
                  </b-icon>
                  <div class="title is-size-4">{{ $t('igraPrekinuta') }}</div>
                </div>
              </template>-->
              <!--End-->
              <div v-if="isAdmin && isMemberOfTheClub" class="admin_box m-b-30 m-t-30 p-t-25">
                <admin-weather-buttons @update="getCourts()"></admin-weather-buttons>
                <div v-if="user && user.is_admin" class="buttons">
                  <b-button
                    class="softshadow"
                    type="is-small noborder"
                    pack="fas"
                    icon-right="cog"
                    rounded
                    tag="nuxt-link"
                    :to="localePath('/admin/courts')"
                  >
                    {{ $t('administracijaTerena') }}
                  </b-button>
                  <b-button
                    class="softshadow"
                    type="is-small noborder"
                    pack="fas"
                    icon-right="person-digging"
                    rounded
                    @click="isModalCourtBreakActive = true"
                  >
                    {{ $t('Nedostupnost terena') }}
                  </b-button>
                </div>
              </div>
              <template v-if="isMemberOfTheClub">
                <div class="buttons m-t-10">
                  <b-button
                    class="softshadow m-t-10 m-b-10"
                    type="is-small noborder"
                    icon-right="tennis-ball"
                    pack="fal"
                    rounded
                    tag="nuxt-link"
                    :to="localePath('/terms')"
                  >
                    {{ $t('predloiTermineIgrau') }}
                  </b-button>
                  <b-button
                    class="softshadow m-t-10 m-b-10"
                    type="is-small noborder"
                    :icon-right="!preference.courts.showDetailedCourtsView ? 'arrows-maximize' : 'arrows-minimize'"
                    pack="fal"
                    rounded
                    @click="
                      showDetails = !showDetails
                      changePreference()
                    "
                  >
                    {{ !preference.courts.showDetailedCourtsView ? $t('Prikaži detaljno') : $t('Prikaži sažeto') }}
                  </b-button>
                  <b-button
                    v-if="preference.courts.showDetailedCourtsView && isAdmin"
                    class="softshadow m-t-10 m-b-10"
                    type="is-small noborder"
                    :icon-right="preference.courts.showButtonsInDetailedCourtsView ? 'square-xmark' : 'square-check'"
                    pack="fal"
                    rounded
                    @click="
                      showDetailsButtons = !showDetailsButtons
                      changePreference()
                    "
                  >
                    {{ preference.courts.showButtonsInDetailedCourtsView ? $t('Sakrij gumbe') : $t('Prikaži gumbe') }}
                  </b-button>
                </div>
                <!--Class .inactive is for disabled arrow - user can't go to past dates -->
              </template>
              <div v-else class="notify m-t-20" @click.prevent="joinClub">
                <div v-if="true" class="notification-info is-primary rounded-md">
                  <b-icon icon="exclamation-square" pack="fal" type="is-white" class="is-large m-t-5"> </b-icon>
                  <div class="has-text-centered is-size-5 has-text-white fw600">
                    {{ $t('akoEliteRezerviratiTereneMorateSePrijavitiUKlub') }}
                  </div>
                  <div class="buttons m-t-25 m-b-5">
                    <b-button
                      class="m-b-10 softshadow"
                      type="is-small noborder"
                      pack="fal"
                      icon-right="arrow-circle-right"
                      rounded
                      :loading="loading3"
                      @click.prevent="joinClub"
                    >
                      {{ $t('prijaviSe') }}
                    </b-button>
                  </div>
                </div>
              </div>
              <!--End-->
            </div>
          </div>
          <div class="relative">
            <transition name="fade">
              <div v-if="loading2" class="align__centar__x loading_z_spinner">
                <b-icon
                  class="comment-send m-b-20"
                  custom-class="rotating"
                  icon="spinner"
                  size="is-large"
                  type="is-primary"
                  pack="far"
                ></b-icon>
              </div>
            </transition>
            <div
              v-if="courts.length && !preference.courts.showDetailedCourtsView && isMemberOfTheClub"
              class="bodyWrap p-l-10 p-r-10"
            >
              <div v-for="c in courts" :key="c.id" :class="{ loading_opaq: swipeLoading, 'court-loading': true }">
                <template v-if="Object.keys(c.parsed_reservations).length">
                  <div
                    class="court activity__box--padding m-b-15"
                    :class="{
                      'border-court-slot-rain': c.weather,
                      'border-court-break': checkIfCourtBreak(c),
                      'border-court-break-admin': checkIfCourtBreakAdmin(c),
                    }"
                  >
                    <nuxt-link :to="localePath('/courts/' + c.id + '/' + selected_date.format('YYYY-MM-DD'))">
                      <div>
                        <court-slot :court="c"></court-slot>
                      </div>
                    </nuxt-link>
                    <template v-if="c.member_reservation || isAdmin">
                      <div v-if="club.type === 'classic' || isAdmin" class="buttons">
                        <b-button
                          class="m-t-15"
                          type="is-small noborder"
                          pack="fal"
                          rounded
                          @click.stop="
                            selected_court = c
                            isReservationModal = true
                          "
                        >
                          {{ $t('rezerviraj') }}
                        </b-button>
                      </div>
                    </template>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="flex align__centar__x">
          <div
            v-if="preference.courts.showDetailedCourtsView && isMemberOfTheClub"
            v-dragscroll="windowWidth > 650"
            class="flex p-l-10 p-r-10 align__left__x"
            :class="{ snapit: windowWidth < 650 }"
          >
            <div v-for="c in courts" :key="c.id">
              <template v-if="Object.keys(c.parsed_reservations).length">
                <div
                  class="court m-b-15 m-r-15"
                  :class="
                    ({ loading_opaq: swipeLoading, 'court-loading': true },
                    windowWidth > 750 ? 'court-min-width-desktop' : 'court-min-width')
                  "
                >
                  <nuxt-link :to="localePath('/courts/' + c.id + '/' + selected_date.format('YYYY-MM-DD'))">
                    <div class="fw600 is-size-4 m-b-5 has-text-centered has-text-black80 flex align__centar__all">
                      <cloudSmall v-if="c.weather" class="m-r-5" />{{ c.name }}
                    </div>
                  </nuxt-link>
                  <div
                    v-if="checkIfCourtBreakAdmin(c)"
                    class="has-text-centered fw600 is-size-75 has-text-danger m-b-7 m-t--5"
                  >
                    {{ $t('Nije moguća rezervacija') }}
                  </div>
                  <div
                    class="activity__box"
                    :class="{
                      'border-court-slot-rain': c.weather,
                      'border-court-break': checkIfCourtBreak(c),
                      'border-court-break-admin': checkIfCourtBreakAdmin(c),
                    }"
                  >
                    <div
                      v-for="(one, indexOne) in c.parsed_reservations"
                      :id="indexOne + '-' + c.id"
                      :key="one.id + indexOne"
                    >
                      <div
                        v-if="combineTerms(c, indexOne) || (combineTerms(c, indexOne) && isAdmin)"
                        :class="['court-timeslot', 'relative', one.id === 0 ? '' : 'reserved']"
                        :style="
                          one.category && (isAdmin || user.is_trainer) ? `backgroundColor: ${one.category.color}15` : ''
                        "
                      >
                        <!--                    Show if reservation is category and it is payed-->
                        <template v-if="isAdmin && clubId !== 26 && club.is_w2p === true">
                          <!--                      <div class="">{{ one.created_by?.club_member[4] }}</div>-->
                          <div
                            v-if="
                              !one.category &&
                              one.created_by?.club_member[clubId.toString()]?.cashier === false &&
                              one.created_by?.club_member[clubId.toString()]?.admin === false
                            "
                            class=""
                          >
                            <b-icon class="m-b-5 is-small-16 w2p-ball" pack="fal" type="is-black80" icon="tennis-ball">
                            </b-icon>
                          </div>
                        </template>
                        <template v-if="one.category && isAdmin">
                          <div v-if="one.category.is_paid" class="court-category-paid">{{ $t('Plaćeno') }}</div>
                        </template>
                        <div :class="getClass(one)" class="court-item">
                          <div class="court-time-range">
                            {{ one.start_time !== undefined ? one.start_time : one.time | parseTime(true) }}<br />
                            {{
                              one.end_time !== undefined
                                ? one.end_time
                                : (one.time + (c.reservation_duration / 30) * 50) | parseTime(true)
                            }}
                          </div>
                          <div class="list-user" :class="one.type === 'school_group' ? 'w100' : ''">
                            <template v-if="one.competition">
                              <template v-if="one.competition">
                                <nuxt-link
                                  v-if="one.competition.type === 'App\\Models\\TournamentRound'"
                                  tag="div"
                                  :to="localePath('/cup/' + one.competition.object.tournament_id)"
                                  class="x-tag m-l-10 is-primary has-text-white m-b-10 inlineblock"
                                >
                                  {{ $t('natjecanjeKup') }}
                                </nuxt-link>
                                <nuxt-link
                                  v-if="one.competition.type === 'App\\Models\\League\\Group'"
                                  tag="div"
                                  :to="localePath('/liga/' + one.competition.object.league_id)"
                                  class="x-tag m-l-10 is-primary has-text-white m-b-10 inlineblock"
                                >
                                  {{ $t('natjecanjeLiga') }}
                                </nuxt-link>
                              </template>

                              <template v-if="one.category && one.players.length">
                                <div
                                  class="x-tag m-l-10 has-text-white m-b-10 inlineblock"
                                  :style="`backgroundColor: ${one.category.color}`"
                                >
                                  {{ one.category.name }}
                                </div>
                              </template>
                            </template>
                            <!--                      Show if school group reservation-->
                            <template v-if="one.type === 'school_group'">
                              <div v-if="one.players[0]">
                                <router-link
                                  v-if="club.hide_personal_data || isAdmin || isUserInReservation(one).length"
                                  :to="localePath('/school/' + one.players[0].id)"
                                  class="court-user"
                                >
                                  <TennisImage
                                    v-if="one.players[0].image"
                                    :size="[32, 32]"
                                    class="user_image-small m-l-5 m-r-10"
                                    :src="one.players[0].image"
                                  />
                                  <TennisImage
                                    v-else
                                    :size="[32, 32]"
                                    class="user_image-small m-l-5 m-r-10"
                                    :src="club.logo"
                                  />
                                  <div
                                    class="heading-mid is-size-55 has-text-black80 align-self-center fw500 flex flex__column line-height-11 fw600"
                                  >
                                    {{ one.players[0].display_name }}
                                  </div>
                                </router-link>
                                <div v-else class="court-user">
                                  <TennisImage
                                    :size="[32, 32]"
                                    class="user_image-small m-l-5 m-r-10"
                                    :src="club.logo"
                                  />
                                  <div
                                    class="heading-mid is-size-55 has-text-black80 align-self-center fw500 flex flex__column line-height-11 fw600"
                                  >
                                    {{ $t('rezervirano') }}
                                  </div>
                                </div>
                                <!--                                <b-button type="is-reservation" pack="fal" rounded size="is-smaller">{{-->
                                <!--                                  $t('Prikaži više')-->
                                <!--                                }}</b-button>-->

                                <court-school-group
                                  v-if="showSchoolDetails.filter((item) => item === one.id).length > 0"
                                  :group="one"
                                />
                              </div>
                            </template>
                            <template v-else>
                              <!--                      Show if less then three players in reservation-->
                              <template v-if="one.players.length < 3">
                                <template
                                  v-if="
                                    one.name &&
                                    (one.type === 'players' || one.type === 'doubles' || one.type === 'in_behalf')
                                  "
                                >
                                  <div
                                    v-if="!one.category"
                                    class="x-tag is-black50 m-l-10 has-text-white m-b-10 inlineblock"
                                  >
                                    {{ one.name }}
                                  </div>
                                </template>
                                <div v-if="one.players[0]" class="flex">
                                  <router-link
                                    v-if="club.hide_personal_data || isAdmin || isUserInReservation(one).length"
                                    :to="localePath('/player/' + one.players[0].id)"
                                    class="court-user"
                                  >
                                    <TennisImage
                                      v-if="one.type !== 'guest'"
                                      class="user_image-small m-l-5 m-r-10"
                                      :src="one.players[0].image"
                                    />
                                    <TennisImage v-else class="user_image-small m-l-5 m-r-10" :src="club.logo" />
                                    <div
                                      class="heading-mid is-size-55 has-text-black80 align-self-center fw500 flex flex__column line-height-11 fw600"
                                    >
                                      {{ one.type !== 'guest' ? one.players[0].display_name : one.name }}
                                      <span
                                        v-if="isAdmin && one.type !== 'guest'"
                                        class="is-size-7 has-text-lightblue fw600 m-t-2"
                                        >{{
                                          one.players[0].membership === '' ? 'Nije član' : one.players[0].membership
                                        }}</span
                                      >
                                      <span
                                        v-if="isAdmin && (one.type === 'in_behalf' || one.type === 'guest')"
                                        class="is-size-7 has-text-black50 fw600"
                                        >{{ $t('rezervacija2') }}
                                        <span class="has-text-lightblue">{{ one.created_by.display_name }}</span></span
                                      >
                                    </div>
                                  </router-link>
                                  <div v-else class="court-user">
                                    <TennisImage class="user_image-small m-l-5 m-r-10" :src="club.logo" />
                                    <div
                                      class="heading-mid is-size-55 has-text-black80 align-self-center fw500 flex flex__column line-height-11 fw600"
                                    >
                                      {{ $t('rezervirano') }}
                                    </div>
                                  </div>
                                  <div
                                    v-if="!one.is_paid && isAdmin && one.players.length > 1"
                                    class="m-t-10 m-l-auto"
                                    @click.stop="deletePlayer(one, 0)"
                                  >
                                    <b-icon icon="times" pack="fal" type="is-danger" size="is-small" class="m-l-15" />
                                  </div>
                                </div>

                                <div v-if="one.players[1]" class="flex">
                                  <router-link
                                    v-if="club.hide_personal_data || isAdmin || isUserInReservation(one).length"
                                    :to="localePath('/player/' + one.players[1].id)"
                                    class="court-user m-t-10"
                                  >
                                    <TennisImage class="user_image-small m-l-5 m-r-10" :src="one.players[1].image" />
                                    <div
                                      class="heading-mid is-size-55 has-text-black80 align-self-center fw500 flex flex__column line-height-11 fw600"
                                    >
                                      {{ one.players[1].display_name }}
                                      <span v-if="isAdmin" class="is-size-7 has-text-lightblue fw600 m-t-2">{{
                                        one.players[1].membership === '' ? 'Nije član' : one.players[1].membership
                                      }}</span>
                                    </div>
                                  </router-link>
                                  <div v-else class="court-user m-t-10">
                                    <TennisImage class="user_image-small m-l-5 m-r-10" :src="club.logo" />
                                    <div
                                      class="heading-mid is-size-55 has-text-black80 align-self-center fw500 flex flex__column line-height-11 fw600"
                                    >
                                      {{ $t('rezervirano') }}
                                    </div>
                                  </div>
                                  <div
                                    v-if="!one.is_paid && isAdmin && one.players.length > 1"
                                    class="m-t-10 m-l-auto"
                                    @click.stop="deletePlayer(one, 1)"
                                  >
                                    <b-icon icon="times" pack="fal" type="is-danger" size="is-small" class="m-l-15" />
                                  </div>
                                </div>
                              </template>
                              <!--                  Show if more then two players-->
                              <template v-if="one.players.length > 2">
                                <template
                                  v-if="
                                    one.name &&
                                    (one.type === 'players' || one.type === 'doubles' || one.type === 'in_behalf')
                                  "
                                >
                                  <div
                                    v-if="!one.category"
                                    class="x-tag is-black50 m-l-10 has-text-white m-b-10 inlineblock"
                                  >
                                    {{ one.name }}
                                  </div>
                                </template>
                                <template v-if="club.hide_personal_data || isAdmin || isUserInReservation(one).length">
                                  <div v-for="(player, index) in one.players" :key="player.id + index" class="flex">
                                    <router-link
                                      :to="localePath('/player/' + one.players[index].id)"
                                      class="court-user m-t-10)"
                                    >
                                      <TennisImage
                                        v-if="one.type !== 'guest'"
                                        class="user_image-small m-l-5 m-r-10"
                                        :src="player.image"
                                      />
                                      <TennisImage v-else class="user_image-small m-l-5 m-r-10" :src="club.logo" />
                                      <div
                                        class="heading-mid is-size-55 has-text-black80 align-self-center fw500 flex flex__column line-height-11 m-t-7 fw600"
                                      >
                                        {{ one.type !== 'guest' ? player.display_name : one.name }}
                                        <span
                                          v-if="isAdmin && one.type !== 'guest'"
                                          class="is-size-7 has-text-lightblue fw600 m-t-2"
                                          >{{ player.membership === '' ? 'Nije član' : player.membership }}</span
                                        >
                                        <span
                                          v-if="isAdmin && (one.type === 'in_behalf' || one.type === 'guest')"
                                          class="is-size-7 has-text-black50 fw600"
                                          >{{ $t('rezervacija2') }}
                                          <span class="has-text-lightblue">{{
                                            one.created_by.display_name
                                          }}</span></span
                                        >
                                      </div>
                                    </router-link>
                                    <div
                                      v-if="!one.is_paid && (isAdmin || user.id === player.id)"
                                      class="m-t-10 m-l-auto"
                                      @click.stop="deletePlayer(one, index)"
                                    >
                                      <b-icon icon="times" pack="fal" type="is-danger" size="is-small" class="m-l-15" />
                                    </div>
                                  </div>
                                </template>
                                <div v-else class="court-user">
                                  <TennisImage class="user_image-small m-l-5 m-r-10" :src="club.logo" />
                                  <div
                                    class="heading-mid is-size-55 has-text-black80 align-self-center fw500 flex flex__column line-height-11 fw600"
                                  >
                                    {{ $t('rezervirano') }}
                                  </div>
                                </div>
                              </template>
                              <template
                                v-if="!one.players[0] && !one.players[1] && one.id !== 0 && one.category && isAdmin"
                              >
                                <template v-if="Object.keys(one.category).length">
                                  <div class="court-user">
                                    <div class="heading-mid align-self-center fw600 m-l-10">
                                      {{ $t('rezervirano2', { name: one.category.name }) }}
                                    </div>
                                  </div>
                                  <div class="heading-mid align-self-center fw600 m-l-10 is-size-65 has-text-lightblue">
                                    {{ one.name }}
                                  </div>
                                </template>
                              </template>
                              <template v-if="one.category && !isAdmin">
                                <div class="court-user">
                                  <div class="heading-mid align-self-center fw600 m-l-10">{{ $t('rezervirano') }}</div>
                                </div>
                              </template>
                            </template>
                          </div>
                          <span v-if="one.price" class="fw600 is-size-6 m-l-10 has-text-black50"
                            >{{ $t('Cijena') }} {{ one.price | currency }}
                          </span>
                          <template v-if="c.member_reservation || isAdmin">
                            <div
                              v-if="!one.players[0] && one.id === 0 && (timeHasPassed(one) || isAdmin)"
                              class="action m-l-auto"
                            >
                              <div
                                v-if="!checkIfCourtBreakAdmin(c) || isAdmin"
                                class="activity__header m-l-5"
                                @click.prevent="selectSlot(c, one)"
                              >
                                <b-button
                                  v-if="checkIfSelected(c, one) === '' ? true : false"
                                  type="is-reservation"
                                  pack="fal"
                                  rounded
                                  size="is-smaller"
                                  >{{ $t('rezerviraj') }}</b-button
                                >
                                <b-icon
                                  v-else
                                  icon="times"
                                  pack="fal"
                                  type="is-white"
                                  size="is-medium"
                                  class="m-r-15"
                                />
                              </div>
                            </div>
                          </template>
                        </div>
                        <template v-if="preference.courts.showButtonsInDetailedCourtsView">
                          <template v-if="isAdmin">
                            <div class="action-horisontal m-l-auto">
                              <template v-if="(one.players[0] && one.id !== 0) || one.category">
                                <template>
                                  <b-button
                                    v-if="showCancelationForCashier(one) || user.is_admin"
                                    type="is-danger is-smaller-12"
                                    class="m-b-10 m-l-5 m-t-7"
                                    pack="fal"
                                    rounded
                                    size="is-smaller"
                                    :loading="loadingDelete"
                                    @click.prevent="
                                      cancel_term = one
                                      isModalDeleteActive = true
                                    "
                                    >{{ $t('otkai') }}
                                  </b-button>
                                </template>
                                <template>
                                  <b-button
                                    v-if="!one.is_paid"
                                    type="is-primary is-smaller-12"
                                    class="m-b-10 m-l-5 m-t-7"
                                    pack="fal"
                                    rounded
                                    size="is-smaller"
                                    @click.prevent="
                                      selected_court = c
                                      selectedTerm = one
                                      activeTab = 3
                                    "
                                    >{{ $t('Uredi') }}
                                  </b-button>
                                </template>
                                <!--                                <template v-if="!isToday || (!timeHasPassed(one) && isToday)">-->
                                <!--                                  <b-button-->
                                <!--                                    v-if="isAdmin && one.players[0] && one.id !== 0 && !one.is_paid && dateHasPassed"-->
                                <!--                                    type="is-danger is-smaller-12"-->
                                <!--                                    class="m-b-10 m-l-5 m-t-7"-->
                                <!--                                    pack="fal"-->
                                <!--                                    rounded-->
                                <!--                                    size="is-smaller"-->
                                <!--                                    @click.prevent="-->
                                <!--                                      selected_court = c-->
                                <!--                                      selectedTerm = one-->
                                <!--                                      activeTab = 2-->
                                <!--                                    "-->
                                <!--                                    >{{ $t('blokiraj') }}-->
                                <!--                                  </b-button>-->
                                <!--                                </template>-->
                                <b-button
                                  v-if="one.id && isAdmin && one.category?.is_paid === 1 ? false : true"
                                  class="m-b-10 m-l-5 m-t-7 removeborder"
                                  type="green is-smaller-12"
                                  :icon-right="one.is_paid || one.payment_invoice !== null ? 'check' : ''"
                                  pack="fal"
                                  rounded
                                  size="is-smaller"
                                  @click.prevent="
                                    selected_court = c
                                    selectedTerm = one
                                    activeTab = 1
                                  "
                                  ><span v-if="one.is_paid || one.payment_invoice !== null">{{ $t('plaeno') }}</span
                                  ><span v-else>{{ $t('Naplati') }}</span>
                                </b-button>
                              </template>
                            </div>
                          </template>
                          <div
                            v-if="isAdmin && one.players.length === 0 && one.id !== 0 && !one.category"
                            class="action-horisontal m-l-auto m-b-20 p-l-7 p-r-7"
                          >
                            <b-button
                              type="is-danger is-smaller-12"
                              class="m-l-5 m-t-7"
                              pack="fal"
                              rounded
                              size="is-smaller"
                              @click.prevent="
                                cancel_term = one
                                isModalDeleteActive = true
                              "
                              >{{ $t('otkai') }}
                            </b-button>
                          </div>
                        </template>
                        <!--                  Action buttons for user-->
                        <div
                          v-if="!isAdmin && one.players[0] && one.id !== 0 && isUserInReservation(one).length"
                          class="action-horisontal p-l-7 p-r-7"
                        >
                          <b-button
                            v-if="one.is_paid"
                            class="m-b-20 m-l-5 m-t-7 removeborder"
                            type="green is-smaller-12"
                            icon-right="check"
                            pack="fal"
                            rounded
                            size="is-smaller"
                            >{{ $t('plaeno') }}
                          </b-button>

                          <b-button
                            v-if="canAddPlayer(one) && !one.is_paid"
                            type="is-primary"
                            class="m-l-5 m-t-7 m-b-20"
                            pack="fal"
                            rounded
                            size="is-smaller"
                            @click.prevent="addPlayerModal(one)"
                            >{{ $t('dodajIgraa') }}
                          </b-button>
                          <b-button
                            v-if="canDeleteTerm(one)"
                            type="is-danger is-smaller-12"
                            class="m-l-5 m-t-7 m-b-20"
                            pack="fal"
                            rounded
                            size="is-smaller"
                            @click.prevent="
                              cancel_term = one
                              isModalDeleteActive = true
                            "
                            >{{ $t('otkai') }} {{ canDeleteTerm(one) }}
                          </b-button>
                          <b-button
                            v-if="(c.club.payment_accontation || c.club.payment_online) && !one.is_paid"
                            type="green is-smaller-12"
                            class="m-l-5 m-t-7 m-b-20 removeborder"
                            pack="fal"
                            rounded
                            size="is-smaller"
                            @click.prevent="
                              selectedTerm = one
                              isModalUserPaymentActive = true
                            "
                            >{{ $t('plati') }}
                          </b-button>
                        </div>
                        <div
                          v-if="one.type === 'school_group' && (isTrainer || isAdmin)"
                          class="w100 fw600 is-size-7 has-text-white is-black30 has-text-centered is-uppercase p-t-7 p-b-7 m-t-7 flex align__centar__all cursor"
                          @click="selectedSchoolGroups(one.id)"
                        >
                          {{
                            !showSchoolDetails.filter((item) => item === one.id).length > 0
                              ? $t('Prikaži više')
                              : $t('Prikaži manje')
                          }}
                          <b-icon
                            class="m-l-5 m-t--5 transition"
                            :icon="
                              showSchoolDetails.filter((item) => item === one.id).length > 0
                                ? 'chevron-down'
                                : 'chevron-up'
                            "
                            size="is-smaller-12"
                            :style="
                              !showSchoolDetails.filter((item) => item === one.id).length > 0
                                ? 'transform: rotate(180deg);'
                                : 'transform: rotate(-180deg);'
                            "
                            type="is-white"
                            pack="fal"
                          ></b-icon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </b-tab-item>
      <b-tab-item>
        <div class="bodyWrap">
          <CourtPaymentTerm :term="selectedTerm" :is-admin="isAdmin" @close="backFromPayment" />
        </div>
      </b-tab-item>
      <b-tab-item>
        <div class="bodyWrap">
          <CourtPaymentBlock :term="selectedTerm" @close="backFromPayment" />
        </div>
      </b-tab-item>
      <b-tab-item>
        <div v-if="Object.keys(selectedTerm).length" class="bodyWrap">
          <CourtDetails
            v-if="selected_court"
            :key="componentKey"
            :term="selectedTerm"
            :court="selected_court"
            @close="backFromPayment"
            @block="activeTab = 2"
          />
        </div>
      </b-tab-item>
    </b-tabs>
    <transition name="slidea">
      <template v-if="!isReservationModal && selected_times.length">
        <div class="buttons is-fixed m-t-20" :class="{ blur_button: !checkIfAllowed }">
          <b-button icon-right="chevron-right" pack="far" type="is-primary" rounded @click="buttonNextAction">
            {{ $t('Rezerviraj') }}
          </b-button>
        </div>
      </template>
    </transition>
    <b-modal :active.sync="isReservationModal" :width="640" class="hidescrollbar no-close-btn" scroll="clip">
      <modalReservation
        v-if="selected_court"
        :reservations="selected_court.parsed_reservations"
        :court="selected_court"
        :reservation-date="selected_date"
        :title="$t('rezervacija')"
        :selected-time-pre="selected_times"
        @close="selected_times = []"
        @mustpay="mustpay($event)"
      ></modalReservation>
    </b-modal>
    <b-modal :active.sync="isAddPlayerModal" class="hidescrollbar">
      <modalMembers
        :title="$t('dodajteSuigraa')"
        :subtitle="$t('Nakon odabira, odabrani igrač dobiti će obavijest o ovoj rezervaciji')"
        :reservation="reservation"
        @update="getCourts()"
      />
    </b-modal>
    <b-modal :active.sync="isModalDeleteActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('ukloniRezervaciju')"
        :subtitle="$t('Jeste li sigurni?')"
        :ispaid="cancel_term?.is_paid"
        @update="cancelTerm()"
      ></modalConfirmation>
    </b-modal>
    <!--<b-modal :active.sync="isWeatherModalActive" :width="640" scroll="clip">
      <modalOptions
        :options="options"
        :title="$t('obustaviIgru')"
        :subtitle="
          $t('Igračima koji danas imaju rezervirane terene možete poslati obavijest o trenutnoj obustavi igre:')
        "
        @update="weatherSave($event)"
      ></modalOptions>
    </b-modal>-->
    <b-modal :active.sync="isModalUserPaymentActive" :width="640" class="hidescrollbar" scroll="clip">
      <courtUserPaymentModal
        :term="selectedTerm.id"
        @update="getCourts()"
        @cardpayment="cardPayment($event)"
      ></courtUserPaymentModal>
    </b-modal>
    <b-modal :active.sync="showStripe" :width="640" scroll="clip" class="z200">
      <modal-payment-stripe :secret="clientSecret" />
    </b-modal>
    <b-modal :active.sync="isModalCourtBreakActive" :width="640" scroll="clip" class="z200 hidescrollbar">
      <modal-court-break @update="getCourts()" />
    </b-modal>
  </div>
</template>
<script>
import { dragscroll } from 'vue-dragscroll'
import TennisImage from '@/components/TennisImage.vue'
import moment from 'moment'
import _ from 'lodash'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Capacitor } from '@capacitor/core'
import Court from '~/models/Court'
import Player from '~/models/Player'
import hero from '~/components/Hero'
import courtSlot from '~/components/court/CourtSlot'
// import modalOptions from '~/components/modal/ModalOptions'
import modalMembers from '~/components/modal/ModalCourtReservationAddOnly'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import modalReservation from '~/components/modal/ModalCourtReservation'
import CourtPaymentTerm from '~/components/court/CourtPaymentTerm'
import CourtPaymentBlock from '~/components/court/CourtPaymentBlock'
import CourtDetails from '~/components/court/CourtDetails'
import courtUserPaymentModal from '~/components/court/CourtUserPaymentModal'
import Reservation from '~/models/Reservation'
import cloud from '~/components/admin/Cloud'
import cloudSmall from '~/components/admin/CloudCourt'

export default {
  name: 'CourtsClub',
  directives: {
    dragscroll,
  },
  components: {
    hero,
    courtSlot,
    modalReservation,
    modalConfirmation,
    CourtPaymentTerm,
    CourtPaymentBlock,
    CourtDetails,
    TennisImage,
    courtUserPaymentModal,
    modalMembers,
    cloud,
    cloudSmall,
  },
  async fetch() {
    await this.$nextTick(() => {
      this.courtdateGet()
    })
  },
  data() {
    return {
      socket: null,
      history: '',
      showDatePicked: '',
      datePicked: null,
      admin: '',
      heroImage: '/hero_courts.jpg',
      showStripe: false,
      isReservationModal: false,
      isModalCourtBreakActive: false,
      selected_date: this.$moment(),
      inactive: true,
      options: ['Igračima vanjskih terena', 'Igračima unutrarnjih terena', 'Svim igračima', 'Nemoj slati obavijesti'],
      courts: [],
      selected_court: 0,
      gotoDate: '',
      showSchoolDetails: [],
      loading: false,
      loading1: false,
      loading2: false,
      loading3: false,
      fwd: false,
      swipeLoading: false,
      loadingDelete: false,
      showDetails: false,
      showDetailsButtons: true,
      activeTab: 0,
      selected_reservation: null,
      isModalDeleteActive: false,
      isModalUserPaymentActive: false,
      isAddPlayerModal: false,
      selectedTerm: {},
      reservation: {},
      cancel_term: {},
      court: {
        parsed_reservations: [],
      },
      playersForRainToday: 0,
      playersForRain: [],
      selected_times: [],
      selected_times_sorted: [],
      selected_court_permanent: null,
      clientSecret: '',
      componentKey: 0,
    }
  },
  computed: {
    windowWidth() {
      return window.innerWidth
    },
    isMemberOfTheClub() {
      return true
    },
    minDate() {
      return this.isAdmin ? null : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    },
    maxDate() {
      return this.isAdmin
        ? new Date(new Date().getFullYear() + 18, new Date().getMonth(), new Date().getDate())
        : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + this.maxSpan)
    },
    courtdate() {
      return this.$store.state.courtdate
    },
    preference() {
      return this.$store.state.userPreference.preference
    },
    inactiveNext() {
      const a = this.$moment(this.selected_date)
      const b = this.$moment()
      if (a.diff(b, 'days') < this.maxSpan || this.user.is_admin) {
        return true
      } else {
        this.$buefy.toast.open({
          message:
            this.$t('Vaše članstvo"') +
            ' ' +
            this.user.membership.name +
            ' ' +
            this.$t('"omogućuje rezervaciju') +
            ' ' +
            this.maxSpan +
            ' ' +
            this.$t('dana unaprijed'),
          type: 'is-primary',
          duration: 5000,
        })
        return false
      }
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin || this.isCashier()
    },
    isTrainer() {
      return this.$auth.user.is_trainer
    },
    maxSpan() {
      if (this.user) {
        return this.user.membership.max_reservation_span
      }
      return 7
    },
    clubId() {
      return this.club.id
    },
    club() {
      return this.$store.state.club
    },
    isToday() {
      const today = moment(this.selected_date).format('YYYY-MM-DD')
      return moment().isSame(today, 'day')
    },
    dateHasPassed() {
      const selectedDay = this.$moment.utc(this.selected_date)
      const today = this.$moment()
      const dif = selectedDay.diff(today)
      if (dif > 0) {
        return false
      } else {
        return true
      }
    },
    checkIfAllowed() {
      if (this.isAdmin || this.user.is_trainer) return true
      if (this.selected_times_sorted.length === 0) return true
      if (this.court.reservation_duration === 60) {
        const timeRange = _.map(this.selected_times_sorted, 'time')
        const x = _.max(timeRange) - _.min(timeRange)
        return x < 101
      } else {
        const timeRange = _.map(this.selected_times_sorted, 'time')
        const x = _.max(timeRange) - _.min(timeRange)
        return x < 151
      }
    },
    reservations() {
      return this.court.parsed_reservations
    },
    reservationSpan() {
      const mapTimes = _.map(this.selected_times_sorted, 'time')
      const spanRange =
        (_.max(mapTimes) - _.min(mapTimes)) / (this.selected_court.reservation_duration === 60 ? 100 : 50) + 1
      const minRange = _.min(mapTimes)
      const fullRange = []

      for (let i = 0; i < spanRange; i++) {
        if (
          this.selected_court.parsed_reservations[minRange + i * ((this.selected_court.reservation_duration / 30) * 50)]
            .id !== 0
        ) {
        } else {
          fullRange.push(
            this.selected_court.parsed_reservations[
              minRange + i * ((this.selected_court.reservation_duration / 30) * 50)
            ]
          )
        }
      }
      return fullRange
    },
  },
  watch: {
    selected_times: {
      handler() {
        this.selected_times_sorted = [...this.selected_times].sort((a, b) => a.time - b.time)
        if (this.court.reservation_duration === 90 && this.selected_times.length === 1) {
          this.activeTab++
        }
      },
    },
    datePicked: {
      immediate: false,
      handler() {
        this.nextDayJump()
        this.showDatePicked = false
      },
    },
    preference: {
      immediate: true,
      handler() {
        this.showDetails = this.preference.courts.showDetailedCourtsView
        this.showDetailsButtons = this.preference.courts.showButtonsInDetailedCourtsView
      },
    },
  },
  beforeDestroy() {
    this.$echo.leave('courts.' + this.$store.state.club.id + '.' + this.selected_date.format('YYYY-MM-DD'))
  },
  created() {
    this.debouncedGetCourts = _.debounce(this.getCourts, 750)
  },
  methods: {
    selectedSchoolGroups(id) {
      if (_.indexOf(this.showSchoolDetails, id) > -1) {
        this.showSchoolDetails.splice(_.indexOf(this.showSchoolDetails, id), 1)
      } else {
        this.showSchoolDetails.push(id)
      }
    },
    checkIfCourtBreak(court) {
      if (this.isAdmin) return false

      const now = this.$moment(this.selected_date)
      if (court.court_break_from && court.court_break_to) {
        const breakStart = this.$moment(court.court_break_from)
        const breakEnd = this.$moment(court.court_break_to).add(1, 'day')

        if (now.isSameOrAfter(breakStart) && now.isSameOrBefore(breakEnd)) {
          return true
        }
      }

      return false
    },
    checkIfCourtBreakAdmin(court) {
      const now = this.$moment(this.selected_date)
      if (court.court_break_from && court.court_break_to) {
        const breakStart = this.$moment(court.court_break_from)
        const breakEnd = this.$moment(court.court_break_to).add(1, 'day')

        if (now.isSameOrAfter(breakStart) && now.isSameOrBefore(breakEnd)) {
          return true
        }
      }

      return false
    },
    async hapticsVibrate(style) {
      if (Capacitor.isNativePlatform()) {
        await Haptics.impact({ style })
      }
    },
    // send reservation to the user payment modal
    mustpay(item) {
      const reservations = item
      this.selected_times = []
      this.isModalUserPaymentActive = true
      this.selectedTerm = { id: reservations.reservations[0] }
    },
    cardPayment(item) {
      this.clientSecret = item
      this.showStripe = true
    },
    checkIfSelected(c, slot) {
      const selectedCourt = this.selected_court
      if (selectedCourt.id === c.id) {
        if (_.indexOf(this.reservationSpan, slot) > -1) {
          return true
        }
        if (this.selected_times.length) {
          const x = this.selected_times.find((item) => item.time === slot.time) ? 'selectedSlot' : ''
          return x
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    getClass(hour) {
      return {
        selectedSlot: _.indexOf(this.reservationSpan, hour) > -1,
      }
    },
    selectSlot(court, item) {
      this.hapticsVibrate(ImpactStyle.Light)
      const index = this.selected_times.indexOf(item)
      if (index > -1) {
        this.selected_times.splice(index, 1)
      } else if (this.checkIfAllowed) {
        if (court.reservation_duration === 90 && this.selected_times.length === 1) {
          this.$buefy.toast.open({
            message: this.$t('Ne možete rezervirati više od jednog termina'),
            type: 'is-danger',
            duration: 3000,
          })
          return
        }
        this.selected_court = court
        if (this.checkIfSameCourt()) {
          this.selected_times.push(item)
        } else {
          this.selected_times = []
          this.$buefy.toast.open({
            message: this.$t('Ne možete rezervirati terene na različitm terenima u istoj rezervaciji'),
            type: 'is-danger',
            duration: 3000,
          })
        }
      }
    },
    checkIfSameCourt() {
      if (this.selected_times.length) {
        if (this.selected_court_permanent === this.selected_court.id) {
          return true
        } else {
          return false
        }
      } else {
        this.selected_court_permanent = this.selected_court.id
        return true
      }
    },
    ifReservationHoleAlert() {
      this.$buefy.toast.open({
        message: this.$t('Ne možete ostaviti rupu od 30 minuta na rezervaciji terena'),
        type: 'is-danger',
        duration: 3000,
      })
    },
    ifReservationHole() {
      if (this.isAdmin) {
        return true
      }
      if (this.selected_court.reservation_hole === 0 && this.selected_court.reservation_duration === 30) {
        const firstSlot = this.selected_times_sorted[0].time
        const lastSlot = this.selected_times_sorted[this.selected_times_sorted.length - 1].time
        const lastSlotLastSelectedSlot = this.selected_times_sorted[0].time

        const firstSlotSelected =
          this.selected_court.parsed_reservations[firstSlot - 50] === undefined &&
          this.selected_court.parsed_reservations[firstSlot - 100] === undefined
        const secondSlotSelected =
          this.selected_court.parsed_reservations[firstSlot - 50] !== undefined &&
          this.selected_court.parsed_reservations[firstSlot - 100] === undefined
        const lastSlotSelected =
          this.selected_court.parsed_reservations[lastSlot + 50] === undefined &&
          this.selected_court.parsed_reservations[lastSlot + 100] === undefined
        const secondLastSlotSelected =
          this.selected_court.parsed_reservations[lastSlot + 50] !== undefined &&
          this.selected_court.parsed_reservations[lastSlot + 100] === undefined
        // ako su odabrane prva i zadnja rezervacija - u slučaju bukiranja cijelog dana
        if (firstSlotSelected && lastSlotSelected) {
          return true
        }
        // ako je odabrana prva rezervacija
        if (firstSlotSelected) {
          if (
            this.selected_court.parsed_reservations[lastSlot + 50].id === 0 &&
            this.selected_court.parsed_reservations[lastSlot + 100].id !== 0
          ) {
            this.ifReservationHoleAlert()
            return false
          }
        }
        // ako je odabrana druga rezervacija
        if (secondSlotSelected) {
          if (this.selected_court.parsed_reservations[firstSlot - 50].id === 0) {
            this.ifReservationHoleAlert()
            return false
          } else if (
            this.selected_court.parsed_reservations[lastSlot + 100].id !== 0 &&
            this.selected_court.parsed_reservations[lastSlot + 50].id === 0
          ) {
            this.ifReservationHoleAlert()
            return false
          }
        }
        // ako je odabrana zadnja rezervacija
        if (lastSlotSelected) {
          if (
            this.selected_court.parsed_reservations[lastSlot - 50].id === 0 &&
            this.selected_court.parsed_reservations[lastSlotLastSelectedSlot - 50].id === 0 &&
            this.selected_court.parsed_reservations[lastSlotLastSelectedSlot - 100].id !== 0
          ) {
            this.ifReservationHoleAlert()
            return false
          }
        }
        // ako je odabrana predzadnja rezervacija
        if (secondLastSlotSelected) {
          if (
            this.selected_court.parsed_reservations[lastSlot - 50].id === 0 &&
            this.selected_court.parsed_reservations[lastSlot - 100].id !== 0
          ) {
            this.ifReservationHoleAlert()
            return false
          } else if (
            this.selected_court.parsed_reservations[lastSlot + 50].id === 0 &&
            this.selected_court.parsed_reservations[lastSlot - 50].id !== 0
          ) {
            this.ifReservationHoleAlert()
            return false
          }
        }
        // ako nisu odabrani prvi i zadnji termini u danu
        if (!firstSlotSelected && !secondSlotSelected && !lastSlotSelected && !secondLastSlotSelected) {
          const checkFirstHole = this.selected_court.parsed_reservations[firstSlot - 50].id === 0
          const checkLastHole = this.selected_court.parsed_reservations[lastSlot + 50].id === 0
          const checkFirstHoleAfter = this.selected_court.parsed_reservations[firstSlot - 100].id === 0
          const checkLastHoleAfter = this.selected_court.parsed_reservations[lastSlot + 100].id === 0

          const canReserveForward = (checkFirstHole && checkFirstHoleAfter) || !checkFirstHole
          const canReserveBackward = (checkLastHole && checkLastHoleAfter) || !checkLastHole

          const isHoleAvoided = canReserveForward && canReserveBackward

          if (!isHoleAvoided) {
            this.ifReservationHoleAlert()
            return false
          }
        }
        return true
      }
      return true
    },
    buttonNextAction() {
      if (!this.isAdmin) {
        if (this.court.reservation_duration === 30 && this.selected_times_sorted.length === 1) {
          this.$buefy.toast.open({
            message: this.$t('Ne možete rezervirati samo 30 minuta'),
            type: 'is-danger',
            duration: 3000,
          })
          return
        }
      }
      if (this.selected_times.length) {
        this.hapticsVibrate(ImpactStyle.Medium)
        if (this.ifReservationHole() && this.checkIfAllowed) {
          this.isReservationModal = true
        }
      } else {
        this.$buefy.toast.open({
          message: this.$t('Molimo odaberite termin'),
          type: 'is-danger',
          duration: 3000,
        })
      }
    },
    isCashier() {
      if (!this.user.club_member || !this.user.club_member[this.club.id.toString()]) return false
      return this.user.club_member[this.club.id.toString()].cashier === undefined
        ? false
        : this.user.club_member[this.club.id.toString()].cashier === true
    },
    showCancelationForCashier(item) {
      if (this.isToday) {
        return !(this.isCashier() && !this.timeHasPassed(item) && this.dateHasPassed)
      } else if (this.dateHasPassed) {
        return !this.isCashier()
      } else {
        return true
      }
    },
    changePreference() {
      const x = {
        showDetailedCourtsView: this.showDetails,
        showButtonsInDetailedCourtsView: this.showDetailsButtons,
      }
      this.$store.commit('userPreference/setShowDetailedCourtsView', x)
    },
    deletePlayer(reservation, playerIndex) {
      const r = new Reservation(reservation)
      r.players.splice(playerIndex, 1)
      r.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste uklonili igrača s rezervacije terena'),
            type: 'is-success',
          })
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
        })
    },
    canDeleteTerm(item) {
      if (item) {
        const a = this.$moment.utc(item.from)
        const b = this.$moment()
        if (a.diff(b, 'hours') >= this.$auth.user.membership.reservation_cancelable || this.$auth.user.is_admin) {
          return true
        } else {
          return false
        }
      }
      return ''
    },
    canAddPlayer(reservation) {
      return reservation.players.length === 1 && this.user.id === reservation.players[0].id
    },
    isUserInReservation(one) {
      return one.players.filter((item) => {
        return item.id === this.user.id
      })
    },
    cancelTerm() {
      this.loadingDelete = true
      if (this.cancel_term) {
        const r = new Reservation(this.cancel_term)
        r.delete()
          .then(() => {
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste otkazali rezervaciju'),
              type: 'is-success',
            })
            this.loadingDelete = false
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
              type: 'is-danger',
            })
            this.loadingDelete = false
          })
      }
    },
    addPlayerModal(reservation) {
      this.reservation = reservation
      this.isAddPlayerModal = true
    },
    backFromPayment(item) {
      this.selected_times = []
      this.activeTab = 0
      this.componentKey += 1
      const c = this.selectedTerm.start_time - 150 + '-' + this.selected_court.id
      console.log(c)
      c.toString()
      setTimeout(function () {
        document.getElementById(c).scrollIntoView({
          behavior: 'smooth',
        })
      }, 200)
      this.getCourts()
    },
    timeHasPassed(item) {
      const matchTime = moment(item.time.toString(), 'hmm').format('HHmm')
      const currentTime = moment().format('HHmm')
      if (this.isToday) {
        if (matchTime < currentTime) {
          return false
        }
      }
      return true
    },
    combineTerms(item, index) {
      const timeSpan = (item.reservation_duration / 30) * 50
      if (item.parsed_reservations[parseInt(index)].id !== 0 && item.parsed_reservations[parseInt(index) + timeSpan]) {
        if (item.parsed_reservations[parseInt(index)].id === item.parsed_reservations[parseInt(index) + timeSpan].id) {
          return false
        }
      }
      return true
    },
    joinClub() {
      this.loading3 = true
      const player = new Player({ id: this.user.id, newMember: this.club.id })
      player
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste se prijavili u novi klub'),
            type: 'is-success',
          })
          this.loading3 = false
          this.$auth.fetchUser()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading3 = false
          this.$auth.fetchUser()
        })
    },
    courtdateGet() {
      this.$echo.leave('courts.' + this.$store.state.club.id + '.' + this.selected_date.format('YYYY-MM-DD'))
      this.socket = false
      this.gotoDate = this.$store.state.courtdate.date
      if (this.$store.state.courtdate.date !== '') {
        this.selected_date = this.$moment(this.$store.state.courtdate.date)
        this.inactive = false
        this.$store.commit('courtdate/isDate', '')
      }
      this.getCourts()
    },
    swipeHandler(direction) {
      if (direction === 'right') {
        this.swipeLoading = true
        this.prevDay()
      } else if (direction === 'left') {
        this.swipeLoading = true
        this.nextDay()
      }
    },
    getCourts() {
      this.playersForRainToday++
      if (this.fwd) {
        this.loading = true
      } else {
        this.loading1 = true
      }
      this.loading2 = true
      Court.where('is_active', 1)
        .where('club_id', this.$store.state.club.id)
        .params({ date: this.selected_date.format('YYYY-MM-DD') })
        .get()
        .then((res) => {
          this.courts = res.data
          this.loading = false
          this.loading1 = false
          this.loading2 = false
          this.swipeLoading = false
          if (!this.socket) {
            this.$echo
              .channel('courts.' + this.$store.state.club.id + '.' + this.selected_date.format('YYYY-MM-DD'))
              .listen('NewReservationCreated', (e) => {
                this.getCourts()
              })
            this.socket = true
          }
        })
        .catch(() => {
          this.loading = false
          this.loading1 = false
          this.loading2 = false
          this.swipeLoading = false
        })
    },
    nextDayJump() {
      this.$echo.leave('courts.' + this.$store.state.club.id + '.' + this.selected_date.format('YYYY-MM-DD'))
      this.socket = false
      this.selected_date = this.$moment(this.datePicked)
      if (this.selected_date.isAfter(this.$moment())) {
        this.inactive = false
      }
      this.getCourts()
    },
    nextDay() {
      this.$echo.leave('courts.' + this.$store.state.club.id + '.' + this.selected_date.format('YYYY-MM-DD'))
      this.socket = false
      this.selected_times = []
      this.swipeLoading = true
      this.fwd = true
      this.selected_date = this.$moment(this.selected_date).add(1, 'day')
      if (this.selected_date.isAfter(this.$moment())) {
        this.inactive = false
      }
      // this.getCourts()
      this.debouncedGetCourts()
    },
    prevDay() {
      this.$echo.leave('courts.' + this.$store.state.club.id + '.' + this.selected_date.format('YYYY-MM-DD'))
      this.socket = false
      this.selected_times = []
      this.swipeLoading = true
      this.fwd = false
      if (!this.inactive || this.isAdmin) {
        this.selected_date = this.$moment(this.selected_date).subtract(1, 'day')
        if (this.selected_date.isSame(this.$moment(), 'day')) {
          this.inactive = true
        }
      }
      this.debouncedGetCourts()
    },
  },
  head() {
    return {
      title: 'Tereni',
    }
  },
}
</script>
