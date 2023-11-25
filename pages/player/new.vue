<template>
  <div v-if="isAdmin" class="">
    <hero :page="'player'" :back="true">
      <h1 class="has-text-white">{{ $t('registracijaNovogIgraa') }}</h1>
    </hero>
    <div class="buttons m-t-30">
      <b-button
        class="softshadow m-b-10"
        type="is-small noborder"
        pack="fal"
        icon-right="users"
        size="is-large"
        rounded
        tag="nuxt-link"
        :to="localePath('/player/bulk')"
      >
        {{ $t('Skupna registracija') }}
      </b-button>
    </div>

    <div class="player_new p-l-15 p-r-15">
      <div class="has-text-centered align__centar__y flex__column m-t-15">
        <b-icon
          class="comment-send m-b-0 is-larger-lg"
          icon="user-plus"
          size="is-large"
          type="is-primary"
          pack="far"
        ></b-icon>
        <div class="fw600 has-text-centered m-t--10 is-size-4">{{ $t('unesiPotrebnePodatke') }}</div>
      </div>
      <ValidationObserver v-slot="{ invalid }">
        <form class="p-b-150 m-t-30 registration" @submit.prevent="onSubmit">
          <!--          <div class="title has-text-white m-t-10">Popuni podatke</div>-->
          <div class="label--noindent has-text-centered">{{ $t('fotografija') }}</div>
          <photoUpload :aspect-ratio="1" class="m-b-20" @update="image = $event" />
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
          <div class="field has-text-left m-t-30">
            <b-radio v-model="newUser.gender" class="m-l-0" name="gender" native-value="M">
              {{ $t('mukarac') }}
            </b-radio>
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
            <b-field
              :label="$t('datumRoenja')"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
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
              <b-input v-model="newUser.password" name="new-password" type="password" password-reveal rounded>
              </b-input>
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
          <div class="buttons m-t-40">
            <b-button
              class="no-double-zoom"
              type="submit is-primary"
              rounded
              native-type="submit"
              :loading="loading"
              @click.prevent="submit(invalid)"
            >
              {{ $t('registrirajIgraa') }}
            </b-button>
          </div>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import { Capacitor } from '@capacitor/core'
import Player from '~/models/Player'
import hero from '~/components/Hero'
import photoUpload from '~/components/photoUpload'

export default {
  name: 'NewPlayer',
  components: { photoUpload, hero },
  data() {
    return {
      image: null,
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
        consent: true,
      },
      club_players: [],
      offset: 1,
      bottom: false,
      nomore: false,
      total: 0,
      search_term: '',
      isModalPowerActive: false,
      isModalAgeActive: false,
      filterAgeDisplay: 'Sve',
      filterPowerDisplay: 'Sve',
      last_page: 1,
      ageRange: [],
      powerRange: [],
      player_memberships: [],
      loading: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    clubId() {
      return this.$store.state.club.id
    },
    search_icon() {
      if (this.search_term !== '') {
        return 'times'
      } else {
        return 'search'
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
    async submit() {
      this.loading = true
      const player = new Player(this.newUser)
      player.birth_date = this.$moment(this.newUser.birth_date).format('YYYY-MM-DD')
      try {
        await player.save()
        this.$buefy.toast.open({
          message: this.$t('Uspješno ste registrirali novog igrača'),
          type: 'is-success',
        })
        this.$router.go(-1)
        this.loading = false
      } catch (error) {
        this.$buefy.toast.open({
          message: this.$t('Došlo je do') + error.response.data.message,
          type: 'is-danger',
        })
        this.loading = false
      }
    },
  },
}
</script>
