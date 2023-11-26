<template>
  <div class="modal-reservation">
    <div id="tu" class="absolute top0"></div>
    <b-tabs v-model="activeTab">
      <b-tab-item>
        <transition name="slidea">
          <div
            v-if="!checkIfAllowed"
            class="is-red fw600 is-size-5 has-text-centered has-text-white radius__5 p-r-30 p-l-30 p-t-10 p-b-10 is-fixed-floating align-transform m-t-20"
          >
            {{ $t('Jedna rezervacija može biti maksimalno 2 sata') }}
          </div>
        </transition>

        <div :class="{ opacity0: !checkIfAllowed }">
          <div class="modal-title has-text-light">{{ $t('rezervacija') }}</div>
          <div class="modal-subtitle has-text-light is-size-5 m-b-20">{{ court.name }}</div>
        </div>
        <div class="filter-list p-b-75">
          <div
            v-for="(hours, index) in reservations"
            :id="hours.time"
            :key="hours.id + index"
            @click="selectTime(hours)"
          >
            <div v-if="timeHasPassed(hours.time)" :class="getClass(hours)" class="">
              {{ hours.time | parseTime(true) }} -
              {{ (hours.time + (court.reservation_duration / 30) * 50) | parseTime(true) }}
              <b-icon
                class="reservation__price-icon m-t--3"
                pack="fal"
                icon="chevron-right"
                size="is-smaller-12"
                type="is-danger"
              />
              <span v-if="hours.price" class="price">{{ hoursPrice(hours.price) + ' €' }}</span>
            </div>
          </div>
        </div>
      </b-tab-item>
      <b-tab-item>
        <div class="members">
          <div class="modal-title has-text-light m-b-5">{{ $t(title) }}</div>
          <div class="is-size-6 has-text-light m-b-5 transition">
            {{ $t(subtitle) }}
          </div>
          <div class="is-size-3 has-text-centered fw500 radius__12 has-text-white m-t-15 flex align__centar__all">
            <b-icon icon="clock" pack="fal" type="is-white" size="is-smaller" class="m-r-10 p-b-7" />{{
              selected_times_sorted.length ? selected_times_sorted[0].time : '' | parseTimeHour
            }}
            <span class="is-size-6 m-t--10 m-r-5">{{
              selected_times_sorted.length ? selected_times_sorted[0].time : '' | parseTimeMin
            }}</span>
            —
            {{
              selected_times_sorted.length
                ? selected_times_sorted[selected_times_sorted.length - 1].time + (court.reservation_duration / 30) * 50
                : '' | parseTimeHour
            }}<span class="is-size-6 m-t--10 m-r-5">{{
              selected_times_sorted.length
                ? selected_times_sorted[selected_times_sorted.length - 1].time + (court.reservation_duration / 30) * 50
                : '' | parseTimeMin
            }}</span>
          </div>
          <div v-if="isAdmin" class="fw600 is-size-5 has-text-lightblue mt-5">
            {{ $t('Rezervacijske opcije') }}
          </div>
          <div v-if="isAdmin" class="buttons m-t-10 buttons_reservation">
            <b-button
              v-if="
                !listTypeSchool && !guestReservation && !is_doubles && isAdmin && !specialReservation && !showPartners
              "
              type="is-small noborder"
              pack="far"
              icon-left="people-arrows"
              :icon-right="forSomeoneElse ? 'times' : ''"
              :class="{ active: forSomeoneElse }"
              rounded
              @click="forSomeoneElse = !forSomeoneElse"
            >
              {{ $t('naDrugoIme') }}
            </b-button>
            <b-button
              v-if="
                !listTypeSchool && isAdmin && !forSomeoneElse && !is_doubles && !specialReservation && !showPartners
              "
              type="is-small noborder"
              pack="far"
              icon-left="person-circle-question"
              :icon-right="guestReservation ? 'times' : ''"
              :class="{ active: guestReservation }"
              rounded
              @click="guestReservation = !guestReservation"
            >
              {{ $t('naImeGosta') }}
            </b-button>
            <b-button
              v-if="isAdmin && !forSomeoneElse && !guestReservation && !is_doubles && !listTypeSchool && !showPartners"
              type="is-small noborder"
              icon-left="sparkles"
              :icon-right="specialReservation ? 'times' : ''"
              :class="{ active: specialReservation }"
              pack="far"
              rounded
              @click="specialReservation = !specialReservation"
            >
              {{ $t('posebnoOznai') }}
            </b-button>
            <div
              v-if="
                isAdmin &&
                !listTypeSchool &&
                !guestReservation &&
                !forSomeoneElse &&
                !is_doubles &&
                !specialReservation &&
                !showPartners
              "
              class="divider-line-1 m-b-20 m-t-3 w80 opacity6"
            ></div>
            <b-button
              v-if="!listTypeSchool && !guestReservation && !forSomeoneElse && !is_doubles && !specialReservation"
              type="is-small noborder"
              pack="far"
              icon-left="user-plus"
              :icon-right="showPartners ? 'times' : ''"
              :class="[{ active: showPartners }]"
              rounded
              @click="showPartners = !showPartners"
            >
              {{ $t('Dodaj partnera na rezervaciju') }}
            </b-button>
          </div>
          <div
            v-show="
              !listTypeSchool &&
              !guestReservation &&
              !forSomeoneElse &&
              !is_doubles &&
              !specialReservation &&
              !showPartners &&
              showCompetition
            "
          >
            <div class="fw600 is-size-5 has-text-lightblue m-t-10 m-b--16" @click="scrollToTop()">
              {{ $t('Rezerviraj za natjecanje') }}
            </div>
            <competitions
              class="results p-b-200"
              @competition="showCompetition = true"
              @liga="isInCompetition($event)"
            ></competitions>
          </div>

          <template v-if="specialReservation">
            <reservationCategories @update="specialReservationSelected = $event" />
          </template>
          <template v-if="!specialReservation">
            <template v-if="!guestReservation">
              <div v-if="!listTypeSchool" class="for-list p-b-40 m-t--10">
                <template v-if="!is_doubles && (showPartners || forSomeoneElse)">
                  <div class="search mw82 container">
                    <b-field>
                      <b-input
                        ref="filter"
                        v-model="search_term"
                        :placeholder="$t('pretraiIgrae')"
                        type="search"
                        pack="far"
                        :icon-right="search_icon"
                        icon-right-clickable
                        @icon-right-click="search_term = ''"
                      >
                      </b-input>
                    </b-field>
                  </div>
                  <div v-if="loadingPlayers" class="align__centar__x">
                    <b-icon
                      class="comment-send m-b-20"
                      custom-class="rotating"
                      icon="spinner"
                      size="is-large"
                      type="is-white"
                      pack="far"
                    ></b-icon>
                  </div>
                  <template v-if="lastPlayersOnReservation.length && !search_term.length">
                    <div class="fw600 is-size-6 has-text-warning m-b-5 m-t-7">
                      {{ $t('Posljednji igrači koje ste dodali') }}
                    </div>
                    <div
                      v-for="(item, index) in lastPlayersOnReservation"
                      v-show="item.id !== $auth.user.id"
                      :key="index + 'single'"
                      class="list__image-col cursor align__centar__y"
                      @click="
                        selected_player = item
                        is_group = false
                        $store.commit('userPreference/setLastPlayersOnReservation', item)
                      "
                    >
                      <TennisImage :size="[32, 32]" :src="item.image" class="user_image-small m-r-10" alt="" />
                      <div class="list__content">
                        <h3 class="fw600 is-size-5 has-text-black80">{{ item.display_name }}</h3>
                      </div>
                      <div v-if="isBlocked(item)" class="x-tag m-l-auto is-red">{{ $t('Blokirani') }}</div>
                    </div>
                  </template>
                  <template v-else>
                    <div
                      v-for="(item, index) in members"
                      v-show="item.id !== $auth.user.team.id"
                      :key="index + 'single'"
                      class="list__image-col cursor align__centar__y"
                      @click="
                        selected_player = item
                        is_group = false
                        $store.commit('userPreference/setLastPlayersOnReservation', item)
                      "
                    >
                      <TennisImage :size="[32, 32]" :src="item.image" class="user_image-small m-r-10" alt="" />
                      <div class="list__content">
                        <h3 class="fw600 is-size-5 has-text-black80">{{ item.display_name }}</h3>
                      </div>
                      <div v-if="isBlocked(item)" class="x-tag m-l-auto is-red">{{ $t('Blokirani') }}</div>
                    </div>
                  </template>
                </template>
                <div v-if="is_doubles" class="my-rank m-t-20">
                  <div v-if="!members.length" class="">
                    <div class="has-text-danger is-size-5 fw600 has-text-centered">
                      {{ $t('Nemate natjecateljski par') }}
                    </div>
                    <div class="buttons m-t-20 m-b-5">
                      <b-button
                        class="softshadow"
                        type="is-small noborder"
                        pack="fal"
                        icon-right="user-group"
                        rounded
                        @click="$router.push(localePath('/doubles/new'))"
                      >
                        {{ $t('Izradi par') }}
                      </b-button>
                    </div>
                  </div>
                  <div v-if="members.length" class="has-text-white fw500 has-text-centered is-size-4 m-b-3">
                    {{
                      selected_teams.length === 0
                        ? $t('Odaberi prvi par')
                        : selected_teams.length === 1
                        ? $t('Odaberi drugi par')
                        : $t('Parovi su odabrani')
                    }}
                  </div>
                  <div v-if="selected_teams.length > 0" class="list__image-col softshadow">
                    <div v-if="selected_teams.length > 0" class="align__centar__y">
                      <div
                        v-if="selected_teams[0].image === 'https://api.tenis.plus/images/user.svg'"
                        class="list__img"
                      >
                        <TennisImage
                          :size="[42, 42]"
                          :src="selected_teams[0].players[0].image"
                          class="user_image border__white--2"
                          alt=""
                        />
                        <TennisImage
                          :size="[42, 42]"
                          :src="selected_teams[0].players[1].image"
                          class="user_image m-l--20 border__white--2"
                          alt=""
                        />
                      </div>
                      <div v-else class="list__img">
                        <TennisImage
                          :size="[42, 42]"
                          :src="selected_teams[0].image"
                          class="user_image border__white--2"
                          alt=""
                        />
                      </div>
                      <div class="list__content m-r-auto">
                        <div class="has-text-black80 fw600">{{ selected_teams[0].display_name }}</div>
                      </div>
                      <div class="buttons m-l-auto">
                        <b-button
                          class="m-l-auto"
                          type="is-danger"
                          pack="fal"
                          rounded
                          size="is-smaller"
                          @click="selected_teams.splice(0, 1)"
                          >{{ $t('ukloni') }}</b-button
                        >
                      </div>
                    </div>
                    <div v-else class="buttons">
                      <div class="fw600 has-text-white is-size-5 p-b-10">{{ $t('odaberiPrviParSListe') }}</div>
                    </div>
                  </div>
                  <div v-if="selected_teams.length > 1" class="list__image-col softshadow">
                    <div v-if="selected_teams.length > 1" class="align__centar__y">
                      <div
                        v-if="selected_teams[1].image === 'https://api.tenis.plus/images/user.svg'"
                        class="list__img"
                      >
                        <TennisImage
                          :size="[42, 42]"
                          :src="selected_teams[1].players[0].image"
                          class="user_image border__white--2"
                          alt=""
                        />
                        <TennisImage
                          :size="[42, 42]"
                          :src="selected_teams[1].players[1].image"
                          class="user_image m-l--20 border__white--2"
                          alt=""
                        />
                      </div>
                      <div v-else class="list__img">
                        <TennisImage
                          :size="[42, 42]"
                          :src="selected_teams[1].image"
                          class="user_image border__white--2"
                          alt=""
                        />
                      </div>
                      <div class="list__content m-r-auto">
                        <div class="has-text-black80 fw600">{{ selected_teams[1].display_name }}</div>
                      </div>
                      <div class="buttons m-l-auto">
                        <b-button
                          class="m-l-auto"
                          type="is-danger"
                          rounded
                          size="is-smaller"
                          @click="selected_teams.splice(1, 1)"
                          >{{ $t('ukloni') }}</b-button
                        >
                      </div>
                    </div>
                    <div v-else class="buttons">
                      <div class="fw600 has-text-black20 p-b-10">{{ $t('odaberiDrugiParSListe') }}</div>
                    </div>
                  </div>
                  <div v-if="selected_teams.length < 2 && members.length" class="search container m-b--10">
                    <b-field>
                      <b-input
                        ref="filter"
                        v-model="search_term"
                        :placeholder="$t('pretraiParove')"
                        type="search"
                        pack="far"
                        :icon-right="search_icon"
                        icon-right-clickable
                        @icon-right-click="search_term = ''"
                      >
                      </b-input>
                    </b-field>
                  </div>
                </div>
                <!--            For Doubles list-->
                <template v-if="is_doubles && selected_teams.length < 2">
                  <div v-if="loadingPlayers" class="align__centar__x">
                    <b-icon
                      class="comment-send m-b-7"
                      custom-class="rotating"
                      icon="spinner"
                      size="is-large"
                      type="is-white"
                      pack="far"
                    ></b-icon>
                  </div>
                  <div
                    v-for="(item, index) in members"
                    :key="index + 'doubles'"
                    class="list__image-col cursor align__centar__y"
                    @click="
                      addTeam(item)
                      is_group = false
                    "
                  >
                    <div
                      v-if="item.image === 'https://api.tenis.plus/images/user.svg' && item.players.length"
                      class="list__img"
                    >
                      <TennisImage
                        :size="[42, 42]"
                        :src="item.players[0].image"
                        class="user_image border__white--2"
                        alt=""
                      />
                      <TennisImage
                        :size="[42, 42]"
                        :src="item.players[1].image"
                        class="user_image m-l--20 border__white--2"
                        alt=""
                      />
                    </div>
                    <div v-else class="list__img">
                      <TennisImage :size="[42, 42]" :src="item.image" class="user_image border__white--2" alt="" />
                    </div>

                    <div class="list__content">
                      <h3 class="fw600 is-size-5 has-text-black80">{{ item.display_name }}</h3>
                    </div>
                    <span v-if="item.is_doubles" class="is-size-7 x-tag nav__notification has-text-white">{{
                      $t('par')
                    }}</span>
                  </div>
                </template>
                <template v-else>
                  <div v-if="is_doubles" class="buttons m-t-40">
                    <b-button
                      :icon-right="buttonNextIcon"
                      pack="far"
                      type="is-primary"
                      :class="disableNextButton"
                      rounded
                      :loading="loading"
                      @click="buttonNextAction"
                    >
                      {{ buttonNext }}
                    </b-button>
                  </div>
                </template>
              </div>
              <div v-else class="for-list p-b-40">
                <div
                  v-for="(item, index) in schoolGroup"
                  :key="index + 'school'"
                  class="list__image-col cursor align__centar__y"
                  @click="
                    selected_player = item
                    is_group = true
                  "
                >
                  <TennisImage :size="[32, 32]" :src="item.image" class="user_image-small m-r-10" alt="" />
                  <div class="list__content">
                    <h3 class="fw600 is-size-5 has-text-black80">{{ item.name }}</h3>
                  </div>
                </div>
              </div>
            </template>
            <div v-else class="">
              <ValidationProvider v-slot="{ errors }" name="Ime gosta" rules="required">
                <b-field
                  :label="$t('imeGosta')"
                  class="login__input__container has-text-lightblue"
                  :type="{ 'is-danger': errors[0] }"
                  :message="errors"
                >
                  <b-input v-model="guestName" type="text" rounded> </b-input>
                </b-field>
              </ValidationProvider>
            </div>
          </template>
        </div>
      </b-tab-item>
      <b-tab-item class="p-b-300">
        <div class="modal-title has-text-light m-b-30">{{ $t('potvrdaRezervacije') }}</div>
        <div class="court activity__box--no_bgc">
          <div class="court-header">
            <div class="modal-subtitle">{{ court.name }}</div>
            <div :class="['x-tag', 'badge-' + court.surface.badge]">
              {{ $t(court.surface.title) }}
            </div>
          </div>
          <div class="m-t-10 has-text-centered has-text-grey-light fw600">{{ realDateDisplay }}</div>
          <div class="is-size-3 has-text-centered fw600">
            {{ selected_times_sorted.length ? selected_times_sorted[0].time : '' | parseTime(true) }}
            —
            {{
              selected_times_sorted.length
                ? selected_times_sorted[selected_times_sorted.length - 1].time + (court.reservation_duration / 30) * 50
                : '' | parseTime(true)
            }}
            h
          </div>
          <!--          Prikaz za pojedinca-->
          <div
            v-if="!listTypeSchool && !Object.keys(specialReservationSelected).length"
            class="has-text-centered has-text-primary fw600"
          >
            {{ $t('ukupnaCijena') }} {{ reservationSpanPrice | currency }}
          </div>
          <template v-if="guestName !== ''">
            <div class="confirm-reservation">
              <TennisImage :size="[42, 42]" :src="club.logo" class="user_image m-r-10" />
              <div class="list__content">
                <h3 class="fw600 is-size-5 has-text-black80">{{ guestName }}</h3>
                <span v-if="guestName !== ''" class="is-size-7 has-text-black50 fw600 m-t--2"
                  >{{ $t('rezervirao') }} <span class="has-text-lightblue">{{ user.display_name }}</span></span
                >
              </div>
            </div>
          </template>
        </div>
        <div class="align__centar__x">
          <b-button class="m-t-30" type="is-primary" pack="far" icon-right="repeat" rounded @click="activeTab++">
            {{ $t('ponavljajuiTermin') }}
          </b-button>
        </div>
        <div v-if="repeatReservationsWeeks" class="">
          <div class="fw600 has-text-centered has-text-white m-t-20 is-size-55">
            Broj ponavljajućih rezervacija <span class="has-text-lightblue">{{ repeatReservationsWeeks }}</span>
          </div>
        </div>
        <div class="forma">
          <b-field class="login__input__container has-text-lightblue" :label="$t('Ime')">
            <b-input v-model="applicant.name" type="text" rounded> </b-input>
          </b-field>
          <b-field class="login__input__container has-text-lightblue" :label="$t('Adresa')">
            <b-input v-model="applicant.address" type="text" rounded> </b-input>
          </b-field>
          <b-field
            class="login__input__container has-text-lightblue"
            :label="$t('Ime i prezime osobe ovlaštene za zastupanje')"
          >
            <b-input v-model="applicant.representative" type="text" rounded> </b-input>
          </b-field>
          <b-field class="login__input__container has-text-lightblue" :label="$t('OIB')">
            <b-input v-model="applicant.oib" type="number" rounded> </b-input>
          </b-field>
          <b-field class="login__input__container has-text-lightblue" :label="$t('Telefon')">
            <b-input v-model="applicant.phone" type="text" rounded> </b-input>
          </b-field>
          <b-field class="login__input__container has-text-lightblue" :label="$t('E-mail')">
            <b-input v-model="email" type="email" rounded> </b-input>
          </b-field>
          <b-field class="login__input__container has-text-lightblue" :label="$t('Opis')">
            <b-input v-model="description" type="text" rounded> </b-input>
          </b-field>
          <b-field class="login__input__container has-text-lightblue" :label="$t('Bilješka')">
            <b-input v-model="note" type="text" rounded> </b-input>
          </b-field>
          <b-field class="login__input__container has-text-lightblue" :label="$t('Javni opis')">
            <b-input v-model="public_description" type="text" rounded> </b-input>
          </b-field>
          <ValidationProvider v-slot="{ errors, valid }" name="Uvjeti korištenja" rules="required">
            <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
              <b-checkbox v-model="consent" name="consent" :true-value="true" class="has-text-white m-t-10"
                >{{ $t('prihvaam') }}
                <a href="https://www.tenis.plus/terms" target="_blank">{{ $t('uvjeteKoritenja') }}</a></b-checkbox
              >
            </b-field>
          </ValidationProvider>
        </div>
      </b-tab-item>
      <b-tab-item>
        <div class="modal-title has-text-light m-b-15">{{ $t('ponavljajuaRezervacija') }}</div>

        <div class="buttons m-t-20">
          <b-button
            class="softshadow m-t-10 m-b-20 invert-small-button"
            type="is-small noborder is-danger has-text-white"
            pack="fal"
            icon-left="chevron-left"
            rounded
            @click="activeTab--"
          >
            Nazad
          </b-button>
        </div>

        <div v-if="!$auth.user.is_admin" class="modal-subtitle is-size-6 has-text-light m-b-20 lh12">
          {{ $t('odaberiteKolikoSljedeihIstovjetnihTjednihTerminaEl') }}
          <div class="is-size-7 has-text-light m-b-20 m-t-15 lh12">
            {{ $t('maksimalanBrojTjednihTerminaKojeOmoguavaTvojeLanst') }}
            <span class="has-text-lightblue is-size-7">{{ reservationSpanWeeks }} tj.)</span>
          </div>
        </div>
        <template>
          <div class="modal-subtitle m-b-20 lh12 is-size-5 has-text-lightblue">{{ $t('unesiBrojTjedana') }}</div>
          <ValidationProvider v-slot="{ errors }" name="Uplata" rules="required">
            <b-field class="login__input__container m-b-30" :type="{ 'is-danger': errors[0] }" :message="errors">
              <b-numberinput
                v-model="repeatReservationsWeeks"
                :placeholder="$t('brojTjedana2')"
                min="0"
                :max="reservationSpanWeeks"
                step="1"
                type="is-white"
                rounded
                controls-rounded
              ></b-numberinput>
            </b-field>
          </ValidationProvider>
        </template>
        <div class="buttons">
          <b-button
            :class="{ softshadow: true, 'invert-small-button': selectedType === 'all' }"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': selectedType === 'all',
            }"
            pack="fal"
            rounded
            @click="selectedType = 'all'"
          >
            {{ $t('Svaki tjedan') }}
          </b-button>
          <b-button
            :class="{ softshadow: true, 'invert-small-button': selectedType === 'second' }"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': selectedType === 'second',
            }"
            pack="fal"
            rounded
            @click="selectedType = 'second'"
          >
            {{ $t('Svaki drugi tjedan') }}
          </b-button>
        </div>
        <div v-show="repeatReservationsWeeks && selectedType === 'all'" class="w100 has-text-centered m-t--20 m-b-7">
          <span
            v-for="indicator in repeatReservationsWeeks"
            :key="indicator"
            class="school-payment-indicatior is-primary"
          ></span>
        </div>
        <div v-show="repeatReservationsWeeks && selectedType === 'second'" class="w100 has-text-centered m-t--20 m-b-7">
          <span
            v-for="indicator in repeatReservationsWeeks * 2"
            :key="indicator"
            class="school-payment-indicatior"
            :class="indicator % 2 === 0 ? 'is-primary' : 'is-white'"
          ></span>
        </div>
        <div class="filter-list p-b-75">
          <div
            v-for="item in 10"
            :key="item"
            :class="{
              'select-item': true,
              active: repeatReservationsWeeks === item,
            }"
            @click="repeatReservationsWeeks = item"
          >
            <div class="align__centar__y">
              <span class="is-size-6 m-r-5">{{ $t('brojTjedana') }} </span>
              <span class="has-text-danger">{{ item }}</span>
            </div>
          </div>
        </div>
      </b-tab-item>
    </b-tabs>
    <template v-if="specialReservation ? Object.keys(specialReservationSelected).length : true">
      <div v-if="!(is_doubles && activeTab === 1)" class="buttons is-fixed m-t-20">
        <b-button :icon-right="buttonCancelIcon" pack="far" type="is-danger" rounded @click="buttonCancelAction">
          {{ buttonCancel }}
        </b-button>
        <b-button
          :icon-right="buttonNextIcon"
          pack="far"
          type="is-primary"
          :class="disableNextButton"
          rounded
          :loading="loading"
          @click="buttonNextAction"
        >
          {{ buttonNext }}
        </b-button>
      </div>
    </template>
    <div
      class="times-modal"
      @click="
        $parent.close()
        $emit('close')
      "
    >
      <b-icon icon="times" pack="fal" type="is-white" size="is-medium" class="m-l-15" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import SchoolGroup from '@/models/SchoolGroup'
