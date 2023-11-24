<template>
  <ValidationObserver v-slot="{ invalid }">
    <form class="p-b-150 m-t-15 registration x-container" @submit.prevent="onSubmit">
      <!--          <div class="title has-text-white m-t-10">Popuni podatke</div>-->
      <div class="form-group align__centar__y flex__column">
        <cropper
          ref="cropper"
          class="cropper"
          stencil-component="circle-stencil"
          :src="new_image"
          :canvas="{
            width: 1024,
            height: 1024,
            maxHeight: 1024,
            maxWidth: 1024,
          }"
          :stencil-props="{
            aspectRatio: 1,
          }"
          @change="change"
        ></cropper>
        <b-button
          v-show="new_image"
          icon-right="check"
          pack="fal"
          class="m-t-10"
          type="is-primary"
          rounded
          @click="crop"
        >
          {{ $t('spremiSliku') }}
        </b-button>
        <div v-show="newUser.image" class="align__centar__y flex__column">
          <img :size="[180, 180]" :src="newUser.image" class="user_image-large m-b-15" alt="" />
          <b-button class="is-smaller m-t-10" type="is-danger" icon-right="times" rounded @click="reset">
            {{ $t('ukloniSliku') }}
          </b-button>
        </div>
        <div
          v-show="!new_image && !newUser.image"
          class="user_image-large align__centar__all flex__column buttons"
          @click="chooseFiles"
        >
          <b-icon class="" icon="camera" size="is-large" type="is-lightblue" pack="fal"> </b-icon>
          <b-button class="is-smaller m-t-10" type="is-primary" rounded> {{ $t('postaviSliku') }} </b-button>
          <span class="button hide">
            <input id="fileInput" ref="file" type="file" accept="image/*" @change="uploadImage($event)" />
            {{ $t('uploadImage') }}
          </span>
        </div>
        <div class="title has-text-white m-t-15">{{ newUser.first_name }} {{ newUser.last_name }}</div>
      </div>
      <ValidationProvider v-slot="{ errors, valid }" name="Ime" rules="required">
        <b-field
          class="login__input__container m-t--20"
          :label="$t('ime')"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
        >
          <b-input v-model="newUser.first_name" type="text" rounded> </b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors, valid }" name="Prezime" rules="required">
        <b-field
          class="login__input__container"
          :label="$t('prezime')"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
        >
          <b-input v-model="newUser.last_name" type="text" rounded> </b-input>
        </b-field>
      </ValidationProvider>
      <div class="field has-text-left">
        <b-radio v-model="newUser.gender" class="m-l-0" name="gender" native-value="M"> {{ $t('mukarac') }} </b-radio>
        <b-radio v-model="newUser.gender" name="gender" native-value="F"> {{ $t('ena') }} </b-radio>
        <!--        <b-radio v-model="newUser.gender" name="gender" native-value="O"> Drugo </b-radio>-->
      </div>
      <ValidationProvider v-slot="{ errors, valid }" name="E-mail adresa" rules="required|email">
        <b-field
          class="login__input__container"
          :label="$t('emailAdresa')"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
        >
          <b-input v-model="newUser.email" type="email" rounded> </b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors, valid }" name="Datum rođenja" rules="required">
        <b-field :label="$t('datumRoenja')" :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
          <b-datepicker
            v-model="newUser.birth_date"
            class="for-birthday-picker"
            :first-day-of-week="1"
            :placeholder="$t('klikniOvdjeZaOdabir')"
            :max-date="new Date()"
            :mobile-native="nativeDatepicker()"
            trap-focus
            rounded
          >
          </b-datepicker>
        </b-field>
      </ValidationProvider>
      <!--      <ValidationProvider v-slot="{ errors, valid }" name="Adresa" rules="required">-->
      <!--        <b-field-->
      <!--          class="login__input__container"-->
      <!--          label="Adresa"-->
      <!--          :type="{ 'is-danger': errors[0], 'is-success': valid }"-->
      <!--          :message="errors"-->
      <!--        >-->
      <!--          <b-input v-model="newUser.address" type="text" rounded> </b-input>-->
      <!--        </b-field>-->
      <!--      </ValidationProvider>-->
      <ValidationProvider v-slot="{ errors, valid }" name="Mjesto" rules="required">
        <b-field
          class="login__input__container"
          :label="$t('mjesto3')"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
        >
          <b-input v-model="newUser.city" type="text" rounded> </b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors, valid }" name="Broj mobitela" rules="required">
        <b-field
          class="login__input__container"
          :label="$t('brojMobitela')"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
        >
          <b-input v-model="newUser.phone" type="number" rounded> </b-input>
        </b-field>
      </ValidationProvider>

      <ValidationProvider v-slot="{ errors, valid }" name="Lozinka" rules="required|min:8|confirmed:confirm">
        <b-field
          class="login__input__container"
          :label="$t('lozinka')"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
        >
          <b-input v-model="newUser.password" name="new-password" type="password" password-reveal rounded> </b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors, valid }" vid="confirm" name="Lozinka" rules="required|min:8">
        <b-field
          class="login__input__container"
          :label="$t('ponoviLozinku')"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
        >
          <b-input v-model="newUser.passwordConfirm" name="new-password" type="password" password-reveal rounded>
          </b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors, valid }" name="Uvjeti korištenja" rules="required">
        <b-field :type="{ 'is-danger': errors[0], 'is-success': valid }" :message="errors">
          <b-checkbox v-model="newUser.consent" name="consent" :true-value="true"
            >{{ $t('prihvaam') }}
            <a href="https://www.tenis.plus/terms" target="_blank">{{ $t('uvjeteKoritenja') }}</a></b-checkbox
          >
        </b-field>
      </ValidationProvider>
      <div class="buttons m-t-40">
        <b-button
          class="no-double-zoom"
          type="submit is-primary"
          rounded
          native-type="submit"
          :loading="loading"
          @click.prevent="submit(invalid)"
        >
          {{ $t('registrirajSe') }}
        </b-button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { Capacitor } from '@capacitor/core'
