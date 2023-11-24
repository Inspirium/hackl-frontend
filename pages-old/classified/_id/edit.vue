<template>
  <div class="">
    <hero>
      <h1 class="has-text-white tab__title__hero">{{ $t('objaviOglas') }}</h1>
    </hero>
    <div class="x-container">
      <div class="activity">
        <b-field class="login__input__container" :label="$t('nazivOglasa')">
          <b-input id="title" v-model="classified.title" class="form-control" type="text" rounded> </b-input>
        </b-field>
        <div class="label--noindent m-b-10">{{ $t('kategorijaOglasa') }}</div>
        <div class="activity__reservation">
          <div class="activity__box action__buttons">
            <div
              v-for="(item, key) in categories"
              :key="key"
              :class="classified.category === key ? 'active' : ''"
              class="action__item__small fw600"
              @click="classified.category = key"
            >
              {{ $t(item) }}
            </div>
          </div>
        </div>
        <b-field class="login__input__container" :label="$t('Cijena')">
          <b-input id="title" v-model="classified.price" class="form-control" type="number" rounded> </b-input>
        </b-field>
        <div v-if="!classified.image" class="m-b-20">
          <div class="label--noindent">{{ $t('fotografija') }}</div>
          <photoUpload
            stencil="rectangle-stencil"
            :aspect-ratio="1.5"
            @update="classified.new_image = $event"
          ></photoUpload>
        </div>

        <div class="form-radio">
          <TennisImage
            :size="[500, 500]"
            class="classified__image--large m-b-20"
            :src="classified.new_image ? classified.new_image : classified.image"
            alt=""
          />
          <div
            v-if="classified.image"
            class="buttons align__centar__x"
            :style="classified.new_image ? '' : 'marginTop: -20px'"
          >
            <b-button
              v-if="!classified.new_image"
              class="fw600"
              size="is-smaller"
              type="is-danger"
              rounded
              @click.prevent="classified.image = null"
            >
              {{ $t('obriiFotografiju') }}
            </b-button>
          </div>
        </div>
        <div class="label--noindent">{{ $t('opis') }}</div>
        <b-field>
          <b-input id="message" v-model="classified.description" rows="6" maxlength="500" type="textarea"></b-input>
        </b-field>

        <div class="buttons m-t-10">
          <b-button class="m-l-10 fw600" type="is-primary" pack="fal" icon-right="check" rounded @click.prevent="save">
            {{ $t('spremiOglas') }}
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'

import Classified from '@/models/Classified'
import photoUpload from '~/components/photoUpload'
import hero from '~/components/Hero'

export default {
  name: 'ClassifiedEdit',
  components: {
    hero,
    photoUpload,
    TennisImage,
  },
  async fetch() {
    this.classified = await Classified.find(this.$route.params.id)
  },
  data() {
    return {
      classified: {
        title: '',
        description: '',
        price: '',
        image: '',
        new_image: '',
        category: 'all',
      },
      categories: {
        all: 'Sve kategorije',
        racket: 'Reket',
        bags: 'Torba',
        other: 'Ostalo',
      },
    }
  },
  methods: {
    save() {
      const c = new Classified(this.classified)
      c.save()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste izmijenili oglas'),
            type: 'is-success',
            duration: 3000,
          })
          this.$router.push(this.localePath(`/classified/${res.id}`))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Provjerite jesu li sva polja popunjena pa pokušajte ponovno'),
            type: 'is-danger',
            duration: 5000,
          })
        })
    },
  },
}
</script>

<style scoped></style>
