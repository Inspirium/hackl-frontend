<template>
  <div :class="isMobile ? 'mobile-uppy' : 'desktop-uppy'">
    <Dashboard :uppy="uppy" />
  </div>
</template>

<script>
import { Uppy } from '@uppy/core'
import { Dashboard } from '@uppy/vue'
import Tus from '@uppy/tus'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import Vimeo from '~/plugins/uppy/vimeo.js'
export default {
  name: 'VideoUpload',
  components: { Dashboard },
  data() {
    return {}
  },
  computed: {
    isMobile() {
      return window.innerWidth <= 768
    },
    uppy() {
      const accessToken = this.$store.state.club.club_socials[0]?.data.access_token
      return new Uppy({
        id: 'uppy',
        autoProceed: false,
        debug: true,
        restrictions: { maxFileSize: 10000000000, allowedFileTypes: ['video/*'] },
        proudlyDisplayPoweredByUppy: false,
      })
        .use(Tus, {})
        .use(Vimeo, {
          accessToken,
        })
        .on('complete', (result) => {
          if (result.successful.length > 0) {
            for (let i = 0; i < result.successful.length; i++) {
              this.$emit('videoUploaded', result.successful[0].uploadURL)
            }
          }
        })
    },
  },
}
</script>
<style>
.mobile-uppy {
  /* CSS styles for mobile layout */
  max-width: 100%;
}

.desktop-uppy {
  /* CSS styles for desktop layout */
  max-width: 800px; /* Adjust the maximum width as needed */
  margin: 0 auto; /* Center the Uppy component on larger screens */
}
</style>
