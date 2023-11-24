<template>
  <div class="members">
    <hero
      :options="heroImage"
      :second="{
        name: $t('Parovi'),
        link: '/doubles',
      }"
    >
      <h1 class="has-text-white">{{ $t('urediPar') }}</h1>
    </hero>
    <div class="buttons m-t-30">
      <b-button
        class="softshadow m-b-0"
        type="is-small noborder"
        pack="fal"
        icon-right="times-circle"
        rounded
        @click="isModalDeleteTeam = true"
      >
        {{ $t('obriiPar') }}
      </b-button>
    </div>
    <div class="my-rank">
      <div class="list__image-col softshadow">
        <div v-if="Object.keys(team).length" class="align__centar__y">
          <nuxt-link :to="localePath('/doubles/' + team.id + '/edit')" class="flex align__centar__y w100">
            <div v-if="team.image === 'https://api.tenis.plus/images/user.svg'" class="list__img">
              <TennisImage :size="[42, 42]" :src="team.players[0].image" class="user_image border__white--2" alt="" />
              <TennisImage
                :size="[42, 42]"
                :src="team.players[1].image"
                class="user_image m-l--20 border__white--2"
                alt=""
              />
            </div>
            <div v-else class="list__img">
              <TennisImage :size="[42, 42]" :src="team.image" class="user_image border__white--2" alt="" />
            </div>
            <div class="list__content">
              <h3 class="fw600 is-size-55 has-text-black80 line-height-14">{{ team.display_name }}</h3>
            </div>
            <b-tag v-if="team.rating !== null" type="is-info">{{ Math.round(team.rating) }}</b-tag>
          </nuxt-link>
        </div>
      </div>
    </div>
    <h5 class="has-text-black80">{{ $t('fotografijaNijeObvezno') }}</h5>
    <photoUpload @update="team.new_image = $event" />
    <div class="buttons m-t-30 p-b-75">
      <b-button class="fw600" type="is-danger" pack="fal" icon-left="chevron-left" rounded @click="$router.go(-1)">
        {{ $t('nazad') }}
      </b-button>
      <b-button
        class="fw600"
        type="is-primary"
        pack="fal"
        icon-right="check"
        rounded
        :loading="loading"
        @click="save()"
      >
        {{ $t('spremi') }}
      </b-button>
    </div>
    <b-modal :active.sync="isModalAddPlayerFirstActive" :width="640" scroll="clip" class="modal__members">
      <modalMembers
        :show-tennis-school="false"
        :title="$t('dodajIgraaPara')"
        @player="firstDoublePlayer = $event"
      ></modalMembers>
    </b-modal>
    <b-modal :active.sync="isModalAddPlayerActive" :width="640" scroll="clip" class="modal__members">
      <modalMembers
        :show-tennis-school="false"
        :title="$t('dodajIgraaPara')"
        @player="secondDoublePlayer = $event"
      ></modalMembers>
    </b-modal>
    <b-modal :active.sync="isModalDeleteTeam" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('brisanjeTeniskogPara')"
        :subtitle="$t('Jeste li sigurni?')"
        @update="deleteTeam()"
      ></modalConfirmation>
    </b-modal>
  </div>
</template>

<script>
// import Player from '~/models/Player'
import TennisImage from '@/components/TennisImage.vue'
import Team from '~/models/Team'
import hero from '~/components/Hero'
import modalMembers from '~/components/modal/ModalMembersAll'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import photoUpload from '~/components/photoUpload'

export default {
  name: 'DoublesNew',
  components: {
    photoUpload,
    modalConfirmation,
    hero,
    modalMembers,
    TennisImage,
  },
  data() {
    return {
      heroImage: '/hero_doubles.jpg',
      isModalDeleteTeam: false,
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
    this.getPlayer()
  },
  methods: {
    deleteTeam() {
      const t = new Team({ id: this.team.id })
      t.config({
        method: 'DELETE',
      })
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno je uklonjen par'),
            type: 'is-success',
            queue: false,
            duration: 500,
          })
          this.$router.push(this.localePath('/doubles'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
        })
    },
    async getPlayer() {
      this.team = await Team.$find(this.$route.params.id)
    },
    reset() {
      this.team.image = null
    },
    saveOld() {
      if (this.team.new_image) {
        this.loading = true
        this.team.players.push(this.firstDoublePlayer)
        this.team.players.push(this.secondDoublePlayer)
        this.$axios
          .put('v2/team', this.team)
          .then((res) => {
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste se spremili par'),
              type: 'is-success',
            })
            this.loading = false
            this.$router.go(-1)
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
          message: this.$t('Dodaj fotografiju prije spremanja'),
          type: 'is-primary',
        })
      }
    },
    save() {
      if (this.team.new_image) {
        this.loading = true
        const team = new Team(this.team)
        team
          .save()
          .then((res) => {
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste se spremili par'),
              type: 'is-success',
            })
            this.loading = false
            this.$router.go(-1)
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
          message: this.$t('Dodaj fotografiju prije spremanja'),
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
