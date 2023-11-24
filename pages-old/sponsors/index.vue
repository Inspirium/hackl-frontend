<template>
  <div class="container">
    <hero :page="'news'" :options="heroImage">
      <h1 class="has-text-white">{{ $t('Sponzori') }}</h1>
    </hero>
    <div class="activity x-container results schedule">
      <div v-if="isAdmin" class="buttons">
        <b-button
          tag="nuxt-link"
          :to="localePath('/sponsors/new')"
          class="m-t-20 m-b-15"
          type="is-danger"
          pack="fal"
          icon-right="plus-circle"
          rounded
        >
          {{ $t('Dodaj sponzora') }}
        </b-button>
      </div>
      <div :label="$t('Sponzori')">
        <template v-if="news.length">
          <div v-for="one in news" :key="one.id" typeof="div">
            <sponsorBox :options="one" @delete="refresh" />
          </div>
        </template>
        <template v-if="!news.length && !loading">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
              <p class="modal-title">{{ $t('Nemate sponzora') }}</p>
            </div>
          </section>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import News from '~/models/Sponsor'
import hero from '~/components/Hero'
import sponsorBox from '~/components/SponsorBox'

export default {
  name: 'Sponsors',
  components: {
    hero,
    sponsorBox,
  },
  async fetch() {
    await this.getNews()
  },
  data() {
    return {
      heroImage: '/hero_sponsors.jpg',
      news: [],
      newsMeta: {
        last_page: 1,
      },
      loading: false,
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
        this.loading = true
        News.page(this.page)
          .where('club', this.$store.state.club.id)
          .get()
          .then((res) => {
            this.news = res.data
            this.newsMeta = res.meta
            this.page++
            this.loading = false
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
