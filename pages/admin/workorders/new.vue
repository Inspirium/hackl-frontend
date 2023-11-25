<template>
  <div class="p-b-150">
    <PageHeader :title="$t('Novi radni nalog')" :background="'is-primary'" />
    <div class="p-x-16 m-t-30">
      <div class="">
        <div class="fw600 is-size-55 m-l-5 m-b-7 has-text-centered">{{ $t('Status naloga') }}</div>
        <div class="activity__reservation">
          <transition name="fade">
            <div class="activity__box action__buttons">
              <div
                v-for="(item, index) in status"
                :key="index"
                :class="selectedStatus === item ? returnBckg() : ''"
                class="action__item__small fw600"
                @click="selectedStatus = item"
              >
                {{ $t(item) }}
              </div>
            </div>
          </transition>
        </div>
      </div>
      <div class="fw600 is-size-5 m-t-20 has-text-centered">{{ $t('Izvršitelj') }}</div>

      <div class="activity__box action__buttons br100 m-t-10">
        <div class="action__item__small fw600 br100">
          <div v-if="Object.keys(assignee).length" class="align__centar__all w100">
            <TennisImage :size="[42, 42]" :src="assignee.image" class="user_image m-r-10 m-l--5" alt="" />
            <div class="list__content">
              <h3>{{ assignee.display_name }}</h3>
            </div>
            <div @click="assignee = {}">
              <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto m-r-10"> </b-icon>
            </div>
          </div>
          <div v-else class="activity__header" @click="isModalMembersActiveAssignee = true">
            <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
            <div class="list__content">
              <div class="has-text-black80 fw600 is-size-6">{{ $t('Dodaj osobu') }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="fw600 is-size-5 m-t-20 m-b-7 has-text-centered">{{ $t('Opis posla') }}</div>
      <ValidationProvider name="Napomena">
        <b-field class="login__input__container">
          <b-input v-model="note" type="textarea" rounded> </b-input>
        </b-field>
      </ValidationProvider>
    </div>
    <div class="buttons is-fixed m-t-15">
      <b-button
        class="m-l-5 m-t-20 fw600"
        type="is-danger"
        pack="fal"
        icon-left="times"
        rounded
        @click="$router.go(-1)"
      >
        {{ $t('odustani') }}
      </b-button>
      <b-button
        class="m-l-5 m-t-20 fw600"
        :class="{ blur_button: !Object.keys(assignee).length }"
        type="is-primary"
        pack="fal"
        icon-right="check"
        rounded
        native-type="submit"
        :loading="loading"
        @click.prevent="saveWorkOrder"
      >
        {{ $t('spremi') }}
      </b-button>
    </div>

    <b-modal :active.sync="modalPayment" :width="640" scroll="clip">
      <modalPayment :title="$t('plaanje')" />
    </b-modal>
    <b-modal :active.sync="isModalMembersActiveAssignee" :width="640" scroll="clip">
      <modalMembers
        :title="$t('Izvršitelj')"
        :show-tennis-school="false"
        :is-player="true"
        @player="assignee = $event"
      />
    </b-modal>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import PageHeader from '~/components/headers/blankBack'
import modalMembers from '~/components/modal/ModalMembersAll'
import modalPayment from '~/components/modal/ModalPayment'
import WorkOrder from '~/models/WorkOrder'

export default {
  name: 'NewOrder',
  components: {
    PageHeader,
    TennisImage,
    modalMembers,
    modalPayment,
  },
  data() {
    return {
      isCash: false,
      modalPayment: false,
      isModalMembersActive: false,
      isModalMembersActiveAssignee: false,
      loading: false,
      quantity: 1,
      data: {},
      assignee: {},
      note: '',
      paying: false,
      clients_string: 0,
      string: {},
      status: ['pending', 'completed', 'cancelled'],
      selectedStatus: 'pending',
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
  },
  mounted() {
    // this.getProduct()
  },
  methods: {
    saveWorkOrder() {
      this.loading = true
      const workOrder = new WorkOrder({
        assignee: this.assignee,
        note: this.note,
        status: this.selectedStatus,
      })
      workOrder
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste izradili radni nalog'),
            type: 'is-success',
          })
          this.loading = false
          this.$router.push(this.localePath('/admin/workorders/'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    returnBckg() {
      if (this.selectedStatus === 'pending') {
        return 'is-primary has-text-white'
      } else if (this.selectedStatus === 'completed') {
        return 'green has-text-white'
      } else if (this.selectedStatus === 'cancelled') {
        return 'is-red has-text-white'
      } else {
        return ''
      }
    },
  },
}
</script>
