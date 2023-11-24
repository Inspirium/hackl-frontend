<template>
  <div>
    <nuxt-link :to="localePath('/player/' + comment.player.id)">
      <img :src="comment.player.image" class="user_image m-r-5" />
    </nuxt-link>
    <div class="m-b-20">
      <img class="classified__image--large softshadow" :src="comment.multimedia" />
      <div v-if="comment.message" class="comment-box">
        <div class="comment-message title-num">
          {{ comment.message }}
        </div>
        <h4 class="comment-date has-text-right">
          {{ comment.created_at | moment('LT') }}
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageMessage',
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
          multimedia: '',
          multimedia_type: 'image',
        }
      },
    },
  },
}
</script>

<style scoped>
.my_comments >>> .comment-box {
  width: fit-content;
  margin-left: auto;
}
.comment-box {
  width: fit-content;
  margin-left: 20px;
}
.comment-box:before {
  left: 15px;
  top: -18px;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 11px solid white;
}
</style>
