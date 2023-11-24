<template>
  <div v-if="classifieds.length" class="container x-container">
    <div class="activity results schedule">
      <div class="activity__header m-b-10">
        <nuxt-link :to="localePath('/classified')" class="fw600"
          >{{ $t('oglasi') }}
          <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
        </nuxt-link>
      </div>
      <b-carousel :autoplay="true" :pause-hover="false" :repeat="true">
        <b-carousel-item v-for="(carousel, i) in classifieds" :key="i">
          <classifiedBox :options="carousel" @delete="getClassifieds"></classifiedBox>
        </b-carousel-item>
      </b-carousel>
    </div>
  </div>
  <div v-else class="classified__empty">
    <div class="empty__box">
      <div class="m-b-10">
        <nuxt-link :to="localePath('/classified')" class="fw600 is-text-center is-size-3 has-text-black80">{{
          $t('oglasnik')
        }}</nuxt-link>
      </div>
      <div class="fw600 has-text-lightblue is-size-55 is-text-center">
        {{ $t('imaViakTeniskeOpremeKojuEliProdatiIliDarovati') }}
      </div>
      <div class="fw600 is-size-65 m-t-10 m-b-15 is-text-center">
        {{ $t('objaviOglasNa') }}<span><TennisImage :size="[42, 42]" :src="heroLogo" alt="" /></span
        >{{ $t('klupskomOglasniku') }}
      </div>
      <div class="buttons m-t-10">
        <b-button
          tag="nuxt-link"
          class="m-b-20 fw600"
          type="is-primary"
          pack="fal"
          icon-right="chevron-right"
          rounded
          :to="localePath('/classified/new')"
        >
          {{ $t('objaviOglas') }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import Classified from '~/models/Classified'
import classifiedBox from '~/components/ClassifiedBox'

export default {
  name: 'HomeClassifieds',
  components: {
    classifiedBox,
    TennisImage,
  },
  async fetch() {
    await this.getClassifieds()
  },
  data() {
    return {
      classifieds: [],
      heroLogo: this.$store.state.club.logo,
      carousels: [
        { text: 'Slide 1', color: 'primary' },
        { text: 'Slide 2', color: 'info' },
        { text: 'Slide 3', color: 'success' },
        { text: 'Slide 4', color: 'warning' },
        { text: 'Slide 5', color: 'danger' },
      ],
    }
  },
  methods: {
    getClassifieds() {
      if (this.$store.state.club.id) {
        Classified.where('club', this.$store.state.club.id)
          .limit(3)
          .get()
          .then((res) => {
            this.classifieds = res.data
          })
      }
    },
  },
}
</script>
