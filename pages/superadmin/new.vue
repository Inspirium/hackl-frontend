<template>
  <div>
    <div class="hero noimage is-danger">
      <div class="content has-text-white has-text-centered m-t-20">
        <b-icon icon="cog" size="is-large" pack="fal"> </b-icon>
      </div>
      <h1 class="has-text-white">{{ $t('noviKlub') }}</h1>
    </div>
    <div class="x-container registration">
      <div class="form-grobup align__centar__y flex__column">
        <form class="w100" @submit.prevent="submit">
          <ValidationProvider v-slot="{ errors, valid }" name="Naziv kluba" rules="required">
            <b-field
              :label="$t('nazivKluba')"
              size="is-medium"
              class="login__input__container"
              :type="valid ? 'is-success' : 'is-danger'"
              :message="errors"
            >
              <b-input v-model="clubNew.name" :placeholder="$t('upiiNazivKluba')" type="text" rounded> </b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors, valid }" name="Poddomena" rules="required">
            <b-field
              :label="$t('poddomena')"
              size="is-medium"
              class="login__input__container"
              :type="valid ? 'is-success' : 'is-danger'"
              :message="errors"
            >
              <b-input v-model="clubNew.subdomain" :placeholder="$t('upiiNazivKluba')" type="text" rounded> </b-input>
            </b-field>
          </ValidationProvider>
          <div class="label">{{ $t('Država') }}</div>
          <ValidationProvider name="Država" rules="required">
            <b-field class="">
              <b-autocomplete
                v-model="country"
                rounded
                field="name"
                :data="countries"
                :placeholder="$t('Odaberi državu')"
                clearable
                @select="(option) => (selected = option)"
              >
                <template #empty>{{ $t('Nema rezultata pretrage') }}</template>
              </b-autocomplete>
            </b-field>
          </ValidationProvider>

          <div class="label">{{ $t('owner') }}</div>
          <div class="activity__box action__buttons br100 m-b-20">
            <div class="action__item__small fw600 br100">
              <div v-if="Object.keys(clubNew.owner).length" class="align__centar__all w100">
                <TennisImage :size="[42, 42]" :src="clubNew.owner.image" class="user_image m-r-10 m-l--5" alt="" />
                <div class="list__content">
                  <h3>{{ clubNew.owner.display_name }}</h3>
                  <h4>{{ $t('godina range', { range: clubNew.owner.range }) }}</h4>
                </div>
                <div @click="clubNew.owner = {}">
                  <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto m-r-10"> </b-icon>
                </div>
              </div>
              <div v-else class="activity__header" @click="isModalMembersActive = true">
                <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
                <div class="list__content">
                  <div class="has-text-black50 fw600 is-size-6">{{ $t('dodajVlasnika') }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="buttons m-t-15 m-b-30">
            <b-button
              class="m-l-5 m-t-20 fw600"
              type="is-danger"
              pack="fal"
              icon-left="times"
              rounded
              tag="nuxt-link"
              :to="localePath('/superadmin/')"
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
              @click.prevent="submit"
            >
              {{ $t('spremi') }}
            </b-button>
          </div>
        </form>
      </div>
    </div>
    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip">
      <modalMembers
        :title="$t('upraviteljKluba')"
        :subtitle="$t('Odaberi administratora kluba')"
        @player="clubNew.owner.push($event)"
      ></modalMembers>
    </b-modal>
  </div>
</template>
<script>
import TennisImage from '@/components/TennisImage.vue'
import _ from 'lodash'
import Club from '~/models/Club'
import modalMembers from '~/components/modal/ModalMembersAllClub'
import Country from '~/models/Country'

export default {
  name: 'ClubNew',
  components: {
    modalMembers,
    TennisImage,
  },
  data() {
    return {
      isModalMembersActive: false,
      player: {},
      clubNew: {
        name: '',
        subdomain: '',
        owner: [],
        country: '',
      },
      selected: {},
      country: '',
      countries: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  watch: {
    country() {
      this.debouncedGetCountry()
    },
  },
  created() {
    this.debouncedGetCountry = _.debounce(this.getCountry, 500)
  },
  mounted() {
    this.getCountry()
  },
  methods: {
    getCountry() {
      const c = Country
      c.where('name', this.country)
        .get()
        .then((res) => {
          this.countries = res.data
        })
    },
    submit() {
      if (Object.keys(this.selected).length) {
        this.clubNew.country = { id: this.selected.id }
      }
      const club = new Club(this.clubNew)
      club
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste izmijenili podatke'),
            type: 'is-success',
          })
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
        })
    },
  },
}
</script>
<style scoped></style>
