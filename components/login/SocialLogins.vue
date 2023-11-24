<template>
  <div>
    <div class="social-icons icon-circle">
      <div class="block">
        <a :href="social('facebook')">
          <b-icon icon="facebook" size="is-large" pack="fab" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SocialLogins',
  methods: {
    social(value) {
      return `https://${process.env.api_host}/v2/login/${value}?club=${this.$store.state.club.id}`
    },
  },
}
</script>
