<template>
  <div class="container">
    <hero :page="'news'" :options="heroImage">
      <h1 class="has-text-white">{{ $t('novosti') }}</h1>
    </hero>
    <div class="activity x-container results schedule">
      <div v-if="isAdmin" class="buttons">
        <b-button
          tag="nuxt-link"
          :to="localePath('/news/new')"
          class="m-t-20 m-b-15"
          type="is-danger"
          pack="fal"
          icon-right="plus-circle"
          rounded
        >
          {{ $t('objaviVijest') }}
        </b-button>
      </div>
      <div :label="$t('vijesti')">
        <template v-if="news.length">
          <div v-for="one in news" :key="one.id" typeof="div">
            <newsBox :options="one" @delete="refresh"></newsBox>
          </div>
        </template>
        <template v-else>
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
              <p class="modal-title">{{ $t('nemaObjavljenihVijesti') }}</p>
            </div>
          </section>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import News from '~/models/News'
import hero from '~/components/Hero'
import newsBox from '~/components/NewsBox'

export default {
  name: 'News',
  components: {
    hero,
    newsBox,
  },
  async fetch() {
    await this.getNews()
  },
  data() {
    return {
      heroImage: '/hero_news.jpg',
      news: [],
      newsMeta: {
        last_page: 1,
      },
      bottom: false,
      page: 1,
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
  watch: {
    bottom(bottom) {
      if (bottom) {
        this.getNews()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
  },
  methods: {
    refresh() {
      News.get().then((res) => {
        this.news = res.data
        this.newsMeta = res.meta
      })
    },
    getNews() {
      if (this.page <= this.newsMeta.last_page) {
        News.page(this.page)
          .where('club', this.$store.state.club.id)
          .get()
          .then((res) => {
            this.news = res.data
            this.newsMeta = res.meta
            this.page++
          })
      }
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
  },
  head() {
    return {
      title: 'Vijesti',
    }
  },
}
</script>
