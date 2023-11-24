<script src="../../store/index.js"></script>
<template>
  <div class="p-b-300">
    <div class="modal-title has-text-light">{{ title }}</div>
    <div class="modal-subtitle has-text-light m-b-20">
      {{ subtitle }}
    </div>
    <div class="filter-list">
      <div
        v-for="(item, index) in options"
        :key="index"
        :class="['select-item', { active: index === select }]"
        @click="
          select = index
          selectObject = item
        "
      >
        <div>{{ item.name }}</div>
      </div>
    </div>
    <div v-if="confirm" class="buttons is-fixed m-t-20">
      <b-button icon-left="times" pack="fal" type="is-danger" rounded @click="$parent.close()">
        {{ $t('zatvori') }}
      </b-button>
      <b-button
        pack="fal"
        icon-left="check"
        type="is-primary"
        rounded
        @click="
          send(select)
          $parent.close()
        "
      >
        {{ $t('potvrdi') }}
      </b-button>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'

export default {
  name: 'ModalOptions',
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
    confirm: {
      type: Boolean,
      required: false,
      default: true,
    },
    sendObject: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      select: null,
      selectObject: {},
    }
  },
  watch: {
    select() {
      if (!this.confirm) {
        this.send()
      }
    },
    selectObject() {
      if (!this.confirm) {
        this.send()
      }
    },
  },
  methods: {
    send() {
      if (this.sendObject) {
        this.$emit('update', this.selectObject)
        this.$parent.close()
        return
      }
      this.$emit('update', this.select)
      this.$parent.close()
    },
  },
}
</script>
