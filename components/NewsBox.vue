<template>
  <div v-if="Object.keys(options).length" :class="[options.image ? '' : 'noimagebox', 'news__box']" :style="style">
    <nuxt-link :to="localePath('/news/' + options.id)" class="result__header m-b-10">
      <div class="flex flex__column align__centar__y p-t-10">
        <div class="m-b-10 noimagebox-hide">
          <TennisImage :size="[130, 130]" :src="heroLogo" class="" alt="" />
        </div>
        <div :class="[options.image ? 'has-text-white' : '', 'title', 'has-text-centered', 'textshadow']">
          {{ options.title }}
        </div>
      </div>
    </nuxt-link>
    <div :class="[options.author.image ? '' : 'noimage', 'classified__list']">
      <div v-if="$auth.user && $auth.user.id !== options.author.id" class="align__centar__y">
        <TennisImage :size="[42, 42]" class="user_image m-r-10" :src="options.author.image" alt="" />
        <div :class="[options.image ? '' : 'noimagename has-text-white', 'player__name has-text-white']">
          {{ options.author.display_name ? options.author.display_name : $store.state.club.name }}
        </div>
      </div>
      <div v-else class="align__centar__y">
        <div class="buttons">
          <b-button class="is-smaller m-t-5" type="is-danger" rounded @click.prevent="deleteNews()">
            {{ $t('obriiVijest') }}
          </b-button>
          <b-button
            tag="nuxt-link"
            :to="localePath('/news/' + options.id + '/edit')"
            type="is-primary"
            class="is-smaller m-t-5"
            rounded
          >
            {{ $t('urediVijest') }}
          </b-button>
        </div>
      </div>
      <div v-if="$auth.user && $auth.user.id !== options.author.id" class="classified__date m-l-20">
        {{ options.created_at | moment('DD.MM.YYYY') }}
      </div>
    </div>
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
