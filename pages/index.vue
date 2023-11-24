<template>
  <div class="home p-b-75">
    <div class="ranglist">
      <hero :key="`hero-${club.id}`" page="home" :options="heroImage" :hide-it="true" class="hero_big">
        <div
          class="welcome has-text-white absolute flex align__centar__all"
          @click="$router.push(localePath('/clubs/' + club.id + '/myclub'))"
        >
          {{ $t('dobrodoli') }}
        </div>
        <TennisImage :size="[700, 700]" :src="heroLogo" class="club-logo" alt="" />
      </hero>
    </div>
    <div v-if="isApprovedMemeber"></div>
    <birthday class="" />
    <admin-rain-indicator />
    <div v-if="!isMemberOfTheClub" class="notify cursor" @click.prevent="joinClub">
      <div class="notification-info is-primary">
        <font-awesome-icon
          class="m-t-5 has-text-white transparency-translate"
          icon="fa-light fa-arrow-circle-right"
          size="is-small"
        >
        </font-awesome-icon>
        <div class="has-text-centered is-size-5 has-text-white fw600">
          {{ $t('Prijavi se u klub') }} {{ club.name }}
        </div>
      </div>
    </div>
    <template v-if="isNative">
      <div v-if="!hasSubscription" class="notify" @click.prevent="subscribe()">
        <div class="notification-info is-primary flex align__centar__all">
          <b-icon icon="bell-on" pack="fal" type="is-white" class="m-t--5 m-r-7 is-larger"> </b-icon>
          <div class="has-text-centered is-size-5 has-text-white fw600">
            {{ $t('Primaj notifikacije') }}
          </div>
        </div>
      </div>
    </template>

    <!--    <homeCupTournament-->
    <!--      v-if="club.type === 'tournament'"-->
    <!--      :key="`cuphome-${club.id}`"-->
    <!--      class="m-b&#45;&#45;16"-->
    <!--    ></homeCupTournament>-->
    <template v-if="club.type === 'tournament'">
      <div class="flex aboutclub_box align__centar__x is-bckg align__centar__all">
        <nuxt-link
          :to="localePath('/clubs/' + club.id + '/myclub')"
          type="div"
          class="h100 cursor fw600 p-all-12 is-size-65 line-height-9 flex align__centar__all"
        >
          <b-icon
            style="transition: 0.25s all"
            icon="circle-info"
            size="is-smaller-12"
            type="is-black30 m-r-3"
            pack="fal"
          ></b-icon
          >{{ $t('O klubu') }}
        </nuxt-link>
        <nuxt-link
          :to="localePath('/player/' + user.id)"
          type="div"
          class="h100 cursor fw600 is-size-65 p-all-12 flex flex align__centar__all"
        >
          <b-icon
            style="transition: 0.25s all"
            icon="circle-user"
            size="is-smaller-12"
            type="is-black30 m-r-3"
            pack="fal"
          ></b-icon
          >{{ $t('Moj profil') }}
        </nuxt-link>
        <nuxt-link
          v-if="club.payment_accontation && Object.keys(filterUsersClubWallet).length"
          :to="localePath('/player/' + user.id + '/payments')"
          type="div"
          class="h100 cursor fw600 is-size-65 p-all-12 flex flex align__centar__all"
        >
          <b-icon
            style="transition: 0.25s all"
            icon="circle-euro"
            size="is-smaller-12"
            type="is-black30 m-r-3"
            pack="fal"
          ></b-icon>
          <span
            class="fw600 is-size-65"
            :class="filterUsersClubWallet.amount > 0 ? 'has-text-black80' : 'has-text-danger'"
            >{{ $t('key5', { currency: filterUsersClubWallet.amount }) | currency }}</span
          >
        </nuxt-link>
      </div>
      <div class="home-menu">
        <div class="home-menu-top">
          <div class="">
            <nuxt-link :to="localePath('/courts')" type="div" class="">
              <img src="reservation.svg" alt="" />
              <div v-if="club.type === 'classic'" class="nav__menu">{{ $t('rezervacijaTerena') }}</div>
              <div v-else class="nav__menu">{{ $t('tereni') }}</div>
            </nuxt-link>
          </div>
          <div class="">
            <nuxt-link :to="localePath('/academy')">
              <img src="players.svg" alt="" />
              <div class="nav__menu">{{ $t('korisnici') }}</div>
            </nuxt-link>
          </div>
          <div class="">
            <nuxt-link :to="localePath('/school')">
              <img src="academy.svg" alt="" />
              <div class="nav__menu">{{ $t('Akademija') }}</div>
            </nuxt-link>
          </div>
        </div>
        <div class="home-menu-middle">
          <div class="">
            <nuxt-link :to="localePath('/academy/notes')" class="has-text-black50">
              <b-icon class="m-b-5" pack="fal" icon="pen-field" type="is-black50"> </b-icon>
              <div class="nav__menu">{{ $t('Trenerske napomene') }}</div>
            </nuxt-link>
          </div>
          <div class="">
            <nuxt-link :to="localePath('/messages')" class="has-text-black50">
              <b-icon class="m-b-5" pack="fal" icon="comments" type="is-black50"> </b-icon>
              <div class="nav__menu">{{ $t('poruke') }}</div>
            </nuxt-link>
          </div>
          <div v-show="true">
            <nuxt-link :to="localePath('/notification')" class="has-text-black50">
              <b-icon class="m-b-5" pack="fal" icon="bells" type="is-black50"> </b-icon>
              <div class="nav__menu">{{ $t('obavijesti') }}</div>
            </nuxt-link>
          </div>
        </div>
        <div v-if="$store.state.club.id === 26" class="m-b-20 m-t--5">
          <div v-show="false" class="fw600 is-size-5 has-text-centered m-b-3">{{ $t('pronađi') }}</div>
          <div class="home-menu-middle">
            <div class="has-background-white m-t-3 p-t-10 p-b-5">
              <nuxt-link :to="localePath('/clubs')" type="div" class="flex align__centar__all">
                <img src="clubs.svg" alt="" />
                <div class="nav__menu">{{ $t('klubovi') }}</div>
              </nuxt-link>
            </div>
            <div class="has-background-white m-t-3 p-t-10 p-b-5">
              <nuxt-link :to="localePath('/trainer')" type="div" class="flex align__centar__all">
                <b-icon class="m-b-5" pack="fal" icon="graduation-cap" type="is-black50"> </b-icon>
                <div class="nav__menu">{{ $t('popis trenera') }}</div>
              </nuxt-link>
            </div>
            <div class="has-background-white m-t-3 p-t-10 p-b-5">
              <nuxt-link :to="localePath('/services/stringing/list')" type="div" class="flex align__centar__all">
                <b-icon class="m-b-5" pack="fal" icon="racquet" type="is-black50"> </b-icon>
                <div class="nav__menu">{{ $t('Špananje') }}</div>
              </nuxt-link>
            </div>
          </div>
        </div>

        <!--      <div class="has-text-centered fw600 m-b-5 m-t&#45;&#45;5">Natjecanja</div>-->
        <!--      <div class="home-menu-middle&#45;&#45;competition">-->
        <!--        <div v-if="club.type === 'classic'" class="">-->
        <!--          <nuxt-link :to="localePath('/liga')" class="has-text-black50">-->
        <!--            <img src="liga.svg" class="m-r-10" alt="" />-->
        <!--            <div class="nav__menu">Lige</div>-->
        <!--          </nuxt-link>-->
        <!--        </div>-->
        <!--        <div class="">-->
        <!--          <nuxt-link :to="localePath('/cup')" class="has-text-black50">-->
        <!--            <img src="kup.svg" class="m-r-10" alt="" />-->
        <!--            <div class="nav__menu">Turniri</div>-->
        <!--          </nuxt-link>-->
        <!--        </div>-->
        <!--      </div>-->
      </div>
      <homeShop :key="`shop-${club.id}`" class="m-b-20" />
      <transition name="slidea">
        <div v-if="showAdmin" class="home-menu">
          <div class="activity__header m-b-10">
            <div class="fw600 tranform__center m-t-15">{{ $t('administracija') }}</div>
          </div>
          <div class="home-menu-top">
            <div class="">
              <nuxt-link :to="localePath('/admin/courts')" type="div" class="">
                <img src="/reservation.svg" alt="" />
                <div class="nav__menu">{{ $t('tereni') }}</div>
              </nuxt-link>
            </div>
            <div class="">
              <nuxt-link :to="localePath('/admin/payments')">
                <img src="/payments.svg" alt="" />
                <div class="nav__menu">{{ $t('plaanja') }}</div>
              </nuxt-link>
            </div>
            <div class="">
              <nuxt-link :to="localePath('/admin/membership')">
                <img src="/membership.svg" alt="" />
                <div class="nav__menu">{{ $t('lanstvo2') }}</div>
              </nuxt-link>
            </div>
          </div>
          <div class="home-menu-middle">
            <div class="">
              <nuxt-link :to="localePath('/admin/users')" class="has-text-black50">
                <font-awesome-icon class="m-b-5" icon="fa-light fa-users" size="is-small"> </font-awesome-icon>
                <div class="nav__menu">{{ $t('upravljajKorisnicima') }}</div>
              </nuxt-link>
            </div>
            <div class="">
              <nuxt-link :to="localePath('/admin/club/edit')" class="has-text-black50">
                <font-awesome-icon class="m-b-5" icon="fa-light fa-tools"> </font-awesome-icon>
                <div class="nav__menu">{{ $t('podaciOKlubu') }}</div>
              </nuxt-link>
            </div>
            <!--          <div class="">-->
            <!--            <nuxt-link :to="localePath('/terms')" class="has-text-black50">-->
            <!--              <font-awesome-icon  class="m-b-5"  icon="fa-light fa-chart-pie-alt"> </font-awesome-icon>-->
            <!--              <div class="nav__menu">Izvještaji</div>-->
            <!--            </nuxt-link>-->
            <!--          </div>-->
          </div>
        </div>
      </transition>
      <div v-if="$auth.loggedIn && ($auth.user.is_admin || isCashier) && $store.state.club.id !== 26" class="buttons">
        <b-button
          class="m-l-5 m-t-20 fw600 is-smaller softshadow"
          type="noborder"
          pack="fal"
          size="is-smaller-75"
          icon-right="cog"
          rounded
          @click="$router.push(localeRoute('/admin'))"
        >
          {{ showAdmin ? $t('Sakrij administraciju') : $t('Administracija kluba') }}
        </b-button>
      </div>
      <homeMyLiga :key="`myliga-${club.id}`" class="m-b--16"></homeMyLiga>
      <homeSchool :key="`school-${club.id}`" class="m-b-20"></homeSchool>
      <homeWorkorder :key="`workorder-${club.id}`" class="m-b-20"></homeWorkorder>
      <homeOrder :key="`order-${club.id}`" class="m-b-20"></homeOrder>
      <homeReservations :key="`reservations-${club.id}`" class="m-b--16"></homeReservations>
      <homeMessages :key="`messages-${club.id}`" class="m-t-20"></homeMessages>
      <homeNews :key="`news-${club.id}`" class=""></homeNews>
      <!--    <homeServices class="m-b&#45;&#45;16"></homeServices>-->

      <!--<template v-if="false">
        <homeCup :key="`cup-${club.id}`" class="m-b--16"></homeCup>
      </template>-->
      <homeClassified :key="`classified-${club.id}`" class="m-b--16"></homeClassified>
      <homeSponsors class="m-t-15" />
      <homeRankings
        v-if="club.type === 'classic' && club.hide_ranks"
        :key="`rankings-${club.id}`"
        class="m-b--16"
      ></homeRankings>
      <homeResults :key="`results-${club.id}`" class="m-b--16"></homeResults>
      <homeSchedule :key="`schedule-${club.id}`" class="m-b--16"></homeSchedule>
      <!--<homeCups v-if="false" :key="`cups-${club.id}`"></homeCups>-->
      <!--    <template v-if="$store.state.club.id !== 26">-->
      <!--      <b-modal :active.sync="isModalNotif" :width="640" scroll="clip" class="modal-notif">-->
      <!--        <modalNotif />-->
      <!--      </b-modal>-->
      <!--    </template>-->
      <div v-if="isAdmin" class="classified__empty">
        <div class="empty__box">
          <div class="m-b-10">
            <nuxt-link :to="localePath('/classified')" class="fw600 is-text-center is-size-3 has-text-black80">{{
              $t('klupskeVijesti')
            }}</nuxt-link>
          </div>
          <div class="fw600 is-size-65 m-t-10 m-b-15 is-text-center">
            {{ $t('objaviVijestNa') }}<span><TennisImage :size="[42, 42]" :src="$store.state.club.logo" alt="" /></span
            >{{ $t('klupskojAplikaciji') }}
          </div>
          <div class="buttons m-t-10">
            <b-button
              tag="nuxt-link"
              class="m-b-20 fw600"
              type="is-primary"
              pack="fal"
              icon-right="chevron-right"
              rounded
              :to="localePath('/news/new')"
            >
              {{ $t('objavi') }}
            </b-button>
          </div>
        </div>
        <b-modal :active.sync="isModalActive" :width="640" scroll="clip" class="modal__confirmation">
          <modalConfirmation :title="title" :subtitle="subtitle" @update="deleteConfirmed"></modalConfirmation>
        </b-modal>
        <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip" class="modal__members">
          <modalMembers
            :title="$t('dodajtePartnera')"
            :subtitle="$t('Nakon odabira, odabrani igrač dobiti će obavijest o ovoj rezervaciji')"
            @update="updatePartner"
          ></modalMembers>
        </b-modal>
      </div>
    </template>
    <template v-else>
      <div class="flex aboutclub_box align__centar__x is-bckg align__centar__all">
        <nuxt-link
          :to="localePath('/clubs/' + club.id + '/myclub')"
          type="div"
          class="h100 cursor fw600 p-all-12 is-size-65 line-height-9 flex align__centar__all"
        >
          <b-icon
            style="transition: 0.25s all"
            icon="circle-info"
            size="is-smaller-12"
            type="is-black30 m-r-3"
            pack="fal"
          ></b-icon
          >{{ $t('O klubu') }}
        </nuxt-link>
        <nuxt-link
          :to="localePath('/player/' + user.id)"
          type="div"
          class="h100 cursor fw600 is-size-65 p-all-12 flex flex align__centar__all"
        >
          <b-icon
            style="transition: 0.25s all"
            icon="circle-user"
            size="is-smaller-12"
            type="is-black30 m-r-3"
            pack="fal"
          ></b-icon
          >{{ $t('Moj profil') }}
        </nuxt-link>
        <nuxt-link
          v-if="club.payment_accontation && club.payment_online && filterUsersClubWallet"
          :to="localePath('/player/' + user.id + '/payments')"
          type="div"
          class="h100 cursor fw600 is-size-65 p-all-12 flex flex align__centar__all"
        >
          <b-icon
            style="transition: 0.25s all"
            icon="circle-euro"
            size="is-smaller-12"
            type="is-black30 m-r-3"
            pack="fal"
          ></b-icon>
          <span
            class="fw600 is-size-65"
            :class="filterUsersClubWallet.amount > 0 ? 'has-text-black80' : 'has-text-danger'"
            >{{ $t('key5', { currency: filterUsersClubWallet.amount }) | currency }}</span
          >
        </nuxt-link>
      </div>
      <div class="home-menu">
        <div class="home-menu-top">
          <div class="">
            <nuxt-link :to="localePath('/courts')" type="div" class="">
              <img src="reservation.svg" alt="" />
              <div v-if="club.type === 'classic'" class="nav__menu">{{ $t('rezervacijaTerena') }}</div>
              <div v-else class="nav__menu">{{ $t('tereni') }}</div>
            </nuxt-link>
          </div>
          <div class="">
            <nuxt-link :to="localePath('/player')">
              <img src="players.svg" alt="" />
              <div class="nav__menu">{{ $t('igrai') }}</div>
            </nuxt-link>
          </div>
          <div class="">
            <nuxt-link :to="localePath('/result')">
              <img src="results.svg" alt="" />
              <div class="nav__menu">{{ $t('rezultati') }}</div>
            </nuxt-link>
          </div>
        </div>
        <div class="home-menu-middle">
          <div class="">
            <nuxt-link :to="localePath('doubles')" class="has-text-black50">
              <b-icon class="m-b-5" pack="fal" icon="user-friends" type="is-black50"> </b-icon>
              <div class="nav__menu">{{ $t('parovi') }}</div>
            </nuxt-link>
          </div>
          <div class="">
            <nuxt-link :to="localePath('/schedule')" class="has-text-black50">
              <b-icon class="m-b-5" pack="fal" icon="clock" type="is-black50"> </b-icon>
              <div class="nav__menu">{{ $t('najaveMeeva') }}</div>
            </nuxt-link>
          </div>
          <div v-if="club.type === 'classic' && club.hide_ranks" class="">
            <nuxt-link :to="localePath('/rankings')" class="has-text-black50">
              <b-icon class="m-b-5" pack="fal" icon="trophy" type="is-black50"> </b-icon>
              <div class="nav__menu">{{ $t('rangLjestvica') }}</div>
            </nuxt-link>
          </div>
          <div class="">
            <nuxt-link :to="localePath('/messages')" class="has-text-black50">
              <b-icon class="m-b-5" pack="fal" icon="comments" type="is-black50"> </b-icon>
              <div class="nav__menu">{{ $t('poruke') }}</div>
            </nuxt-link>
          </div>
          <div v-show="false">
            <nuxt-link :to="localePath('/school')" class="has-text-black50">
              <font-awesome-icon class="m-b-5" icon="fa-light fa-university"> </font-awesome-icon>
              <div class="nav__menu">{{ $t('Akademija') }}</div>
            </nuxt-link>
          </div>
        </div>
        <div v-if="$store.state.club.id === 26" class="m-b-20 m-t--5">
          <div v-show="false" class="fw600 is-size-5 has-text-centered m-b-3">{{ $t('pronađi') }}</div>
          <div class="home-menu-middle">
            <div class="has-background-white m-t-3 p-t-10 p-b-5">
              <nuxt-link :to="localePath('/clubs')" type="div" class="flex align__centar__all">
                <img src="clubs.svg" alt="" />
                <div class="nav__menu">{{ $t('klubovi') }}</div>
              </nuxt-link>
            </div>
            <div class="has-background-white m-t-3 p-t-10 p-b-5">
              <nuxt-link :to="localePath('/trainer')" type="div" class="flex align__centar__all">
                <b-icon class="m-b-5" pack="fal" icon="graduation-cap" type="is-black50"> </b-icon>
                <div class="nav__menu">{{ $t('popis trenera') }}</div>
              </nuxt-link>
            </div>
            <div class="has-background-white m-t-3 p-t-10 p-b-5">
              <nuxt-link :to="localePath('/services/stringing/list')" type="div" class="flex align__centar__all">
                <b-icon class="m-b-5" pack="fal" icon="racquet" type="is-black50"> </b-icon>
                <div class="nav__menu">{{ $t('Špananje') }}</div>
              </nuxt-link>
            </div>
          </div>
        </div>

        <!--      <div class="has-text-centered fw600 m-b-5 m-t&#45;&#45;5">Natjecanja</div>-->
        <!--      <div class="home-menu-middle&#45;&#45;competition">-->
        <!--        <div v-if="club.type === 'classic'" class="">-->
        <!--          <nuxt-link :to="localePath('/liga')" class="has-text-black50">-->
        <!--            <img src="liga.svg" class="m-r-10" alt="" />-->
        <!--            <div class="nav__menu">Lige</div>-->
        <!--          </nuxt-link>-->
        <!--        </div>-->
        <!--        <div class="">-->
        <!--          <nuxt-link :to="localePath('/cup')" class="has-text-black50">-->
        <!--            <img src="kup.svg" class="m-r-10" alt="" />-->
        <!--            <div class="nav__menu">Turniri</div>-->
        <!--          </nuxt-link>-->
        <!--        </div>-->
        <!--      </div>-->
      </div>
      <homeShop :key="`shop-${club.id}`" class="m-b-20" />
      <transition name="slidea">
        <div v-if="showAdmin" class="home-menu">
          <div class="activity__header m-b-10">
            <div class="fw600 tranform__center m-t-15">{{ $t('administracija') }}</div>
          </div>
          <div class="home-menu-top">
            <div class="">
              <nuxt-link :to="localePath('/admin/courts')" type="div" class="">
                <img src="/reservation.svg" alt="" />
                <div class="nav__menu">{{ $t('tereni') }}</div>
              </nuxt-link>
            </div>
            <div class="">
              <nuxt-link :to="localePath('/admin/payments')">
                <img src="/payments.svg" alt="" />
                <div class="nav__menu">{{ $t('plaanja') }}</div>
              </nuxt-link>
            </div>
            <div class="">
              <nuxt-link :to="localePath('/admin/membership')">
                <img src="/membership.svg" alt="" />
                <div class="nav__menu">{{ $t('lanstvo2') }}</div>
              </nuxt-link>
            </div>
          </div>
          <div class="home-menu-middle">
            <div class="">
              <nuxt-link :to="localePath('/admin/users')" class="has-text-black50">
                <font-awesome-icon class="m-b-5" icon="fa-light fa-users" size="is-small"> </font-awesome-icon>
                <div class="nav__menu">{{ $t('upravljajKorisnicima') }}</div>
              </nuxt-link>
            </div>
            <div class="">
              <nuxt-link :to="localePath('/admin/club/edit')" class="has-text-black50">
                <font-awesome-icon class="m-b-5" icon="fa-light fa-tools"> </font-awesome-icon>
                <div class="nav__menu">{{ $t('podaciOKlubu') }}</div>
              </nuxt-link>
            </div>
            <!--          <div class="">-->
            <!--            <nuxt-link :to="localePath('/terms')" class="has-text-black50">-->
            <!--              <font-awesome-icon  class="m-b-5"  icon="fa-light fa-chart-pie-alt"> </font-awesome-icon>-->
            <!--              <div class="nav__menu">Izvještaji</div>-->
            <!--            </nuxt-link>-->
            <!--          </div>-->
          </div>
        </div>
      </transition>
      <div v-if="$auth.loggedIn && ($auth.user.is_admin || isCashier) && $store.state.club.id !== 26" class="buttons">
        <b-button
          class="m-l-5 m-t-20 fw600 is-smaller softshadow"
          type="noborder"
          pack="fal"
          size="is-smaller-75"
          icon-right="cog"
          rounded
          @click="$router.push(localeRoute('/admin'))"
        >
          {{ showAdmin ? $t('Sakrij administraciju') : $t('Administracija kluba') }}
        </b-button>
      </div>
      <homeMyLiga :key="`myliga-${club.id}`" class="m-b--16"></homeMyLiga>
      <homeSchool :key="`school-${club.id}`" class="m-b-20"></homeSchool>
      <homeWorkorder :key="`workorder-${club.id}`" class="m-b-20"></homeWorkorder>
      <homeOrder :key="`order-${club.id}`" class="m-b-20"></homeOrder>
      <homeReservations :key="`reservations-${club.id}`" class="m-b--16"></homeReservations>
      <homeMessages :key="`messages-${club.id}`" class="m-t-20"></homeMessages>
      <homeNews :key="`news-${club.id}`" class=""></homeNews>
      <!--    <homeServices class="m-b&#45;&#45;16"></homeServices>-->

      <!--<template v-if="false">
        <homeCup :key="`cup-${club.id}`" class="m-b--16"></homeCup>
      </template>-->
      <homeClassified :key="`classified-${club.id}`" class="m-b--16"></homeClassified>
      <homeSponsors class="m-t-15" />
      <homeRankings
        v-if="club.type === 'classic' && club.hide_ranks"
        :key="`rankings-${club.id}`"
        class="m-b--16"
      ></homeRankings>
      <homeResults :key="`results-${club.id}`" class="m-b--16"></homeResults>
      <homeSchedule :key="`schedule-${club.id}`" class="m-b--16"></homeSchedule>
      <!--<homeCups v-if="false" :key="`cups-${club.id}`"></homeCups>-->
      <!--    <template v-if="$store.state.club.id !== 26">-->
      <!--      <b-modal :active.sync="isModalNotif" :width="640" scroll="clip" class="modal-notif">-->
      <!--        <modalNotif />-->
      <!--      </b-modal>-->
      <!--    </template>-->
      <div v-if="isAdmin" class="classified__empty">
        <div class="empty__box">
          <div class="m-b-10">
            <nuxt-link :to="localePath('/classified')" class="fw600 is-text-center is-size-3 has-text-black80">{{
              $t('klupskeVijesti')
            }}</nuxt-link>
          </div>
          <div class="fw600 is-size-65 m-t-10 m-b-15 is-text-center">
            {{ $t('objaviVijestNa') }}<span><TennisImage :size="[42, 42]" :src="$store.state.club.logo" alt="" /></span
            >{{ $t('klupskojAplikaciji') }}
          </div>
          <div class="buttons m-t-10">
            <b-button
              tag="nuxt-link"
              class="m-b-20 fw600"
              type="is-primary"
              pack="fal"
              icon-right="chevron-right"
              rounded
              :to="localePath('/news/new')"
            >
              {{ $t('objavi') }}
            </b-button>
          </div>
        </div>
        <b-modal :active.sync="isModalActive" :width="640" scroll="clip" class="modal__confirmation">
          <modalConfirmation :title="title" :subtitle="subtitle" @update="deleteConfirmed"></modalConfirmation>
        </b-modal>
        <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip" class="modal__members">
          <modalMembers
            :title="$t('dodajtePartnera')"
            :subtitle="$t('Nakon odabira, odabrani igrač dobiti će obavijest o ovoj rezervaciji')"
            @update="updatePartner"
          ></modalMembers>
        </b-modal>
      </div>
    </template>
    <socialFooter></socialFooter>
  </div>
