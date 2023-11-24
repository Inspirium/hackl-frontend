<template>
  <div v-if="isBirthday" class="birthday">
    <div class="align__centar__y flex__column p-all-24">
      <b-icon icon="birthday-cake" size="is-large" type="is-white" pack="fal"></b-icon>
      <div class="fw600 is-size-4 has-text-centered has-text-white m-t-10">
        {{ $t('sretanRoendan') }} <span class="">{{ user.first_name }}!!!</span>
      </div>
      <div class="fw600 is-size-65 has-text-centered has-text-white m-t-0">{{ $t('tvoj', { name: club.name }) }}</div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'

export default {
  name: 'Birthday',
  components: {},
  data() {
    return {
      loading1: false,
    }
  },
  computed: {
    birthday() {
      return this.$moment(this.user.birth_date).format('MM-DD')
    },
    today() {
      return this.$moment().format('MM-DD')
    },
    isBirthday() {
      if (this.birthday === this.today) {
        return true
      } else {
        return false
      }
    },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
  },
}
</script>
