<template>
  <div class="dont-show-totop">
    <template>
      <div :class="isScrolled ? 'is-fixed-floating' : +''" class="breadcrumbs breadcrumbs-back m-t-10 transition">
        <a class="fw600 is-size-55 has-text-black80 align__centar__y" @click="$router.go(-1)">
          <b-icon icon="arrow-circle-left" pack="fal" type="is-black80" class="m-r-5"> </b-icon>
          <span class="m-r-5">{{ $t('nazad') }}</span>
        </a>
      </div>
    </template>
    <div class="activity x-container">
      <div v-if="thread.players.length < 3" class="my-rank tablelist comments">
        <h5>{{ $t('lanovi3') }}</h5>
        <div v-if="player" class="list__image-col">
          <nuxt-link :to="localePath('/player/' + player.id)">
            <div class="list__img">
              <TennisImage :size="[42, 42]" :src="player.image" class="user_image" alt="" />
            </div>
            <div class="list__content m-r-auto">
              <h3 class="player__name">{{ player.display_name }}</h3>
              <h4>{{ $t('godina range', { range: player.range }) }}</h4>
            </div>
            <b-tag type="is-info">{{ Math.round(player.rating) }}</b-tag>
          </nuxt-link>
        </div>
      </div>
      <div v-else class="activity my-rank">
        <h5>{{ $t('lanovi3') }}</h5>
        <div class="cup__players-list">
          <div v-for="(p, index) in thread.players" :key="p.id + index" class="align__centar__y">
            <TennisImage :size="[42, 42]" :src="p.image" class="user_image" alt="" />
            <span v-if="thread.players.length < 4" class="player__name m-l-10">{{ p.name }}</span>
          </div>
        </div>
      </div>
      <div v-if="isAdmin" class="buttons m-t-30">
        <b-button
          class="m-l-10 fw600"
          type="is-danger"
          pack="fal"
          icon-right="times"
          rounded
          :loading="loadingDelete"
          @click.prevent="deleteThread()"
        >
          {{ $t('Obriši grupu') }}
        </b-button>
      </div>

      <div class="activity x-container p-b-75">
        <div class="tab__header m-b-20">
          <div>{{ $t('poruke') }}</div>
        </div>
        <div v-if="page <= messages_last_page" class="buttons">
          <b-button class="m-t-10 m-b-15" type="is-danger" pack="fal" icon-right="scroll-old" rounded @click="loadMore">
            {{ $t('uitajStarijePoruke') }}
          </b-button>
        </div>
        <div v-chat-scroll="{ always: false, smooth: true, window: true }" class="comments p-b-10">
          <div
            v-for="(comment, index) in sorted"
            :key="comment.id + index"
            :class="{
              'comments-item': true,
              my_comments: $auth.user.id === comment.player.id && comment.multimedia_type !== 'terms',
              terms: comment.multimedia_type === 'terms',
            }"
            class=""
            @click="
              showMiniPop = !showMiniPop
              selectedMessage = comment
            "
          >
            <text-message v-if="!comment.multimedia_type" :comment="comment" />
            <term-message v-if="comment.multimedia_type === 'terms'" :players="thread.players" :comment="comment" />
            <image-message v-if="comment.multimedia_type === 'image'" :comment="comment" />
            <div
              v-if="
                showMiniPop &&
                selectedMessage.id === comment.id &&
                comment.multimedia_type !== 'terms' &&
                user.id === comment.player.id
              "
              class="context m-r-10 m-t-40"
            >
              <div
                v-for="(item, i) in miniPopContent"
                :key="i"
                class="context-item has-text-white fw600"
                @click="deleteMessage()"
              >
                <b-icon :icon="item.icon" type="is-danger" pack="fal" class="m-r-5"> </b-icon>{{ $t(item.name) }}
              </div>
            </div>
          </div>
          <transition name="fade">
            <div v-if="loading" class="align__centar__x loading_z_spinner--bottom m-t-20">
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
        </div>
        <div class="buttons">
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="previewImage($event.target)"
          />
        </div>
        <div class="comment-input-box">
          <form class="m-l--16" @submit.prevent="submitMessage">
            <div class="comment-buttons">
              <b-input
                v-model="new_message"
                :placeholder="$t('upiiPoruku')"
                class="input-message"
                @focus="test = 'bla'"
              ></b-input>
              <transition name="slide">
                <div v-if="!new_message" class="comment-icons">
                  <b-icon
                    class="m-r-20"
                    icon="camera"
                    size="is-normal"
                    type="is-grey"
                    pack="fal"
                    @click.native.prevent="chooseFiles"
                  ></b-icon>
                  <b-icon
                    class="m-r-20"
                    icon="tennis-ball"
                    size="is-normal"
                    type="is-grey"
                    pack="fal"
                    native-type="submit"
                    @click.native.prevent="termModal = true"
                  ></b-icon>
                </div>
              </transition>
            </div>
            <b-icon
              class="comment-send"
              :custom-class="sending || loading ? 'rotating' : ''"
              :icon="sending ? 'spinner' : 'paper-plane'"
              :pack="sending ? 'far' : 'fal'"
              size="is-large"
              type="is-primary"
              native-type="submit"
              @click.native.prevent="submitMessage"
            ></b-icon>
          </form>
        </div>
      </div>
      <b-modal :active.sync="termModal" scroll="clip" class="terms__modal">
        <terms @sendList="getList"></terms>
      </b-modal>
      <div class="image__preview__modal">
        <b-modal :active.sync="showImagePreview" :width="640" scroll="keep">
          <div class="card">
            <div class="card-image">
              <figure class="image">
                <TennisImage :size="[500, 500]" :src="multimedia" :alt="$t('image')" />
              </figure>
            </div>
          </div>
          <form @submit="submitMessage">
            <div class="comment-buttons">
              <b-input
                v-model="new_message"
                :placeholder="$t('dodajOpis')"
                rounded
                class="m-t-15 input-message"
              ></b-input>
            </div>
            <div class="buttons m-t-20">
              <b-button
                class="m-l-10"
                type="is-danger"
                pack="far"
                icon-right="times"
                rounded
                @click.prevent="multimedia = ''"
              >
                {{ $t('otkai') }}
              </b-button>
              <b-button
                class="m-l-10"
                type="is-primary"
                pack="fal"
                :custom-class="sending ? 'inactive' : ''"
                :icon-right="sending ? 'spinner' : 'paper-plane'"
                rounded
                native-type="submit"
                @click.native.prevent="submitMessage"
              >
                {{ $t('poalji') }}
              </b-button>
            </div>
          </form>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
