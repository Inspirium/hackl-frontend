<template>
  <div class="">
    <template>
      <div class="breadcrumbs breadcrumbs-back m-t-10">
        <a class="fw600 is-size-55 has-text-black80 align__centar__y" @click="$router.go(-1)">
          <b-icon icon="arrow-circle-left" pack="fal" type="is-black80" class="m-r-5"> </b-icon>
          <span class="m-r-5">{{ $t('nazad') }}</span>
        </a>
      </div>
    </template>
    <div v-if="classified" class="container x-container">
      <div class="white-box m-t-20 align__centar__y flex__column">
        <div class="is-primary x-tag m-t-10">
          {{ classified.created_at | moment('DD.MM.YYYY') }}
        </div>
        <div class="tab__header m-b-10 has-text-centered">
          <div>{{ classified.title }}</div>
        </div>
        <div class="modal-subtitle has-text-centered">{{ classified.description }}</div>
        <TennisImage :size="[500, 500]" class="m-t-20 m-b-5" :src="classified.image" alt="" />
        <div v-if="classified.price" class="is-size-5 m-l-5 m-t-10 fw600 has-text-lightblue">
          {{ $t('Cijena') }} {{ classified.price | currency }}
        </div>
        <span v-else class="is-size-5 fw600 m-l-5 has-text-lightblue has-text-right">{{ $t('cijenaNaUpit') }}</span>
      </div>
      <nuxt-link typeof="div" :to="localePath(classified.user.link)" class="align__centar__all m-t-5">
        <div class="is-size-7 fw600 m-r-10 has-text-lightblue">{{ $t('oglasPostavio') }}</div>
        <TennisImage :size="[42, 42]" class="user_image m-r-10" :src="classified.user.image" />
        <div class="player__name">{{ classified.user.display_name }}</div>
      </nuxt-link>
      <div v-if="$store.state.auth.user.id !== classified.user.id" class="buttons m-t-20">
        <b-button
          tag="nuxt-link"
          :to="localePath('tel:' + classified.user.phone)"
          class="m-l-10"
          type="is-danger"
          pack="far"
          icon-right="phone"
          rounded
        >
          {{ $t('nazovi') }}
        </b-button>
        <b-button
          tag="nuxt-link"
          :to="localePath('/me/message/new/' + classified.user.id)"
          class="m-l-10"
          type="is-primary"
          pack="fal"
          icon-right="comments"
          rounded
        >
          {{ $t('poaljiPoruku') }}
        </b-button>
      </div>
      <div v-if="$store.state.auth.user.id === classified.user.id" class="buttons m-t-20">
        <b-button
          class="m-l-10"
          type="is-danger"
          pack="far"
          icon-right="times"
          rounded
          @click.prevent="deleteClassified"
        >
          {{ $t('obrii') }}
        </b-button>
        <b-button
          tag="nuxt-link"
          :to="localePath('/classified/' + classified.id + '/edit')"
          class="m-l-10"
          type="is-primary"
          pack="fal"
          icon-right="pen"
          rounded
        >
          {{ $t('Uredi') }}
        </b-button>
      </div>
      <div v-if="$auth.user.is_admin" class="admin_box m-b-30 m-t-20">
        <div class="buttons">
          <b-button
            class="m-l-10"
            type="is-danger"
            pack="far"
            icon-right="times"
            rounded
            @click.prevent="deleteClassified"
          >
            {{ $t('obriiOglas') }}
          </b-button>
        </div>
      </div>
      <div class="tab__header m-b-20">
        <div>{{ $t('postaviPitanje') }}</div>
      </div>
      <div class="comments p-b-75">
        <div
          v-for="c in comments"
          :key="c.id"
          :class="{
            'comments-item': true,
            my_comments: c.player.id === $auth.user.id,
          }"
        >
          <nuxt-link :to="localePath('/player/' / c.player.id)">
            <TennisImage :size="[42, 42]" :src="c.player.image" class="user_image m-r-5" />
          </nuxt-link>
          <div class="comment-box">
            <div class="">
              <div class="comment-author modal-subtitle m-b-5">
                {{ c.player.display_name }}
              </div>
              <div class="comment-message title-num">
                {{ c.message }}
              </div>
              <h4 class="comment-date has-text-right">
                {{ c.created_at | moment('LT') }}
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div class="comment-input-box">
        <form @submit.prevent="submitComment">
          <b-input
            v-model="comment"
            :placeholder="$t('upiiPoruku')"
            class="input-message"
            :disabled="sending"
          ></b-input>
          <b-icon
            :icon="sending ? 'spinner' : 'paper-plane'"
            :custom-class="sending ? ['rotating'] : ''"
            class="m-t-7 m-l-10"
            size="is-medium"
            type="is-primary"
            :pack="sending ? 'far' : 'fal'"
            native-type="submit"
            @click.native="submitComment()"
          ></b-icon>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Classified from '@/models/Classified'
import Comment from '@/models/Comment'
import TennisImage from '@/components/TennisImage.vue'

export default {
  name: 'Classified',
  components: {
    TennisImage,
  },
  data() {
    return {
      classified: false,
      comments: [],
      comment: '',
      sending: false,
      sendFirstMessage: false,
    }
  },
  mounted() {
    this.getClassifieds()
  },
  beforeDestroy() {
    this.$echo.leave('classified.' + this.classified.id)
  },
  methods: {
    scrollToBottom(offset) {
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight)
      }, offset)
    },
    getClassifieds() {
      Classified.find(this.$route.params.id).then((res) => {
        this.classified = new Classified(res)
        this.classified
          .comments()
          .get()
          .then((res) => {
            this.comments = res.data
            this.$echo.channel('classified.' + this.classified.id).listen('ClassifiedCommentAdded', (e) => {
              this.comments.push(e.comment)
            })
            if (this.sendFirstMessage) {
              this.scrollToBottom(0)
            }
          })
      })
    },
    submitComment() {
      if (this.comment && !this.sending) {
        this.sendFirstMessage = true
        this.sending = true
        const comment = new Comment({ message: this.comment }).for(this.classified)
        comment
          .save()
          .then(() => {
            this.comment = ''
            this.sending = false
            this.getClassifieds()
          })
          .catch(() => {
            this.sending = false
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške. Pokušajte objaviti oglas ponovno'),
              type: 'is-danger',
              duration: 3000,
            })
          })
      }
    },
    deleteClassified() {
      const c = new Classified(this.classified)
      c.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali oglas'),
            type: 'is-success',
            duration: 3000,
          })
          this.$router.push(this.localePath('/classified'))
        })
        .catch(() => {
          this.sending = false
          this.$buefy.toast.open({
            message: this.$t('UDošlo je do greške. Pokušajte ponovno obrisati oglas'),
            type: 'is-danger',
            duration: 3000,
          })
        })
    },
  },
}
</script>

<style scoped>
.player__name {
  color: #444444;
}
.tab__header div {
  margin-top: 0.6rem;
  line-height: 2.3rem;
}
</style>
