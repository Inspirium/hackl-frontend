<template>
  <div class="results no-double-zoom dont-show-totop p-b-500">
    <transition name="slide-fade" mode="out-in">
      <div
        v-if="result.live_data ? result.live_data.pause : false"
        class="fw600 is-size-55 small-hero w100 m-b-10 is-red rounded-md has-text-white"
      >
        <div class="has-text-centered">{{ $t('pauza') }}</div>
      </div>
    </transition>
    <template>
      <div class="breadcrumbs breadcrumbs-back m-t-10">
        <a class="fw600 is-size-55 has-text-black80 align__centar__y" @click="$router.go(-1)">
          <b-icon icon="arrow-circle-left" pack="fal" type="is-black80" class="m-r-5"> </b-icon>
          <span class="m-r-5">{{ $t('nazad') }}</span>
        </a>
      </div>
    </template>
    <div class="activity x-container">
      <!--      <h2 class="has-text-white">-->
      <!--        {{ checkedResult ? result.players[0].first_name : '' }}-->
      <!--        <span class="m-l-10 m-r-10">-->
      <!--          <b-icon icon="tennis-ball" pack="far"></b-icon-->
      <!--        ></span>-->
      <!--        {{ checkedResult ? result.players[1].first_name : '' }}-->
      <!--      </h2>-->
      <div class="activity__results">
        <div class="activity__box">
          <div class="results__list">
            <div>
              <resultBoxLivePreview v-if="result.live === 1" class="relative z-1" :result="result" />
              <template v-else>
                <resultBox
                  v-if="result.id"
                  class="relative z-1"
                  :result-props="result"
                  :loading="loadingConfirm"
                  :show-options="true"
                  @delete="confirm($event)"
                  @dispute="dispute($event)"
                  @confirm="verifyResult($event)"
                >
                </resultBox>
              </template>
              <transition name="slide-fade" mode="out-in">
                <div
                  v-if="result.live === 1"
                  class="fw600 m-b-15 is-size-55 tie-break__live__label w100 m-b-10 m-t--10 is-red rounded-md has-text-white"
                >
                  <div class="has-text-centered">{{ $t('liveRezultat') }}</div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
      <template v-if="result.live === 1">
        <div class="align__centar__all m-b-20">
          <div class="modal-subtitle is-uppercase m-r-10 has-text-danger">{{ $t('sudac') }}</div>
          <TennisImage :size="[32, 32]" :src="umpire.image" class="user_image-small m-r-10 border__white" alt="" />
          <div class="is-text-center fw600 is-size-5">{{ umpire.display_name }}</div>
        </div>
      </template>
      <div class="buttons m-b-10">
        <b-button
          v-if="(umpire.id === user.id || isAdmin) && result.verified !== 1"
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
      <div class="tab__header relative m-b-20">
        <div>{{ $t('komentari') }}</div>
        <transition name="fade">
          <div v-if="loading" class="align__centar__x loading_z_spinner m-t-40">
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

      <template v-if="result.live === 1">
        <template v-if="result.live_data.showComments">
          <template v-if="comments.length">
            <div class="comments p-b-75 flex__column-revers">
              <div
                v-for="(comment, index) in comments"
                :key="index + comment.id"
                :class="{ 'comments-item': true, my_comments: $auth.user.id === comment.player_id }"
              >
                <nuxt-link :to="localePath('/player/' + comment.player.id)">
                  <TennisImage :size="[32, 32]" :src="comment.player.image" class="user_image m-r-5" />
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
      <template v-if="result.live === 1 && result.live_data.showComments">
        <div class="comment-input-box">
          <form @submit.prevent="submitComment">
            <b-input v-model="message" :placeholder="$t('komentiraj')" class="input-message m-t--5 m-r-10"></b-input>
            <b-icon
              :icon="!sending ? 'spinner' : 'paper-plane'"
              size="is-medium"
              type="is-primary"
              :pack="sending ? 'far' : 'fal'"
              :custom-class="sending ? ['rotating'] : ''"
              native-type="submit"
              @click.native="submitComment()"
            ></b-icon>
          </form>
        </div>
      </template>
      <div v-if="result.live === 0 || result.live === null" class="comment-input-box">
        <form @submit.prevent="submitComment">
          <b-input
            v-model="message"
            :placeholder="$t('komentiraj')"
            class="input-message m-t--5 m-r-10"
            autofocus
          ></b-input>
          <b-icon
            :icon="sending ? 'spinner' : 'paper-plane'"
            size="is-medium"
            type="is-primary"
            pack="far"
            :custom-class="sending ? 'rotating' : ''"
            native-type="submit"
            @click.native="submitComment()"
          ></b-icon>
        </form>
      </div>
    </div>
    <b-modal :active.sync="isModalActive" :width="640" scroll="clip" class="modal__confirmation">
      <modalConfirmation
        :title="$t('potvrdomEteObrisatiRezultat')"
        :subtitle="$t('Jeste li sigurni?')"
        @update="deleteResult"
      ></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalDisputeActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('eliteOsporitiRezultat')"
        :subtitle="$t('Osporavanjem rezultat neće biti spremljen i vaši bodovi ostaju nepromijenjeni')"
        @update="disputeResult"
      ></modalConfirmation>
    </b-modal>
  </div>
</template>

<script>
import Result from '@/models/Result'
import Player from '@/models/Player'
import Comment from '@/models/Comment'
import TennisImage from '@/components/TennisImage.vue'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import resultBox from '~/components/ResultBoxLink'
import resultBoxLivePreview from '~/components/ResultBoxLivePreview'

export default {
  name: 'Result',
  components: {
    resultBox,
    resultBoxLivePreview,
    modalConfirmation,
    TennisImage,
  },
  async fetch() {
    await this.$nextTick(() => {
      this.getResults()
    })
  },
  data() {
    return {
      isModalDisputeActive: false,
      isModalActive: false,
      message: this.$t(''),
      result: {},
      sending: false,
      comments: [],
      result_id: null,
      umpire: {},
      loading: false,
      loadingConfirm: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
  },
  methods: {
    async getPlayer() {
      if (this.result.live_data) {
        this.umpire = await Player.$find(this.result.live_data.umpire)
      }
    },
    getResults() {
      this.loading = true
      Result.find(this.$route.params.id).then((res) => {
        this.result = new Result(res)
        this.getPlayer()
        if (this.result.live === 1) {
          this.$echo.channel('live.' + this.result.game_id).listen('LiveResultUpdated', (e) => {
            this.result = e.game.result
          })
        }
        this.result
          .comments()
          .get()
          .then((res) => {
            this.comments = res.data
            this.$echo.channel('result.' + this.result.id).listen('ResultCommentAdded', (e) => {
              this.comments.push(e.comment)
            })
            this.loading = false
            if (this.result.live !== 1) {
              this.scrollToBottom(500)
            }
          })
          .catch(() => {
            this.loading = false
          })
      })
      if (!this.comments.length) {
        this.loading = false
      }
    },
    verifyResult(id) {
      const r = new Result({ id })
      this.loadingConfirm = true
      Result.custom(r, 'verify')
        .get()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste potvrdili rezultat'),
            type: 'is-success',
          })
          this.loadingConfirm = false
          this.$router.push(this.localePath('/result'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loadingConfirm = false
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
        this.loading = true
        this.sending = true
        const c = new Comment({ message: this.message }).for(this.result)
        c.save()
          .then(() => {
            this.message = ''
            this.sending = false
            this.getResults()
            this.loading = false
          })
          .catch(() => {
            this.sending = false
            this.loading = false
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
