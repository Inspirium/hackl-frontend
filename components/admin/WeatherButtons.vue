<template>
  <div class="buttons">
    <b-button
      v-if="!club.weather"
      class="m-b-0 softshadow"
      type="is-small noborder"
      pack="fal"
      icon-right="cloud-showers-heavy"
      rounded
      :loading="loadingWeather"
      @click.prevent="openModal('on')"
    >
      {{ $t('prekidIgre') }}
    </b-button>
    <b-button
      v-else
      class="m-b-10 softshadow"
      type="is-primary"
      pack="fal"
      icon-right="sun-bright"
      rounded
      :loading="loadingWeather"
      @click.prevent="openModal('off')"
    >
      {{ $t('nastavakIgre') }}
    </b-button>
    <b-button
      v-if="user.id === 2"
      class="m-b-10 softshadow"
      type="is-small noborder"
      pack="fal"
      icon-right="sun-bright"
      rounded
      :loading="loadingWeather"
      @click.prevent="weatherSave()"
    >
      {{ $t('Označi prekid') }}
    </b-button>
    <b-modal :active.sync="modalWeather" :action="action" :width="640" scroll="clip" class="hidescrollbar">
      <modalWeather @update="sendUpdate()" />
    </b-modal>
  </div>
</template>

<script>
import Club from '~/models/Club'

export default {
  name: 'WeatherButtons',
  data() {
    return {
      modalWeather: false,
      action: false,
      loadingWeather: false,
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
    sendUpdate() {
      setTimeout(this.send, 500)
    },
    send() {
      this.$emit('update')
    },
    openModal(action) {
      this.action = action
      this.modalWeather = true
    },
    weatherSave() {
      const c = new Club({
        id: this.club.id,
        weather: this.club.weather ? 'off' : 'open',
        weather_message: '',
      })
      c.save().then(() => {
        this.$store.dispatch('club/init_club', { force: true })
      })
    },
  },
}
</script>
