<template>
  <div class="results">
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
      <div class="tab__header m-b-20">
        <div>{{ $t('komentari') }}</div>
      </div>
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

      <div class="comment-input-box">
        <form @submit.prevent="submitComment">
          <b-input v-model="message" :placeholder="$t('komentiraj')" class="input-message" autofocus></b-input>
          <b-icon
            :icon="sending ? 'spinner' : 'paper-plane'"
            size="is-large"
            type="is-primary"
            :pack="sending ? 'far' : 'fal'"
            :custom-class="sending ? ['rotating'] : ''"
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
import TennisImage from '@/components/TennisImage.vue'
import Result from '@/models/Result'
import Comment from '@/models/Comment'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import resultBox from '~/components/ResultBox'

export default {
  name: 'Comments',
  components: {
    resultBox,
    modalConfirmation,
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
      message: this.$t(''),
      result: {},
      sending: false,
      loadingVeryfing: false,
      comments: [],
      result_id: null,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  beforeDestroy() {
    this.$echo.leave('result.' + this.result.id)
  },
  methods: {
    getResults() {
      Result.find(this.$route.params.id).then((res) => {
        this.result = new Result(res)
        this.result
          .comments()
          .get()
          .then((res) => {
            this.comments = res.data
            this.$echo.channel('result.' + this.result.id).listen('ResultCommentAdded', (e) => {
              this.comments.push(e.comment)
            })
            this.$root.$loading.finish()
            this.scrollToBottom(500)
          })
          .catch(() => {
            this.$root.$loading.finish()
          })
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
