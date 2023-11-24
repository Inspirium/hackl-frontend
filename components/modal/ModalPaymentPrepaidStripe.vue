<template>
  <div class="modal-confirmation align-self p-b-300">
    <transition name="fade">
      <div>
        <div class="modal-title has-text-light m-b-5">{{ $t(title) }}</div>
        <div class="modal-subtitle has-text-light m-b-20">
          {{ $t(subtitle) }}
        </div>
        <div v-if="isAdmin" class="buttons m-t-30">
          <b-button
            :class="{ softshadow: true, 'invert-small-button': !direct_transfer }"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': !direct_transfer,
            }"
            pack="fal"
            rounded
            @click.prevent="direct_transfer = false"
          >
            {{ $t('card') }}
          </b-button>

          <b-button
            :class="{ softshadow: true, 'invert-small-button': direct_transfer }"
            :type="{
              'is-small': true,
              noborder: true,
              'is-primary has-text-white': direct_transfer,
            }"
            pack="fal"
            rounded
            @click.prevent="direct_transfer = true"
          >
            {{ $t('Izravno na račun') }}
          </b-button>
        </div>

        <ValidationProvider v-slot="{ errors, valid }" name="Iznos" rules="required">
          <b-field
            :label="$t('upiiIznosUplate')"
            class="login__input__container has-text-lightblue"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors"
          >
            <b-input ref="input" v-model="amount" :placeholder="$t('upiiIznosUplate')" type="number" rounded> </b-input>
          </b-field>
        </ValidationProvider>

        <ValidationProvider name="Napomena" rules="required">
          <b-field :label="$t('napomena')" class="login__input__container has-text-lightblue">
            <b-input v-model="note" :placeholder="$t('upiiNapomenu')" type="text" rounded> </b-input>
          </b-field>
        </ValidationProvider>
        <transition name="fade">
          <div v-if="amount && !secret && !direct_transfer" class="buttons m-t-20 m-l--5 m-t-30">
            <b-button
              class="m-l-10 fw600"
              type="is-primary"
              pack="fal"
              icon-right="chevron-right"
              rounded
              @click="getSecret()"
            >
              {{ $t('dalje') }}
            </b-button>
          </div>
        </transition>
        <transition name="fade">
          <div v-if="direct_transfer && amount" class="buttons m-t-20 m-l--5 m-t-30">
            <b-button
              class="m-l-10 fw600"
              type="is-primary"
              pack="fal"
              icon-right="chevron-right"
              rounded
              :loading="loading1"
              @click="addFunds()"
            >
              {{ $t('Uplati') }}
            </b-button>
          </div>
        </transition>
        <form v-show="secret && !direct_transfer" id="payment-form" class="m-t-30">
          <div id="link-authentication-element"></div>
          <div id="payment-element">
            <!-- Elements will create form elements here -->
          </div>
          <div id="error-message">
            <!-- Display error message to your customers here -->
          </div>
          <div class="buttons is-fixed m-t-20 m-l--5 m-t-30">
            <b-button
              class="m-l-10 fw600"
              type="is-danger"
              pack="fal"
              icon-right="times"
              rounded
              @click="$parent.close()"
            >
              {{ $t('otkai') }}
            </b-button>
            <b-button
              class="m-l-10 fw600"
              type="is-primary"
              pack="fal"
              icon-right="chevron-right"
              rounded
              :loading="loading"
              @click="pay"
            >
              {{ $t('plati') }}
            </b-button>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
import { Capacitor } from '@capacitor/core'
import WalletTransaction from '@/models/WalletTransaction'

