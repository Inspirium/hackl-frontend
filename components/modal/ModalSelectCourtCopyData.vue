<template>
  <div class="p-b-75">
    <div class="modal-title has-text-light">{{ title }}</div>
    <div class="modal-subtitle has-text-light m-b-20">
      {{ subtitle }}
    </div>
    <div class="filter-list">
      <div v-for="(item, index) in options" :key="index" class="select-item" @click="send(item)">
        <div>{{ item.name }}</div>
      </div>
    </div>
    <div class="buttons is-fixed m-t-20">
      <b-button type="is-danger" rounded @click="$parent.close()"> {{ $t('zatvori') }} </b-button>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'

export default {
  name: 'ModalSelect',
  props: {
    title: {
      type: String,
      required: true,
      default: 'Tip',
    },
    subtitle: {
      type: String,
      required: false,
      default: 'Filtriraj po tipu',
    },
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      select: 0,
    }
  },
  methods: {
    send(seeds) {
      this.$emit('update', seeds)
      this.$parent.close()
    },
  },
}
</script>
