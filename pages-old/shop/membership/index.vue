<template>
  <div v-if="isAdmin && Object.keys(clubNew).length" class="p-b-300">
    <PageHeader :title="$t('Članstvo')" :background="'is-primary'" :hide="true" />
    <div class="activity x-container">
      <TennisImage
        :size="[180, 180]"
        :src="club.logo"
        class="user_image-large-noborder m-r-auto m-l-auto m-t-20 m-b-10"
        alt=""
      />
      <div class="fw600 has-text-centered m-b-10 m-t-20 is-size-5 line-height-19">
        {{ $t('Za učlanjenje u klub, morate kupite članstvo') }}
      </div>
      <div class="activity__reservation m-t-30">
        <div v-for="item in filteredMemberships" :key="item.id" class="activity__box action__buttons m-b-15">
          <nuxt-link class="action__item__small fw600" :to="localePath('/shop/membership/' + item.id)">
            <div class="has-text-centered w100">
              <span v-if="item.subscription?.price || item.price" class="x-tag primary-light m-b-20">
                {{ club.name }}
              </span>

              <div class="is-size-3 has-text-black80 m-r-5 m-b--5">{{ item.name }}</div>
              <span
                v-if="item.subscription?.price || item.price"
                class="is-size-5 has-text-primary m-t-2 flex align__centar__all"
              >
                {{ item.subscription?.price || item.price | currency }}
                <span class="is-size-75 m-l-5"> / {{ item.subscription.interval }}</span>
              </span>
              <div class="flex has-text-left justify-between border-color-black10 p-t-3 m-t-5 align__centar__y">
                <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                  <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-door-closed" />
                  {{ $t('rezervacijaTerena') }}:
                  {{ $t('danaUnaprijed', { max_reservation_span: item.max_reservation_span }) }}
                </div>
              </div>
              <div class="flex has-text-left justify-between border-color-black10 p-t-3 m-t-5 align__centar__y">
                <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                  <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-timer" />
                  {{ $t('rokOtkazivanjaRezervacije') }}:
                  {{ $t('satiRanije', { reservation_cancelable: item.reservation_cancelable }) }}
                </div>
              </div>
              <div
                v-if="item.max_reservation_per_period"
                class="flex has-text-left justify-between border-color-black10 p-t-3 m-t-5 align__centar__y"
              >
                <div class="fw600 is-size-65 has-text-black50 flex align__centar__y">
                  <font-awesome-icon class="m-r-5 has-text-lightblue iw08" icon="fa-light fa-timeline" />
                  {{ $t('Maksimalan broj ativnih rezervacija u satima') }}: {{ item.max_reservation_per_period_days }}
                </div>
              </div>

              <div
                v-if="filteredMemberships.length === 1"
                class="has-text-left is-size-6 content-tiny m-t-20 has-text-black80"
                v-html="item.description"
              ></div>
            </div>
            <span>
              <b-icon
                v-if="filteredMemberships.length > 1"
                icon="chevron-right"
                type="is-black80"
                pack="fal"
                class="m-l-5"
              >
              </b-icon>
            </span>
          </nuxt-link>
          <div class="buttons p-t-10 p-b-10 is-bckg1">
            <b-button
              class="fw600"
              type="is-primary"
              pack="fal"
              icon-right="cart-shopping"
              rounded
              @click="
                isModalMembershipActive = true
                selectedMembership = item
              "
            >
              {{ $t('Kupi') }}
            </b-button>
          </div>
        </div>
      </div>
      <template v-if="isAdmin">
        <div class="buttons m-t-10">
          <b-button
            class="softshadow m-t-10 m-b-10"
            type="is-small noborder"
            icon-right="edit"
            pack="fal"
            rounded
            tag="nuxt-link"
            :to="localePath('/admin/membership/')"
          >
            {{ $t('urediPostojeaLanstva') }}
          </b-button>
        </div>
      </template>
    </div>
    <b-modal :active.sync="isModalDeleteActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('eliTrajnoObrisatiOdabranoLanstvo')"
        :subtitle="$t('Nakon brisanja svi korisnici tog članstva biti će prebačeni na standardno članstvo')"
        @update="deleteMemebership()"
      ></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalMembershipActive" :width="640" class="hidescrollbar" scroll="clip">
      <courtUserPaymentModal
        :membership="selectedMembership"
        @update="isModalMembershipActive = false"
        @cardpayment="cardPayment($event)"
      ></courtUserPaymentModal>
    </b-modal>
    <b-modal :active.sync="showStripe" :width="640" scroll="clip" class="z200">
      <modal-payment-stripe :secret="clientSecret" />
    </b-modal>
  </div>
</template>
<script>
// import _ from 'lodash'
import Membership from '@/models/Membership'
import Club from '@/models/Club'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import PageHeader from '~/components/headers/blankBack'
import courtUserPaymentModal from '~/components/payment/CourtUserPaymentMembershipModal'

export default {
  name: 'BuyMembership',
  components: {
    PageHeader,
    modalConfirmation,
    courtUserPaymentModal,
  },
  layout: 'default',
  data() {
    return {
      showStripe: false,
      isModalMembershipActive: false,
      indicator: {
        steps: 8,
      },
      isModalDeleteActive: false,
      deleteMembershipId: null,
      clientSecret: null,
      selectedMembership: {},
      clubNew: [],
    }
  },
  computed: {
    filteredMemberships() {
      return this.clubNew.memberships.filter((item) => {
        return item.subscription?.status === 'active' && item.subscription?.price
      })
    },
    basicMembership() {
      return this.clubNew.memberships.filter((item) => {
        return item.basic
      })
    },
    // memberships() {
    //   return this.$store.state.club.memberships
    // },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    isAdmin() {
      return this.user.is_admin
    },
  },
  mounted() {
    this.getClubs()
  },
  methods: {
    cardPayment(item) {
      this.clientSecret = item
      this.showStripe = true
    },
    getClubs() {
      Club.include('memberships')
        .find(this.$store.state.club.id)
        .then((res) => {
          this.clubNew = res
        })
    },
    editMembership(item) {
      this.newMembership = this.clubNew.memberships[item]
      this.activeStep = 1
    },
    deleteMemebership() {
      const club = new Club({ id: this.$store.state.club.id })
      const m = new Membership({ id: this.deleteMembershipId }).for(club)
      m.delete().then(() => {
        this.$buefy.toast.open({
          message: this.$t('Uspješno ste obrisali tip članstva'),
          type: 'is-success',
        })
        this.$store.dispatch('club/init_club', { force: true })
      })
    },
    submit(item) {
      const club = new Club(this.$store.state.club)
      this.clubNew.memberships[item].basic = true
      const membership = new Membership(this.clubNew.memberships[item]).for(club)
      membership
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste izmjenili osnovno članstvo'),
            type: 'is-success',
          })
          this.$store.dispatch('club/init_club', { force: true })
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
        })
    },
  },
}
</script>
<style scoped>
p {
  color: #444444 !important;
}
</style>
