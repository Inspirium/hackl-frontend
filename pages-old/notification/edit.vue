<template>
  <div class="container">
    <hero :back="true">
      <h1 class="has-text-white navigation__title">{{ $t('postavke') }}</h1>
    </hero>
    <div class="x-container">
      <div class="activity__reservation p-b-75">
        <div class="switchevi">
          <div class="switchevi_label m-b-10">
            <div class="fw600 is-size-3">{{ $t('obavijesti') }}</div>
            <div class="fw600 is-size-65 has-text-lightblue">{{ $t('oznaiKojeVrsteObavijestiEliPrimati') }}</div>
          </div>
          <b-field v-for="notification in regular" :key="notification.key" class="switch__box">
            <b-switch
              v-model="notification.value"
              class="fw600"
              type="is-info"
              :true-value="true"
              :false-value="false"
              @input="change(notification.key)"
            >
              {{ notification.title }}
            </b-switch>
          </b-field>
          <template v-if="isAdmin">
            <div class="switchevi_label m-b-10">
              <div class="fw600 is-size-4">{{ $t('admin') }}</div>
            </div>
            <b-field v-for="notification in admin" :key="notification.key" class="switch__box">
              <b-switch
                v-model="notification.value"
                class="fw600"
                type="is-info"
                :true-value="true"
                :false-value="false"
                @input="change(notification.key)"
              >
                {{ notification.title }}
              </b-switch>
            </b-field>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import hero from '~/components/Hero'

export default {
  name: 'NotificationsOptions',
  components: {
    hero,
  },
  data() {
    return {
      notifications: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    regular() {
      return this.notifications.filter((item) => {
        return !item.key.includes('ADMIN')
      })
    },
    admin() {
      return this.notifications.filter((item) => {
        return item.key.includes('ADMIN')
      })
    },
  },
  mounted() {
    this.getNotifications()
  },
  methods: {
    async getNotifications() {
      this.notifications = await this.$axios.$get('v2/notifications')
    },
    change(key) {
      this.$axios.$post('v2/notifications', { key })
    },
  },
}
</script>
