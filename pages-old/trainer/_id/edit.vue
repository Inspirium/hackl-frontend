<template>
  <div class="trainers">
    <hero :options="heroImage">
      <h1 class="has-text-white">{{ $t('podaciOTreneru') }}</h1>
    </hero>
    <div class="activity x-container">
      <div class="fw600 is-size-3 m-t-15">{{ $t('urediSvojePodatke') }}</div>
      <div class="help__text m-t-5 m-b-10">
        <span>{{ $t('objanjenje') }} </span>{{ $t('ovdjeMoeteUnijetiPodatkeOTreniranjuIVaojDostupnost') }}
      </div>
      <form @submit.prevent="submit">
        <div class="label">{{ $t('dostupnost') }}</div>
        <ValidationProvider v-slot="{ errors, valid }" name="Dostupan" class="radio__box">
          <div class="block">
            <b-radio v-model="player.trainer.available" :type="valid ? 'is-success' : 'is-danger'" :native-value="1">
              {{ $t('dostupan') }}
            </b-radio>
            <b-radio v-model="player.trainer.available" :type="valid ? 'is-success' : 'is-danger'" :native-value="0">
              {{ $t('nedostupan') }}
            </b-radio>
          </div>
        </ValidationProvider>
        <ValidationProvider v-slot="{ errors, valid }" name="Cijena" rules="required">
          <b-field
            :label="$t('Cijena')"
            class="login__input__container"
            :type="valid ? 'is-success' : 'is-danger'"
            :message="errors"
          >
            <b-input v-model="player.trainer.price" :placeholder="$t('upiiCijenuPoSatu')" type="number" rounded>
            </b-input>
          </b-field>
        </ValidationProvider>
        <div class="label">{{ $t('terenUkljuenUCijenu') }}</div>
        <ValidationProvider v-slot="{ errors, valid }" name="Plaćanje terena" class="radio__box">
          <div class="block">
            <b-radio
              v-model="player.trainer.court_included"
              :type="valid ? 'is-success' : 'is-danger'"
              :native-value="0"
            >
              {{ $t('ukljuen') }}
            </b-radio>
            <b-radio
              v-model="player.trainer.court_included"
              :type="valid ? 'is-success' : 'is-danger'"
              :native-value="1"
            >
              {{ $t('zasebnoSePlaa') }}
            </b-radio>
          </div>
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors, valid }" name="Opis" rules="required">
          <b-field
            :label="$t('opis')"
            class="login__input__container"
            :type="valid ? 'is-success' : 'is-danger'"
            :message="errors"
          >
            <tinymce-editor v-model="player.trainer.description" class="" />
          </b-field>
        </ValidationProvider>
        <div class="label">{{ $t('prikazBrojaMobitela') }}</div>
        <ValidationProvider v-slot="{ errors, valid }" name="Dostupan" class="radio__box">
          <div class="block">
            <b-radio v-model="player.trainer.show_phone" :type="valid ? 'is-success' : 'is-danger'" :native-value="1">
              {{ $t('prikai') }}
            </b-radio>
            <b-radio v-model="player.trainer.show_phone" :type="valid ? 'is-success' : 'is-danger'" :native-value="0">
              {{ $t('nemojPrikazat') }}
            </b-radio>
          </div>
        </ValidationProvider>
        <div class="buttons m-t-15 m-b-30">
          <b-button
            class="m-l-5 m-t-20 fw600"
            type="is-danger"
            pack="fal"
            icon-left="times"
            rounded
            @click="$router.go(-1)"
          >
            {{ $t('odustani') }}
          </b-button>
          <b-button
            class="m-l-5 m-t-20 fw600"
            type="is-primary"
            pack="fal"
            icon-right="check"
            rounded
            native-type="submit"
            :loading="loading"
            @click.prevent="submit"
          >
            {{ $t('spremi') }}
          </b-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import hero from '~/components/Hero'
import Player from '~/models/Player'
import Trainer from '~/models/Trainer'

export default {
  name: 'Trainers',
  components: {
    hero,
  },
  async fetch() {
    const id = this.$route.params.id
    this.player = await Player.include('trainer').$find(id)
  },
  data() {
    return {
      loading: false,
      heroImage: '/hero_trainer.jpg',
      activeTab: 0,
      isCardModalActive: false,
      player: {
        trainer: {
          available: 1,
          description: '',
          price: 0,
          show_phone: 1,
          court_included: 0,
        },
      },
      trainer: {
        available: false,
        description: '',
        price: '',
        show_phone: true,
        court_included: false,
      },
      trainers: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  methods: {
    submit() {
      this.loading = true
      const trainer = new Trainer(this.player.trainer)
      trainer
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste osvježili podatke'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/trainer/' + this.player.id))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
        })
      this.loading = false
    },
  },
}
</script>
