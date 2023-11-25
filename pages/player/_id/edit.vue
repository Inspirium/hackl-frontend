<template>
  <div class="">
    <template>
      <div class="breadcrumbs breadcrumbs-back m-t-10">
        <a class="fw600 is-size-55 has-text-black80 align__centar__y" @click="$router.go(-1)">
          <b-icon icon="arrow-circle-left" pack="fal" type="is-black80" class="m-r-5"> </b-icon>
          <span class="m-r-5">{{ $t('nazad') }}</span>
        </a>
      </div>
    </template>
    <div class="x-container registration custom-cropper-width">
      <div class="form-group align__centar__y flex__column">
        <ValidationObserver v-slot="{ invalid }" class="w100">
          <form class="p-b-100" @submit.prevent="submit">
            <div class="m-t-20">
              <cropper
                ref="cropper"
                class="cropper"
                stencil-component="circle-stencil"
                :src="crop_image"
                :stencil-props="{
                  aspectRatio: 1,
                }"
                :canvas="{
                  width: 1024,
                  height: 1024,
                  maxHeight: 1024,
                  maxWidth: 1024,
                }"
                @change="change"
              ></cropper>
              <b-button
                v-show="crop_image"
                class="m-t-10 center--transform"
                type="is-primary"
                icon-right="check"
                pack="fal"
                rounded
                :loading="loading"
                @click="crop"
              >
                {{ $t('spremiSliku') }}
              </b-button>
              <div v-show="playerUpdate.image" class="align__centar__all flex__column">
                <img
                  :src="playerUpdate.image"
                  :class="{ 'user_image-large': true, 'm-b-15': true, inactive: loading }"
                  alt=""
                />
                <b-button class="is-smaller" :loading="loading" type="is-danger" rounded @click="reset">
                  {{ $t('ukloniSliku') }}
                </b-button>
              </div>
              <div
                v-show="playerUpdate.image === null && crop_image === null"
                class="user_image-large align__centar__all flex__column buttons center--transform"
                @click="$refs.file.click()"
              >
                <b-icon class="" icon="camera" size="is-large" type="is-lightblue" pack="fal"> </b-icon>
                <b-button class="is-smaller m-t-10" type="is-primary" rounded> {{ $t('postaviSliku') }} </b-button>
                <span class="button hide">
                  <input id="fileInput" ref="file" type="file" accept="image/*" @change="uploadImage($event)" />
                  {{ $t('uploadImage') }}
                </span>
              </div>
            </div>
            <ValidationProvider v-slot="{ errors, valid }" name="Ime" rules="required">
              <b-field
                :label="$t('ime')"
                class="login__input__container"
                :type="valid ? 'is-success' : 'is-danger'"
                :message="errors"
              >
                <b-input v-model="playerUpdate.first_name" :placeholder="$t('upiiIme')" type="text" rounded> </b-input>
              </b-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors, valid }" name="Prezime" rules="required">
              <b-field
                :label="$t('prezime')"
                class="login__input__container"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input v-model="playerUpdate.last_name" :placeholder="$t('upiiPrezime')" type="text" rounded>
                </b-input>
              </b-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors, valid }" name="Email" rules="required|email">
              <b-field
                :label="$t('email')"
                class="login__input__container"
                :type="valid ? 'is-success' : 'is-danger'"
                :message="errors"
              >
                <b-input v-model="playerUpdate.email" placeholder="E-mail" type="email" rounded> </b-input>
              </b-field>
            </ValidationProvider>
            <div v-if="showhide">
              <ValidationProvider v-slot="{ errors, valid }" name="Nova lozinka" rules="confirmed:confirmation|min:8">
                <b-field
                  :label="$t('novaLozinka')"
                  class="login__input__container"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                >
                  <b-input v-model="playerUpdate.new_password" :placeholder="$t('upiiNovuLozinku')" type="text" rounded>
                  </b-input>
                </b-field>
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors, valid }" name="Potvrda nove lozinke" vid="confirmation">
                <b-field
                  :label="$t('potvrdaNoveLozinke')"
                  class="login__input__container"
                  :type="valid ? 'is-success' : 'is-danger'"
                  :message="errors"
                >
                  <b-input
                    v-model="playerUpdate.new_password_confirmation"
                    :placeholder="$t('ponovnoUpiiNovuLozinku')"
                    type="text"
                    rounded
                  >
                  </b-input>
                </b-field>
              </ValidationProvider>
              <div class="buttons">
                <b-button
                  class="'m-l-5 m-t-20 fw600 is-smaller"
                  type="is-danger"
                  pack="fal"
                  icon-right="times"
                  rounded
                  @click.prevent="clearPass"
                >
                  {{ $t('otkai') }}
                </b-button>
                <!--                <b-button-->
                <!--                  class="'m-l-5 m-t-20 fw600 is-smaller"-->
                <!--                  type="is-primary"-->
                <!--                  pack="fal"-->
                <!--                  icon-right="check"-->
                <!--                  rounded-->
                <!--                  @click.prevent="submit"-->
                <!--                >-->
                <!--                  Spremi-->
                <!--                </b-button>-->
              </div>
            </div>
            <div v-if="!showhide" class="buttons">
              <b-button
                v-if="!showhide"
                class="m-l-5 m-t-20 fw600 is-smaller"
                type="is-primary"
                pack="fal"
                icon-right="lock-alt"
                rounded
                @click.prevent="showhide = true"
              >
                {{ $t('promijeniLozinku') }}
              </b-button>
            </div>
            <div class="label">{{ $t('spol') }}</div>
            <ValidationProvider v-slot="{ errors, valid }" name="Spol" rules="required" class="radio__box">
              <div class="block">
                <b-radio v-model="playerUpdate.gender" :type="valid ? 'is-success' : 'is-danger'" native-value="M">
                  {{ $t('muki') }}
                </b-radio>
                <b-radio v-model="playerUpdate.gender" :type="valid ? 'is-success' : 'is-danger'" native-value="F">
                  {{ $t('enski') }}
                </b-radio>
              </div>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors, valid }" name="Datum rođenja">
              <b-field
                :label="$t('datumRoenja')"
                class="login__input__container"
                :type="valid ? 'is-success' : 'is-danger'"
                :message="errors"
              >
                <b-datepicker
                  v-model="playerUpdate.birth_date"
                  class="for-birthday-picker"
                  :placeholder="$t('klikni')"
                  :first-day-of-week="1"
                  :max-date="new Date()"
                  :mobile-native="nativeDatepicker()"
                  trap-focus
                  rounded
                >
                </b-datepicker>
              </b-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors, valid }" name="Adresa">
              <b-field
                :label="$t('adresa')"
                class="login__input__container"
                :type="valid ? 'is-success' : 'is-danger'"
                :message="errors"
              >
                <b-input v-model="playerUpdate.address" :placeholder="$t('upiiAdresu')" type="text" rounded> </b-input>
              </b-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors, valid }" name="Mjesto">
              <b-field
                :label="$t('mjesto3')"
                class="login__input__container"
                :type="valid ? 'is-success' : 'is-danger'"
                :message="errors"
              >
                <b-input v-model="playerUpdate.city" :placeholder="$t('mjesto3')" type="text" rounded> </b-input>
              </b-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors, valid }" name="Mobitel" rules="integer">
              <b-field
                :label="$t('mobitel')"
                class="login__input__container"
                :type="valid ? 'is-success' : 'is-danger'"
                :message="errors"
              >
                <b-input v-model="playerUpdate.phone" :placeholder="$t('upiBrojMobitela')" type="tel" rounded>
                </b-input>
              </b-field>
            </ValidationProvider>
            <template v-if="Object.keys(playerUpdate.hidden_fields).length">
              <div v-if="user.id === playerUpdate.id || user.is_admin" class="">
                <div class="label">{{ $t('Prikaz broja mobitela članovima kluba') }}</div>
                <div class="radio__box--small">
                  <div class="block">
                    <b-radio v-model="playerUpdate.hidden_fields.hide_my_phone" type="is-success" :native-value="false">
                      {{ $t('Prikaži') }}
                    </b-radio>
                    <b-radio v-model="playerUpdate.hidden_fields.hide_my_phone" type="is-danger" :native-value="true">
                      {{ $t('sakrij') }}
                    </b-radio>
                  </div>
                </div>
              </div>
            </template>
            <div class="fw600 is-size-55 m-l-5 m-t-30 m-b-10">{{ $t('popisKlubovaUKojimaSteLan') }}</div>
            <div v-show="true" class="activity__box">
              <div v-for="(item, key) in playerUpdate.club_member" :key="item.id" class="flex border-list">
                <div class="fw600 flex align__centar__y">
                  <div class="list__img">
                    <TennisImage :size="[42, 42]" :src="item.logo" class="user_image" alt="" />
                  </div>
                  <div class="list__content">
                    <h4 class="fw600 is-size-6 m-t--2">
                      {{ item.name }}
                    </h4>
                  </div>
                </div>
                <div v-if="key == club.id" class="buttons m-l-auto">
                  <b-button
                    class="m-l-auto"
                    type="is-danger"
                    rounded
                    size="is-smaller"
                    :loading="loading1"
                    @click="isModalRemoveUserFromClubActive = true"
                    >{{ $t('ilaniSe') }}</b-button
                  >
                </div>
              </div>
            </div>

            <div class="tablelist">
              <b-table
                v-if="user.club_member.length"
                :data="user.club_member"
                :mobile-cards="false"
                :bordered="false"
                class=""
              >
                <b-table-column v-slot="props">
                  <div class="list__image-col flex">
                    <nuxt-link :to="localePath('/superadmin/' + props.row.id)" class="fw600">
                      <div class="list__img">
                        <TennisImage :size="[42, 42]" :src="props.row.logo" class="user_image" alt="" />
                      </div>
                      <div class="list__content">
                        <h4 class="fw600 is-size-6 m-t--2">
                          {{ props.row.name }}
                        </h4>
                      </div>
                    </nuxt-link>
                    <div class="buttons m-l-auto">
                      <b-button
                        class="m-l-auto"
                        type="is-danger"
                        rounded
                        size="is-smaller"
                        :loading="loading1"
                        @click="isModalRemoveUserFromClubActive = true"
                        >{{ $t('ilaniSe') }}</b-button
                      >
                    </div>
                  </div>
                </b-table-column>
              </b-table>
            </div>
            <div class="buttons">
              <b-button
                v-if="user.id == $route.params.id"
                class="softshadow m-b-30 m-t-30"
                type="is-small noborder"
                pack="fal"
                icon-right="user-times"
                rounded
                @click="isModalRemoveUserFromClubActiveSelf = true"
              >
                {{ $t('trajnoObriiProfil') }}
              </b-button>
            </div>
            <template v-if="isAdmin">
              <div class="fw600 is-size-55 m-l-5 m-t-30 m-b-2">{{ $t('eloBodovi') }}</div>
              <div v-if="Object.keys(playerUpdate).length" class="fw600 is-size-7 m-l-5 m-t-2 m-b-10">
                {{ $t('Ovdje možete premostiti ELO bodove') }} —
                <span v-if="playerUpdate.team?.score_club" class="has-text-lightblue"
                  >({{ playerUpdate.team?.score_club }} {{ $t('bodova7') }})</span
                >
              </div>
              <ValidationProvider name="Elo" rules="required">
                <b-field class="login__input__container">
                  <b-input v-model="elo" :placeholder="$t('eloBodovi')" type="number" rounded> </b-input>
                </b-field>
              </ValidationProvider>

              <div class="buttons">
                <b-button
                  class="softshadow m-b-30 m-t-30"
                  type="is-small noborder"
                  pack="fal"
                  icon-right="check"
                  rounded
                  :loading="loadingElo"
                  @click="overrideELO()"
                >
                  {{ $t('Spremi') }}
                </b-button>
              </div>
            </template>

            <!--        <div class="label">Dostupan za igru</div>-->
            <!--        <ValidationProvider v-slot="{ errors, valid }" name="Spol" class="radio__box">-->
            <!--          <div class="block">-->
            <!--            <b-radio v-model="playerUpdate.available" :type="valid ? 'is-success' : 'is-danger'" native-value="true">-->
            <!--              Dostupan-->
            <!--            </b-radio>-->
            <!--            <b-radio v-model="playerUpdate.available" :type="valid ? 'is-success' : 'is-danger'" native-value="false">-->
            <!--              Nisam dostupan-->
            <!--            </b-radio>-->
            <!--          </div>-->
            <!--        </ValidationProvider>-->
            <div v-if="touched > 1 && crop_image === null" class="buttons is-fixed">
              <b-button
                class="fw600"
                type="is-danger"
                pack="fal"
                icon-left="times"
                rounded
                tag="nuxt-link"
                :to="localePath(user.link)"
              >
                {{ $t('odustani') }}
              </b-button>
              <b-button
                :class="[invalid ? 'inactive' : '']"
                class="m-l-5 fw600"
                type="is-primary"
                pack="fal"
                icon-right="check"
                rounded
                native-type="submit"
                :loading="loading"
                @click.prevent="submit"
              >
                {{ $t('spremiIzmjene') }}
              </b-button>
            </div>
          </form>
        </ValidationObserver>
      </div>
    </div>
    <b-modal :active.sync="isModalRemoveUserFromClubActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('ilaniSeIzKluba')"
        :subtitle="$t('Nakon potvrde više nećete biti više član kluba')"
        @update="removeFromClub()"
      ></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalRemoveUserFromClubActiveSelf" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('brisanjeProfila')"
        :subtitle="$t('Nakon potvrde više nećete imati profil')"
        @update="deletePlayer()"
      ></modalConfirmation>
    </b-modal>
  </div>
