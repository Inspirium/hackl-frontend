<template>
  <div class="">
    <div class="fw600 has-text-centered m-b-20 is-size-5 line-height-19 m-t-5">{{ $t('kategorije') }}</div>
    <div class="buttons m-t-10">
      <b-button
        :class="{ softshadow: true, 'invert-small-button': selectedCategory === 0 }"
        :type="{
          'is-mini': true,
          noborder: true,
          'is-primary has-text-white': selectedCategory === 0,
        }"
        rounded
        @click="updateIt(0)"
      >
        {{ $t('sve') }}
      </b-button>
      <b-button
        v-for="category in categories"
        :key="category.id"
        :class="{ softshadow: true, 'invert-small-button': selectedCategory === category.id }"
        :type="{
          'is-mini': true,
          noborder: true,
          'is-primary has-text-white': selectedCategory === category.id,
        }"
        rounded
        @click="updateIt(category.id)"
      >
        {{ category.name }}
      </b-button>
    </div>
  </div>
</template>
<script>
// import _ from 'lodash'
import ShopCategories from '~/models/ShopCategory'

export default {
  name: 'TimeRange',
  components: {},
  props: {
    show: {
      type: Object,
      required: false,
      default() {
        return {
          day: true,
        }
      },
    },
  },
  data() {
    return {
      categories: [],
      selectedCategory: 0,
    }
  },
  computed: {
    today() {
      return this.$moment().format('YYYY-MM-DD')
    },
    reformat() {
      if (this.dates.length) {
        return (
          this.$moment(this.dates[0]).format('YYYY-MM-DD') +
          ',' +
          this.$moment(this.dates[1]).add(1, 'd').format('YYYY-MM-DD')
        )
      } else {
        return this.selectedTimeSpanDateMin + ',' + this.selectedTimeSpanDateMax
      }
    },
  },
  mounted() {
    this.getCategories()
  },
  methods: {
    updateIt(item) {
      this.selectedCategory = item
      this.$emit('update', item)
    },
    getCategories() {
      ShopCategories.get().then((res) => {
        this.categories = res
      })
    },
  },
}
</script>
