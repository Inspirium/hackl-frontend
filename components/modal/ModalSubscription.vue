<template>
  <div class="members w90">
    <div class="modal-title has-text-light m-b-5">{{ title }}</div>
    <div class="modal-subtitle has-text-light m-b-5">{{ subtitle }}</div>
    <div class="for-list relative min-h-20">
      <subscriptionCategories
        :is-small="true"
        @update="specialReservationSelected = $event"
        @isEditing="isEditing = $event"
      />
    </div>
    <div v-if="!isEditing" class="buttons is-fixed m-t-15">
      <b-button
        class="m-l-5 m-t-20 fw600"
        type="is-danger"
        pack="fal"
        icon-left="times"
        rounded
        @click="$parent.close()"
      >
        {{ $t('odustani') }}
      </b-button>
      <b-button
        class="m-l-5 m-t-20 fw600"
        :class="{ blur_button: !Object.keys(specialReservationSelected).length }"
        type="is-primary"
        pack="fal"
        icon-right="check"
        rounded
        native-type="submit"
        :loading="loading"
        @click="
          $emit('update', specialReservationSelected)
          $parent.close()
        "
      >
        {{ $t('odaberi') }}
      </b-button>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import subscriptionCategories from '~/components/subscriptions/subscriptionCategoriesModal'

export default {
  name: 'ModalMembers',
  components: {
    subscriptionCategories,
  },
  scrollToTop: true,
  props: {
    title: {
      type: String,
      required: true,
      default: 'Tip',
    },
    subtitle: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      page: 1,
      last_page: 1,
      loading: false,
      bottom: false,
      isEditing: false,
      players: [],
      search_term: '',
      members: [],
      specialReservationSelected: {},
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },

  methods: {},
}
</script>
