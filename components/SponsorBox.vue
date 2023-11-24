<template>
  <div v-if="Object.keys(options).length" :class="[options.image ? '' : 'noimagebox', 'news__box']" :style="style">
    <nuxt-link :to="localePath('/sponsors/' + options.id)" class="result__header m-b-10">
      <div class="align__centar__y p-t-10">
        <div :class="[options.image ? 'has-text-white' : '', 'title', 'has-text-centered', 'textshadow']">
          {{ options.title }}
        </div>
      </div>
    </nuxt-link>
    <div v-if="isAdmin" class="noimage classified__list">
      <div class="align__centar__y">
        <div class="buttons">
          <b-button class="is-smaller m-t-5" type="is-danger" rounded @click.prevent="deleteNews()">
            {{ $t('Obriši sponzora') }}
          </b-button>
          <b-button
            tag="nuxt-link"
            :to="localePath('/sponsors/' + options.id + '/edit')"
            type="is-primary"
            class="is-smaller m-t-5"
            rounded
          >
            {{ $t('Uredi sponzora') }}
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// TODO: compare id of author to give edit and delete options

// import _ from 'lodash'
import News from '~/models/Sponsor'
export default {
  name: 'SponsorsBox',
  components: {},
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
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
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
