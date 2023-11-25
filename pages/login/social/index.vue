<template>
  <div class="container">
    <p>{{ $t('pleaseWaitWhileWereLoggingYouIn') }}</p>
  </div>
</template>

<script>
/**
 * Successful login
 * Get access token and init user, redirect to homepage
 */
export default {
  mounted() {
    if (this.$route.query.token) {
      this.$auth.setUserToken('Bearer ' + this.$route.query.token).then(() => {
        this.$auth.fetchUser().then(() => {
          this.$router.push(this.localePath('/'))
        })
      })
    } else {
      this.$router.push(this.localePath('/login'))
    }
  },
}
</script>
