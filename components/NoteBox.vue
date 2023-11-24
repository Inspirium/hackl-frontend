<template>
  <div v-if="Object.keys(options).length">
    <template>
      <div class="is-white radius__12 overflow-hidden softshadow">
        <div class="bb1-10"></div>
        <div class="p-r-10 p-l-10 p-t-5 p-b-5 bb1-10">
          <nuxt-link :to="localePath('/academy/notes/' + options.id)" class="fw600 align__centar__all">
            <div v-if="options.team.players[0].image" class="list__img">
              <TennisImage :size="[80, 80]" :src="options.team.players[0].image" class="user_image" alt="" />
            </div>
            <div class="list__content">
              <div class="flex align__centar__y">
                <div class="has-text-grey-light fw600 is-size-7 m-r-auto">
                  {{ options.created_at | moment('DD.MM.YYYY.') }}
                </div>
                <b-icon
                  v-if="options.videos.length"
                  icon="video"
                  size="is-13 m-t--1 m-r-5"
                  type="is-primary"
                  pack="fal"
                ></b-icon>

                <template v-if="isFullAdmin">
                  <b-icon v-if="options.is_public" icon="eye" size="is-13 m-t--1" type="is-primary" pack="fal"></b-icon>
                  <b-icon v-else icon="eye-slash" size="is-13 m-t--3" type="is-danger" pack="fal"></b-icon>
                </template>
              </div>
              <h4 class="fw600 is-size-5 m-t--1">{{ options.team.players[0].display_name }}</h4>
              <h3 class="fw600 has-text-black80 is-size-65">
                {{ $t('Unio napomenu') }}:
                <span class="has-text-lightblue">{{ options.trainer.display_name }}</span>
              </h3>
            </div>
            <!--            <div class="flex flex__column justify-start">-->
            <!--              <h3 v-if="item.orderable_id" class="fw600 has-text-black80 is-size-6 has-text-right m-b-3">-->
            <!--                {{ $t('key5', { currency: item.orderable.total }) | currency }}-->
            <!--              </h3>-->
            <!--              <div v-if="item.status" class="x-tag m-l-auto nowrap" :class="returnBckg(item)">-->
            <!--                {{ $t(item.status) }}-->
            <!--              </div>-->
            <!--            </div>-->
          </nuxt-link>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
// TODO: compare id of author to give edit and delete options

// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import News from '~/models/News'
export default {
  name: 'NewsBox',
  components: {
    TennisImage,
  },
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    isFullAdmin() {
      return this.user.is_trainer || this.isAdmin
    },
    isAdmin() {
      return this.user.is_admin
    },
    user() {
      return this.$store.state.auth.user
    },
    heroLogo() {
      return this.$store.state.club.logo
    },
    style() {
      if (this.options.image) {
        return {
          backgroundImage: 'linear-gradient( rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.85) ), url(' + this.options.image + ')',
        }
      }
      return {
        backgroundImage: 'none',
      }
    },
  },
  methods: {
    deleteNews() {
      const n = new News(this.options)
      n.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Vijest je obrisana'),
            type: 'is-success',
            duration: 3000,
          })
          this.$emit('delete')
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
            duration: 3000,
          })
        })
    },
  },
}
</script>
<style scoped>
.noimage {
  border-top-color: #d7dde7;
}
.noimagename {
  color: #777777;
}
.noimagebox {
  min-height: auto;
}
</style>
