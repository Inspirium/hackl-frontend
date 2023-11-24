<template>
  <div>
    <div class="modal-title has-text-light">{{ title }}</div>
    <div class="modal-subtitle has-text-light m-b-20 m-t-5">
      {{ subtitle }}
    </div>
    <div v-if="categories.length" class="filter-list">
      <div
        v-for="(item, key) in categories"
        :key="key"
        :class="['select-item', { active: key === select }]"
        @click="
          select = key
          send(select)
          $parent.close()
        "
      >
        <div>{{ item.name }}</div>
      </div>
    </div>
    <div class="buttons is-fixed m-t-20">
      <b-button icon-left="times" pack="fal" type="is-danger" rounded @click="$parent.close()">
        {{ $t('zatvori') }}
      </b-button>
    </div>
  </div>
</template>

<script>
import ShopCategories from '~/models/ShopCategory'
export default {
  name: 'ModalCategories',
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
      categories: [],
    }
  },
  mounted() {
    this.getCategories()
  },
  methods: {
    getCategories() {
      ShopCategories.get().then((res) => {
        this.categories = res
      })
    },
    send() {
      this.$emit('update', this.select)
      this.$parent.close()
    },
  },
}
</script>
