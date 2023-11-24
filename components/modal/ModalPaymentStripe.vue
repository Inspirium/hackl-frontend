<template>
  <div class="modal-confirmation align-self p-b-300">
    <transition name="fade">
      <div>
        <div class="modal-title has-text-light m-b-5">{{ title }}</div>
        <div class="modal-subtitle has-text-light m-b-20">
          {{ subtitle }}
        </div>
        <form id="payment-form">
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

export default {
  name: 'ModalPaymentStripe',
  props: {
    secret: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      title: 'Plaćanje',
      subtitle: 'Unesite podatke za plaćanje',
      is_business_invoice: false,
      isModalPaymentTypeActive: false,
      loading: false,
      pk_test:
        'pk_test_51MifUnGgaVW9n1pvrYTDuaEeXVvmXnOSJDg10czeazT45fdcLf5yoMBKGwdVDdWybgGtqzZuZGno9NeCrDLgLpuo00xTo48QQu',
      pk_live:
        'pk_live_51MifUnGgaVW9n1pvCXTVnWuXickOyE3uqMDG6YFQWRsNo6VchShwPapOAFzZgY8qdLNNDkDaIJQDRPAKlhfSSVyM008Di92lw7',
      elementsOptions: {
        clientSecret: this.secret,
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
    }
  },
  computed: {
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
  mounted() {
    this.getPaymentIntent()
  },
  methods: {
    getPaymentIntent() {
      /* global Stripe */
      this.stripe = Stripe(this.pk_live)
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
