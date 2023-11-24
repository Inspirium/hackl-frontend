<template>
  <div class="members">
    <b-tabs v-model="activeTab" position="is-centered" class="hide_tab_navigation_impt">
      <b-tab-item>
        <div class="m-b-20">
          <transition name="fade">
            <div v-if="loading" class="align__centar__x loading_z_spinner">
              <b-icon
                class="comment-send"
                custom-class="rotating"
                icon="spinner"
                size="is-large"
                type="is-primary"
                pack="far"
              ></b-icon>
            </div>
          </transition>

          <div v-if="myTeams.length" class="tablelist x-container">
            <div class="fw600 is-size-5 has-text-centered m-b-10">{{ $t('odaberiteParZaPrijavu') }}</div>

            <b-table class="softshadow" :data="myTeams" :mobile-cards="false" :bordered="false">
              <b-table-column v-slot="props" cell-class="list__image-col">
                <div class="flex">
                  <nuxt-link :to="localePath('/doubles/' + props.row.id)">
                    <div v-if="props.row.image === 'https://api.tenis.plus/images/user.svg'" class="list__img">
                      <TennisImage
                        :size="[42, 42]"
                        :src="props.row.players[0].image"
                        class="user_image border__white--2"
                        alt=""
                      />
                      <TennisImage
                        :size="[42, 42]"
                        :src="props.row.players[1].image"
                        class="user_image m-l--20 border__white--2"
                        alt=""
                      />
                    </div>
                    <div v-else class="list__img">
                      <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image border__white--2" alt="" />
                    </div>
                    <div class="list__content">
                      <h3 class="fw600 is-size-55 has-text-black80 line-height-14">{{ props.row.display_name }}</h3>
                    </div>
                  </nuxt-link>
                  <div class="buttons m-l-auto">
                    <b-button
                      class="m-l-auto"
                      type="is-primary"
                      rounded
                      size="is-smaller"
                      :loading="loadingIt && props.index === selectedTeam"
                      @click="
                        $emit('team', props.row)
                        selectedTeam = props.index
                      "
                      >{{ $t('prijaviSe') }}</b-button
                    >
                  </div>
                </div>
              </b-table-column>
            </b-table>
            <div class="buttons m-t-20">
              <b-button
                class="softshadow"
                type="is-small noborder"
                pack="fas"
                icon-right="plus"
                rounded
                @click="activeTab = 1"
              >
                {{ $t('izradiNoviTeniskiPar') }}
              </b-button>
            </div>
          </div>
          <div v-else class="flex flex__column align__centar__y">
            <template v-if="isLoaded">
              <b-icon icon="exclamation-square" type="is-danger" size="is-large" pack="fal"></b-icon>
              <div class="fw600 is-size-4 has-text-centered has-text-danger m-b-10 m-t-10">
                {{ $t('nemateTeniskiPar') }}
              </div>
              <div class="fw600 is-size-6 has-text-centered p-l-10 p-r-10">
                {{ $t('zaPrijavuNaTurnirParovaMorateSePrijavitiSTeniskimP') }}
              </div>
              <div class="buttons m-t-20">
                <b-button
                  class="softshadow"
                  type="is-small noborder"
                  pack="fas"
                  icon-right="plus"
                  rounded
                  @click="activeTab = 1"
                >
                  {{ $t('izradiSvojPrviTeniskiPar') }}
                </b-button>
              </div>
            </template>
          </div>
        </div>
      </b-tab-item>
      <b-tab-item>
        <div v-if="showme" class="tablelist x-container">
          <div class="my-rank m-t-20">
            <div class="fw600 is-size-5 has-text-centered m-b-10">{{ $t('izradiNoviTeniskiPar') }}</div>
            <div class="list__image-col softshadow">
              <div v-if="Object.keys(firstDoublePlayer).length" class="align__centar__y">
                <div class="list__img">
                  <TennisImage :size="[42, 42]" :src="firstDoublePlayer.image" class="user_image" alt="" />
                </div>
                <div class="list__content m-r-auto">
                  <h3>{{ firstDoublePlayer.display_name }}</h3>
                  <h4>{{ $t('godina range', { range: firstDoublePlayer.range }) }}</h4>
                </div>
              </div>
            </div>
            <div class="list__image-col softshadow m-t-2">
              <div v-if="Object.keys(secondDoublePlayer).length" class="align__centar__y">
                <div class="list__img">
                  <TennisImage :size="[42, 42]" :src="secondDoublePlayer.image" class="user_image" alt="" />
                </div>
                <div class="list__content m-r-auto">
                  <h3>{{ secondDoublePlayer.display_name }}</h3>
                  <h4>{{ $t('godina range', { range: secondDoublePlayer.range }) }}</h4>
                </div>
                <div class="buttons m-l-auto">
                  <b-button
                    class="m-l-auto"
                    type="is-danger"
                    rounded
                    size="is-smaller"
                    @click="secondDoublePlayer = {}"
                    >{{ $t('ukloni') }}</b-button
                  >
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
                  {{ $t('dodajPartnera') }}
                </b-button>
              </div>
            </div>
          </div>
        </div>
        <template v-if="Object.keys(firstDoublePlayer).length && Object.keys(secondDoublePlayer).length">
          <h5 class="has-text-black80">{{ $t('fotografijaNijeObvezno') }}</h5>
          <photoUpload @update="team.image = $event" />
        </template>
        <div class="buttons m-t-20 m-b-5">
          <b-button
            class="softshadow"
            type="is-small noborder"
            pack="fal"
            icon-left="chevron-left"
            rounded
            @click="activeTab = 0"
          >
            {{ $t('nazad') }}
          </b-button>

          <b-button
            class="softshadow m-t-10 m-b-20 invert-small-button"
            type="is-small noborder is-primary has-text-white"
            pack="fal"
            icon-right="check"
            rounded
            :loading="loading1"
            @click="save"
          >
            {{ $t('spremiNoviPar') }}
          </b-button>
        </div>
      </b-tab-item>
    </b-tabs>

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
import modalMembers from '~/components/modal/ModalMembersAll'
import Team from '~/models/Team'
import photoUpload from '~/components/photoUpload'

export default {
  name: 'DoublesNew',
  components: {
    TennisImage,
    photoUpload,
    modalMembers,
  },
  props: {
    loadingIt: {
      type: Boolean,
      required: false,
      default: false,
    },
    immidiate: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      heroImage: '/hero_doubles.jpg',
      firstDoublePlayer: {},
      secondDoublePlayer: {},
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
      myTeams: false,
      activeTab: 0,
      selectedTeam: null,
      isLoaded: null,
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
  watch: {
    myTeams: {
      handler() {
        this.$emit('listofteams', this.myTeams)
      },
    },
  },
  mounted() {
    this.prepopulate()
    this.getPlayersDoubles()
  },
  methods: {
    getPlayersDoubles() {
      this.loading = true
      Team.where('number_of_players', 2)
        .where('players', this.user.id)
        .get()
        .then((res) => {
          this.myTeams = res.data
          this.isLoaded = true
          this.loading = false
          this.$emit('listofteams', this.myTeams)
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading = false
        })
    },
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
        this.loading1 = true
        this.team.players.push(this.firstDoublePlayer)
        this.team.players.push(this.secondDoublePlayer)
        const team = new Team(this.team)
        team
          .save()
          .then(() => {
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste se spremili par'),
              type: 'is-success',
            })
            this.getPlayersDoubles()
            this.loading1 = false
            this.activeTab = 0
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
              type: 'is-danger',
            })
            this.loading1 = false
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
