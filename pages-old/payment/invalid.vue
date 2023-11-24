<template>
  <div class="container">
    <hero :options="heroImage">
      <h1 class="has-text-white">Završena uplata</h1>
    </hero>
    <div class="has-text-centered m-t-20 p-x-16">
      <b-icon type="is-danger" icon="circle-xmark" size="is-large" pack="fal"> </b-icon>
      <div class="fw600 is-size-35 has-text-centered">{{ $t('Došlo je do greške') }}</div>
      <div class="fw600 is-size-6 has-text-centered">
        {{ $t('Plaćanje karticom - odbijeno - text') }}
      </div>
    </div>
  </div>
</template>

<script>
import hero from '@/components/Hero.vue'

export default {
  name: 'News',
  components: {
    hero,
  },
  data() {
    return {
      heroImage: '/hero_news.jpg',
    }
  },
}
</script>
