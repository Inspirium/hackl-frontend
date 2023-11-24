<template>
  <div class="indicator align__centar__all">
    <div
      v-for="index in options.tabs"
      :key="index + 10"
      :class="['indicator__tab', index <= activeTab + 1 ? ['primary-light'] : 'has-background-white']"
    ></div>
    <div
      v-for="index in options.steps"
      v-show="activeTab + 1 >= options.tabs"
      :key="index + 100"
      :class="['indicator__step', index < activeStep + 1 ? 'primary-light' : 'has-background-white']"
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
    activeTab: {
      type: Number,
      required: false,
      default() {
        return {
          activeTab: 0,
        }
      },
    },
    activeStep: {
      type: Number,
      required: false,
      default() {
        return {
          activeStep: 0,
        }
      },
    },
  },
}
</script>