export default {
  name: 'ModalPaymentStripePrepaid',
  props: {
    player: {
      type: Object,
      required: true,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      title: 'Plaćanje',
      subtitle: 'Unesite podatke za plaćanje',
      is_business_invoice: false,
      direct_transfer: false,
      isModalPaymentTypeActive: false,
      loading: false,
      loading1: false,
      amount: null,
      note: '',
      secret: '',
      pk_test:
        'pk_test_51MifUnGgaVW9n1pvrYTDuaEeXVvmXnOSJDg10czeazT45fdcLf5yoMBKGwdVDdWybgGtqzZuZGno9NeCrDLgLpuo00xTo48QQu',
      pk_live:
        'pk_live_51MifUnGgaVW9n1pvCXTVnWuXickOyE3uqMDG6YFQWRsNo6VchShwPapOAFzZgY8qdLNNDkDaIJQDRPAKlhfSSVyM008Di92lw7',
      elementsOptions: {
        clientSecret: '',
        locale: this.$i18n.locale,
        loader: 'auto',
        appearance: {
          theme: 'night',
          labels: 'floating',
          variables: {
            fontFamily: 'Quicksand, Ideal Sans, system-ui, sans-serif',
            colorPrimary: '#209cee',
            borderRadius: '4px',
          },
        },
      },
      elements: null,
      stripe: null,
      linkAuthenticationElement: null,
      transaction: {
        player: this.player,
        note: '',
        amount: null,
        wallet: null,
      },
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.$store.state.auth.user.is_admin
    },
    club() {
      return this.$store.state.club
    },
    filterUsersClubWallet() {
      return this.player.wallets.filter((item) => {
        return item.club_id === this.club.id
      })
    },
    returnUrl() {
      switch (Capacitor.getPlatform()) {
        case 'android':
          return 'https://app.tenis.plus/payment/finished'
        case 'ios':
          return 'tennisplus://app.tenis.plus/payment/finished'
        default:
          return 'https://' + this.$store.state.club.domain + '/payment/finished'
      }
    },
  },
  methods: {
    addFunds() {
      this.loading1 = true
      if (this.user.wallets.length) {
        this.transaction.wallet = this.filterUsersClubWallet[0]
      }
      const wt = new WalletTransaction({
        player: this.user,
        note: this.note,
        amount: this.amount,
        wallet: this.transaction.wallet,
      })
      wt.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste izvšili plaćanja'),
            type: 'is-success',
          })
          this.loading1 = false
          this.$emit('update')
          this.$parent.close()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading1 = false
        })
    },
    getSecret() {
      this.$axios.post('/v2/stripe/intent', { amount: this.amount, note: this.note }).then((response) => {
        this.secret = response.data.client_secret
        this.getPaymentIntent()
      })
    },
    getPaymentIntent() {
      /* global Stripe */
      this.stripe = Stripe(this.pk_live)
      this.elementsOptions.clientSecret = this.secret
      this.elements = this.stripe.elements(this.elementsOptions)
      this.linkAuthenticationElement = this.elements.create('linkAuthentication', {
        defaultValues: { email: this.$store.state.auth.user.email },
      })
      const paymentElement = this.elements.create('payment', {
        layout: {
          type: 'tabs',
        },
        business: { name: 'Tennis.plus' },
        defaultValues: {
          billingDetails: {
            name: this.$store.state.auth.user.display_name,
            phone: this.$store.state.auth.user.phone,
            email: this.$store.state.auth.user.email,
            address: {
              line1: this.$store.state.auth.user.address,
              city: this.$store.state.auth.user.city,
              country: this.$store.state.auth.user.country,
              postal_code: this.$store.state.auth.user.postal_code,
            },
          },
        },
      })
      this.linkAuthenticationElement.mount('#link-authentication-element')
      paymentElement.mount('#payment-element')
    },
    async pay(event) {
      this.loading = true
      event.preventDefault()
      const { error } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: this.returnUrl,
        },
      })

      if (error) {
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Show error to your customer (for example, payment
        // details incomplete)
        this.loading = false
        const messageContainer = document.querySelector('#error-message')
        messageContainer.textContent = error.message
      } else {
        this.loading = false
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
    },
  },
}
</script>
