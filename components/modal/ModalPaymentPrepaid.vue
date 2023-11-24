<template>
  <div class="modal-confirmation align-self">
    <transition name="fade">
      <div>
        <div class="modal-title has-text-light m-b-5">{{ title }}</div>
        <div class="modal-subtitle has-text-light m-b-20">
          {{ subtitle }}
        </div>
        <ValidationProvider v-slot="{ errors, valid }" name="Iznos" rules="required">
          <b-field
            :label="label"
            class="login__input__container has-text-lightblue"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors"
          >
            <b-input
              ref="input"
              v-model="transaction.amount"
              :placeholder="$t('upiiIznosUplate')"
              type="number"
              rounded
            >
            </b-input>
          </b-field>
        </ValidationProvider>
        <ValidationProvider name="Napomena" rules="required">
          <b-field :label="$t('napomena')" class="login__input__container has-text-lightblue">
            <b-input v-model="transaction.note" :placeholder="$t('upiiNapomenu')" type="text" rounded> </b-input>
          </b-field>
        </ValidationProvider>

        <div class="buttons m-t-20 m-l--5 m-t-30">
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
            @click="addFunds()"
          >
            {{ $t('spremi') }}
          </b-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import _ from 'lodash'
import WalletTransaction from '@/models/WalletTransaction'

export default {
  name: 'ModalPaymentPrepaid',
  props: {
    title: {
      type: String,
      required: true,
      default: 'Tip',
    },
    subtitle: {
      type: String,
      required: false,
      default: 'Podnaslov',
    },
    label: {
      type: String,
      required: true,
      default: '',
    },
    type: {
      type: String,
      required: true,
      default: '',
    },
    user: {
      type: Object,
      required: true,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      isModalPaymentTypeActive: false,
      loading: false,
      transaction: {
        player: this.user,
        note: '',
        amount: null,
      },
    }
  },
  computed: {
    club() {
      return this.$store.state.club
    },
    filterUsersClubWallet() {
      return this.user.wallets.filter((item) => {
        return item.club_id === this.club.id
      })
    },
  },
  mounted() {
    this.focusInput()
  },
  methods: {
    focusInput() {
      this.$refs.input.focus()
    },
    addFunds() {
      this.loading = true
      if (this.user.wallets.length) {
        this.transaction.wallet = this.filterUsersClubWallet[0]
      }
      if (this.type === 'paying') {
        this.transaction.amount = -this.transaction.amount
      }
      const wt = new WalletTransaction(this.transaction)
      wt.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste izvšili plaćanja'),
            type: 'is-success',
          })
          this.loading = false
          this.$emit('update')
          this.$parent.close()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
  },
}
</script>
