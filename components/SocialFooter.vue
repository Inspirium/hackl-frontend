<template>
  <footer
    v-if="
      club.social !== null &&
      (club.social.facebook !== null || club.social.instagram !== null || club.social.twitter !== null)
    "
    class=""
  >
    <div class="divider-line-1 m-t-10"></div>
    <div class="activity__header--center m-b-10 m-t-10">
      <div class="fw600 is-size-5 has-text-centered">{{ $t('pratite', { name: club.name }) }}</div>
    </div>
    <div class="flex align__centar__x">
      <a v-if="club.social.facebook !== null" :href="club.social.facebook" class="">
        <b-icon icon="facebook" pack="fab" type="is-primary" class="is-larger m-r-10 m-l-10"> </b-icon>
      </a>
      <a v-if="club.social.instagram !== null" :href="club.social.instagram" class="">
        <b-icon icon="instagram" pack="fab" type="is-primary" class="is-larger m-r-10 m-l-10"> </b-icon>
      </a>
      <a v-if="club.social.twitter !== null" :href="club.social.twitter" class="">
        <b-icon icon="twitter" pack="fab" type="is-primary" class="is-larger m-r-10 m-l-10"> </b-icon>
      </a>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'SocialFooter',
  data() {
    return {}
  },
  computed: {
    club() {
      return this.$store.state.club
    },
  },
  methods: {},
}
</script>
