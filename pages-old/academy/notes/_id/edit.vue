<template>
  <div v-if="Object.keys(news).length" class="p-b-300">
    <PageHeader :title="$t('Uredi napomenu')" :background="'is-primary'" />
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
        <template v-if="news.videos.length">
          <div class="label--noindent m-b-5">{{ $t('Video') }}</div>
          <div v-for="(item, index) in news.videos" :key="index" class="">
            <div style="padding: 56.34% 0 0 0; position: relative" class="">
              <iframe
                :src="item"
                frameborder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
              ></iframe>
            </div>
            <div class="buttons align__centar__x m-t-10 m-b-20">
              <b-button
                class="fw600"
                size="is-smaller"
                icon-right="times"
                type="is-danger"
                rounded
                @click="removeVideo(index)"
              >
                {{ $t('Obriši video') }}
              </b-button>
            </div>
          </div>
        </template>
        <div class="label--noindent">{{ $t('tekst') }}</div>

        <tinymce-editor v-model="news.content" class="m-t-20"></tinymce-editor>
        <template>
          <div class="has-text-centered m-t-20 m-b-20">
            <div class="label--center">{{ $t('Napomena vidljiva igraču?') }}</div>
            <div class="radio__box--smaller">
              <div class="block">
                <b-radio v-model="news.is_public" type="is-success" :native-value="true">
                  {{ $t('da') }}
                </b-radio>
                <b-radio v-model="news.is_public" type="is-danger" :native-value="false">
                  {{ $t('ne') }}
                </b-radio>
              </div>
            </div>
          </div>
        </template>

        <!--        <b-field>-->
        <!--          <b-input-->
        <!--            id="message"-->
        <!--            v-model="news.content"-->
        <!--            :placeholder="$t('upiiTekstVijesti')"-->
        <!--            rows="6"-->
        <!--            type="textarea"-->
        <!--          ></b-input>-->
        <!--        </b-field>-->
        <div class="buttons m-t-20">
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
import PageHeader from '~/components/headers/blankBack'
import News from '~/models/TrainerNote'

export default {
  name: 'NewsEdit',
  components: {
    PageHeader,
  },
  async fetch() {
    await this.getNews()
  },
  data() {
    return {
      news: {
        new_image: null,
        videos: [],
      },
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  methods: {
    removeVideo(index) {
      this.news.videos.splice(index, 1)
    },
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
          this.$router.push(this.localePath('/academy/notes/' + this.news.id))
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
