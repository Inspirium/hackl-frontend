<template>
  <div class="results">
    <transition name="slide-fade" mode="out-in">
      <div
        v-if="result.live_data ? result.live_data.pause : false"
        class="fw600 is-size-55 small-hero w100 m-b-10 is-red rounded-md has-text-white"
      >
        <div class="has-text-centered">{{ $t('pauza') }}</div>
      </div>
    </transition>
    <template v-if="isAdmin && show">
      <div class="breadcrumbs breadcrumbs-back m-t-10">
        <a class="fw600 is-size-55 has-text-black80 align__centar__y" @click="$router.go(-1)">
          <b-icon icon="arrow-circle-left" pack="fal" type="is-black80" class="m-r-5"> </b-icon>
          <span class="m-r-5">{{ $t('nazad') }}</span>
        </a>
      </div>
    </template>
    <div class="activity x-container">
      <div class="activity__results">
        <div class="activity__box">
          <div class="results__list">
            <div>
              <resultBoxLivePreview v-if="result.live === 1" class="relative z-1" :result="result" />
              <template v-else>
                <resultBox
                  v-if="result.id"
                  class="relative z-1"
                  :class="{ blur_button: loadingVeryfing }"
                  :result="result"
                  @delete="confirm($event)"
                  @dispute="dispute($event)"
                  @confirm="verifyResult($event)"
                >
                </resultBox>
              </template>
            </div>
          </div>
        </div>
      </div>
      <template v-if="result.live === 1 && isAdmin && show">
        <div class="align__centar__all m-b-20">
          <div class="modal-subtitle is-uppercase m-r-10 has-text-danger">{{ $t('sudac') }}</div>
          <TennisImage :size="[42, 42]" :src="umpire.image" class="user_image-small m-r-10 border__white" alt="" />
          <div class="is-text-center fw600 is-size-5">{{ umpire.display_name }}</div>
        </div>
      </template>
      <div class="buttons m-b-10">
        <b-button
          v-if="isAdmin && show"
          class="m-b-0 softshadow"
          type="is-small noborder"
          pack="fal"
          icon-right="play-circle"
          rounded
          @click="$router.push(localePath('/live/' + result.game_id))"
        >
          {{ $t('nastaviLivePrijenos') }}
        </b-button>
      </div>
      <div class="buttons m-b-10">
        <b-button
          v-if="isAdmin && show"
          class="m-b-0 softshadow"
          type="is-small noborder"
          pack="fal"
          icon-right="minus-circle"
          rounded
          @click="
            zoom -= 20
            zoomDisplay()
          "
        >
          {{ $t('smanji') }}
        </b-button>
        <b-button
          v-if="isAdmin && show"
          class="m-b-0 softshadow"
          type="is-small noborder"
          pack="fal"
          icon-right="plus-circle"
          rounded
          @click="
            zoom += 20
            zoomDisplay()
          "
        >
          {{ $t('poveaj') }}
        </b-button>
      </div>
      <div v-if="isAdmin && show" class="buttons m-b-10">
        <b-button
          class="softshadow invert-small-button"
          type="is-small noborder is-danger has-text-white"
          pack="fal"
          rounded
          @click="show = false"
        >
          {{ $t('sakrijOpcije') }}
        </b-button>
      </div>
      <div class="buttons live-display-options">
        <b-button
          v-if="isAdmin && !show"
          class="softshadow invert-small-button"
          type="is-small noborder is-danger has-text-white"
          pack="fal"
          rounded
          @click="show = true"
        >
          {{ $t('opcije') }}
        </b-button>
      </div>

      <template v-if="result.live === 1">
        <template v-if="result.live_data.showComments">
          <div class="tab__header m-b-20">
            <div>{{ $t('komentari') }}</div>
          </div>
          <template v-if="comments.length">
            <div class="comments p-b-75 flex__column-revers">
              <div
                v-for="(comment, index) in comments"
                :key="index + comment.id"
                :class="{ 'comments-item': true, my_comments: $auth.user.id === comment.player_id }"
              >
                <nuxt-link :to="localePath('/player/' + comment.player.id)">
                  <TennisImage :size="[42, 42]" :src="comment.player.image" class="user_image m-r-5" />
                </nuxt-link>
                <div class="comment-box">
                  <div class="">
                    <div class="comment-author modal-subtitle m-b-5">
                      {{ comment.player.display_name }}
                    </div>
                    <div class="comment-message title-num">
                      {{ comment.message }}
                    </div>
                    <h4 class="comment-date has-text-right">
                      {{ comment.created_at | moment('LT') }}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
        <div v-else class="first-comment">
          <div class="comment-message title-num">
            {{ $t('komentariNaMeSu') }} <span class="has-text-danger">{{ $t('onemogueni') }}</span>
          </div>
        </div>
      </template>

      <template v-else>
        <template v-if="comments.length">
          <div v-chat-scroll class="comments p-b-75">
            <div
              v-for="(comment, index) in comments"
              :key="index + comment.id"
              :class="{ 'comments-item': true, my_comments: $auth.user.id === comment.player_id }"
            >
              <nuxt-link :to="localePath('/player/' + comment.player.id)">
                <TennisImage :size="[42, 42]" :src="comment.player.image" class="user_image m-r-5" />
              </nuxt-link>
              <div class="comment-box">
                <div class="">
                  <div class="comment-author modal-subtitle m-b-5">
                    {{ comment.player.display_name }}
                  </div>
                  <div class="comment-message title-num">
                    {{ comment.message }}
                  </div>
                  <h4 class="comment-date has-text-right">
                    {{ comment.created_at | moment('LT') }}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="first-comment">
          <div class="comment-message title-num">
            <span class="has-text-lightblue">{{ user.first_name }},</span> {{ $t('komentirajRezultat') }}
          </div>
          <b-icon icon="hand-point-down" size="is-small" pack="fas" class="anim__up-down m-t-15"></b-icon>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import Result from '@/models/Result'
