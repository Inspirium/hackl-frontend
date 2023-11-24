<template>
  <div class="home p-b-300">
    <div class="ranglist">
      <PageHeader class="m-b-30" :title="$t('administracija')" />
    </div>
    <div class="home-menu">
      <template v-if="user.is_admin">
        <div class="fw600 is-size-55 p-l-15 m-b-3">{{ $t('klub') }}</div>
        <div class="home-menu-middle">
          <div class="">
            <nuxt-link :to="localePath('/admin/courts')" type="div" class="">
              <img src="/reservation.svg" alt="" />
              <div class="nav__menu">{{ $t('tereni') }}</div>
            </nuxt-link>
          </div>
          <div class="">
            <nuxt-link :to="localePath('/admin/workorders')" class="has-text-black50">
              <font-awesome-icon class="m-b-5" icon="fa-light fa-person-digging" />
              <div class="nav__menu">{{ $t('Radni nalozi') }}</div>
            </nuxt-link>
          </div>
          <div class="">
            <nuxt-link :to="localePath('/admin/club/edit')" class="has-text-black50">
              <font-awesome-icon class="m-b-5" icon="fa-light fa-tools" />
              <div class="nav__menu">{{ $t('podaciOKlubu') }}</div>
            </nuxt-link>
          </div>
        </div>
        <div class="fw600 is-size-55 p-l-15 m-b-3">{{ $t('Korisnici') }}</div>
        <div class="home-menu-middle">
          <div class="">
            <nuxt-link :to="localePath('/admin/membership')" class="has-text-black50">
              <font-awesome-icon class="m-b-5" icon="fa-light fa-user-tag" />
              <div class="nav__menu">{{ $t('Vrste članstva') }}</div>
            </nuxt-link>
          </div>

          <div class="">
            <nuxt-link :to="localePath('/admin/users')" class="has-text-black50">
              <font-awesome-icon class="m-b-5" icon="fa-light fa-users" />
              <div class="nav__menu">{{ $t('upravljajKorisnicima') }}</div>
            </nuxt-link>
          </div>
        </div>
        <div class="fw600 is-size-55 p-l-15 m-b-3">{{ $t('financije') }}</div>
        <div class="home-menu-middle">
          <div class="">
            <nuxt-link :to="localePath('/admin/payments')" class="has-text-black50">
              <font-awesome-icon class="m-b-5" icon="fa-light fa-sack-dollar" />
              <div class="nav__menu">{{ $t('acc') }}</div>
            </nuxt-link>
          </div>
          <div class="">
            <nuxt-link :to="localePath('/admin/invoices')" class="has-text-black50">
              <font-awesome-icon class="m-b-5" icon="fa-light fa-file-invoice-dollar" />
              <div class="nav__menu">{{ $t('Računi') }}</div>
            </nuxt-link>
          </div>
          <div class="">
            <nuxt-link :to="localePath('/admin/business')" class="has-text-black50">
              <font-awesome-icon class="m-b-5" icon="fa-light fa-file-invoice" />
              <div class="nav__menu">{{ $t('Podaci o računu') }}</div>
            </nuxt-link>
          </div>
        </div>
        <div class="home-menu-middle m-t--16">
          <div v-if="user.id === 2" class="">
            <nuxt-link :to="localePath('/admin/subscriptions')" class="has-text-black50">
              <font-awesome-icon class="m-b-5" icon="fa-light fa-arrows-repeat" />
              <div class="nav__menu">{{ $t('Članarine') }}</div>
            </nuxt-link>
          </div>
          <div v-if="user.id === 2" class="">
            <nuxt-link :to="localePath('/admin/subscriptions/pending')" class="has-text-black50">
              <font-awesome-icon class="m-b-5" icon="fa-light fa-alarm-clock" />
              <div class="nav__menu">{{ $t('Računi u najavi') }}</div>
            </nuxt-link>
          </div>
          <div v-if="user.id === 2" class="">
            <nuxt-link :to="localePath('/admin/subscriptions/list')" class="has-text-black50">
              <font-awesome-icon class="m-b-5" icon="fa-light fa-rectangle-list" />
              <div class="nav__menu">{{ $t('Ponude') }}</div>
            </nuxt-link>
          </div>
        </div>
      </template>

      <template v-if="user.is_admin || isCashier">
        <!--      <div class="activity__header m-l-15">-->
        <!--        <nuxt-link :to="localePath('/admin')" class="fw600">{{ $t('Rezervacije') }}</nuxt-link>-->
        <!--      </div>-->
        <template>
          <div class="fw600 is-size-55 p-l-15 m-b-3">{{ $t('Rezervacije') }}</div>
          <div class="home-menu">
            <div class="home-menu-middle m-b--0">
              <div class="">
                <nuxt-link :to="localePath('/admin/reservation')" class="has-text-black50">
                  <font-awesome-icon class="m-b-5" icon="fa-light fa-calendar-range" />
                  <div class="nav__menu">{{ $t('Popis rezervacija') }}</div>
                </nuxt-link>
              </div>
              <div class="">
                <nuxt-link :to="localePath('/admin/weather')" class="has-text-black50">
                  <font-awesome-icon class="m-b-5" icon="fa-light fa-cloud-drizzle" />
                  <div class="nav__menu">{{ $t('Vremenske neprilike') }}</div>
                </nuxt-link>
              </div>
            </div>
            <div class="home-menu-middle">
              <div class="">
                <nuxt-link :to="localePath('/admin/reports/reservations')" class="has-text-black50">
                  <font-awesome-icon class="m-b-5" icon="fa-light fa-calendar" />
                  <div class="nav__menu">{{ $t('Najviše rezervacija') }}</div>
                </nuxt-link>
              </div>
              <div class="">
                <nuxt-link :to="localePath('/admin/reports/reservationCancelations')" class="has-text-black50">
                  <font-awesome-icon class="m-b-5" icon="fa-light fa-ban" />
                  <div class="nav__menu">{{ $t('Najviše otkazivanje') }}</div>
                </nuxt-link>
              </div>
              <div class="">
                <nuxt-link :to="localePath('/admin/reports/reservationLastCancelations')" class="has-text-black50">
                  <font-awesome-icon class="m-b-5" icon="fa-light fa-calendar-circle-minus" />
                  <div class="nav__menu">{{ $t('Posljednja otkazivanja') }}</div>
                </nuxt-link>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-if="user.is_admin">
        <div class="fw600 is-size-55 p-l-15 m-b-3">{{ $t('proizvodiIUsluge') }}</div>
        <div class="home-menu-middle">
          <div class="">
            <nuxt-link :to="localePath('/shop')" class="has-text-black50">
              <font-awesome-icon class="m-b-5" icon="fa-light fa-basket-shopping" />
              <div class="nav__menu">{{ $t('proizvodi') }}</div>
            </nuxt-link>
          </div>
          <div class="">
            <nuxt-link :to="localePath('/services')" class="has-text-black50">
              <font-awesome-icon class="m-b-5" icon="fa-light fa-lightbulb-on" />
              <div class="nav__menu">{{ $t('usluge') }}</div>
            </nuxt-link>
          </div>
          <div class="">
            <nuxt-link :to="localePath('/services/stringing')" class="has-text-black50">
              <font-awesome-icon class="m-b-5" icon="fa-light fa-racquet" />
              <div class="nav__menu">{{ $t('Špananje') }}</div>
            </nuxt-link>
          </div>
        </div>
        <div class="home-menu-middle m-t--16">
          <div class="">
            <nuxt-link :to="localePath('/admin/orders')" class="has-text-black50">
              <font-awesome-icon class="m-b-5" icon="fa-light fa-barcode-read" />
              <div class="nav__menu">{{ $t('narudbe') }}</div>
            </nuxt-link>
          </div>
        </div>
      </template>
    </div>
    <div v-if="user.id === 2" class="fw600 is-size-55 p-l-15 m-b-3">{{ $t('Izvještaji') }}</div>
    <div v-if="user.id === 2" class="home-menu-middle">
      <div class="">
        <nuxt-link :to="localePath('/admin/reports')" class="has-text-black50">
          <font-awesome-icon class="m-b-5" icon="fa-light fa-chart-line" />
          <div class="nav__menu">{{ $t('izvjetaji') }}</div>
        </nuxt-link>
      </div>
    </div>

    <template v-if="user.id === 1 || user.id === 2">
      <div class="activity__header m-l-15">
        <nuxt-link :to="localePath('/admin')" class="fw600">{{ $t('superadmin') }}</nuxt-link>
      </div>
      <div class="home-menu">
        <div class="home-menu-middle">
          <div class="">
            <nuxt-link :to="localePath('/superadmin/users')" class="has-text-black50">
              <font-awesome-icon class="m-b-5" icon="fa-light fa-users" />
              <div class="nav__menu">{{ $t('korisnici') }}</div>
            </nuxt-link>
          </div>
          <div class="">
            <nuxt-link :to="localePath('/superadmin')" class="has-text-black50">
              <font-awesome-icon class="m-b-5" icon="fa-light fa-tools" />
              <div class="nav__menu">{{ $t('klubovi') }}</div>
            </nuxt-link>
          </div>
          <div class="">
            <nuxt-link :to="localePath('/superadmin/multiteam')" class="has-text-black50">
              <font-awesome-icon class="m-b-5" icon="fa-light fa-user-plus" />
              <div class="nav__menu">{{ $t('multiTimovi') }}</div>
            </nuxt-link>
          </div>
          <div class="">
            <nuxt-link :to="localePath('/superadmin/tax')" class="has-text-black50">
              <font-awesome-icon class="m-b-5" icon="fa-light fa-money-bill" />
              <div class="nav__menu">{{ $t('Porezi') }}</div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import PageHeader from '~/components/headers/blankBack'

export default {
  name: 'Home',
  components: {
    PageHeader,
  },
  data() {
    return {
      heroImage: '/club-brand-image.jpg',
      title: '',
      subtitle: '',
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
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
  },
  methods: {
    isCashier() {
      if (!this.user.club_member || !this.user.club_member[this.club.id.toString()]) return false
      return this.user.club_member[this.club.id.toString()].cashier === undefined
        ? false
        : this.user.club_member[this.club.id.toString()].cashier === true
    },
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
}
</script>
