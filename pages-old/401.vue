<template>
  <div>
    <div v-if="$auth.loggedIn" class="flex flex__column align__centar__all">
      <p>{{ $t('pokualiStePristupiliSadrajuKojemNematePristupOvajI') }}</p>
    </div>
    <div v-else class="flex flex__column align__centar__all">
      <p>{{ $t('zaPristupOvomSadrajuPotrebnaJePrijava') }}</p>
      <b-button
        class="m-l-5 m-t-20 fw600"
        type="is-primary"
        pack="fal"
        icon-right="arrow-right"
        rounded
        tag="nuxt-link"
        :to="localePath('/login')"
      >
        {{ $t('prijaviSe') }}
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: '401',
}
</script>
