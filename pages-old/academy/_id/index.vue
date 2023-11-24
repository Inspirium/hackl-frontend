<template>
  <div v-if="isAdmin || user.is_trainer || samePlayer" class="member p-b-300">
    <template v-if="notes.length && Object.keys(player).length">
      <template>
        <div class="breadcrumbs breadcrumbs-back m-t-10">
          <a
            class="fw600 is-size-55 has-text-black80 align__centar__y fade-in-left anim_delay_2 opacity-0"
            @click="$router.go(-1)"
          >
            <b-icon icon="arrow-circle-left" pack="fal" type="is-black80" class="m-r-5"> </b-icon>
            <span class="m-r-5">{{ $t('nazad') }}</span>
          </a>
        </div>
      </template>
      <div class="activity x-container m-t--20">
        <div class="member__info">
          <TennisImage
            v-if="player.image"
            :size="[180, 180]"
            :src="player.image"
            class="user_image-large m-r-5"
            alt=""
          />
          <div class="title m-b-5 m-t-5">{{ player.display_name }}</div>
          <div class="modal-subtitle">{{ $t('godina range', { range: player.range }) }}</div>
          <div v-if="user.id !== player.id" class="buttons m-t-20">
            <b-button
              v-if="!player.hidden_fields?.hide_my_phone || isAdmin"
              :href="'tel:' + player.phone"
              tag="a"
              class="softshadow m-l-10"
              type="is-small noborder"
              pack="far"
              icon-right="phone"
              rounded
            >
              {{ $t('nazovi') }}
            </b-button>
            <b-button
              class="softshadow m-l-10"
              type="is-small noborder"
              pack="fal"
              icon-right="comments"
              rounded
              :loading="loadingMessage"
              @click.native.prevent="submitMessage"
            >
              {{ $t('poaljiPoruku') }}
            </b-button>
          </div>
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
          <div v-if="notes.length" class="fw600 is-size-35 m-b-10 m-t-30">{{ $t('Napomene trenera') }}</div>
          <template v-else>
            <section class="section m-t-30">
              <div class="content has-text-grey has-text-centered">
                <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
                <div class="fw600 is-size-4 has-text-centered has-text-black80 m-b-5 m-t-0">
                  {{ $t('nemaPodataka') }}
                </div>
              </div>
            </section>
          </template>

          <!-- eslint-disable-next-line -->
        <transition-group name="slide">
            <div v-for="(note, index) in notes" :key="note.id" class="m-b-30">
              <div class="divider-line-1 m-b-5"></div>
              <div class="flex justify-between align__centar__y">
                <div class="date">
                  {{ note.created_at | moment('DD.MM.YYYY.') }}
                </div>
                <b-icon v-if="note.is_public" icon="eye" size="is-larger m-t--3" type="is-primary" pack="fal"></b-icon>
                <b-icon v-else icon="eye-slash" size="is-larger m-t--3" type="is-danger" pack="fal"></b-icon>
              </div>
              <div class="align__centar__y m-t-10">
                <TennisImage :size="[32, 32]" class="user_image-small m-r-10" :src="note.trainer.image" />
                <div class="is-size-65 fw600 has-text-black50">
                  {{ note.trainer.display_name }}
                </div>
              </div>
              <div
                v-for="(item, i) in note.videos"
                :key="i"
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
              <div v-if="user.id !== player.id" class="buttons m-t-20">
                <b-button
                  class="softshadow m-l-10"
                  type="is-small noborder"
                  pack="far"
                  icon-right="times"
                  rounded
                  @click.native.prevent="deleteNote(note, index)"
                >
                  {{ $t('Obriši') }}
                </b-button>
                <b-button
                  class="softshadow m-l-10"
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
            </div>
          </transition-group>
        </template>
      </div>
    </template>
    <transition name="fade">
      <div v-if="loading" class="align__centar__x loading_z_spinner m-t-100">
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

    <template v-if="!notes.length && !loading">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
          <p class="modal-title">{{ $t('nemaPodataka') }}</p>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Thread from '@/models/Thread'
import Player from '~/models/Player'
import Note from '~/models/TrainerNote'

export default {
  name: 'AcademyMember',
  components: {
    TennisImage,
  },
  data() {
    return {
      offset: 1,
      total: 0,
      last_page: 1,
      bottom: false,
      activeTab: 0,
      is_parent: false,
      player: {},
      noteMeta: {},
      notes: [],
      loading: false,
      loadingMessage: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    isAdmin() {
      return this.user.is_admin
    },
    samePlayer() {
      if (Object.keys(this.player).length === 0) return false
      return this.user.team.id === this.player?.team.id
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        this.offset++
        this.getNotes()
      }
    },
  },
  mounted() {
    this.loading = true
    this.getPlayer()
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.offset = 1
  },
  methods: {
    addNewChild() {
      // console.log('bla bal')
    },
    getPlayer() {
      Player.find(this.$route.params.id).then((res) => {
        this.player = res
        this.getNotes()
      })
    },
    getNotes() {
      console.log(this.player.team.id)
      const p = Note.page(this.offset)
      p.include('team', 'trainer').where('club', this.$store.state.club.id).where('team', this.player.team.id)
      if (this.samePlayer) {
        p.where('is_public', true)
      }
      p.get().then((res) => {
        if (this.offset === 1) {
          this.notes = res.data
        } else {
          this.notes = [...this.notes, ...res.data]
        }
        this.total = res.meta.total
        this.last_page = res.meta.last_page
        this.page++
        this.loading = false
      })
    },
    deleteNote(item, index) {
      const n = new Note(item)
      n.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali napomenu'),
            type: 'is-success',
          })
          this.notes.splice(index, 1)
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
