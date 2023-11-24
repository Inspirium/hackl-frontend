<template>
  <div class="modal-confirmation">
    <transition name="fade">
      <div v-show="!isConfirmation">
        <div class="modal-title has-text-light m-b-5">{{ title }}</div>
        <div class="modal-subtitle has-text-primary m-b-20 m-t-10 is-size-5">
          {{ subtitle }}
        </div>
        <div class="buttons m-t-30">
          <b-button size="is-large" type="is-danger" rounded @click="$parent.close()">
            {{ $t('ne') }}
          </b-button>
          <b-button type="is-primary" size="is-large" rounded @click="send()"> {{ $t('da') }} </b-button>
        </div>
        <div v-if="ispaid && clubPaymentBoth" class="modal-subtitle has-text-primary m-b-20 m-t-20 is-size-55">
          <div class="empty_red_empty has-text-centered has-text-white">
            <div class="fw600 has-text-centered">
              {{ $t('Povrat novca izvršiti će se na vaš akontacijski račun u klubu') }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import _ from 'lodash'

export default {
  name: 'ModalConfirmation',
  props: {
    title: {
      type: String,
      required: true,
      default: 'Tip',
    },
    subtitle: {
      type: String,
      required: false,
      default: '',
    },
    ispaid: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      isConfirmation: false,
    }
  },
  computed: {
    clubPaymentBoth() {
      return this.club.payment_accontation === 1 && this.club.payment_online === 1
    },
    club() {
      return this.$store.state.club
    },
  },
  methods: {
    send() {
      this.$emit('update', {
        confirm: this.isConfirmation,
      })
      this.$parent.close()
    },
  },
}
</script>
