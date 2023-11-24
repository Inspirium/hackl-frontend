<template>
  <div v-if="true" class="builder hero-photo-cropper">
    <div class="mw900">
      <div v-show="crop_image" class="buttons">
        <b-button
          class="is-smaller m-t-10 m-t-30 m-b-15"
          type="is-danger"
          icon-right="times"
          pack="fal"
          rounded
          @click="crop_image = null"
        >
          {{ $t('otkai') }}
        </b-button>
        <b-button
          class="is-smaller m-t-10 m-t-30 m-b-15 border__white"
          type="is-primary"
          icon-right="check"
          pack="fal"
          rounded
          :loading="loading"
          @click="crop"
        >
          {{ $t('spremiSliku') }}
        </b-button>
      </div>

      <cropper
        ref="cropper"
        class="cropper"
        :stencil-component="stencil"
        :src="crop_image"
        :canvas="{
          width: 1024,
          height: 1024,
          maxHeight: 1024,
          maxWidth: 1024,
        }"
        :stencil-props="{
          aspectRatio: aspectRatio,
        }"
        @change="change"
      ></cropper>
      <div v-show="image" class="align__centar__all flex__column">
        <img v-if="stencil === 'circle-stencil'" :src="image" class="user_image-large m-b-15" alt="" />
        <img v-else :src="image" class="m-b-15 softshadow radius__5" alt="" />
        <b-button class="is-smaller" type="is-danger" rounded @click="reset"> {{ $t('ukloniSliku') }} </b-button>
      </div>
      <div
        v-show="image === null && crop_image === null"
        class="hero-photo-icon absolute align__centar__all flex__column buttons center--transform"
        @click="chooseFiles()"
      >
        <b-icon class="" icon="camera" size="is-smaller" type="is-white" pack="fal"> </b-icon>
        <span class="button hide">
          <input id="fileInput" ref="file" type="file" accept="image/*" @change="uploadImage($event)" />
          {{ $t('uploadImage') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'
import { Capacitor } from '@capacitor/core'
import { Camera } from '@capacitor/camera'
import 'vue-advanced-cropper/dist/style.css'

export default {
  name: 'ImageUpload',
  components: {
    Cropper,
  },
  props: {
    stencil: {
      type: String,
      required: false,
      default: 'circle-stencil',
    },
    aspectRatio: {
      type: Number,
      required: false,
      default: 1,
    },
    edit: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      image: null,
      crop_image: null,
      coordinates: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
    }
  },
  methods: {
    async chooseFiles() {
      if (Capacitor.isNativePlatform()) {
        const permission = await Camera.checkPermissions()
        if (permission.photos === 'prompt') {
          await Camera.requestPermissions()
        }
        if (permission.photos === 'granted') {
          // have permission handle
          const photo = await Camera.getPhoto({
            width: 1024,
            height: 1024,
            quality: 80,
            resultType: 'dataUrl',
          })
          this.crop_image = photo.dataUrl
        }
      } else {
        document.getElementById('fileInput').click()
      }
    },
    reset() {
      this.image = null
      this.$emit('update', this.image)
    },
    crop() {
      const { coordinates, canvas } = this.$refs.cropper.getResult()
      this.coordinates = coordinates
      this.image = canvas.toDataURL()
      this.crop_image = null
      this.$emit('update', this.image)
      this.image = null
    },
    uploadImage(event) {
      this.$root.$loading.start()
      const input = event.target
      if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.crop_image = e.target.result
        }
        reader.readAsDataURL(input.files[0])
        this.$root.$loading.finish()
      }
    },
    change({ coordinates, canvas }) {},
  },
}
</script>
<style scoped>
.cropper {
  height: auto;
  margin: 0 auto;
  width: 100vw;
}
</style>
