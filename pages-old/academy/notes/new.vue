<template>
  <div v-if="isAdmin || user.is_trainer" class="">
    <hero
      :options="heroImage"
      :second="{
        name: $t('Napomene trenera'),
        link: '/academy/notes',
      }"
    >
      <h1 class="has-text-white tab__title__hero">{{ $t('Napomene trenera') }}</h1>
    </hero>
    <div class="x-container">
      <div class="activity">
        <div class="fw600 is-size-5 m-t-20 has-text-centered">{{ $t('dodajIgraa') }}</div>

        <div class="activity__box action__buttons br100 m-t-10">
          <div class="action__item__small fw600 br100">
            <div v-if="Object.keys(assignee).length" class="align__centar__all w100">
              <TennisImage :size="[42, 42]" :src="assignee.image" class="user_image m-r-10 m-l--5" alt="" />
              <div class="list__content">
                <h3>{{ assignee.display_name }}</h3>
              </div>
              <div @click="assignee = {}">
                <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto m-r-10"> </b-icon>
              </div>
            </div>
            <div v-else class="activity__header" @click="isModalMembersActiveAssignee = true">
              <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
              <div class="list__content">
                <div class="has-text-black80 fw600 is-size-6">{{ $t('dodajIgraa') }}</div>
              </div>
            </div>
          </div>
        </div>
        <template v-if="Object.keys(assignee).length">
          <b-field class="login__input__container" :label="$t('naslov')">
            <b-input
              id="title"
              v-model="note.title"
              :placeholder="$t('upiiNaziv')"
              class="form-control"
              type="text"
              rounded
            >
            </b-input>
          </b-field>

          <!--        <div class="label&#45;&#45;noindent">{{ $t('fotografija') }}</div>-->
          <!--        <div class="forcefit">-->
          <!--          <photo-upload stencil="rectangle-stencil" :aspect-ratio="1.5" @update="image = $event" />-->
          <!--        </div>-->
          <div class="label--noindent m-b-7 m-l-15">{{ $t('Video') }}</div>
          <!--          <div class="buttons is-left">-->
          <!--            <b-button-->
          <!--              class="softshadow m-b-10"-->
          <!--              type="is-small noborder"-->
          <!--              pack="fal"-->
          <!--              icon-right="video"-->
          <!--              rounded-->
          <!--              tag="nuxt-link"-->
          <!--              :to="localePath('/player/new')"-->
          <!--            >-->
          <!--              {{ $t('Unesi video') }}-->
          <!--            </b-button>-->
          <!--          </div>-->
          <videoUpload class="m-b-20" @videoUploaded="videoUploaded" />
          <div class="label--noindent">{{ $t('tekst') }}</div>
          <tinymce-editor v-model="note.content" />
          <documentUpload v-if="false" :options="liga" :type="'tournament'" @reload="getLeague"></documentUpload>

          <!--        <template>-->
          <!--          <div class="fw600 has-text-centered m-b-20 is-size-5 m-t-20 line-height-16">-->
          <!--            {{ $t('eliteLiPoslatiPushObavijestSvimLanovimaSPoveznicom') }}-->
          <!--          </div>-->
          <!--          <ValidationProvider name="Funkcija" class="radio__box__center" rules="required">-->
          <!--            <div class="block">-->
          <!--              <b-radio v-model="pushNotif" :native-value="false"> {{ $t('nemojPoslat') }} </b-radio>-->
          <!--              <b-radio v-model="pushNotif" :native-value="true"> {{ $t('poalji') }} </b-radio>-->
          <!--            </div>-->
          <!--          </ValidationProvider>-->
          <!--        </template>-->
          <template>
            <div class="has-text-centered m-t-20 m-b-20">
              <div class="label--center">{{ $t('Napomena vidljiva igraču?') }}</div>
              <div class="radio__box--smaller">
                <div class="block">
                  <b-radio v-model="note.is_public" type="is-success" :native-value="true">
                    {{ $t('da') }}
                  </b-radio>
                  <b-radio v-model="note.is_public" type="is-danger" :native-value="false">
                    {{ $t('ne') }}
                  </b-radio>
                </div>
              </div>
            </div>
          </template>

          <div class="buttons m-t-30 p-b-150">
            <b-button
              class="m-l-10 fw600"
              type="is-primary"
              pack="fal"
              icon-right="check"
              rounded
              :loading="loading"
              @click.prevent="saveNote"
            >
              {{ $t('Objavi') }}
            </b-button>
          </div>
        </template>
      </div>
    </div>
    <b-modal :active.sync="isModalMembersActiveAssignee" :width="640" scroll="clip">
      <modalMembers :title="$t('igra')" :show-tennis-school="false" :is-player="true" @player="assignee = $event" />
    </b-modal>
  </div>
</template>

<script>
import documentUpload from '~/components/documentUpload'
import Hero from '~/components/Hero'
import News from '~/models/TrainerNote'
import modalMembers from '~/components/modal/ModalMembersAll'
import Player from '~/models/Player'

export default {
  name: 'TrainerNoteNew',
  components: {
    hero: Hero,
    documentUpload,
    modalMembers,
  },
  data() {
    return {
      heroImage: '/hero_news.jpg',
      isModalConfirmation: false,
      note: {
        title: '',
        content: '',
        is_public: true,
        new_image: null,
        pushNotif: false,
        videos: [],
        trainer: {},
        team: {},
      },
      isModalMembersActiveAssignee: false,
      assignee: {},
      title: '',
      content: '',
      image: null,
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
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    club() {
      return this.$store.state.club
    },
    isPrepopulated() {
      return this.$route.query.player
    },
  },
  mounted() {
    this.getTeam()
  },
  methods: {
    videoUploaded(url) {
      this.note.videos.push(url)
    },
    saveNote() {
      if (this.note.title === '') {
        this.$buefy.toast.open({
          message: this.$t('Morate upisati naslov ili dodati sadržaj'),
          type: 'is-primary',
        })
        return
      }
      this.loading = true
      this.note.trainer = this.user
      this.note.team = this.assignee.team
      const n = new News(this.note)
      n.save()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste objavili vijest'),
            type: 'is-success',
          })
          this.loading = false
          this.$router.push(this.localePath('/academy/notes/' + res.id))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    getTeam() {
      if (this.isPrepopulated) {
        Player.$find(this.$route.query.player).then((res) => {
          this.assignee = res
        })
      }
    },
    previewImage(input) {
      if (input.files && input.files[0]) {
        this.image2 = input
        const reader = new FileReader()

        reader.onload = function (e) {
          this.image = e.target.result
        }.bind(this)

        reader.readAsDataURL(input.files[0])
      }
    },
    removeImage() {
      this.image = false
    },
  },
}
</script>

<style scoped></style>