</template>

<script>
/* eslint-disable */
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'
import ModalNotification from '../components/modal/ModalNotification'
import Player from '~/models/Player'
import Hero from '~/components/Hero'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import modalMembers from '~/components/modal/ModalMembers'
import homeReservations from '~/components/home/HomeReservation'
import homeMessages from '~/components/home/HomeMessages'
import homeNews from '~/components/home/HomeNews'
import homeRankings from '~/components/home/HomeRankings'
import homeSchedule from '~/components/home/HomeSchedule'
import homeSponsors from '~/components/home/HomeSponsors'
import homeResults from '~/components/home/HomeResults'
import homeSchool from '~/components/home/HomeSchool'
import homeShop from '~/components/home/HomeShop'
import homeClassified from '~/components/home/HomeClassified'
import homeCups from '~/components/home/HomeCups'
import homeWorkorder from '~/components/home/HomeWorkorders'
import homeOrder from '~/components/home/HomeOrders'
import homeCupTournament from '~/components/home/HomeCupTournament'
import homeServices from '~/components/home/HomeServices'
import homeCup from '~/components/home/HomeCup'
import homeMyLiga from '~/components/home/HomeMyLiga'
import birthday from '~/components/Birthday'
import socialFooter from '~/components/SocialFooter'
import modalNotif from '~/components/notifications/newStuff'
import cloud from '~/components/admin/Cloud'

