<template>
  <div class="bodyWrap_notop" :class="selectedLanguageStyle">
    <nuxt />
  </div>
</template>

<script>
export default {
  name: 'NoTop',
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    selectedLanguageStyle() {
      const selectedLanguage = this.$i18n.locale
      if (selectedLanguage === 'el') {
        return 'bodyWrap greek'
      } else {
        return ''
      }
    },
  },
}
</script>
