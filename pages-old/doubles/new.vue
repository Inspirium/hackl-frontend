<template>
  <div class="members">
    <hero
      :options="heroImage"
      :second="{
        name: $t('Parovi'),
        link: '/doubles',
      }"
    >
      <h1 class="has-text-white">{{ $t('izradiNoviPar') }}</h1>
    </hero>

    <div v-if="showme" class="tablelist x-container">
      <div class="my-rank m-t-20">
        <h5>{{ $t('igraiPara') }}</h5>
        <div class="fw600 is-size-65 has-text-black50 m-b-4">{{ $t('prviPostavljeniIgraJeKapetanTima') }}</div>
        <div class="list__image-col softshadow">
          <div v-if="Object.keys(firstDoublePlayer).length" class="align__centar__y">
            <div class="list__img">
              <TennisImage :size="[42, 42]" :src="firstDoublePlayer.image" class="user_image" alt="" />
            </div>
            <div class="list__content m-r-auto">
              <h3>{{ firstDoublePlayer.display_name }}</h3>
              <h4>{{ $t('godina range', { range: firstDoublePlayer.range }) }}</h4>
            </div>
            <div v-if="isAdmin" class="buttons m-l-auto">
              <b-button class="m-l-auto" type="is-danger" rounded size="is-smaller" @click="firstDoublePlayer = {}">{{
                $t('ukloni')
              }}</b-button>
            </div>
          </div>
          <div v-else class="buttons">
            <b-button
              class="softshadow m-t-10 invert-small-button"
              type="is-small noborder is-primary has-text-white"
              pack="fal"
              icon-right="user-plus"
              rounded
              @click="isModalAddPlayerFirstActive = true"
            >
              {{ $t('dodajIgraa') }}
            </b-button>
          </div>
        </div>
        <div class="list__image-col softshadow m-t-10">
          <div v-if="Object.keys(secondDoublePlayer).length" class="align__centar__y">
            <div class="list__img">
              <TennisImage :size="[42, 42]" :src="secondDoublePlayer.image" class="user_image" alt="" />
            </div>
            <div class="list__content m-r-auto">
              <h3>{{ secondDoublePlayer.display_name }}</h3>
              <h4>{{ $t('godina range', { range: secondDoublePlayer.range }) }}</h4>
            </div>
            <div class="buttons m-l-auto">
              <b-button class="m-l-auto" type="is-danger" rounded size="is-smaller" @click="secondDoublePlayer = {}">{{
                $t('ukloni')
              }}</b-button>
            </div>
          </div>
          <div v-else class="buttons">
            <b-button
              class="softshadow m-t-10 invert-small-button"
              type="is-small noborder is-primary has-text-white"
              pack="fal"
              icon-right="user-plus"
              rounded
              @click="isModalAddPlayerActive = true"
            >
              {{ $t('dodajIgraa') }}
            </b-button>
          </div>
        </div>
      </div>
    </div>
    <template v-if="Object.keys(firstDoublePlayer).length && Object.keys(secondDoublePlayer).length">
      <h5 class="has-text-black80">{{ $t('fotografijaNijeObvezno') }}</h5>
      <photoUpload @update="team.image = $event" />
      <!--      <div class="tablelist x-container">-->
      <!--        <b-field class="login__input__container" label="Naziv tima">-->
      <!--          <b-input-->
      <!--            id="title"-->
      <!--            v-model="team.display_name"-->
      <!--            placeholder="Upiši naziv"-->
      <!--            class="form-control"-->
      <!--            type="text"-->
      <!--            rounded-->
      <!--          >-->
      <!--          </b-input>-->
      <!--        </b-field>-->
      <!--      </div>-->
    </template>
    <div class="buttons m-t-30 p-b-75">
      <b-button
        class="fw600"
        type="is-danger"
        pack="fal"
        icon-right="plus-circle"
        rounded
        :loading="loading1"
        @click="save"
      >
        {{ $t('spremiNoviPar') }}
      </b-button>
    </div>
    <b-modal :active.sync="isModalAddPlayerFirstActive" :width="640" scroll="clip" class="modal__members">
      <modalMembers
        :is-player="true"
        :show-tennis-school="false"
        :title="$t('dodajIgraaPara')"
        @player="firstDoublePlayer = $event"
      ></modalMembers>
    </b-modal>
    <b-modal :active.sync="isModalAddPlayerActive" :width="640" scroll="clip" class="modal__members">
      <modalMembers
        :is-player="true"
        :show-tennis-school="false"
        :title="$t('dodajIgraaPara')"
        @player="secondDoublePlayer = $event"
      ></modalMembers>
    </b-modal>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import hero from '~/components/Hero'
import modalMembers from '~/components/modal/ModalMembersAll'
// import Player from '~/models/Player'
import Team from '~/models/Team'
import photoUpload from '~/components/photoUpload'

export default {
  name: 'DoublesNew',
  components: {
    photoUpload,
    hero,
    modalMembers,
    TennisImage,
  },
  data() {
    return {
      heroImage: '/hero_doubles.jpg',
      firstDoublePlayer: {},
      secondDoublePlayer: {},
      isModalAddPlayerFirstActive: false,
      isModalAddPlayerActive: false,
      showhide: false,
      crop_image: null,
      team: {
        number_of_players: 2,
        display_name: '',
        new_image: null,
        image: null,
        players: [],
        primary_contact_id: null,
      },
      loading: false,
      loading1: false,
      showme: false,
    }
  },
  computed: {
    isAdmin() {
      return this.user.is_admin
    },
    user() {
      return this.$store.state.auth.user
    },
  },
  mounted() {
    this.prepopulate()
  },
  methods: {
    prepopulate() {
      this.firstDoublePlayer = this.user
      this.showme = true
    },
    reset() {
      this.team.image = null
    },
    crop() {
      const { coordinates, canvas } = this.$refs.cropper.getResult()
      this.coordinates = coordinates
      this.team.new_image = canvas.toDataURL()
      this.team.image = canvas.toDataURL()
      this.crop_image = null
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
    save() {
      if (Object.keys(this.firstDoublePlayer).length && Object.keys(this.secondDoublePlayer).length) {
        this.loading = true
        this.team.players.push(this.firstDoublePlayer)
        this.team.players.push(this.secondDoublePlayer)
        const team = new Team(this.team)
        team
          .save()
          .then((res) => {
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste se spremili par'),
              type: 'is-success',
            })
            this.loading = false
            this.$router.push(this.localePath('/doubles'))
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
              type: 'is-danger',
            })
            this.loading = false
          })
      } else {
        this.$buefy.toast.open({
          message: this.$t('Popunite tim s igračama'),
          type: 'is-primary',
        })
      }
    },
  },
}
</script>
<style scoped>
.cropper {
  width: 100vw;
}
</style>
