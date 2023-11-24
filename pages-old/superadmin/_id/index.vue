<template>
  <div>
    <div class="hero noimage is-danger">
      <div class="content has-text-white has-text-centered m-t-20">
        <b-icon icon="cog" size="is-large" pack="fal"> </b-icon>
      </div>
      <h1 class="has-text-white">{{ $t('noviKlub') }}</h1>
    </div>
    <div class="buttons m-t-15 m-b-30">
      <b-button class="m-l-5 m-t-20 fw600" type="is-danger" pack="fal" icon-left="times" rounded @click="deleteClub()">
        {{ $t('obriiKlub') }}
      </b-button>
    </div>
    <div v-if="Object.keys(clubNew).length" class="x-container registration">
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
          <div class="label">{{ $t('owner') }}</div>
          <!--<div v-if="false" class="activity__box action__buttons br100 m-b-20">
            <div class="action__item__small fw600 br100">
              <div v-if="Object.keys(clubNew.owner).length" class="align__centar__all w100">
                <img :src="clubNew.owner.image" class="user_image m-r-10 m-l--5" alt="" />
                <div class="list__content">
                  <h3>{{ clubNew.owner.display_name }}</h3>
                  <h4>{{ clubNew.owner.range }} godina</h4>
                </div>
                <div @click="clubNew.owner = {}">
                  <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto m-r-10"> </b-icon>
                </div>
              </div>
              <div v-else class="activity__header" @click="isModalMembersActive = true">
                <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
                <div class="list__content">
                  <div class="has-text-black50 fw600 is-size-6">Dodaj vlasnika</div>
                </div>
              </div>
            </div>
          </div>-->

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
        :title="$t('poalji')"
        :subtitle="$t('Odaberite igrača kojem želite predložiti odabrane termine')"
        @player="clubNew.owner = $event"
      ></modalMembers>
    </b-modal>
  </div>
</template>
<script>
import Club from '~/models/Club'
import modalMembers from '~/components/modal/ModalMembersTerms'

export default {
  name: 'ClubNew',
  components: {
    modalMembers,
  },
  async fetch() {
    await this.getClubs()
  },
  data() {
    return {
      isModalMembersActive: false,
      clubNew: {},
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  methods: {
    getClubs() {
      Club.find(this.$route.params.id).then((res) => {
        this.clubNew = res
      })
    },
    deleteClub() {
      const c = new Club(this.clubNew)
      c.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili proizvod'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/superadmin/'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
        })
    },
    submit() {
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
