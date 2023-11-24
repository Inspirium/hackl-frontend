<template>
  <div>
    <nuxt-link :to="localePath('/player/' + comment.player.id)">
      <TennisImage :size="[42, 42]" :src="comment.player.image" class="user_image m-r-5" />
    </nuxt-link>
    <div class="comment-box">
      <div class="comment-author modal-subtitle m-b-5">
        {{ comment.player.display_name }}
      </div>
      <div class="comment-message title-num">
        {{ comment.message }}
      </div>
      <h4 class="comment-date has-text-right">
        {{ comment.created_at | moment('LT') }}
      </h4>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
export default {
  name: 'TextMessage',
  components: {
    TennisImage,
  },
  props: {
    comment: {
      type: Object,
      required: true,
      default() {
        return {
          player: {
            display_name: '',
            image: '',
          },
          created_at: null,
          message: '',
        }
      },
    },
  },
}
</script>

<style scoped></style>
