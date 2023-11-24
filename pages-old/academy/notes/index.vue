<script src="../../../node_modules/@uppy/provider-views/lib/ProviderView/ProviderView.js"></script>
<template>
  <div class="">
    <div v-if="isFullAdmin" class="container p-b-300">
      <hero :options="heroImage">
        <h1 class="has-text-white">{{ $t('Napomene trenera') }}</h1>
      </hero>
      <div class="activity x-container results schedule relative">
        <div v-if="isAdmin" class="buttons">
          <b-button
            tag="nuxt-link"
            :to="localePath('/academy/notes/new')"
            class="m-t-20"
            type="is-primary"
            pack="fal"
            icon-right="plus-circle"
            rounded
          >
            {{ $t('izradiNovo') }}
          </b-button>
        </div>
        <div id="inputsearch" class="search container">
          <b-field>
            <b-input
              v-model="search_term"
              :placeholder="$t('pretraiIgrae')"
              type="search"
              pack="far"
              class="search-icon-right"
              :icon-right="search_icon"
              icon-right-clickable
              @icon-right-click="search_term = ''"
            >
              >
            </b-input>
          </b-field>
        </div>

        <div
          v-if="newsMeta.total"
          class="is-text-center fw600 is-size-6 m-l-auto m-r-auto m-t-0 has-text-centered m-b-10"
        >
          {{ $t('ukupno') }}: <span class="has-text-lightblue">{{ newsMeta.total }}</span>
        </div>
        <div :label="$t('Napomene trenera')">
          <template v-if="news.length">
            <div v-for="one in news" :key="one.id" typeof="div">
              <noteBox :options="one" @delete="refresh" />
            </div>
          </template>
          <template v-if="!news.length && !loading">
            <section class="section">
              <div class="content has-text-grey has-text-centered">
                <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
                <p class="fw600 is-size-4 has-text-centered has-text-black80 m-b-10 m-t-0">{{ $t('nemaPodataka') }}</p>
              </div>
            </section>
          </template>
        </div>
        <transition v-if="loading" name="fade">
          <div class="align__centar__x m-t-100 loading_z_spinner">
            <b-icon
              class="comment-send"
              custom-class="rotating"
              icon="spinner"
              size="is-large"
              type="is-primary"
              pack="far"
            ></b-icon>
          </div>
        </transition>
      </div>
    </div>
    <div v-else class="container p-b-300">
      <hero :options="heroImage" class="m-b-30">
        <h1 class="has-text-white">{{ $t('Napomene trenera') }}</h1>
      </hero>
      <div
        v-if="newsMeta.total"
        class="is-text-center fw600 is-size-6 m-l-auto m-r-auto m-t-0 has-text-centered m-b-10"
      >
        {{ $t('ukupno') }}: <span class="has-text-lightblue">{{ newsMeta.total }}</span>
      </div>

      <div class="p-x-16">
        <template v-if="news.length">
          <div v-for="one in news" :key="one.id" typeof="div">
            <noteBox :options="one" @delete="refresh" />
          </div>
        </template>
        <template v-if="!news.length && !loading">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
              <p class="fw600 is-size-4 has-text-centered has-text-black80 m-b-10 m-t-0">{{ $t('nemaPodataka') }}</p>
            </div>
          </section>
        </template>
      </div>

      <transition v-if="loading" name="fade">
        <div class="align__centar__x m-t-100 loading_z_spinner">
          <b-icon
            class="comment-send"
            custom-class="rotating"
            icon="spinner"
            size="is-large"
            type="is-primary"
            pack="far"
          ></b-icon>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import News from '~/models/TrainerNote'
import hero from '~/components/Hero'
import noteBox from '~/components/NoteBox'
import _ from 'lodash'

export default {
  name: 'TrainerNote',
  components: {
    hero,
    noteBox,
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
      loading: false,
      bottom: false,
      page: 1,
      search_term: '',
    }
  },
  computed: {
    isFullAdmin() {
      return this.user.is_trainer || this.isAdmin
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    search_icon() {
      if (this.search_term !== '') {
        return 'times'
      } else {
        return 'search'
      }
    },
  },
  watch: {
    search_term(term) {
      if (term.length) {
        document.getElementById('inputsearch').scrollTop = 20
        this.page = 1
        this.debouncedGetNews()
      } else {
        this.getNews()
      }
    },
    bottom(bottom) {
      if (bottom) {
        this.page++
        this.getNews()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
  },
  created() {
    this.debouncedGetNews = _.debounce(this.getNews, 500)
  },
  methods: {
    search_icon_click() {
      this.search_term = ''
    },
    refresh() {
      News.get().then((res) => {
        this.news = res.data
        this.newsMeta = res.meta
      })
    },
    getNews() {
      if (this.page <= this.newsMeta.last_page) {
        this.loading = true
        const p = News.page(this.page)
        p.where('display_name', this.search_term)
          .include('team', 'trainer')
          .orderBy('-created_at')
          .where('club', this.$store.state.club.id)
        if (!this.isFullAdmin) {
          p.where('team', this.user.team.id).where('is_public', true)
        }
        p.get().then((res) => {
          if (this.page === 1) {
            this.news = res.data
          } else {
            this.news = [...this.news, ...res.data]
          }
          this.newsMeta = res.meta
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
      title: 'Napomene',
    }
  },
}
</script>