import Player from '@/models/Player'
import Comment from '@/models/Comment'
import resultBox from '~/components/ResultBox'
import resultBoxLivePreview from '~/components/ResultBoxLivePreview'

export default {
  name: 'Comments',
  layout: 'noTop',
  components: {
    resultBox,
    resultBoxLivePreview,
    TennisImage,
  },
  async fetch() {
    if (process.client) {
      this.$nextTick(() => {
        this.$root.$loading.start()
      })
    }
    await this.$nextTick(() => {
      this.getResults()
    })
  },
  data() {
    return {
      isModalDisputeActive: false,
      isModalActive: false,
      loadingVeryfing: false,
      message: '',
      result: {},
      sending: false,
      comments: [],
      result_id: null,
      umpire: {},
      zoom: 100,
      show: true,
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
  beforeDestroy() {
    this.$echo.leave('live.' + this.result.game_id)
  },
  methods: {
    zoomDisplay() {
      document.body.style.zoom = this.zoom + '%'
    },
    async getPlayer() {
      this.umpire = await Player.$find(Object.keys(this.result).length ? this.result.live_data.umpire : 2)
    },
    getResults() {
      Result.find(this.$route.params.id).then((res) => {
        this.result = new Result(res)
        if (this.result.live === 1) {
          this.$echo.channel('live.' + this.result.game_id).listen('LiveResultUpdated', (e) => {
            this.result = e.game.result
          })
        }
        /* this.result
          .comments()
          .get()
          .then((res) => {
            this.comments = res.data
            this.$echo.channel('result.' + this.result.id).listen('ResultCommentAdded', (e) => {
              this.comments.push(e.comment)
            })
            this.$root.$loading.finish()
            if (this.result.live !== 1) {
              this.scrollToBottom(500)
            }
          })
          .catch(() => {
            this.$root.$loading.finish()
          }) */
      })
      if (!this.comments.length) {
        this.$root.$loading.finish()
      }
    },
    verifyResult(id) {
      const r = new Result({ id })
      this.loadingVeryfing = true
      Result.custom(r, 'verify')
        .get()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste potvrdili rezultat'),
            type: 'is-success',
          })
          this.loadingVeryfing = false
          this.$router.push(this.localePath('/result'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loadingVeryfing = false
        })
    },
    dispute(item) {
      this.result_id = item
      this.isModalDisputeActive = true
    },
    disputeResult() {
      if (this.result_id) {
        this.loadingVeryfing = true
        const r = new Result({ id: this.result_id })
        Result.custom(r, 'dispute')
          .get()
          .then(() => {
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste osporili rezultat'),
              type: 'is-success',
            })
            this.loadingVeryfing = false
            this.$router.push(this.localePath('/result'))
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške, pokušajte ponovno'),
              type: 'is-danger',
            })
            this.loadingVeryfing = false
          })
      }
    },
    scrollToBottom(offset) {
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight)
      }, offset)
    },
    confirm(item) {
      this.result_id = item
      this.isModalActive = true
    },
    deleteResult() {
      if (this.result_id) {
        const r = new Result({ id: this.result_id })
        r.delete()
          .then(() => {
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste obrisali rezultat'),
              type: 'is-success',
            })
            this.$router.push(this.localePath('/result'))
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške, pokušajte ponovno'),
              type: 'is-danger',
            })
          })
      }
    },
    submitComment() {
      if (this.message && !this.sending) {
        this.sending = true
        const c = new Comment({ message: this.message }).for(this.result)
        c.save()
          .then(() => {
            this.message = ''
            this.sending = false
            this.getResults()
          })
          .catch(() => {
            this.sending = false
          })
      }
    },
  },
}
</script>
<style scoped>
.topnav {
  opacity: 0;
}
</style>
