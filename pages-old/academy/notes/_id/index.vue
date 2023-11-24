<template>
  <div v-if="isAdmin || user.is_trainer || samePlayer" class="member p-b-300">
    <template v-if="Object.keys(note).length">
      <PageHeader
        :second="{ name: $t('Napomene'), link: '/academy/notes' }"
        :title="$t('Napomene trenera')"
        :background="'is-primary'"
      />
      <div
        class="align__centar__all badge-acrylic has-text-white p-t-10 p-b-10 border-dashed-top"
        @click="$router.push(localePath('/academy/' + playerId))"
      >
        <div class="modal-subtitle is-uppercase m-r-10"></div>
        <TennisImage
          v-if="player.image"
          :size="[42, 42]"
          :src="player.image"
          class="user_image m-r-10 border__white--2"
          alt=""
        />
        <div class="is-text-center fw600 is-size-5">{{ player.display_name }}</div>
      </div>
      <div class="activity x-container">
        <div class="member__info">
          <div v-if="user.id !== player.id" class="buttons m-t-20">
            <b-button
              v-if="!player.hidden_fields?.hide_my_phone || isAdmin"
              class="m-l-10"
              type="is-primary"
              pack="far"
              icon-right="plus"
              rounded
              @click="
                $router.push({
                  path: localePath('/academy/notes/new'),
                  query: { player: player.id },
                })
              "
            >
              {{ $t('izradiNovo') }}
            </b-button>
          </div>
        </div>
        <template>
          <!-- eslint-disable-next-line -->
        <div class="m-t-20">
            <div class="divider-line-1 m-b-5"></div>
            <div class="flex justify-between align__centar__y">
              <div class="date">
                {{ note.created_at | moment('DD.MM.YYYY.') }}
              </div>
              <b-icon v-if="note.is_public" icon="eye" size="is-larger m-t--3" type="is-primary" pack="fal"></b-icon>
              <b-icon v-else icon="eye-slash" size="is-larger m-t--3" type="is-danger" pack="fal"></b-icon>
            </div>
            <div
              v-for="(item, index) in note.videos"
              :key="index"
              style="padding: 56.34% 0 0 0; position: relative"
              class="m-t-15"
            >
              <iframe
                :src="item"
                frameborder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
              ></iframe>
            </div>
            <div v-if="note.title" class="has-text-left fw600 is-size-4 m-t-10">{{ note.title }}</div>
            <div v-if="note.content" class="has-text-left is-size-65 content-tiny" v-html="note.content"></div>
          </div>
          <div class="align__centar__y m-t-10">
            <TennisImage
              v-if="note.trainer.image"
              :size="[32, 32]"
              class="user_image-small m-r-10"
              :src="note.trainer.image"
            />
            <div class="is-size-65 fw600 has-text-black50">
              {{ note.trainer.display_name }}
            </div>
          </div>
        </template>
        <div v-if="isAdmin || user.is_trainer" class="buttons m-t-20">
          <b-button
            class="softshadow m-l-10"
            type="is-small noborder"
            pack="far"
            icon-right="times"
            rounded
            @click.native.prevent="deleteNote()"
          >
            {{ $t('Obriši') }}
          </b-button>
          <b-button
            class="softshadow"
            type="is-small noborder"
            pack="fal"
            rounded
            :loading="loadingMessage"
            tag="nuxt-link"
            :to="localePath('/academy/notes/' + note.id + '/edit')"
          >
            {{ $t('Uredi') }}
          </b-button>
        </div>
        <div class="divider-line-1"></div>
        <div class="buttons m-t-20">
          <b-button
            class=""
            type="is-primary"
            pack="far"
            icon-right="chevron-right"
            rounded
            tag="nuxt-link"
            :to="localePath('/academy/' + playerId)"
          >
            {{ $t('Prikaži sve') }}
          </b-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Thread from '@/models/Thread'
import Player from '~/models/Player'
import Note from '~/models/TrainerNote'
import PageHeader from '~/components/headers/blankBack'

export default {
  name: 'AcademyMember',
  components: {
    PageHeader,
    TennisImage,
  },
  data() {
    return {
      bottom: false,
      page: 1,
      activeTab: 0,
      is_parent: false,
      notes: [{ description: '', videos: [] }],
      player: {},
      noteMeta: {},
      note: {},
      loading: false,
      loadingMessage: false,
    }
  },
  computed: {
    samePlayer() {
      if (Object.keys(this.player).length === 0) return false
      return this.user.team.id === this.player?.team.id
    },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    isAdmin() {
      return this.user.is_admin
    },
    playerId() {
      return this.note.team.primary_contact_id
    },
  },
  mounted() {
    this.getNotes()
  },
  methods: {
    addNewChild() {
      // console.log('bla bal')
    },
    getPlayer() {
      Player.find(this.note.team.players[0].id).then((res) => {
        this.player = res
      })
    },
    getNotes() {
      this.loading = true
      Note.include('team', 'trainer')
        .find(this.$route.params.id)
        .then((res) => {
          this.note = res
          this.loading = false
          this.getPlayer()
        })
    },
    deleteNote() {
      const n = new Note(this.note)
      n.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali napomenu'),
            type: 'is-success',
          })
          this.$router.push(this.localePath(`/academy/notes/`))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
        })
    },
    submitMessage() {
      this.loadingMessage = true
      Thread.whereIn('players_exact', [this.user.id, this.player.id])
        .get()
        .then((res) => {
          if (res.data.length) {
            this.$router.push(this.localePath(`/messages/${res.data[0].id}`))
          } else {
            const t = new Thread({ players: [this.player] })
            t.save().then((res) => {
              this.$router.push(this.localePath(`/messages/${res.id}`))
            })
          }
          this.loadingMessage = false
        })
        .catch(() => {
          this.loadingMessage = false
        })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
  },
}
</script>
<style scoped>
.section {
  padding: 1rem;
}
</style>
