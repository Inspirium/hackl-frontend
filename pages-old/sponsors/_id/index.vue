<template>
  <div v-if="news.id" class="p-b-150">
    <template>
      <div class="breadcrumbs breadcrumbs-back m-t-10">
        <a class="fw600 is-size-55 has-text-black80 align__centar__y" @click="$router.go(-1)">
          <b-icon icon="arrow-circle-left" pack="fal" type="is-black80" class="m-r-5"> </b-icon>
          <span class="m-r-5">{{ $t('nazad') }}</span>
        </a>
      </div>
    </template>
    <div class="container x-container">
      <div class="m-t-20 align__centar__y flex__column">
        <div class="tab__header m-b-10 has-text-centered">
          <div>{{ news.title }}</div>
        </div>
        <TennisImage :size="[500, 500]" class="m-t-20 m-b-20 b-radius softshadow" :src="news.image" alt="" />
      </div>
      <!-- eslint-disable-next-line -->
      <div class="has-text-left is-size-6 content-tiny" v-html="news.content"></div>
      <div v-if="news.link" class="buttons m-t-20">
        <b-button
          class="softshadow"
          type="is-small noborder"
          pack="fas"
          icon-right="chevron-right"
          rounded
          tag="a"
          target="_blank"
          :href="news.link"
        >
          {{ $t('Posjetite web stranicu') }}
        </b-button>
      </div>

      <div v-if="isAdmin" class="buttons m-t-20 m-b-30">
        <b-button class="m-l-10" type="is-danger" pack="far" icon-right="times" rounded @click.prevent="deleteNews">
          {{ $t('obrii') }}
        </b-button>
        <b-button
          tag="nuxt-link"
          :to="localePath('/sponsors/' + news.id + '/edit')"
          class="m-l-10"
          type="is-primary"
          pack="fal"
          icon-right="pen"
          rounded
        >
          {{ $t('Uredi') }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import News from '~/models/Sponsor'

export default {
  name: 'SponsorsItem',
  components: {
    TennisImage,
  },
  async fetch() {
    await this.getNews()
  },
  data() {
    return {
      news: {
        author: {},
      },
      comment: '',
      sending: false,
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
    getNews() {
      News.find(this.$route.params.id).then((res) => {
        this.news = res
      })
    },
    deleteNews() {
      const n = new News(this.news)
      n.delete()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali vijest'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/news/'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
        })
    },
    mycomment(e) {
      return this.classified.comments[e].player.id === this.$store.state.auth.user.id ? 'my_comments' : ''
    },
  },
}
</script>

<style scoped>
.b-radius {
  border-radius: 0.5rem;
}
.user_image {
  height: 26px;
  width: 26px;
}
.player__name {
  color: #444444;
  font-size: 0.9rem;
}
.tab__header div {
  margin-top: 0.6rem;
  line-height: 2.3rem;
}
</style>
