<template>
  <div class="">
    <div class="fw600 is-size-4 has-text-centered m-t-15">{{ $t('Članarina') }}</div>
    <div class="activity__box action__buttons br100 m-t-5">
      <div class="action__item__small fw600 br100 p-l-20">
        <template>
          <div v-if="checkSubscription()" class="align__centar__all w100">
            <div class="list__content">
              <h3 class="fw600 has-text-black80 is-size-5 line-height-14">{{ selected_subscription.name }}</h3>
              <h4 class="fw600 has-text-primary is-size-65">
                {{ $t('Cijena') }}: {{ selected_subscription.price | currency }}
              </h4>
            </div>
            <div :class="{ blur_button: loadingDelete }" @click="deleteSubscription()">
              <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto m-r-10"> </b-icon>
            </div>
          </div>
          <div v-else class="activity__header" @click="isModalSubscriptionActive = true">
            <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
            <div class="list__content">
              <div class="has-text-black80 fw600 is-size-6">{{ $t('Odaberi vrstu Članarine') }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <b-modal
      :active.sync="isModalSubscriptionActive"
      :width="640"
      :data="schoolGroup.players"
      class="modal__payment hidescrollbar"
      scroll="clip"
    >
      <modalSubscription :title="$t('Članarine')" @update="updateSubscription($event)"></modalSubscription>
    </b-modal>
  </div>
</template>

<script>
// import _ from 'lodash'
import modalSubscription from '~/components/modal/ModalSubscription'
import Subscription from '~/models/Subscription'
import UserSubscription from '~/models/UserSubscription'

export default {
  name: 'MembershipSubscriptions',
  components: {
    modalSubscription,
  },
  props: {
    schoolGroup: {
      type: Object,
      required: false,
      default() {
        return {
          schoolGroup: {},
        }
      },
    },
  },
  data() {
    return {
      activeTab: 0,
      isModalConfirmationActive: false,
      isModalSubscriptionActive: false,
      loading: false,
      loadingDelete: false,
      selected_player: {},
      selected_reservation: {},
      selected_subscription: {},
      isOpen: 0,
    }
  },
  computed: {
    isAdmin() {
      return this.user.is_admin
    },
    user() {
      return this.$store.state.auth.user
    },
    schoolGroupIDs() {
      return this.schoolGroup.players.map((p) => ({ id: p.id }))
    },
  },
  watch: {
    isModalSubscriptionActive: {
      handler() {
        if (this.isModalSubscriptionActive) {
          this.$emit('isOpen')
        } else {
          this.$emit('isClose')
        }
      },
    },
  },
  mounted() {},
  methods: {
    checkSubscription() {
      if (this.selected_subscription === undefined) {
        return false
      } else if (this.selected_subscription === null) {
        return false
      } else if (Object.keys(this.selected_subscription).length > 0) {
        return true
      } else {
        return false
      }
    },
    applySubscriptionGroup() {
      this.loading = true
      new Subscription({ id: this.selected_subscription.id })
        .users()
        .attach({
          users: this.schoolGroupIDs,
          type: 'schoolGroup',
          type_id: this.schoolGroup.id,
          all: true,
        })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Grupa je spremljena'),
            type: 'is-success',
          })
          this.$emit('reload')
          this.saved = true
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    deleteSubscription() {
      if (!this.selectedUser.active_subscription) {
        this.selected_subscription = {}
        return
      }
      this.loadingDelete = true
      const s = new UserSubscription({ id: this.selectedUser.active_subscription.pivot_id })
      s.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili promjene'),
            type: 'is-success',
          })
          this.loadingDelete = false
          this.$emit('update')
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadingDelete = false
        })
    },
    updateSubscription(item) {
      this.selected_subscription = item
      if (!this.forGroup) {
        this.$emit('singleupdate', item)
      }
    },
  },
}
</script>
<style scoped></style>
