<template>
  <div class="classified__box">
    <div class="result__header m-b-10">
      <div class="align__centar__y classified__box__header">
        <div class="modal-subtitle is-size-5">{{ categoryDisplay }}</div>
        <div class="classified__date m-l-auto">
          {{ options.created_at | moment('DD.MM.YYYY') }}
        </div>
      </div>
      <nuxt-link :to="localePath('/classified/' + options.id)" class="align__centar__y p-t-20 p-b-10">
        <TennisImage
          v-if="options.image"
          :size="[150, 120]"
          class="classified__image m-r-15"
          :src="options.image"
          alt=""
        />
        <div class="modal-subtitle">{{ options.title }}</div>
      </nuxt-link>
    </div>
    <div class="classified__list">
      <div v-if="$auth.user.id !== options.user.id" class="align__centar__y">
        <TennisImage :size="[42, 42]" class="user_image m-r-10" :src="options.user.image" alt="" />
        <div class="player__name">{{ options.user.display_name }}</div>
      </div>
      <div v-else class="align__centar__y">
        <div class="buttons">
          <b-button class="is-smaller m-t-5" type="is-danger" rounded @click.prevent="deleteClassified(options)">
            {{ $t('obriiOglas') }}
          </b-button>
          <b-button
            tag="nuxt-link"
            :to="localePath('/classified/' + options.id + '/edit')"
            type="is-primary"
            class="is-smaller m-t-5"
            rounded
          >
            {{ $t('urediOglas') }}
          </b-button>
        </div>
      </div>
      <div v-if="$store.state.auth.user.id !== options.user.id" class="is-size-7 fw600 align__centar__y">
        <span v-if="options.price" class="is-size-5 m-l-5 has-text-lightblue">{{
          $t('key5', { currency: options.price }) | currency
        }}</span>
        <span v-else class="is-size-7 m-l-5 has-text-lightblue has-text-right">{{ $t('cijenaNaUpit') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import Classified from '~/models/Classified'

export default {
  name: 'ClassifiedBox',
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
    categoryDisplay() {
      switch (this.options.category) {
        case 'bags':
          return 'Torba'
        case 'other':
          return 'Ostalo'
        case 'racket':
          return 'Reket'
      }
      return ''
    },
  },
  methods: {
    deleteClassified(item) {
      const c = new Classified(item)
      c.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali oglas'),
            type: 'is-success',
            duration: 3000,
          })
          this.$emit('delete')
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('UDošlo je do greške. Pokušajte ponovno obrisati oglas'),
            type: 'is-danger',
            duration: 3000,
          })
        })
    },
  },
}
</script>
