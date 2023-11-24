<template>
  <div class="container">
    <hero :options="heroImage">
      <h1 class="has-text-white">{{ $t('Završena uplata') }}</h1>
    </hero>
    <div class="has-text-centered m-t-20 p-x-16">
      <b-icon type="is-success" icon="circle-check" size="is-large" pack="fal"> </b-icon>
      <div class="fw600 is-size-35 has-text-centered">{{ $t('Zahvaljujemo vam na uplati!') }}</div>
      <div class="fw600 is-size-6 has-text-centered">
        {{
          $t('Uskoro ćete primiti račun putem e-pošte, koji će također biti dostupan unutar vašeg korisničkog profila.')
        }}
      </div>
      <div class="buttons m-t-30 m-b-5">
        <b-button
          class="softshadow m-t-10 m-b-20 invert-small-button"
          type="noborder is-small is-primary has-text-white"
          pack="fal"
          icon-right="chevron-right"
          rounded
          @click="$router.push(localePath('/'))"
        >
          {{ $t('Idi na početnu stranicu') }}
        </b-button>
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
