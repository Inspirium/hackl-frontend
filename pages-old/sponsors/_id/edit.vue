<template>
  <div class="p-b-300">
    <hero
      :second="{
        name: $t('Sponzori'),
        link: '/sponsors',
      }"
    >
      <h1 class="has-text-white tab__title__hero">{{ $t('Uredi sponzora') }}</h1>
    </hero>
    <div class="x-container">
      <div class="activity">
        <b-field class="login__input__container" :label="$t('naslov')">
          <b-input
            id="title"
            v-model="news.title"
            :placeholder="$t('upiiNaziv')"
            class="form-control"
            type="text"
            rounded
          >
          </b-input>
        </b-field>
        <div v-if="!news.image" class="m-b-20">
          <div class="label--noindent">{{ $t('fotografija') }}</div>
          <photoUpload stencil="rectangle-stencil" :aspect-ratio="1.5" @update="news.new_image = $event"></photoUpload>
        </div>
        <div class="form-radio m-b-30">
          <TennisImage
            :size="[800, 800]"
            class="classified__image--large m-b-20"
            :style="news.image || news.new_image ? '' : 'height: 0px'"
            :src="news.new_image ? news.new_image : news.image"
            alt=""
          />
          <div v-if="news.image" class="buttons align__centar__x" :style="news.new_image ? '' : 'marginTop: -20px'">
            <b-button
              v-if="!news.new_image"
              class="fw600"
              size="is-smaller"
              type="is-danger"
              rounded
              @click.prevent="news.image = null"
            >
              {{ $t('obriiFotografiju') }}
            </b-button>
          </div>
        </div>

        <tinymce-editor v-model="news.content" class=""></tinymce-editor>
        <b-field class="login__input__container" :label="$t('Poveznica')">
          <b-input
            id="link"
            v-model="news.link"
            :placeholder="$t('Upiši poveznicu')"
            class="form-control"
            type="text"
            rounded
          >
          </b-input>
        </b-field>

        <!--        <b-field>-->
        <!--          <b-input-->
        <!--            id="message"-->
        <!--            v-model="news.content"-->
        <!--            :placeholder="$t('upiiTekstVijesti')"-->
        <!--            rows="6"-->
        <!--            type="textarea"-->
        <!--          ></b-input>-->
        <!--        </b-field>-->
        <div class="buttons m-t-30">
          <b-button
            class="m-l-10 fw600"
            type="is-danger"
            icon-right="times"
            pack="fal"
            rounded
            @click="$router.push(localePath('/sponsors'))"
            >{{ $t('otkai') }}
          </b-button>

          <b-button
            class="m-l-10 fw600"
            type="is-primary"
            pack="fal"
            icon-right="check"
            rounded
            @click.prevent="saveNews"
          >
            {{ $t('spremi') }}
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import photoUpload from '~/components/photoUpload'
import hero from '~/components/Hero'
import News from '~/models/Sponsor'

export default {
  name: 'SponsorsEdit',
  components: {
    hero,
    photoUpload,
    TennisImage,
  },
  async fetch() {
    await this.getNews()
  },
  data() {
    return {
      news: {
        new_image: null,
      },
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  methods: {
    getNews() {
      News.find(this.$route.params.id).then((res) => {
        this.news = res
      })
    },
    saveNews() {
      const n = new News(this.news)
      n.save()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste uredili vijest'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/sponsors/'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
        })
    },
  },
}
</script>

<style scoped></style>
