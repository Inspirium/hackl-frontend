<template>
  <div class="modal-confirmation">
    <transition name="fade">
      <div v-show="!isConfirmation">
        <div class="modal-title has-text-light m-b-5">{{ title }}</div>
        <div class="modal-subtitle has-text-light m-b-20">
          {{ subtitle }}
        </div>
        <div class="buttons m-t-20">
          <b-button size="is-large" type="is-danger" rounded @click="closeDialog">
            {{ $t('ne') }}
          </b-button>
          <b-button type="is-primary" size="is-large" rounded @click="discardChanges"> {{ $t('da') }} </b-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import _ from 'lodash'

export default {
  name: 'ModalConfirmationLeave',
  props: {
    title: {
      type: String,
      required: true,
      default: 'Tip',
    },
    subtitle: {
      type: String,
      required: false,
      default: 'Podnaslov',
    },
  },
  data() {
    return {
      isConfirmation: false,
    }
  },
  methods: {
    discardChanges() {
      this.$emit('discardChanges', true)
      this.$parent.close()
    },
    closeDialog() {
      this.$emit('closeDialog', false)
      this.$parent.close()
    },
  },
}
</script>
