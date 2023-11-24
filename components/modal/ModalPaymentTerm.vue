<template>
  <div v-if="isLoaded" class="modal-confirmation">
    <transition name="fade">
      <div>
        <div class="modal-title has-text-light m-b-20">{{ title }}</div>
        <div v-if="result.payment_date !== null" class="fw600 is-size-6 m-l-5 m-t-20 m-b-5 has-text-white">
          <span class="has-text-lightblue">{{ $t('datumUplate') }} </span
          >{{ $moment(result.payment_date).format('dddd' + ', ' + 'DD' + '.' + 'MM' + '.') }}
        </div>
        <div v-if="result.payment_user !== null" class="align__centar__y m-t-10">
          <div class="fw600 is-size-6 m-l-5 has-text-lightblue">{{ $t('unos') }}</div>
          <TennisImage
            :size="[42, 42]"
            class="user_image-small m-r-10 m-l-10 border__white--2"
            :src="result.payment_user.image"
          />
          <div class="player__name is-size-6 has-text-white">
            {{ result.payment_user.display_name }}
          </div>
        </div>
        <ValidationProvider v-slot="{ errors }" name="Broj fiskalnog računa">
          <div class="fw600 is-size-6 m-l-5 m-t-10 m-b-5 has-text-lightblue">{{ $t('brojFiskalnogRauna') }}</div>
          <b-field
            class="login__input__container has-text-lightblue"
            :type="{ 'is-danger': errors[0] }"
            :message="errors"
          >
            <b-input v-model="payment_invoice" :placeholder="$t('unesiBrojRauna')" type="text" rounded> </b-input>
          </b-field>
        </ValidationProvider>
        <div class="fw600 is-size-6 m-l-5 m-t-20 m-b-5 has-text-lightblue">{{ $t('napomena') }}</div>
        <ValidationProvider v-slot="{ errors }" name="Napomena">
          <b-field class="login__input__container has-text-lightblue" :message="errors">
            <b-input v-model="payment_note" :placeholder="$t('napomena')" type="text" rounded> </b-input>
          </b-field>
        </ValidationProvider>
        <!--        <div class="fw600 is-size-6 m-l-5 m-t-20 m-b-5 has-text-lightblue">Plaćena rezervacija</div>-->
        <!--        <ValidationProvider v-slot="{ errors, valid }" name="Uplata" class="radio__box">-->
        <!--          <div class="block">-->
        <!--            <b-radio v-model="is_paid" :type="valid ? 'is-success' : 'is-danger'" native-value="false">-->
        <!--              Nije plaćeno-->
        <!--            </b-radio>-->
        <!--            <b-radio v-model="is_paid" :type="valid ? 'is-success' : 'is-danger'" native-value="true">-->
        <!--              Plaćeno-->
        <!--            </b-radio>-->
        <!--          </div>-->
        <!--        </ValidationProvider>-->

        <div v-if="isDelete" class="buttons m-t-20 m-l--5 m-t-30">
          <b-button
            class="m-l-10 fw600"
            type="is-danger"
            pack="fal"
            icon-right="times"
            rounded
            @click="$parent.close()"
          >
            {{ $t('zatvori') }}
          </b-button>
          <b-button
            class="m-l-10 fw600"
            type="is-primary"
            pack="fal"
            icon-right="chevron-right"
            rounded
            @click="addPayment()"
          >
            {{ $t('spremi') }}
          </b-button>
        </div>
        <div v-if="term.is_paid" class="buttons m-t-20 m-l--5 m-t-30">
          <b-button
            class="m-l-10 fw600"
            type="is-danger"
            pack="fal"
            icon-right="times"
            rounded
            @click="deletePayment()"
          >
            {{ $t('obriiUplatu') }}
          </b-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'

import Reservation from '~/models/Reservation'

export default {
  name: 'ModalPaymentType',
  components: {
    TennisImage,
  },
  props: {
    title: {
      type: String,
      required: true,
      default: 'Tip',
    },
    term: {
      type: Object,
      required: true,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      isLoaded: false,
      edit: false,
      is_paid: false,
      payment_invoice: null,
      payment_note: null,
      result: {},
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isDelete() {
      if (!this.edit) {
        return true
      }
      return false
    },
  },
  watch: {
    payment_invoice() {
      if (this.payment_invoice === '') {
        this.is_paid = false
      } else {
        this.is_paid = true
      }
    },
  },
  mounted() {
    this.getResults()
  },
  methods: {
    getResults() {
      Reservation.find(this.term.id).then((res) => {
        this.result = res
        this.isLoaded = true
        if (res.payment_invoice !== null) {
          this.edit = true
          this.payment_note = res.payment_note
        }
        this.is_paid = res.is_paid
        this.payment_invoice = res.payment_invoice
      })
    },
    deletePayment() {
      const r = new Reservation({
        id: this.term.id,
        payment_invoice: null,
        payment_user: {},
        payment_note: null,
        is_paid: false,
      })
      r.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste unijeli podatke o plaćanju'),
            type: 'is-success',
          })
          this.$emit('update')
          this.$parent.close()
        })
        .catch(() => {
          this.$parent.close()
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
        })
    },
    addPayment() {
      const r = new Reservation({
        id: this.term.id,
        payment_invoice: this.payment_invoice === '' ? null : this.payment_invoice,
        payment_note: this.payment_note,
        is_paid: this.is_paid,
      })
      r.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste unijeli podatke o plaćanju'),
            type: 'is-success',
          })
          this.$emit('update')
          this.$parent.close()
        })
        .catch(() => {
          this.$parent.close()
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
        })
    },
  },
}
</script>
