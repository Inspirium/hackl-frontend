<template>
  <div class="">
    <!--        <div v-if="news.length" class="container">-->
    <!--          <div class="activity x-container results schedule">-->
    <!--            <div class="activity__header m-b-10">-->
    <!--              <nuxt-link :to="localePath('/news')" class="fw600"-->
    <!--                >Novosti-->
    <!--                <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>-->
    <!--              </nuxt-link>-->
    <!--            </div>-->
    <!--            <nuxt-link v-for="newsa in news" :key="newsa.id" typeof="div" :to="localePath('news/' + newsa.id)">-->
    <!--              <newsBox :options="newsa" @delete="getNews"></newsBox>-->
    <!--            </nuxt-link>-->
    <!--          </div>-->
    <!--        </div>-->
    <div v-if="news.length" class="container x-container">
      <div class="activity__header m-b-10">
        <nuxt-link :to="localePath('/news')" class="fw600"
          >{{ $t('novosti') }}
          <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
        </nuxt-link>
      </div>

      <b-carousel :autoplay="true" :pause-hover="false" :repeat="true">
        <b-carousel-item v-for="(carousel, i) in news" :key="i">
          <newsBox :options="carousel" @delete="getNews"></newsBox>
        </b-carousel-item>
      </b-carousel>
    </div>
  </div>
</template>

<script>
import News from '~/models/News'
import newsBox from '~/components/NewsBox'

export default {
  name: 'HomeNews',
  components: {
    newsBox,
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
          .limit(3)
          .get()
          .then((res) => {
            this.news = res.data
          })
      }
    },
  },
}
</script>
