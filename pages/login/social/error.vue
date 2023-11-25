<template>
  <div>
    {{ message }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: this.$route.query.message ? this.$route.query.message : '',
    }
  },
}
</script>
