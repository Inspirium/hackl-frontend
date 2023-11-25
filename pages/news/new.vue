<template>
  <div class="">
    <hero
      :second="{
        name: $t('news'),
        link: '/news',
      }"
    >
      <h1 class="has-text-white tab__title__hero">{{ $t('objaviVijest') }}</h1>
    </hero>
    <div class="x-container">
      <div class="activity">
        <b-field class="login__input__container" :label="$t('naslovVijesti')">
          <b-input id="title" v-model="title" :placeholder="$t('upiiNaziv')" class="form-control" type="text" rounded>
          </b-input>
        </b-field>
        <div class="label--noindent">{{ $t('fotografija') }}</div>
        <div class="forcefit">
          <photoUpload stencil="rectangle-stencil" :aspect-ratio="1.5" @update="image = $event"></photoUpload>
        </div>
        <div class="label--noindent">{{ $t('tekst') }}</div>
        <!--<b-field>
          <b-input
            id="message"
            v-model="content"
            :placeholder="$t('upiiTekstVijesti')"
            rows="6"
            type="textarea"
          ></b-input>
        </b-field>-->
        <tinymce-editor v-model="content"></tinymce-editor>
        <documentUpload v-if="false" :options="liga" :type="'tournament'" @reload="getLeague"></documentUpload>
        <div class="fw600 has-text-centered m-b-20 is-size-5 m-t-20 line-height-16">
          {{ $t('eliteLiPoslatiPushObavijestSvimLanovimaSPoveznicom') }}
        </div>
        <ValidationProvider name="Funkcija" class="radio__box__center" rules="required">
          <div class="block">
            <b-radio v-model="pushNotif" :native-value="false"> {{ $t('nemojPoslat') }} </b-radio>
            <b-radio v-model="pushNotif" :native-value="true"> {{ $t('poalji') }} </b-radio>
          </div>
        </ValidationProvider>

        <div class="buttons m-t-30 p-b-150">
          <b-button
            class="m-l-10 fw600"
            type="is-primary"
            pack="fal"
            icon-right="check"
            rounded
            @click.prevent="saveNews"
          >
            {{ !pushNotif ? $t('Objavi') : $t('Objavi i pošalji') }}
          </b-button>
        </div>
      </div>
    </div>
    <b-modal :active.sync="isModalConfirmation" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmationLeave
        :title="$t('nisteSpremiliPodatkeSigurnoEliteOtii')"
        :subtitle="$t('Potvrdom će uneseni podaci biti izbrisani')"
        @discardChanges="discardChanges()"
        @closeDialog="closeDialog()"
      ></modalConfirmationLeave>
    </b-modal>
  </div>
</template>

<script>
import { Capacitor } from '@capacitor/core'
import { Camera } from '@capacitor/camera'
import documentUpload from '~/components/documentUpload'
import Hero from '~/components/Hero'
import News from '~/models/News'
import photoUpload from '~/components/photoUpload'
import modalConfirmationLeave from '~/components/modal/ModalConfirmationLeave'

export default {
  name: 'NewsNew',
  components: {
    hero: Hero,
    documentUpload,
    modalConfirmationLeave,
    photoUpload,
  },
  data() {
    return {
      isModalConfirmation: false,
      title: '',
      content: '',
      new_image: null,
      pushNotif: false,
      image: null,
      crop_image: null,
      coordinates: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
      showhide: false,
      loading: false,
      to: null,
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   if (this.to || this.title !== '') {
  //     next()
  //   } else {
  //     this.to = to
  //     this.isModalConfirmation = true
  //   }
  // },
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
          this.image = photo.dataUrl
        }
      } else {
        document.getElementById('fileInput').click()
      }
    },
    reset() {
      this.image = null
      this.new_image = null
    },
    crop() {
      this.loading = true
      const { coordinates, canvas } = this.$refs.cropper.getResult()
      this.coordinates = coordinates
      this.new_image = canvas.toDataURL()
      this.image = canvas.toDataURL()
      this.crop_image = null
      if (this.image !== null) {
        this.loading = false
      }
    },
    uploadImage(event) {
      this.$root.$loading.start()
      this.loading = true
      const input = event.target
      if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.crop_image = e.target.result
        }
        reader.readAsDataURL(input.files[0])
        this.$root.$loading.finish()
        this.loading = false
        this.$auth.fetchUser()
      }
    },
    change({ coordinates, canvas }) {},
    closeDialog() {
      this.isModalConfirmation = false
      this.to = null
    },
    discardChanges() {
      this.isModalConfirmation = false
      this.$router.push(this.to)
    },
    saveNews() {
      if (this.title === '') {
        this.$buefy.toast.open({
          message: this.$t('Morate upisati naslov vijesti'),
          type: 'is-primary',
        })
        return
      }
      this.$root.$loading.start()
      const n = new News({ title: this.title, content: this.content, image: this.image, notif: this.pushNotif })
      n.save()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste objavili vijest'),
            type: 'is-success',
          })
          this.$root.$loading.finish()
          this.$router.push(this.localePath('/news/'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.$root.$loading.finish()
        })
    },
    previewImage(input) {
      if (input.files && input.files[0]) {
        this.image2 = input
        const reader = new FileReader()

        reader.onload = function (e) {
          this.image = e.target.result
        }.bind(this)

        reader.readAsDataURL(input.files[0])
      }
    },
    removeImage() {
      this.image = false
    },
  },
}
</script>

<style scoped></style>
