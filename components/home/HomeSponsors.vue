<template>
  <div class="">
    <div v-if="news.length" class="container x-container">
      <div class="activity__header m-b-10">
        <nuxt-link :to="localePath('/sponsors')" class="fw600"
          >{{ $t('Sponsors') }}
          <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
        </nuxt-link>
      </div>

      <b-carousel :autoplay="true" :pause-hover="false" :repeat="true">
        <b-carousel-item v-for="(carousel, i) in news" :key="i">
          <sponsorBox :options="carousel" @delete="getNews" />
        </b-carousel-item>
      </b-carousel>
    </div>
  </div>
</template>

<script>
import News from '~/models/Sponsor'
import sponsorBox from '~/components/SponsorBox'

export default {
  name: 'HomeNews',
  components: {
    sponsorBox,
  },
  async fetch() {
    await this.getNews()
  },
  data() {
    return {
      news: [],
      carousels: [
        { text: 'Slide 1', color: 'primary' },
        { text: 'Slide 2', color: 'info' },
        { text: 'Slide 3', color: 'success' },
        { text: 'Slide 4', color: 'warning' },
        { text: 'Slide 5', color: 'danger' },
      ],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin && this.user.admin.includes(this.news.club_id)
    },
  },
  methods: {
    getNews() {
      if (this.$store.state.club.id) {
        News.where('club', this.$store.state.club.id)
          .limit(10)
          .get()
          .then((res) => {
            this.news = res.data
          })
      }
    },
  },
}
</script>
