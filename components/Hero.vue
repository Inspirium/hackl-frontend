<script src="../store/club.js"></script>
<template>
  <div class="hero relative">
    <div v-if="!hideIt" class="breadcrumbs-box">
      <div v-if="!back" class="breadcrumbs align__centar__y">
        <nuxt-link
          :to="localePath('/')"
          class="fw600 is-size-55 has-text-white align__centar__y fade-in-left anim_delay_2 opacity-0"
        >
          <img src="/house.svg" class="m-r-5" alt="" />
          <span class="m-r-5">{{ $t('poetna') }}</span>
        </nuxt-link>
        <template v-if="second.name !== ''">
          <nuxt-link
            :to="localePath(second.link)"
            class="fw600 is-size-55 has-text-white align__centar__y fade-in-left anim_delay_2 opacity-2"
          >
            <b-icon icon="angle-right" pack="fal" type="is-white" size="is-smaller" class="m-r-5"> </b-icon>
            <span class="">{{ second.name }}</span>
          </nuxt-link>
        </template>
      </div>
      <div v-else class="breadcrumbs breadcrumbs-back m-t-10 fade-in-left anim_delay_4 opacity-2">
        <a class="fw600 is-size-55 has-text-white align__centar__y" @click="$router.go(-1)">
          <b-icon icon="arrow-circle-left" pack="fal" type="is-white" class="m-r-5"> </b-icon>
          <span class="m-r-5">{{ $t('nazad') }}</span>
        </a>
      </div>
    </div>
    <transition name="fade">
      <div v-if="loading" class="align__centar__x loading_z_spinner m-t-20">
        <b-icon
          class="comment-send m-b-20"
          custom-class="rotating"
          icon="spinner"
          size="is-large"
          type="is-white"
          pack="far"
        ></b-icon>
      </div>
    </transition>

    <TennisImage :size="[1000, 300]" class="hero-bckg" :src="pageImage" alt="" />
    <div v-if="page !== '' && isAdmin" class="">
      <photoUploadHero
        stencil="rectangle-stencil"
        :aspect-ratio="page === 'home' ? 1.35 : 2.35"
        @update="
          new_image = $event
          saveMedia()
        "
      ></photoUploadHero>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import Media from '~/models/Media'
import Club from '~/models/Club'
import photoUploadHero from '~/components/photoUploadHero'

export default {
  components: {
    photoUploadHero,
    TennisImage,
  },
  props: {
    options: {
      type: String,
      required: false,
      default() {
        return require('../assets/img/members.jpg')
      },
    },
    page: {
      type: String,
      required: false,
      default: '',
    },
    hideIt: {
      type: Boolean,
      required: false,
      default: false,
    },
    back: {
      type: Boolean,
      required: false,
      default: false,
    },
    second: {
      type: Object,
      required: false,
      default() {
        return {
          name: '',
          link: '',
        }
      },
    },
  },
  data() {
    return {
      loading: false,
      user: {
        userImage: this.options,
        new_image: '',
      },
    }
  },
  computed: {
    club() {
      return this.$store.state.club
    },
    isAdmin() {
      return this.$store.state.auth.loggedIn && this.$store.state.auth.user.is_admin
    },
    pageImage() {
      if (this.page) {
        if (this.$store.state.club.hero_images[this.page]) {
          return this.$store.state.club.hero_images[this.page]
        }
      }
      if (this.options) {
        return this.options
      }
      return this.user.userImage
    },
  },
  methods: {
    saveMedia() {
      this.loading = true
      const n = new Media({ media: this.new_image, title: this.page, description: this.page })
      n.save()
        .then((res) => {
          this.saveClub(res.link)
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    saveClub(image) {
      const club = { id: this.club.id, hero_images: {} }
      club.hero_images[this.page] = image
      new Club(club)
        .save()
        .then(() => {
          this.$store.dispatch('club/init_club', { force: true })
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste postavili fotografiju'),
            type: 'is-success',
          })
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
  },
}
</script>