</template>
<script>
import TennisImage from '@/components/TennisImage.vue'
import _ from 'lodash'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { Capacitor } from '@capacitor/core'
import Player from '~/models/Player'
import modalConfirmation from '~/components/modal/ModalConfirmation'

export default {
  name: 'PlayerEdit',
  components: {
    Cropper,
    modalConfirmation,
    TennisImage,
  },
  async fetch() {
    await this.$nextTick(() => {
      this.getPlayer()
    })
  },
  data() {
    return {
      isModalRemoveUserFromClubActive: false,
      isModalRemoveUserFromClubActiveSelf: false,
      selected_club: null,
      player: {},
      showhide: false,
      crop_image: null,
      playerUpdate: {
        id: '',
        image: '',
        new_image: null,
        first_name: '',
        last_name: '',
        gender: '',
        email: '',
        new_password: '',
        new_password_confirmation: '',
        address: '',
        city: '',
        phone: '',
        club_member: '',
        available: '',
        birth_date: null,
        hidden_fields: {
          hide_my_phone: false,
        },
      },
      coordinates: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
      loading: false,
      loading1: false,
      loadingElo: false,
      touched: 0,
      elo: null,
    }
  },
  computed: {
    style() {
      if (this.playerUpdate.image) {
        return {
          backgroundImage:
            'linear-gradient( rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.85) ), url(' + this.playerUpdate.image + ')',
        }
      }
      return {
        backgroundImage: 'none',
      }
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    club() {
      return this.$store.state.club
    },
  },
  watch: {
    playerUpdate: {
      deep: true,
      handler() {
        this.touched++
      },
    },
  },
  methods: {
    deletePlayer() {
      const p = new Player({ id: this.user.id })
      p.delete()
        .then(() => {
          this.$router.push(this.localePath('/'))
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali profil'),
            type: 'is-success',
          })
          this.$auth.logout()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
        })
    },
    removeFromClub() {
      this.loading1 = true
      this.$axios
        .put('v2/club/member', { delete: [this.playerUpdate] })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste se uklonili korisnika iz kluba'),
            type: 'is-success',
          })
          this.loading1 = false
          this.$router.push(this.localePath('/player'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading1 = false
        })
    },
    nativeDatepicker() {
      if (Capacitor.getPlatform() === 'android') {
        return false
      }
      return true
    },
    getPlayer() {
      if (this.$auth.user.is_admin || this.$auth.user.id === parseInt(this.$route.params.id)) {
        this.$root.$loading.start()
        Player.find(this.$route.params.id).then((res) => {
          if (res.birth_date) {
            res.birth_date = new Date(res.birth_date)
          } else {
            res.birth_date = new Date(res.birthyear, 0, 1)
          }
          _.merge(this.playerUpdate, res)
          this.$root.$loading.finish()
        })
      } else {
        this.$router.push(this.localePath('/401'))
      }
    },
    reset() {
      this.playerUpdate.image = null
    },
    crop() {
      // this.loading = true
      // this.$root.$loading.start()
      const { coordinates, canvas } = this.$refs.cropper.getResult()
      this.coordinates = coordinates
      this.playerUpdate.new_image = canvas.toDataURL()
      this.playerUpdate.image = canvas.toDataURL()
      this.crop_image = null
      this.submit()
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
        this.$auth.fetchUser()
      }
    },
    submit() {
      this.loading = true
      this.$root.$loading.start()
      const player = new Player(this.playerUpdate)
      player.birth_date = this.$moment(this.playerUpdate.birth_date).format('YYYY-MM-DD')
      player
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili promjene'),
            type: 'is-success',
          })
          this.touched = 0
          this.loading = false
          this.$auth.fetchUser()
          this.$root.$loading.finish()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading = false
          this.$auth.fetchUser()
          this.$root.$loading.finish()
        })
    },
    change({ coordinates, canvas }) {},
    clearPass() {
      this.playerUpdate.new_password = ''
      this.playerUpdate.new_password_confirmation = ''
      this.showhide = false
    },
    overrideELO() {
      this.loadingElo = true
      this.$axios
        .post('/v2/club/member/elo', { player: this.playerUpdate, club: this.club, elo_points: this.elo })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili promjene'),
            type: 'is-success',
          })
          this.loadingElo = false
        })
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
