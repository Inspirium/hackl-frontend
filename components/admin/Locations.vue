<template>
  <div class="">
    <div class="">
      <div class="m-t-20">
        <div class="fw600 is-size-4 has-text-centered has-text-black80 subscription-title m-b--10">
          {{ $t('Lokacije') }}
        </div>

        <ValidationProvider v-slot="{ errors, valid }" name="Naziv lokacije" rules="required">
          <b-field
            :label="$t('Naziv')"
            class="login__input__container"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors"
          >
            <b-input v-model="newLocation.name" type="text" rounded></b-input>
          </b-field>
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors, valid }" name="Napomena" rules="required">
          <b-field
            :label="$t('Opis')"
            class="login__input__container"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors"
          >
            <b-input v-model="newLocation.description" type="text" rounded></b-input>
          </b-field>
        </ValidationProvider>
      </div>
      <div class="buttons m-t-30 m-b-5">
        <b-button
          class="softshadow m-t-10 m-b-20 invert-small-button"
          type="noborder is-small is-primary has-text-white"
          pack="fal"
          icon-right="check"
          rounded
          :loading="loading"
          @click="submit()"
        >
          {{ $t('Spremi lokaciju') }}
        </b-button>
      </div>
      <div class="divider-line-1 m-t-10 m-b-20"></div>
      <div class="">
        <div class="fw600 is-size-4 has-text-centered has-text-black80 subscription-title m-b-10">
          {{ $t('Lista lokacija') }}
        </div>
        <div class="activity relative">
          <template>
            <div v-if="location.length" class="is-white radius__12 softshadow">
              <div class="bb1-10"></div>
              <div v-for="(item, index) in location" :key="index + 'ob'" class="p-r-10 p-l-10 p-t-10 p-b-10 bb1-10">
                <span class="fw600 align__centar__all">
                  <div class="list__content">
                    <h4 class="fw600 is-size-55 m-t--2">{{ item.name }}</h4>
                    <div class="fw600 has-text-black80 is-size-7 m-l-auto nowrap">{{ item.description }}</div>
                  </div>

                  <div
                    class="flex align__centar__all"
                    :class="[{ blur_button: loadingDelete }]"
                    @click="deleteTax(item.id)"
                  >
                    <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto"> </b-icon>
                  </div>
                </span>
              </div>
            </div>
            <template v-if="!location.length && !loading">
              <div class="rounded-md has-text-centered m-t-5">
                <b-icon icon="exclamation-square" pack="fal" type="is-danger" class="is-medium m-t-5"> </b-icon>
                <div class="has-text-centered is-size-5 has-text-black50 fw600">
                  {{ $t('nemaPodataka') }}
                </div>
              </div>
            </template>

            <template v-if="loading && !location.length">
              <transition name="fade">
                <div v-if="loading" class="align__centar__x loading_z_spinner m-t-30">
                  <b-icon
                    class="comment-send m-b-20"
                    custom-class="rotating"
                    icon="spinner"
                    size="is-large"
                    type="is-primary"
                    pack="far"
                  ></b-icon>
                </div>
              </transition>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import Location from '~/models/Location'

export default {
  name: 'ClubLocations',
  components: {},
  data() {
    return {
      location: [],
      newLocation: {
        name: '',
        description: '',
      },
      loading: false,
      loadingDelete: false,
      country: '',
      countries: [],
      selected: {},
    }
  },
  computed: {
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

  mounted() {
    this.getLocation()
  },
  methods: {
    getLocation() {
      this.loading = true
      Location.where('club', this.club.id)
        .get()
        .then((res) => {
          this.location = res.data
          this.loading = false
        })
    },
    deleteTax(id) {
      this.loadingDelete = true
      const tc = new Location({ id })
      tc.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali'),
            type: 'is-success',
          })
          this.getLocation()
          this.loadingDelete = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadingDelete = false
        })
    },
    submit() {
      this.loading = true
      this.newLocation.country_id = this.selected.id
      const tc = new Location(this.newLocation)
      tc.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili izmjene'),
            type: 'is-success',
          })
          this.loading = false
          this.getLocation()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
  },
}
</script>
