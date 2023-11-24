<template>
  <div v-if="isModalNotif" class="has-text-centered">
    <transition name="fade">
      <div class="modal-notif-content">
        <div class="has-text-black80 fw600 is-size-3">{{ user.first_name }},</div>
        <div class="has-text-danger fw600 m-b-5 m-t-5 is-size-5">{{ $t('Notif.Imamo sjajnu vijest!') }}</div>
        <div class="has-text-black80 fw500 m-b-20 m-t-10 is-size-6">
          {{ $t('Notif.general court') }}
        </div>
        <div class="buttons m-t-30">
          <div class="close-button m-r-10" @click="closeIt()">
            <b-icon icon="times" pack="fal" type="is-white" class="is-smaller"> </b-icon>
          </div>
          <b-button type="is-primary" icon-right="chevron-right" size="is-medium" rounded @click="submit()">
            {{ $t('Isprobaj') }}
          </b-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import _ from 'lodash'
import { Capacitor } from '@capacitor/core'

export default {
  name: 'NewStuff',
  // props: {
  //   title: {
  //     type: String,
  //     required: false,
  //     default: 'Tip',
  //   },
  //   subtitle: {
  //     type: String,
  //     required: false,
  //     default: '',
  //   },
  // },
  data() {
    return {
      isConfirmation: false,
      isModalNotif: false,
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
  mounted() {
    this.isModalNotifFunc()
  },
  methods: {
    closeIt() {
      this.hideNottif()
      this.$parent.close()
    },
    hideNottif() {
      this.$axios.post('v2/user/popups', { notification: 'globalCourtBooking' })
    },
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
    submit() {
      this.hideNottif()
      if (Capacitor.getPlatform() === 'web') {
        window.location.href = `https://my.tenis.plus`
      } else {
        this.$store.commit('club/setId', 26)
        this.$store.dispatch('club/init_club', { force: true })
      }
    },
  },
}
</script>