// TODO: On scroll fixed position, blur background
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Message from '@/models/Message'
import TextMessage from '@/components/messages/textMessage'
import TermMessage from '@/components/messages/termsMessage'
import ImageMessage from '@/components/messages/imageMessage'
import { Camera } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import Thread from '~/models/Thread'
import Terms from '~/pages/terms/indexChat'

export default {
  name: 'Thread',
  components: { ImageMessage, TermMessage, TextMessage, Terms, TennisImage },
  data() {
    return {
      thread: {
        players: [],
      },
      test: '',
      messages: [],
      multimedia_type: '',
      multimedia: '',
      page: 1,
      messages_last_page: 1,
      messages_total: 0,
      new_message: '',
      loading: false,
      loadingDelete: false,
      sending: false,
      termModal: false,
      isScrolled: false,
      socket: false,
      showMiniPop: false,
      miniPopContent: [{ name: 'Obriši poruku', icon: 'times-circle' }],
      selectedMessage: {},
    }
  },
  computed: {
    isAdmin() {
      return this.$store.state.auth.user.is_admin
    },
    user() {
      return this.$store.state.auth.user
    },
    player() {
      return _.find(this.thread.players, (player) => {
        return player.id !== this.$auth.user.id
      })
    },
    showImagePreview() {
      return !!this.multimedia
    },
    sorted() {
      return _.sortBy(_.uniqBy(this.messages, 'id'), 'created_at')
    },
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    this.$echo.leave('thread.' + this.thread.id)
    App.removeAllListeners()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    Thread.find(this.$route.params.id).then((res) => {
      this.thread = new Thread(res)
      this.getMessages()
    })
    App.addListener('appStateChange', (state) => {
      if (state.isActive) {
        this.socket = false
        this.getMessages()
      }
    })
  },
  methods: {
    deleteThread() {
      this.loadingDelete = true
      const x = new Thread({ id: this.$route.params.id })
      x.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali poruku'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/messages/'))
          this.loadingDelete = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Popunite sva polja i pokušajte ponovo.'),
            type: 'is-danger',
          })
          this.loading = false
          this.loadingDelete = false
        })
    },
    deleteMessage() {
      const m = new Message({ id: this.selectedMessage.id })
      m.delete().then(() => {
        this.$buefy.toast.open({
          message: this.$t('Uspješno ste obrisali poruku'),
          type: 'is-success',
        })
        const x = this.messages.filter((message) => {
          return message.id !== this.selectedMessage.id
        })
        this.messages = x
        this.showMiniPop = false
      })
    },
    getMessages() {
      this.thread
        .messages()
        .get()
        .then((res) => {
          this.messages = [...this.messages, ...res.data.reverse()]
          this.messages_total = res.meta.total
          this.messages_last_page = res.meta.last_page
          this.page++
          this.scrollToBottom(500)
          if (!this.socket) {
            this.$echo.channel('thread.' + this.thread.id).listen('MessageSent', (e) => {
              this.messages.push(e.message)
              this.messages_total++
            })
            this.$echo.connector.pusher.connection.bind('error', (e) => {
              this.getMessages()
            })
            this.socket = true
          }
        })
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 100
    },
    scrollToBottom(offset) {
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight)
      }, offset)
    },
    scrollToTop() {
      window.scrollTo(0, 0)
    },
    async chooseFiles() {
      if (Capacitor.isNativePlatform()) {
        const permission = await Camera.checkPermissions()
        if (permission.photos === 'prompt') {
          await Camera.requestPermissions()
        }
        if (permission.photos === 'granted') {
          // have permission handle
          const photo = await Camera.getPhoto({
            width: 1024,
            height: 1024,
            quality: 80,
            resultType: 'dataUrl',
          })
          this.multimedia = photo.dataUrl
          this.multimedia_type = 'image'
        }
      } else {
        document.getElementById('fileInput').click()
      }
    },
    previewImage(input) {
      if (input.files && input.files[0]) {
        const reader = new FileReader()

        reader.onload = function (e) {
          this.multimedia = e.target.result
          this.multimedia_type = 'image'
        }.bind(this)

        reader.readAsDataURL(input.files[0])
      }
    },
    loadMore() {
      if (this.page <= this.messages_last_page) {
        this.thread
          .messages()
          .page(this.page)
          .get()
          .then((res) => {
            this.messages = [...res.data.reverse(), ...this.messages]
            this.messages_total = res.meta.total
            this.messages_last_page = res.meta.last_page
            this.page++
          })
      }
    },
    submitMessage() {
      if (!this.sending && (this.new_message || this.multimedia)) {
        this.sending = true
        const m = new Message({
          message: this.new_message,
          type: this.multimedia_type,
          multimedia: this.multimedia,
        }).for(this.thread)
        m.save().then(() => {
          this.new_message = ''
          this.multimedia_type = ''
          this.sending = false
          this.multimedia = ''
          this.scrollToBottom()
        })
      }
    },
    addImage() {
      this.showImage = true
    },
    getList(list) {
      this.$root.$loading.start()
      const m = new Message({ message: list, type: 'terms' }).for(this.thread)
      m.save().then(() => {
        this.new_message = ''
        this.multimedia = false
        this.multimedia = false
        this.multimedia_type = ''
        this.sending = false
        this.termModal = false
        this.$root.$loading.finish()
        this.scrollToBottom(500)
      })
    },
  },
}
</script>
<style scoped>
.image__preview__modal >>> .modal-close {
  display: none;
}
.modal-content {
  padding: 0;
}
.terms__modal >>> .modal-content {
  padding: 0;
}
/*.terms__modal >>> .modal-background {*/
/*  background-color: rgb(233 238 243);*/
/*}*/
</style>
