<template>
  <div class="builder custom-cropper-width">
    <div>
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
      <div class="buttons">
        <b-button
          v-show="crop_image"
          class="softshadow m-t-20 save-photo-pulse"
          type="is-success"
          icon-right="check"
          pack="fal"
          rounded
          :loading="loading"
          @click="crop"
        >
          {{ $t('spremiSliku') }}
        </b-button>
      </div>
      <div v-show="image" class="align__centar__all flex__column">
        <img v-if="stencil === 'circle-stencil'" :src="image" class="user_image-large m-b-15" alt="" />
        <img v-else :src="image" class="m-b-15 softshadow radius__5 max-w-500" alt="" />
        <b-button class="is-smaller" type="is-danger" pack="fal" icon-right="times" rounded @click="reset">
          {{ $t('ukloniSliku') }}
        </b-button>
      </div>
      <div
        v-show="image === null && crop_image === null"
        class="user_image-large align__centar__all flex__column buttons center--transform"
        @click="chooseFiles()"
      >
        <b-icon class="" icon="camera" size="is-large" type="is-lightblue" pack="fal"> </b-icon>
        <b-button class="is-smaller m-t-10" type="is-primary" rounded> {{ $t('postaviSliku') }} </b-button>
        <span class="button hide">
          <input :id="fileinput" ref="file" type="file" accept="image/*" @change="uploadImage($event)" />
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
    fileinput: {
      type: String,
      required: false,
      default: 'fileinput',
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
  watch: {
    crop_image: {
      handler() {
        if (this.crop_image) {
          this.$emit('isEditing', true)
        } else {
          this.$emit('isEditing', false)
        }
      },
    },
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
        document.getElementById(this.fileinput).click()
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
  width: 90vw;
}
</style>
