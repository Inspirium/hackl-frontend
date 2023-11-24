<template>
  <div class="indicator align__centar__all">
    <div
      v-for="index in options.steps"
      :key="index"
      :class="['indicator__tab', index <= activeStep + 1 ? 'primary-light' : 'has-background-white']"
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
            steps: 0,
          },
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
