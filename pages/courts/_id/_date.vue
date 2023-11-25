<template>
  <div ref="top" class="container">
    <template v-if="activeTab === 0">
      <hero
        :options="heroImage"
        :second="{
          name: $t('Tereni'),
          link: '/courts',
        }"
      >
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
      </hero>
      <transition name="slidea">
        <div
          v-if="!checkIfAllowed"
          class="is-red fw600 is-size-5 has-text-centered has-text-white radius__5 p-r-30 p-l-30 p-t-10 p-b-10 is-fixed-floating align-transform m-t-20"
        >
          {{ $t('Jedna rezervacija može biti maksimalno 2 sata') }}
        </div>
      </transition>

      <section v-if="showDatePicked" class="courtDatePicker">
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
    </template>
    <b-tabs v-model="activeTab" size="is-medium" position="is-centered" class="hide_tab_navigation">
      <b-tab-item>
        <div
          v-touch:swipe="swipeHandler"
          class="x-container activity transition"
          :class="{
            'datepicker-active': showDatePicked,
            'is-moving-right': direction === 'right',
            'is-moving-left': direction === 'left',
          }"
        >
          <div class="tab__navigation m-b-20 m-t--40 relative z-1">
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
          <div v-if="user.is_admin && court.club_id === club.id" class="buttons m-t--30 m-b--10">
            <b-button
              class="softshadow m-t-10"
              type="is-small noborder has-text-white"
              pack="fal"
              rounded
              icon-right="cog"
              @click="$router.push(localePath('/admin/courts/' + court.id + '/edit/'))"
            >
              {{ $t('urediTeren') }}
            </b-button>
          </div>
          <!--          Show club info if court is not in club (for cup and liga when players make reservation)-->
          <template v-if="Object.keys(court).length">
            <template v-if="court.club_id !== club.id">
              <div
                class="flex align__centar__all m-b-10 m-t-20 cursor"
                @click="$router.push(localePath('/clubs/' + court.club.id))"
              >
                <img
                  v-if="court.club?.logo"
                  :src="court.club?.logo"
                  class="user_image-smallish border__white--2 m-l-1 m-r-10 softshadow"
                  alt=""
                />
                <div class="">
                  <div class="fw600 is-size-12 has-text-black80">{{ court.club?.name }}</div>
                  <div class="fw600 is-size-7 m-t--2 has-text-black50 flex align__centar__y">
                    <font-awesome-icon class="m-r-2 has-text-lightblue iw08" icon="fa-light fa-location-dot" />
                    {{ court.club?.city }}, {{ court.club?.address }}
                  </div>
                </div>
              </div>
            </template>
          </template>

          <div v-if="court.id" class="activity">
            <div
              class="court activity__box--padding"
              :class="{ 'border-court-slot-rain': court.weather, 'border-court-break': checkIfCourtBreak(court) }"
            >
              <court-slot :court="court" />
            </div>
          </div>
          <div class="align__centar__x m-t-30">
            <div class="fw600 is-size-3 m-t--30 m-b-0 has-text-centered">{{ $t('Galerija') }}</div>
          </div>

          <div class="align__centar__x m-t-30">
            <div class="fw600 is-size-3 m-t--30 m-b-0 has-text-centered">{{ $t('Podaci o prostoru') }}</div>
          </div>
          <div class="activity x-container">
            <div class="">
              <div class="m-t-0 display-data__box">
                <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
                  {{ $t('naziv') }}
                </div>
                <div class="fw600 is-size-55">
                  {{ court.name }}
                </div>
              </div>
              <div class="m-t-10 display-data__box">
                <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
                  {{ $t('Površina') }}
                </div>
                <div class="fw600 is-size-55">
                  {{ court.size }}
                </div>
              </div>
              <div class="m-t-10 display-data__box">
                <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
                  {{ $t('Opis') }}
                </div>
                <div class="has-text-left is-size-6 content-tiny" v-html="court.description"></div>
              </div>
              <div class="m-t-10 display-data__box">
                <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
                  {{ $t('Klimatizacija') }}
                </div>
                <div class="fw600 is-size-55">
                  {{ court.airconditioner ? $t('Da') : $t('Ne') }}
                </div>
              </div>
              <div class="m-t-10 display-data__box">
                <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
                  {{ $t('Grijanje') }}
                </div>
                <div class="fw600 is-size-55">
                  {{ court.heating ? $t('Da') : $t('Ne') }}
                </div>
              </div>
              <div class="m-t-10 display-data__box">
                <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
                  {{ $t('Sanitarni čvor') }}
                </div>
                <div class="fw600 is-size-55">
                  {{ court.lights ? $t('Da') : $t('Ne') }}
                </div>
              </div>
              <div class="m-t-10 display-data__box">
                <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
                  {{ $t('Sanitarni čvor') }}
                </div>
                <div class="fw600 is-size-55">
                  {{ court.lights ? $t('Da') : $t('Ne') }}
                </div>
              </div>
              <div class="m-t-10 display-data__box">
                <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
                  {{ $t('Wifi') }}
                </div>
                <div class="fw600 is-size-55">
                  {{ court.wifi ? $t('Da') : $t('Ne') }}
                </div>
              </div>
              <div class="m-t-10 display-data__box">
                <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
                  {{ $t('Pristup osobama s teškoćama u kretanju') }}
                </div>
                <div class="fw600 is-size-55">
                  {{ court.invalid ? $t('Da') : $t('Ne') }}
                </div>
              </div>
              <div class="m-t-10 display-data__box">
                <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
                  {{ $t('Tip prostora') }}
                </div>
                <div class="fw600 is-size-55">
                  {{ court.type }}
                </div>
              </div>
              <div class="m-t-10 display-data__box">
                <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
                  {{ $t('otkazivanjeRezervacije') }}
                </div>
                <div class="fw600 is-size-55">
                  {{ court ? $t('mogue') : $t('nijeMogue') }}
                </div>
              </div>
            </div>
          </div>


          <!-- Google map -->
          <div v-if="court.id" style="width: 100%;, height: 400px; margin-bottom: 3rem;">
            <GmapMap
              :center="{ lat: parseFloat(court.club.latitude), lng: parseFloat(court.club.longitude) }"
              :zoom="mapZoom"
              map-type-id="roadmap"
              style="width: 100%; height: 400px"
            >
              <GmapMarker
                :position="{ lat: parseFloat(court.club.latitude), lng: parseFloat(court.club.longitude) }"
                :clickable="true"
                @click="logCourtName(court.club.name)"
              />
            </GmapMap>
          </div>

          <!-- Table list -->
          <div class="activity">
            <div class="align__centar__x">
              <div class="fw600 is-size-3 m-t--30 m-b-5 has-text-centered">{{ $t('raspored') }}</div>
            </div>
            <div
              class="activity__box"
              :class="{
                'border-court-break': checkIfCourtBreak(court),
                'border-court-break-admin': checkIfCourtBreakAdmin(court),
              }"
            >
              <div v-for="(one, indexOne) in court.parsed_reservations" :id="indexOne" :key="one.id + indexOne">
                <div
                  v-if="combineTerms(one, indexOne) || (combineTerms(one, indexOne) && isAdmin)"
                  :class="['court-timeslot', 'relative', one.id === 0 ? '' : 'reserved']"
                  :style="
                    one.category && (isAdmin || user.is_trainer) ? `backgroundColor: ${one.category.color}15` : ''
                  "
                >
                  <!--                  Show if reservation is category and it is payed-->
                  <template v-if="one.category && isAdmin">
                    <div v-if="one.category.is_paid" class="court-category-paid">{{ $t('Plaćeno') }}</div>
                  </template>
                  <div :class="getClass(one)" class="court-item">
                    <div class="court-time-range">
                      {{ one.start_time !== undefined ? one.start_time : one.time | parseTime(true) }}<br />
                      {{
                        one.end_time !== undefined
                          ? one.end_time
                          : (one.time + (court.reservation_duration / 30) * 50) | parseTime(true)
                      }}
                    </div>
                    <div class="list-user">
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
                      <!--                      Show if school group reservation-->
                      <template v-if="one.type === 'school_group'">
                        <template v-if="one.players[0]">
                          <router-link
                            v-if="club.hide_personal_data || isAdmin"
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
                            <TennisImage :size="[32, 32]" class="user_image-small m-l-5 m-r-10" :src="club.logo" />
                            <div
                              class="heading-mid is-size-55 has-text-black80 align-self-center fw500 flex flex__column line-height-11 fw600"
                            >
                              {{ $t('rezervirano') }}
                            </div>
                          </div>
                        </template>
                      </template>
                      <!--                      Show if not school group reservation-->
                      <template v-else>
                        <!--                      Show if less then three players in reservation-->
                        <template v-if="one.players.length < 3">
                          <template
                            v-if="
                              one.name && (one.type === 'players' || one.type === 'doubles' || one.type === 'in_behalf')
                            "
                          >
                            <div v-if="!one.category" class="x-tag is-black50 m-l-10 has-text-white m-b-10 inlineblock">
                              {{ one.name }}
                            </div>
                          </template>
                          <div v-if="one.players[0]" class="flex">
                            <router-link
                              v-if="club.hide_personal_data || isAdmin"
                              :to="localePath('/player/' + one.players[0].id)"
                              class="court-user"
                            >
                              <TennisImage
                                v-if="one.type !== 'guest'"
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
                                {{ one.type !== 'guest' ? one.players[0].display_name : one.name }}
                                <span
                                  v-if="isAdmin && one.type !== 'guest'"
                                  class="is-size-7 has-text-lightblue fw600 m-t-2"
                                  >{{
                                    one.players[0].membership === '' ? $t('Nije član') : one.players[0].membership
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
                              <TennisImage :size="[32, 32]" class="user_image-small m-l-5 m-r-10" :src="club.logo" />
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
                              v-if="club.hide_personal_data || isAdmin"
                              :to="localePath('/player/' + one.players[1].id)"
                              class="court-user m-t-10"
                            >
                              <TennisImage
                                :size="[32, 32]"
                                class="user_image-small m-l-5 m-r-10"
                                :src="one.players[1].image"
                              />
                              <div
                                class="heading-mid is-size-55 has-text-black80 align-self-center fw500 flex flex__column line-height-11 fw600"
                              >
                                {{ one.players[1].display_name }}
                                <span v-if="isAdmin" class="is-size-7 has-text-lightblue fw600 m-t-2">{{
                                  one.players[1].membership === '' ? $t('Nije član') : one.players[1].membership
                                }}</span>
                              </div>
                            </router-link>
                            <div v-else class="court-user m-t-10">
                              <TennisImage :size="[32, 32]" class="user_image-small m-l-5 m-r-10" :src="club.logo" />
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
                              one.name && (one.type === 'players' || one.type === 'doubles' || one.type === 'in_behalf')
                            "
                          >
                            <div v-if="!one.category" class="x-tag is-black50 m-l-10 has-text-white m-b-10 inlineblock">
                              {{ one.name }}
                            </div>
                          </template>
                          <template v-if="club.hide_personal_data || isAdmin">
                            <div v-for="(player, index) in one.players" :key="player.id + index" class="flex">
                              <router-link
                                :to="localePath('/player/' + one.players[index].id)"
                                class="court-user m-t-10"
                              >
                                <TennisImage
                                  v-if="one.type !== 'guest'"
                                  :size="[32, 32]"
                                  class="user_image-small m-l-5 m-r-10"
                                  :src="player.image"
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
                                  {{ one.type !== 'guest' ? player.display_name : one.name }}
                                  <span
                                    v-if="isAdmin && one.type !== 'guest'"
                                    class="is-size-7 has-text-lightblue fw600 m-t-2"
                                    >{{ player.membership === '' ? $t('Nije član') : player.membership }}</span
                                  >
                                  <span
                                    v-if="isAdmin && (one.type === 'in_behalf' || one.type === 'guest')"
                                    class="is-size-7 has-text-black50 fw600"
                                    >{{ $t('rezervacija2') }}
                                    <span class="has-text-lightblue">{{ one.created_by.display_name }}</span></span
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
                            <TennisImage :size="[32, 32]" class="user_image-small m-l-5 m-r-10" :src="club.logo" />
                            <div
                              class="heading-mid is-size-55 has-text-black80 align-self-center fw500 flex flex__column line-height-11 fw600"
                            >
                              {{ $t('rezervirano') }}
                            </div>
                          </div>
                        </template>
                        <!--                  Show if category reservation -->
                        <template v-if="!one.players[0] && !one.players[1] && one.id !== 0 && one.category && isAdmin">
                          <!--                          Show title of category if have-->
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
                    <template v-if="court.member_reservation || isAdmin">
                      <div
                        v-if="!one.players[0] && one.id === 0 && (timeHasPassed(one) || isAdmin)"
                        class="action m-l-auto"
                      >
                        <div
                          v-if="!checkIfCourtBreakAdmin(court) || isAdmin"
                          class="activity__header m-l-5"
                          @click.prevent="selectSlot(one)"
                        >
                          <b-button
                            v-if="checkIfSelected(one) === '' ? true : false"
                            type="is-reservation"
                            pack="fal"
                            rounded
                            size="is-smaller"
                            >{{ $t('rezerviraj') }}</b-button
                          >
                          <b-icon v-else icon="times" pack="fal" type="is-white" size="is-medium" class="m-r-15" />
                        </div>
                      </div>
                    </template>
                  </div>
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
                            :loading="loadingDelete"
                            @click.prevent="
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
                      >{{ $t('otkai') }}
                    </b-button>
                    <b-button
                      v-if="(club.payment_accontation || club.payment_online) && !one.is_paid"
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
                </div>
              </div>
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
            :key="componentKey"
            :term="selectedTerm"
            :court="court"
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

    <b-modal :active.sync="isAddPlayerModal" class="hidescrollbar">
      <modalMembers
        :title="$t('dodajteSuigraa')"
        :subtitle="$t('Nakon odabira, odabrani igrač dobiti će obavijest o ovoj rezervaciji')"
        :reservation="reservation"
        :reservations="court.parsed_reservations"
        :court="court"
        @update="getCourt()"
      />
    </b-modal>
    <!--    novi modali-->
    <b-modal
      :active.sync="isReservationModal"
      :width="640"
      scroll="clip"
      class="hidescrollbar no-close-btn"
      @close="getCourt"
    >
      <modalReservation
        :title="$t('rezervacija')"
        :reservations="court.parsed_reservations"
        :court="court"
        :reservation-date="selected_date"
        :selected-time-pre="selected_times"
        @close="selected_times = []"
        @mustpay="mustpay($event)"
      ></modalReservation>
    </b-modal>
    <b-modal :active.sync="isModalDeleteActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('ukloniRezervaciju')"
        :subtitle="$t('Jeste li sigurni?')"
        :ispaid="cancel_term?.is_paid"
        @update="cancelTerm"
      ></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalUserPaymentActive" :width="640" class="" scroll="clip">
      <courtUserPaymentModal
        :term="selectedTerm.id"
        @cardpayment="cardPayment($event)"
        @update="getCourt"
      ></courtUserPaymentModal>
    </b-modal>
    <b-modal :active.sync="showStripe" :width="640" scroll="clip" class="z200">
      <modal-payment-stripe :secret="clientSecret" />
    </b-modal>
  </div>
</template>
<script>
import moment from 'moment'
import TennisImage from '@/components/TennisImage.vue'
import _ from 'lodash'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Capacitor } from '@capacitor/core'
import Court from '~/models/Court'
import modalReservation from '~/components/modal/ModalCourtReservation'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import modalMembers from '~/components/modal/ModalCourtReservationAddOnly'
import hero from '~/components/Hero'
import CourtSlot from '~/components/court/CourtSlot'
import CourtPaymentTerm from '~/components/court/CourtPaymentTerm'
import CourtPaymentBlock from '~/components/court/CourtPaymentBlock'
import courtUserPaymentModal from '~/components/court/CourtUserPaymentModal'
import Reservation from '~/models/Reservation'

export default {
  name: 'CourtDate',
  components: {
    CourtSlot,
    hero,
    modalReservation,
    modalConfirmation,
    modalMembers,
    CourtPaymentTerm,
    CourtPaymentBlock,
    courtUserPaymentModal,
    TennisImage,
  },
  async fetch() {
    await this.getCourt()
    await this.putdate(this.$route.params.date)
  },
  data() {
    return {
      test: '',
      activeTab: 0,
      isAddPlayerModal: false,
      // minDate: this.isAdmin ? '' : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
      showDatePicked: false,
      selected_date: this.$route.params.date,
      isModalUserPaymentActive: false,
      isModalPaymentActive: false,
      isReservationModal: false,
      isModalDeleteActive: false,
      selectedTerm: {},
      court: {
        parsed_reservations: [],
      },
      courts: {},
      datePicked: null,
      cancel_term: {},
      reservation: 0,
      inactive: true,
      loading: false,
      loading1: false,
      loadingDelete: false,
      fwd: false,
      selected_times: [],
      selected_times_sorted: [],
      isMoving: false,
      clientSecret: '',
      showStripe: false,
      direction: '',
      componentKey: 1,

      mapZoom: 15,
    }
  },
  computed: {
    heroImage() {
      return this.court.hero_image ? this.court.hero_image : '/hero_courts.jpg'
    },
    maxSpan() {
      return this.user.membership.max_reservation_span
    },
    maxDate() {
      return this.isAdmin
        ? new Date(new Date().getFullYear() + 18, new Date().getMonth(), new Date().getDate())
        : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + this.maxSpan)
    },
    minDate() {
      return this.isAdmin ? null : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    },
    inactiveNext() {
      const a = this.$moment(this.selected_date)
      const b = this.$moment()
      if (a.diff(b, 'days') < this.user.membership.max_reservation_span || this.user.is_admin) {
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
            this.user.membership.max_reservation_span +
            ' ' +
            this.$t('dana unaprijed'),
          type: 'is-primary',
          duration: 5000,
        })

        return false
      }
    },
    minTime() {
      return Object.keys(this.court.parsed_reservations).reduce((key, v) =>
        this.court.parsed_reservations[v] < this.court.parsed_reservations[key] ? v : key
      )
    },
    maxTime() {
      return Object.keys(this.court.parsed_reservations).reduce((key, v) =>
        this.court.parsed_reservations[v] > this.court.parsed_reservations[key] ? key : v
      )
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin || this.isCashier()
    },
    club() {
      return this.$store.state.club
    },
    date() {
      if (this.$route.params.date) {
        return this.$route.params.date
      }
      return this.$moment().format('YYYY-MM-DD')
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
      const spanRange = (_.max(mapTimes) - _.min(mapTimes)) / (this.court.reservation_duration === 60 ? 100 : 50) + 1
      const minRange = _.min(mapTimes)
      const fullRange = []

      for (let i = 0; i < spanRange; i++) {
        if (this.court.parsed_reservations[minRange + i * ((this.court.reservation_duration / 30) * 50)].id !== 0) {
        } else {
          fullRange.push(this.court.parsed_reservations[minRange + i * ((this.court.reservation_duration / 30) * 50)])
        }
      }
      return fullRange
    },
  },
  watch: {
    selected_times: {
      handler() {
        this.selected_times_sorted = [...this.selected_times].sort((a, b) => a.time - b.time)
      },
    },
    activeTab: {
      handler() {
        if (this.activeTab === 1) {
          setTimeout(function () {
            window.scrollTo(0, 0)
          }, 200)
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
  },
  mounted() {
    this.selected_date = this.$route.params.date
  },
  methods: {
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
    checkIfSelected(slot) {
      if (_.indexOf(this.reservationSpan, slot) > -1) {
        return true
      }
      if (this.selected_times.length) {
        const x = this.selected_times.find((item) => item.time === slot.time) ? 'selectedSlot' : ''
        return x
      } else {
        return ''
      }
    },
    getClass(hour) {
      return {
        selectedSlot: _.indexOf(this.reservationSpan, hour) > -1,
      }
    },
    selectSlot(item) {
      this.hapticsVibrate(ImpactStyle.Light)
      const index = this.selected_times.indexOf(item)
      if (index > -1) {
        this.selected_times.splice(index, 1)
      } else if (this.checkIfAllowed) {
        this.selected_times.push(item)
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
      if (this.court.reservation_hole === 0 && this.court.reservation_duration === 30) {
        const firstSlot = this.selected_times_sorted[0].time
        const lastSlot = this.selected_times_sorted[this.selected_times_sorted.length - 1].time
        const lastSlotLastSelectedSlot = this.selected_times_sorted[0].time

        const firstSlotSelected =
          this.reservations[firstSlot - 50] === undefined && this.reservations[firstSlot - 100] === undefined
        const secondSlotSelected =
          this.reservations[firstSlot - 50] !== undefined && this.reservations[firstSlot - 100] === undefined
        const lastSlotSelected =
          this.reservations[lastSlot + 50] === undefined && this.reservations[lastSlot + 100] === undefined
        const secondLastSlotSelected =
          this.reservations[lastSlot + 50] !== undefined && this.reservations[lastSlot + 100] === undefined
        // ako su odabrane prva i zadnja rezervacija - u slučaju bukiranja cijelog dana
        if (firstSlotSelected && lastSlotSelected) {
          return true
        }
        // ako je odabrana prva rezervacija
        if (firstSlotSelected) {
          if (this.reservations[lastSlot + 50].id === 0 && this.reservations[lastSlot + 100].id !== 0) {
            this.ifReservationHoleAlert()
            return false
          }
        }
        // ako je odabrana druga rezervacija
        if (secondSlotSelected) {
          if (this.reservations[firstSlot - 50].id === 0) {
            this.ifReservationHoleAlert()
            return false
          } else if (this.reservations[lastSlot + 100].id !== 0 && this.reservations[lastSlot + 50].id === 0) {
            this.ifReservationHoleAlert()
            return false
          }
        }
        // ako je odabrana zadnja rezervacija
        if (lastSlotSelected) {
          if (
            this.reservations[lastSlot - 50].id === 0 &&
            this.reservations[lastSlotLastSelectedSlot - 50].id === 0 &&
            this.reservations[lastSlotLastSelectedSlot - 100].id !== 0
          ) {
            this.ifReservationHoleAlert()
            return false
          }
        }
        // ako je odabrana predzadnja rezervacija
        if (secondLastSlotSelected) {
          if (this.reservations[lastSlot - 50].id === 0 && this.reservations[lastSlot - 100].id !== 0) {
            this.ifReservationHoleAlert()
            return false
          } else if (this.reservations[lastSlot + 50].id === 0 && this.reservations[lastSlot - 50].id !== 0) {
            this.ifReservationHoleAlert()
            return false
          }
        }
        // ako nisu odabrani prvi i zadnji termini u danu
        if (!firstSlotSelected && !secondSlotSelected && !lastSlotSelected && !secondLastSlotSelected) {
          const checkFirstHole = this.reservations[firstSlot - 50].id === 0
          const checkLastHole = this.reservations[lastSlot + 50].id === 0
          const checkFirstHoleAfter = this.reservations[firstSlot - 100].id === 0
          const checkLastHoleAfter = this.reservations[lastSlot + 100].id === 0

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
    isUserInReservation(one) {
      return one.players.filter((item) => {
        return item.id === this.user.id
      })
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
    backFromPayment() {
      this.activeTab = 0
      this.componentKey += 1
      const c = this.selectedTerm.start_time - (this.court.reservation_duration / 30) * 100
      c.toString()
      setTimeout(function () {
        document.getElementById(c).scrollIntoView({
          top: 1000,
          behavior: 'smooth',
        })
      }, 200)
      this.getCourt()
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
          this.getCourt()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
        })
    },
    // hasDatePassed(one) {
    //   const a = this.$moment.utc(one.start_time)
    //   const b = this.$moment()
    //   if (a.diff(b, 'hours') >= 0) {
    //     console.log('true')
    //     return true
    //   } else {
    //     console.log('false')
    //     console.log(this.$moment.utc(one.start_time))
    //     return false
    //   }
    // },
    nextDayJump() {
      this.selected_date = this.$moment(this.datePicked)
      if (this.selected_date.isAfter(this.$moment())) {
        this.inactive = false
      }
      this.getCourtsCustom()
    },
    combineTerms(item, index) {
      const timeSpan = (this.court.reservation_duration / 30) * 50
      if (index < parseInt(this.maxTime) && index >= parseInt(this.minTime) && item.id !== 0) {
        if (item.id === this.court.parsed_reservations[parseInt(index) + timeSpan].id) {
          return false
        }
      }
      return true
    },
    // combineTerms(item, index) {
    //   const duljina = Object.keys(this.court.parsed_reservations).length
    //   console.log('index ' + index)
    //   if (this.court.parsed_reservations[index - 50] !== undefined) {
    //     if (this.item.id === this.court.parsed_reservations[index - 50]) return false
    //   }
    //   console.log(duljina)
    //   console.log('itemid ' + item.id)
    //   console.log('stari podatak ' + this.court.parsed_reservations[index].id)
    //   console.log('index ' + index)
    //
    //   return true
    // },
    putdate(payload) {
      this.$store.commit('courtdate/isDate', payload)
    },
    canAddPlayer(reservation) {
      return reservation.players.length === 1 && this.user.id === reservation.players[0].id
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
    canShowAddPlayer(reservation) {
      return true
      // return (this.isAdmin && reservation.players.length < 2) || reservation.players.length < 2
    },
    addPlayerModal(reservation) {
      this.reservation = reservation
      this.isAddPlayerModal = true
    },
    async getCourt() {
      this.court = await Court.params({ date: this.$moment(this.selected_date).format('YYYY-MM-DD') }).find(
        this.$route.params.id
      )
    },
    getCourtsCustom() {
      if (this.fwd) {
        this.loading = true
      } else {
        this.loading1 = true
      }
      Court.params({ date: this.selected_date.format('YYYY-MM-DD') })
        .find(this.$route.params.id)
        .then((res) => {
          this.court = res
          this.loading = false
          this.loading1 = false
        })
        .catch(() => {
          this.loading = false
          this.loading1 = false
        })
    },
    swipeHandler(direction) {
      if (direction === 'right') {
        // this.direction = 'right'
        this.prevDay()
      } else if (direction === 'left') {
        // this.direction = 'left'
        this.nextDay()
      }
    },
    // swipeHandlerMoving() {
    //   this.isMoving = true
    // },
    // swipeHandlerEnd(direction) {
    //   console.log('asdasd')
    //   this.isMoving = false
    //   setTimeout(function () {
    //     this.direction = 'sdf'
    //   }, 200)
    // },
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
            this.getCourt()
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
    nextDay() {
      this.fwd = true
      this.selected_date = this.$moment(this.selected_date).add(1, 'day')
      if (this.selected_date.isAfter(this.$moment())) {
        this.inactive = false
      }
      this.getCourtsCustom()
    },
    prevDay() {
      this.fwd = false
      if (!this.inactive || this.isAdmin) {
        this.selected_date = this.$moment(this.selected_date).subtract(1, 'day')
        if (this.selected_date.isSame(this.$moment(), 'day')) {
          this.inactive = true
        }
      }
      this.getCourtsCustom()
    },
  },
}
</script>
<style scoped>
.court-timeslot.reserved >>> .list-user {
  width: 100%;
}
</style>
