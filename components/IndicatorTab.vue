<template>
  <div class="indicator align__centar__all">
    <div
      v-for="index in numberOfTabs"
      :key="index + 10"
      :class="['indicator__tab', index <= activeTab + 1 ? ['primary-light'] : 'has-background-white']"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      required: true,
      default() {
        return {
          indicator: {
            tabs: 1,
            steps: 1,
          },
        }
      },
    },
    numberOfTabs: {
      type: Number,
      required: false,
      default() {
        return {
          activeTab: 0,
        }
      },
    },
    activeTab: {
      type: Number,
      required: false,
      default() {
        return {
          activeTab: 0,
        }
      },
    },
  },
}
</script>