import { Camera } from '@capacitor/camera'
import Player from '~/models/Player'

export default {
  name: 'RegistrationForm',
  components: {
    Cropper,
  },
  data() {
    // const today = new Date()
    return {
      activeTab: 0,
      loading: false,
      // max_date: new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()),
      new_image: null,
      newUser: {
        image: null,
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        member: 1,
        birth_date: new Date(),
        city: '',
        phone: '',
        gender: 'M',
        consent: false,
      },
      coordinates: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
    }
  },
  computed: {
    style() {
      return {
        backgroundImage: 'url(' + 'login__bckg.jpg' + ')',
      }
    },
  },
  methods: {
    nativeDatepicker() {
      if (Capacitor.getPlatform() !== 'ios') {
        return false
      }
      return true
    },
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
          this.new_image = photo.dataUrl
        }
      } else {
        document.getElementById('fileInput').click()
      }
    },
    reset() {
      this.newUser.image = null
    },
    uploadImage(event) {
      this.$root.$loading.start()
      // Reference to the DOM input element
      const input = event.target
      // Ensure that you have a file before attempting to read it
      if (input.files && input.files[0]) {
        // create a new FileReader to read this image and convert to base64 format
        const reader = new FileReader()
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
          // Read image as base64 and set to imageData
          this.new_image = e.target.result
        }
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input.files[0])
        this.$root.$loading.finish()
      }
    },
    change({ coordinates, canvas }) {},
    crop() {
      const { coordinates, canvas } = this.$refs.cropper.getResult()
      this.coordinates = coordinates
      this.newUser.image = canvas.toDataURL()
      this.new_image = null
    },
    async submit() {
      this.loading = true
      const player = new Player(this.newUser)
      player.birth_date = this.$moment(this.newUser.birth_date).format('YYYY-MM-DD')
      try {
        await player.save()
        this.$buefy.toast.open({
          message: this.$t('Uspješno ste se registrirali'),
          type: 'is-success',
        })
        this.loading = false
        await this.$auth.loginWith('password_grant', {
          data: {
            username: this.newUser.email,
            password: this.newUser.password,
          },
        })
        await this.$router.push(this.localePath('/'))
      } catch (error) {
        if (error.response.data.message === '{attribute} je zauzeto') {
          this.$buefy.toast.open({
            message: this.$t('Uneseni email već postoji u sustavu. Ili se prijavite s tim emailom ili odaberite drugi'),
            type: 'is-danger',
            duration: 4000,
          })
        } else {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do') + error.response.data.message,
            type: 'is-danger',
          })
        }
        this.loading = false
      }
    },
  },
}
</script>
<style scoped>
.cropper {
  height: auto;
  margin: 0 auto;
  width: 80vw;
}
</style>
