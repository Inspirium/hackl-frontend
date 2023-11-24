<template>
  <img :srcset="srcset" v-bind="$props" />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true,
    },
    size: {
      type: Array,
      required: false,
      default() {
        return [144, 144]
      },
    },
    alt: {
      type: String,
      required: false,
      default() {
        return ''
      },
    },
  },
  computed: {
    srcset() {
      if (!this.src?.includes('tenis.plus')) {
        return ''
      }
      const link1 = `https://images.tenis.plus/0/resize:auto:${this.size[0]}:${this.size[1]}:1:sm/dpr:1/plain/${this.src}@webp`
      const link2 = `https://images.tenis.plus/0/resize:auto:${this.size[0]}:${this.size[1]}:1:sm/dpr:2/plain/${this.src}@webp`
      const link3 = `https://images.tenis.plus/0/resize:auto:${this.size[0]}:${this.size[1]}:1:sm/dpr:3/plain/${this.src}@webp`
      return `${link1}, ${link2} 2x, ${link3} 3x`
    },
  },
}
</script>
