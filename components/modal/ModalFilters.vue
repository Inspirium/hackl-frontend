<template>
  <div>
    <div class="modal-title has-text-light">{{ title }}</div>
    <div class="modal-subtitle has-text-light m-b-20">
      {{ subtitle }}
    </div>
    <div class="filter-list">
      <div
        v-for="(item, key) in categories"
        :key="key"
        :class="['select-item', { active: key === select }]"
        @click="select = key"
      >
        {{ $t(item) }}
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
  },
  data() {
    return {
      select: 'all',
      categories: {
        all: 'Sve kategorije',
        racket: 'Reket',
        bags: 'Torba',
        other: 'Ostalo',
      },
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
