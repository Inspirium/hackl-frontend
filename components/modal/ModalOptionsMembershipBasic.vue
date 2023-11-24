<template>
  <div>
    <div class="modal-title has-text-light m-b-10">{{ title }}</div>
    <div class="modal-subtitle has-text-light m-b-20">
      {{ subtitle }}
    </div>
    <div class="filter-list">
      <div
        v-for="(item, index) in options"
        :key="index"
        :class="['select-item', { active: index === select }]"
        @click="select = index"
      >
        <div>{{ item.name }}</div>
      </div>
    </div>
    <div class="buttons is-fixed m-t-20">
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
  },
  data() {
    return {
      select: null,
    }
  },
  methods: {
    send() {
      this.$emit('update', this.select)
      this.$parent.close()
    },
  },
}
</script>
