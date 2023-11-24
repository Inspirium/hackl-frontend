<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { Capacitor } from '@capacitor/core'
import { Geolocation } from '@capacitor/geolocation'

export default {
  name: 'GeoLocation',
  data() {
    return {
      permission: null,
      location: {
        latitude: null,
        longitude: null,
      },
    }
  },
  computed: {},
  watch: {
    location: {
      deep: true,
      handler() {
        if (this.location.latitude && this.location.longitude) {
          this.sendLocation()
        }
      },
    },
    permission: {
      handler() {
        if (this.permission === PermissionState.DENIED) {
          this.emitUpdateAndSendLocation()
        }
      },
    },
  },
  mounted() {
    this.fetchLocationPermission()
  },
  methods: {
    async fetchLocationPermission() {
      try {
        if (Capacitor.getPlatform() === 'web') {
          if (navigator.permissions) {
            const result = await navigator.permissions.query({ name: 'geolocation' })
            this.permission = result.state
            if (this.permission === PermissionState.GRANTED) {
              await this.fetchLocation()
              this.emitUpdateAndSendLocation()
            } else {
              this.emitUpdate()
            }
          }
        } else {
          const result = await Geolocation.requestPermissions()
          if (Capacitor.getPlatform() === 'ios') {
            this.permission = result.granted
          } else if (Capacitor.getPlatform() === 'android') {
            this.permission = result.location
          }
        }
      } catch (error) {
        console.error('Error while fetching location permission:', error)
      }
    },
    async fetchLocation() {
      try {
        if (Capacitor.getPlatform() === 'web') {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject)
          })
          this.location.latitude = position.coords.latitude
          this.location.longitude = position.coords.longitude
        } else {
          const coordinates = await Geolocation.getCurrentPosition()
          this.location = coordinates.coords
        }
      } catch (error) {
        console.error('Error while fetching location:', error)
      }
    },
    sendLocation() {
      this.$emit('location', this.location)
    },
    emitUpdate() {
      this.$emit('update')
    },
    emitUpdateAndSendLocation() {
      this.emitUpdate()
      this.sendLocation()
    },
  },
}

// Constants for permission states
const PermissionState = {
  GRANTED: 'granted',
  DENIED: 'denied',
  PROMPT: 'prompt',
}
</script>
