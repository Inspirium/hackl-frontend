<template>
  <div class="">
    <hero
      :second="{
        name: $t('Oglasi'),
        link: '/classified',
      }"
    >
      <h1 class="has-text-white tab__title__hero">{{ $t('objaviOglas') }}</h1>
    </hero>
    <div class="x-container fordesktop">
      <div class="activity">
        <b-field class="login__input__container" :label="$t('nazivOglasa')">
          <b-input
            id="title"
            v-model="classified.title"
            :placeholder="$t('upiiNaziv')"
            class="form-control"
            type="text"
            rounded
          >
          </b-input>
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
          <b-input
            id="title"
            v-model="classified.price"
            :placeholder="$t('Upiši cijenu')"
            class="form-control"
            type="number"
            rounded
          >
          </b-input>
        </b-field>
        <div class="form-radio">
          <div class="label--noindent">{{ $t('fotografija') }}</div>
          <photoUpload
            stencil="rectangle-stencil"
            :aspect-ratio="1.5"
            @update="classified.image = $event"
          ></photoUpload>
        </div>
        <div class="label--noindent">{{ $t('opis') }}</div>
        <b-field>
          <b-input
            id="message"
            v-model="classified.description"
            :placeholder="$t('ukratkoOpiiProizvod')"
            rows="6"
            maxlength="500"
            type="textarea"
          ></b-input>
        </b-field>

        <div class="buttons m-t-10">
          <b-button
            class="m-l-10 fw600"
            type="is-primary"
            pack="fal"
            icon-right="check"
            rounded
            :loading="loading"
            @click.prevent="save"
          >
            {{ $t('objaviOglas') }}
          </b-button>
        </div>
      </div>
    </div>
    <b-modal :active.sync="isModalConfirmation" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmationLeave
        :title="$t('nisteSpremiliPodatkeSigurnoEliteOtii')"
        :subtitle="$t('Potvrdom će uneseni podaci biti izbrisani')"
        @discardChanges="discardChanges()"
        @closeDialog="closeDialog()"
      ></modalConfirmationLeave>
    </b-modal>
  </div>
</template>

<script>
import Classified from '@/models/Classified'
import hero from '~/components/Hero'
import photoUpload from '~/components/photoUpload'
import modalConfirmationLeave from '~/components/modal/ModalConfirmationLeave'

export default {
  name: 'ClassifiedNew',
  components: {
    hero,
    modalConfirmationLeave,
    photoUpload,
  },
  data() {
    return {
      isModalConfirmation: false,
      classified: {
        title: '',
        description: '',
        price: '',
        image: null,
        new_image: null,
        category: 'all',
      },
      crop_image: null,
      coordinates: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
      showhide: false,
      loading: false,
      to: null,
      categories: {
        all: 'Sve kategorije',
        racket: 'Reket',
        bags: 'Torba',
        other: 'Ostalo',
      },
      placeholder: '/static/shop_noimage.jpg',
    }
  },
  methods: {
    closeDialog() {
      this.isModalConfirmation = false
      this.to = null
    },
    discardChanges() {
      this.isModalConfirmation = false
      this.$router.push(this.to)
    },
    save() {
      // if (this.classified.image === null) {
      //   this.classified.image = this.placeholder
      // }
      const c = new Classified(this.classified)
      this.loading = true
      c.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste objavili oglas'),
            type: 'is-success',
            duration: 3000,
          })
          this.$router.push(this.localePath(`/classified/`))
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Provjerite jesu li sva polja popunjena pa pokušajte ponovno'),
            type: 'is-danger',
            duration: 5000,
          })
          this.loading = false
        })
    },
  },
}
</script>
