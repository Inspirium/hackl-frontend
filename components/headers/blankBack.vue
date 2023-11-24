<template>
  <div class="p-t-7 softshadow" :class="bckg">
    <template v-if="!hide">
      <div v-if="second.name === ''" class="breadcrumbs breadcrumbs-back fade-in-left anim_delay_2 opacity-0">
        <div class="fw600 is-size-55 has-text-white align__centar__y cursor" @click="back()">
          <b-icon icon="arrow-circle-left" pack="fal" type="is-white" class="m-r-5"> </b-icon>
          <span class="m-r-5">{{ $t('nazad') }}</span>
        </div>
      </div>
      <div v-else class="breadcrumbs align__centar__y">
        <nuxt-link
          :to="localePath('/')"
          class="fw600 is-size-55 has-text-white align__centar__y cursor fade-in-left anim_delay_2 opacity-0"
        >
          <img src="/house.svg" class="m-r-5" alt="" />
          <span class="m-r-5">{{ $t('poetna') }}</span>
        </nuxt-link>

        <template v-if="!second.homeOnly">
          <nuxt-link
            :to="localePath(second.link)"
            class="fw600 is-size-55 has-text-white align__centar__y cursor fade-in-left anim_delay_4 opacity-0"
          >
            <b-icon icon="angle-right" pack="fal" type="is-white" size="is-smaller" class="m-r-5"> </b-icon>
            <span class="">{{ second.name }}</span>
          </nuxt-link>
        </template>
      </div>
    </template>
    <div class="x-container p-b-10 m-t-25">
      <div
        v-if="hasSlotData === undefined && title !== ''"
        class="has-text-centered fw600 is-size-3 m-l-auto m-r-auto has-text-white line-height-22"
      >
        {{ title }}
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'

export default {
  name: 'BlankBack',
  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },
    background: {
      type: String,
      required: false,
      default: '',
    },
    closeFunction: {
      type: Boolean,
      required: false,
      default: false,
    },
    hide: {
      type: Boolean,
      required: false,
      default: false,
    },
    second: {
      type: Object,
      required: false,
      default() {
        return {
          name: '',
          link: '',
        }
      },
    },
  },
  data() {
    return {
      temp: 0,
    }
  },
  computed: {
    bckg() {
      if (this.background !== '') {
        return this.background
      }
      return 'is-primary'
    },
    hasSlotData() {
      return this.$slots.default
    },
  },
  methods: {
    back() {
      if (this.closeFunction) {
        this.$emit('back')
      } else {
        this.$router.go(-1)
      }
    },
  },
}
</script>
