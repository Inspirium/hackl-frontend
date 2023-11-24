<template>
  <div class="container">
    <hero :page="'classified'" :options="heroImage">
      <h1 class="has-text-white">{{ $t('oglasnik') }}</h1>
    </hero>
    <div class="activity x-container results schedule">
      <div class="buttons">
        <b-button
          tag="nuxt-link"
          :to="localePath('/classified/new')"
          class="m-t-20 m-b-5"
          type="is-danger"
          pack="fal"
          icon-right="racquet"
          rounded
        >
          {{ $t('objaviOglas') }}
        </b-button>
      </div>
      <b-tabs position="is-centered" :class="{ 'hide-only-one': !myClassifieds.length }">
        <b-tab-item :label="$t('oglasi')">
          <div class="modal-subtitle has-text-centered fw400">
            {{ $t('ukupnoOglasa') }}
            <span class="has-text-primary">{{ total }}</span>
          </div>
          <div class="filters container">
            <div class="filter">
              <div class="buttons">
                <b-button type="is-primary" pack="far" icon-right="chevron-down" @click="isFilterModalActive = true">
                  {{ selected_category ? $t(selected_category) : $t('Sve kategorije') }}
                </b-button>
              </div>
            </div>
          </div>
          <div v-for="classified in classifieds" :key="classified.id">
            <classifiedBox :options="classified" @delete="refresh"></classifiedBox>
          </div>
        </b-tab-item>
        <b-tab-item v-if="myClassifieds.length" :label="$t('mojiOglasi')">
          <div class="modal-subtitle has-text-centered fw400 m-b-20">
            {{ $t('ukupnoOglasa') }}
            <span class="has-text-primary">{{ myClassifiedsMeta.total }}</span>
          </div>
          <div v-for="classified in myClassifieds" :key="classified.id">
            <classifiedBox :options="classified" @delete="refresh"></classifiedBox>
          </div>
        </b-tab-item>
      </b-tabs>
      <b-modal :active.sync="isFilterModalActive" :width="640" scroll="clip">
        <modalOptions :title="$t('prikai2')" @update="updateCategory"></modalOptions>
      </b-modal>
    </div>
  </div>
</template>

<script>
import Classified from '~/models/Classified'
import hero from '~/components/Hero'
import modalOptions from '~/components/modal/ModalFilters'
import classifiedBox from '~/components/ClassifiedBox'

export default {
  name: 'Classifieds',
  components: {
    hero,
    modalOptions,
    classifiedBox,
  },
  data() {
    return {
      heroImage: '/hero_classifieds.jpg',
      isFilterModalActive: false,
      classifieds: [],
      classifiedsMeta: {
        last_page: 1,
      },
      myClassifiedsMeta: {},
      myClassifieds: [],
      selected_category: '',
      total: 0,
      last_page: 1,
      bottom: false,
      offset: 1,
    }
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        this.offset++
        this.getClassifieds()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.getClassifieds()
  },
  methods: {
    refresh() {
      Classified.get().then((res) => {
        this.classifieds = res.data
      })
      this.getMyClassifieds()
    },
    updateCategory(category) {
      this.selected_category = category
      if (category === 'all') {
        this.selected_category = ''
      }
      this.offset = 1
      this.getClassifieds()
    },
    getClassifieds() {
      if (this.last_page < this.offset) return
      const c = Classified.where('category', this.selected_category)
      if (this.$store.state.club.id !== 26) {
        c.where('club', this.$store.state.club.id)
      }
      c.page(this.offset)
        .get()
        .then((res) => {
          if (this.offset === 1) {
            this.classifieds = res.data
          } else {
            this.classifieds = [...this.classifieds, ...res.data]
          }
          this.classifiedsMeta = res
          this.total = res.meta.total
          this.last_page = res.meta.last_page
        })
    },
    getMyClassifieds() {
      Classified.where('user_id', this.$auth.user.id)
        .get()
        .then((res) => {
          this.myClassifieds = res.data
          this.myClassifiedsMeta = res.meta
        })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
  },
}
</script>

<style scoped></style>