import moment from 'moment'
import TennisImage from '@/components/TennisImage.vue'
import Team from '~/models/Team'
import Reservation from '~/models/Reservation'
import reservationCategories from '~/components/court/reservationCategories'
import competitions from '~/components/reservations/userCompetitionsReserve'
export default {
  name: 'ModalCourtReservation',
  components: {
    TennisImage,
    reservationCategories,
    competitions,
  },
  filters: {
    parseTime(value, m) {
      const hour = Math.floor(value / 100)
      let minutes = ((value % 100) / 100) * 60
      if (minutes === 0) {
        minutes = '00'
      }
      if (m) {
        return hour + ':' + minutes
      }
      return hour
    },
    parseTimeMin(value) {
      let minutes = ((value % 100) / 100) * 60
      if (minutes === 0) {
        minutes = '00'
      }
      return ':' + minutes
    },
    parseTimeHour(value) {
      const hour = Math.floor(value / 100)
      return hour
    },
  },
  props: {
    court: {
      type: Object,
      required: true,
    },
    selectedTimePre: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
    reservations: {
      type: [Object, String],
      required: true,
    },
    isDoubles: {
      type: Boolean,
      required: false,
      default: false,
    },
    reservationDate: {
      type: [Object, String],
      required: false,
      default() {
        return {}
      },
    },
  },
  async fetch() {
    await this.debouncedGetPlayers()
  },
  data() {
    return {
      loading: false,
      last_page: 1,
      offset: 1,
      page: 1,
      bottom: false,
      nomore: false,
      teams: [],
      selected_teams: [],
      is_doubles: false,
      loadingPlayers: false,
      activeTab: 0,
      isModalMembersActive: true,
      selected_times: [],
      search_term: '',
      members: [],
      schoolGroup: [],
      selected_player: {},
      is_group: false,
      listTypeSchool: false,
      guestReservation: false,
      guestName: '',
      selectedType: 'all',
      showPartners: false,
      forSomeoneElse: false,
      specialReservation: false,
      specialReservationSelected: {},
      selected_times_sorted: [],
      repeatReservationsWeeks: 0,
      title: 'Rezervacija terena',
      test: null,
      totalReservations: null,
      totalReservationsList: [],
      loading_reservation: false,
      name: '',
      showCompetition: false,
      isReservatioPre: false,
      game: {},
      applicant: {
        name: '',
        address: '',
        representative: '',
        oib: '',
        phone: '',
      },
      email: '',
      description: '',
      note: '',
      public_description: '',
      consent: false,
    }
  },
  computed: {
    lastPlayersOnReservation() {
      return this.$store.state.userPreference.preference.lastPlayersOnReservation
    },
    subtitle() {
      if (this.forSomeoneElse) {
        return 'Nakon odabira, igrač će dobiti obavijest o rezervaciju'
      } else if (this.guestReservation) {
        return 'Koristite ovu opciju ako želite rezervirati teren za gosta koji nije registriran u aplikaciju'
      } else if (this.listTypeSchool) {
        return 'Svi igrači unutar odabrane grupe će dobiti obavijest o rezerviranom terminu'
      } else if (this.is_doubles) {
        return 'Svi igrači parova će dobiti obavijest o rezerviranom terminu'
      } else if (this.showPartners) {
        return 'Igrač će dobiti obavijest o dodavanju na vašu rezervaciju'
      } else {
        return 'Kako biste rezervirali teren samo za sebe, kliknite gumb "Dalje"'
      }
    },
    reservationSpanWeeks() {
      return this.club.id !== 26 && !this.user.is_admin
        ? Math.round(this.user.membership.max_reservation_span / 7)
        : this.user.is_admin
        ? 52
        : 1
    },
    search_icon() {
      if (this.search_term !== '') {
        return 'times'
      } else {
        return 'search'
      }
    },
    user() {
      return this.$store.state.auth.user
    },
    date() {
      return this.$moment(this.$route.params.date).format('dddd' + ', ' + 'l')
    },
    realDate() {
      if (Object.keys(this.reservationDate).length) {
        return this.$moment(this.reservationDate).format('YYYY-MM-DD')
      }
      return this.$route.params.date
    },
    realDateDisplay() {
      if (Object.keys(this.reservationDate).length) {
        return this.$moment(this.reservationDate).format('dddd' + ', ' + 'l')
      }
      return this.$moment(this.$route.params.date).format('dddd' + ', ' + 'l')
    },
    price() {
      return _.sumBy(this.selected_times, 'price')
    },
    reservationSpan() {
      const mapTimes = _.map(this.selected_times, 'time')
      const spanRange = (_.max(mapTimes) - _.min(mapTimes)) / (this.court.reservation_duration === 60 ? 100 : 50) + 1
      const minRange = _.min(mapTimes)
      const fullRange = []

      for (let i = 0; i < spanRange; i++) {
        if (this.reservations[minRange + i * ((this.court.reservation_duration / 30) * 50)].id !== 0) {
        } else {
          fullRange.push(this.reservations[minRange + i * ((this.court.reservation_duration / 30) * 50)])
        }
      }
      return fullRange
    },
    reservationSpanPrice() {
      const mapPrice = _.map(this.reservationSpan, 'price')
      const mapPriceDiscount = []
      for (let i = 0; i < mapPrice.length; i++) {
        if (this.club.id !== 26) {
          if (this.user.membership.has_discount) {
            if (this.user.membership.discount_type === 1) {
              mapPriceDiscount.push(mapPrice[i] - this.user.membership.discount_amount)
            } else if (this.user.membership.discount_type === 2) {
              mapPriceDiscount.push(
                Math.round(mapPrice[i] - (mapPrice[i] / 100) * this.user.membership.discount_amount)
              )
            }
          } else {
            mapPriceDiscount.push(mapPrice[i])
          }
        } else {
          mapPriceDiscount.push(mapPrice[i])
        }
      }
      return _.sum(mapPriceDiscount)
    },
    buttonNext() {
      switch (this.activeTab) {
        case 0:
          return this.$t('Rezerviraj')
        case 1:
          return this.$t('dalje')
        case 2:
        case 3:
          if (this.isAdmin) {
            return this.$t('Rezerviraj')
          } else if (this.$store.state.club.id === 26 && this.court.reservation_prepayment) {
            return this.$t('Rezerviraj i plati')
          } else if (
            this.$store.state.club.id !== 26 &&
            this.user.membership?.reservation_prepayment &&
            this.court.club.payment_online
          ) {
            return this.$t('Rezerviraj i plati')
          } else {
            return this.$t('Rezerviraj')
          }
      }
      return ''
    },
    buttonNextIcon() {
      switch (this.activeTab) {
        case 0:
        case 1:
          return 'arrow-right'
        case 2:
        case 3:
          return 'check'
      }
      return ''
    },
    buttonCancel() {
      switch (this.activeTab) {
        case 0:
          return this.$t('Otkaži')
        case 1:
          return this.$t('Otkaži')
        case 2:
          return this.$t('izmijeni')
        case 3:
          return this.$t('Otkaži')
        case 4:
          return this.$t('5. Ždrijeb')
      }
      return ''
    },
    buttonCancelIcon() {
      switch (this.activeTab) {
        case 0:
          return 'times'
        case 1:
          return 'times'
        case 2:
          return 'undo-alt'
        case 3:
          return 'times'
      }
      return ''
    },
    isAdmin() {
      return this.user.is_admin || this.isCashier()
    },
    club() {
      return this.$store.state.club
    },
    disableNextButton() {
      return {
        disable:
          this.selected_times.length === 0 ||
          (this.activeTab === 3 && this.repeatReservationsWeeks === null) ||
          (this.activeTab === 1 && this.forSomeoneElse && Object.keys(this.selected_player)) ||
          !this.checkIfAllowed,
      }
    },
    isToday() {
      const today = moment(this.reservationDate)
      return moment().isSame(today, 'day')
    },
    today() {
      return this.$moment().format('YYYY-MM-DD')
    },
    checkReservations() {
      const now = new Date()
      const filteredReservations = this.totalReservationsList.filter((reservation) => {
        const players = reservation.game.players
        const endTime = new Date(reservation.game.reservation.to)

        // Check if the reservation's end time is in the future
        if (endTime > now) {
          return (
            players.length > 0 && players[0].id === (this.forSomeoneElse ? this.selected_player.id : this.user.team.id)
          )
        }
        return false // Exclude past reservations
      })

      const totalReservations = filteredReservations.reduce((acc, curr) => {
        const reservation = curr.game.reservation
        const duration = (new Date(reservation.to) - new Date(reservation.from)) / (1000 * 60 * 60)
        return acc + duration
      }, 0)

      return totalReservations
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
  },
  watch: {
    selectedTimePre: {
      immediate: true,
      handler() {
        if (this.selectedTimePre.length) {
          this.selected_times = this.selectedTimePre
          this.isReservatioPre = true
          this.activeTab++
        }
      },
    },
    selected_player: {
      handler() {
        if (Object.keys(this.selected_player).length) this.activeTab++
        this.loadReservations()
      },
    },
    repeatReservationsWeeks: {
      handler() {
        if (this.repeatReservationsWeeks > this.reservationSpanWeeks)
          this.repeatReservationsWeeks = this.reservationSpanWeeks
      },
    },
    selected_times: {
      immediate: true,
      handler() {
        this.selected_times_sorted = [...this.selected_times].sort((a, b) => a.time - b.time)
      },
    },
    search_term(term) {
      if (term.length) {
        this.debouncedGetPlayers()
      }
    },
    activeTab: {
      handler() {
        this.scrollToTop()
      },
    },
    selected_teams: {
      handler() {
        if (!this.isAdmin) {
          this.getPlayers()
        }
      },
    },
  },
  created() {
    this.debouncedGetPlayers = _.debounce(this.getPlayers, 500)
    this.$auth.fetchUser()
  },
  methods: {
    isBlocked(player) {
      if (player.club_member[this.club.id.toString()] !== undefined) {
        return player.club_member[this.club.id.toString()].type === 'blocked'
      } else {
        return false
      }
    },
    isInCompetition(item) {
      this.game = item
      if (item.players[0].type === 'team' && item.players.length === 2) {
        this.selected_teams = item.players
        this.is_doubles = true
      } else {
        this.players = item.players
      }
      if (this.user.id === item.players[0].players[0].id) {
        this.selected_player = item.players[1]
      } else {
        this.selected_player = item.players[0]
      }
    },
    isCashier() {
      if (!this.user.club_member || !this.user.club_member[this.club.id.toString()]) return false
      return this.user.club_member[this.club.id.toString()].cashier === undefined
        ? false
        : this.user.club_member[this.club.id.toString()].cashier === true
    },
    loadReservations() {
      if (this.forSomeoneElse) {
        this.loading_reservation = true
        Reservation.where('from', this.today)
          .where('player', this.selected_player.players[0].id)
          .get()
          .then((res) => {
            this.totalReservationsList = res.data
            this.totalReservations = res.meta.total
            this.loading_reservation = false
          })
      } else {
        this.loading_reservation = true
        Reservation.where('from', this.today)
          .where('player', this.user.id)
          .get()
          .then((res) => {
            this.totalReservationsList = res.data
            this.totalReservations = res.meta.total
            this.loading_reservation = false
          })
      }
    },
    timeHasPassed(item) {
      if (this.isToday) {
        const matchTime = moment(item.toString(), 'hmm').format('HHmm')
        const currentTime = moment().format('HHmm')
        if (matchTime < currentTime) {
          if (this.isAdmin) {
            return true
          }
          return false
        }
        return true
      }
      return true
    },
    resetSelectedPlayers() {
      this.selected_player = {}
      this.selected_teams = []
    },
    scrollToTop() {
      document.getElementById('tu').scrollIntoView({
        top: 100,
        behavior: 'smooth',
      })
    },
    hoursPrice(item) {
      if (this.court.id === 163) {
        return item
      }
      return item
    },
    focusInput() {
      this.$refs.filter.focus()
    },
    getDoubles() {
      this.is_doubles = !this.is_doubles
      this.page = 1
      this.resetSelectedPlayers()
      this.getPlayers()
    },
    addTeam(item) {
      if (this.selected_teams.length < 2) {
        this.selected_teams.push(item)
      } else {
        this.$buefy.toast.open({
          message: this.$t('Uklonite prvo jedan od odabrana para'),
          type: 'is-danger',
        })
      }
    },
    getGroups() {
      this.$root.$loading.start()
      SchoolGroup.where('club', this.$store.state.club.id)
        .limit(100)
        .get()
        .then((res) => {
          this.schoolGroup = res.data
          this.$root.$loading.finish()
        })
    },
    getPlayers() {
      // if (this.last_page < this.page) return
      this.loadingPlayers = true
      const t = Team.page(1)
        .where('number_of_players', this.is_doubles ? 2 : 1)
        .where('display_name', this.search_term)
      if (this.$store.state.club.id !== 26) {
        t.where('club', this.$store.state.club.id)
      }
      if (this.is_doubles && !this.isAdmin && this.selected_teams.length === 0) {
        t.where('players', this.user.id)
      }

      t.get().then((res) => {
        this.members = res.data
        this.total = res.meta.total
        this.last_page = res.meta.last_page
        this.loadingPlayers = false
      })
    },
    buttonCancelAction() {
      if (this.activeTab === 2) {
        this.activeTab = 0
      } else {
        this.$parent.close()
        this.$emit('close')
      }
    },
    buttonNextAction() {
      if (this.activeTab === 2 || this.activeTab === 3) {
        this.send()
      } else if (this.ifReservationHole()) {
        if (this.activeTab === 1) {
          this.loadReservations()
        }
        this.activeTab++
      }
    },
    selectTime(hour, part) {
      if (hour.status === 'approved') {
        return
      }
      if (_.indexOf(this.reservationSpan, hour) > -1) {
        this.selected_times.splice(_.indexOf(this.selected_times, hour), 1)
      } else {
        this.selected_times.push(hour)
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
    getClass(hour) {
      return {
        'select-item': true,
        active: _.indexOf(this.reservationSpan, hour) > -1,
        'modal-reserved-input': true,
        'modal-reserved': hour.id !== 0,
      }
    },
    repeatReservation() {
      this.$axios
        .post('club/reservation/' + this.reservation + '/repeat', { times: this.repeat, repeat: this.canRepeat })
        .then(() => {
          this.$router.push(this.localePath('/me/reservations'))
        })
        .catch((err) => {
          if (err.response.status === 409) {
            this.errors = err.response.data.errors
            this.canRepeat = true
            this.$refs.modalTimetable.hide()
            this.$refs.reservationTaken.show()
          }
        })
    },
    sendCompetition() {
      this.loading = true
      const reservation = new Reservation({
        date: this.realDate,
        times: this.selected_times_sorted,
        group: {},
        game: this.game.id,
        repeat: null,
        court_id: this.court.id,
      })
      reservation
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste rezervirali teren'),
            type: 'is-success',
          })
          this.loading = false
          this.$emit('close')
          this.$parent.close()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading = false
          this.$emit('close')
          this.$parent.close()
        })
    },
    send() {
      if (Object.keys(this.game).length) {
        this.sendCompetition()
        return
      }
      this.loading = true
      let players = [
        this.forSomeoneElse ? this.selected_player : this.user.team,
        this.forSomeoneElse ? {} : this.selected_player,
      ]
      if (this.is_group) {
        players = [this.user.team, {}]
      }
      if (this.is_doubles) {
        players = this.selected_teams
      }
      if (this.forSomeoneElse) {
        players = [this.selected_player]
      }
      if (this.specialReservation) {
        players = []
      }
      const reservation = new Reservation({
        date: this.realDate,
        times: this.selected_times_sorted,
        players,
        group: this.is_group ? this.selected_player : {},
        repeat: this.repeatReservationsWeeks,
        every_other_week: this.selectedType === 'second',
        court_id: this.court.id,
        name: this.name,
        applicant: this.applicant,
        email: this.email,
        description: this.description,
        note: this.note,
        public_description: this.public_description,
        consent: this.consent,
      })

      if (Object.keys(this.game).length) {
        reservation.game = [this.game.id]
      }
      if (this.guestReservation) {
        reservation.name = this.guestName
        reservation.type = 'guest'
      }
      if (this.specialReservation) {
        reservation.category = this.specialReservationSelected
        reservation.type = 'special'
      }
      if (this.is_doubles) {
        reservation.type = 'doubles'
      }
      if (this.forSomeoneElse) {
        reservation.type = 'in_behalf'
      }
      if (this.is_group) {
        reservation.type = 'school_group'
      }
      reservation
        .save()
        .then((res) => {
          this.$parent.close()
          if (this.user.membership?.reservation_prepayment && this.court.club.payment_online && !this.isAdmin) {
            this.$emit('mustpay', res)
          } else {
            this.$emit('close')
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste rezervirali teren'),
              type: 'is-success',
            })
          }
          if (this.$store.state.club.id === 26) {
            if (!this.court.reservation_prepayment) {
              this.$router.push(this.localePath('/player/' + this.user.id + '/reservation'))
            } else {
              this.$emit('mustpay', res)
            }
          }

          this.loading = false
        })
        .catch((error) => {
          this.$buefy.toast.open({
            message: this.$t(error.response.data.message),
            type: 'is-danger',
            duration: 5500,
          })
          this.loading = false
        })
    },
  },
}
</script>