export default {
  name: 'Home',
  components: {
    ModalNotification,
    hero: Hero,
    cloud,
    modalConfirmation,
    modalMembers,
    homeReservations,
    homeMessages,
    homeWorkorder,
    homeOrder,
    homeNews,
    homeSchool,
    homeRankings,
    homeSchedule,
    homeResults,
    homeCups,
    homeCupTournament,
    homeServices,
    homeCup,
    homeShop,
    homeMyLiga,
    homeClassified,
    birthday,
    socialFooter,
    TennisImage,
    modalNotif,
    homeSponsors,
  },
  data() {
    return {
      isApprovedMemeber: false,
      title: '',
      subtitle: '',
      heroImage: '/club-brand-image.jpg',
      reservationOptions: false,
      isModalActive: false,
      isModalMembersActive: false,
      selectedPartner: false,
      test: '',
      selectedReservation: false,
      // All active reservation with canceled false (no passed dates of reservation)
      reservations: [],
      // Total user's reservations toll
      total_reservation: 23,
      showAdmin: false,
      isModalNotif: false,
      hasSubscription: false,
    }
  },
  computed: {
    filterUsersClubWallet() {
      return this.$user.wallet(this.user.wallets)
    },
    checkPlatform() {
      if (Capacitor.getPlatform() === 'ios') {
        return 'ios'
      }
      if (Capacitor.getPlatform() === 'android') {
        return 'android'
      }
      return 'web'
    },
    isNative() {
      return Capacitor.isNativePlatform()
    },
    heroLogo() {
      return this.$store.state.club.logo
    },
    canNotify() {
      return Capacitor.isNativePlatform || 'Notification' in window
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    club() {
      return this.$store.state.club
    },
    isMemberOfTheClub() {
      return !!this.user.club_member[this.club.id]
    },
    isCashier() {
      if (!this.user.club_member || !this.user.club_member[this.club.id.toString()]) return false
      return this.user.club_member[this.club.id.toString()].cashier === undefined ? false : this.user.club_member[this.club.id.toString()].cashier === true
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.$auth.fetchUser()
    this.isModalNotifFunc()
    if (Capacitor.isNativePlatform()) {
      PushNotifications.requestPermissions().then((status) => {
        if (status.receive === 'granted') {
          this.hasSubscription = true
        }
      })
      }
  },
  methods: {
    isModalNotifFunc() {
      if (this.user.hidden_notifications === null) {
        this.isModalNotif = true
      }
      if (this.user.hidden_notifications?.globalCourtBooking === true) {
        this.isModalNotif = false
      } else {
        this.isModalNotif = true
      }
    },
    joinClub() {
      if (this.loading) {
        return
      }
      this.loading = true
      this.$root.$loading.start()
      const player = new Player({ id: this.user.id, newMember: this.club.id })
      player
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste se prijavili u novi klub'),
            type: 'is-success',
          })
          this.loading = false
          this.$auth.fetchUser()
          this.$root.$loading.finish()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading = false
          this.$auth.fetchUser()
          this.$root.$loading.finish()
        })
    },
    async subscribe() {
      if (Capacitor.isNativePlatform()) {
        try {
          const status = await PushNotifications.requestPermissions();
          if (status.receive === 'granted') {
            PushNotifications.register();
          }
        } catch (error) {
          console.error('Error while requesting permissions:', error);
        }
      } else {
        try {
          const currentToken = await this.$fire.messaging.getToken({ vapidKey: process.env.FIREBASE_VAPID });
          if (currentToken) {
            await this.$axios.post('v2/notification/subscribe', { token: currentToken });
            this.$store.commit('notifications/setGranted');
          } else {
            this.$buefy.toast.open({
              message: this.$t('Molimo vas da omogućite primanje obaavijesti potvrdom na iskočni prozor'),
              type: 'is-primary',
            });
          }
        } catch (error) {
          console.error('Error while subscribing to notifications:', error);
        }
      }
    },
    // subscribe() {
    //   if (Capacitor.isNativePlatform()) {
    //     PushNotifications.requestPermissions().then((status) => {
    //       if (status.receive === 'granted') {
    //         PushNotifications.register()
    //       }
    //     })
    //   } else {
    //     this.$fire.messaging.getToken({ vapidKey: process.env.FIREBASE_VAPID }).then((currentToken) => {
    //       if (currentToken) {
    //         this.$axios.post('v2/notification/subscribe', { token: currentToken })
    //         this.$store.commit('notifications/setGranted')
    //       } else {
    //         this.$buefy.toast.open({
    //           message: this.$t('Molimo vas da omogućite primanje obaavijesti potvrdom na iskočni prozor'),
    //           type: 'is-primary',
    //         })
    //       }
    //     })
    //   }
    // },
    isSelectedReservation(e) {
      if (this.selectedReservation === e) {
        this.selectedReservation = []
      } else {
        this.selectedReservation = e
      }
    },
    updatePartner(data) {
      this.selectedReservation.partners.push(data)
    },
    isActive(selected) {
      if (_.includes(this.selectedReservation, selected)) {
        return 'active'
      }
    },
    deletePartnerModal(e) {
      this.isModalActive = true
      this.selectedPartner = e
      this.title = 'Jeste li sigurni?'
      this.subtitle = 'Podvrdom ćete obrisati trenutnog partnera'
      this.deleteObject = 'partner'
    },
    deleteReservationModal() {
      this.isModalActive = true
      this.title = 'Jeste li sigurni?'
      this.subtitle = 'Potvrdom ćete poništiti rezervaciju'
      this.deleteObject = 'reservation'
    },
    deleteConfirmed() {
      if (this.deleteObject === 'reservation') {
        this.reservations.splice(this.reservations.indexOf(this.selectedReservation), 1)
      }
      if (this.deleteObject === 'partner') {
        this.selectedReservation.partners.splice(this.selectedReservation.partners.indexOf(this.selectedPartner), 1)
      }
    },
  },
  head() {
    return {
      title: 'Početna'
    }
  }
}
</script>
