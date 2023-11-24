<template>
  <div class="member">
    <PageHeader :title="$t('trener')"></PageHeader>
    <div class="activity x-container">
      <div v-if="Object.keys(player).length" class="member__info">
        <TennisImage v-if="player.image" :size="[180, 180]" :src="player.image" class="user_image-large m-r-5" alt="" />
        <div class="title m-b-5 m-t-5">{{ player.display_name }}</div>
        <div class="modal-subtitle">{{ $t('godina range', { range: player.range }) }}</div>
        <div class="p-t-10 p-b-10 m-t-20 is-white radius__12 softshadow">
          <div v-if="player.trainer.price" class="fw600 m-b-10 m-t-5 is-size-55">
            {{ $t('cijenaPoSatu') }} <span class="has-text-lightblue">{{ player.trainer.price | currency }}</span>
          </div>
          <div v-else class="fw600 m-b-10 m-t-5 is-size-55">{{ $t('cijenaPoSatu') }} {{ $t('Po dogovoru') }}</div>
          <div v-if="player.trainer.court_included" class="fw600 m-b-10 m-t--10 is-size-7">
            {{ $t('Teren je uključen u cijenu') }}
          </div>
          <div v-else class="fw600 m-b-10 m-t--10 is-size-7">
            {{ $t('Teren nije uključen u cijenu') }}
          </div>
        </div>
        <!-- eslint-disable-next-line -->
        <div class="has-text-left is-size-6 content-tiny fw600" v-html="player.trainer.description"></div>
        <template v-if="player.id !== user.id">
          <div class="p-t-10 p-b-20 m-t-20 is-white radius__12 softshadow">
            <div class="fw600 is-size-4">{{ $t('dogovoriTermin') }}</div>
            <div v-if="player.trainer.show_phone" class="modal-subtitle">
              {{ $t('brojTelefona', { phone: user.phone }) }}
            </div>
            <div class="buttons m-t-20">
              <b-button
                v-if="player.trainer.show_phone"
                :href="'tel:' + user.phone"
                class="m-l-10"
                type="is-danger"
                pack="far"
                icon-right="phone"
                rounded
              >
                {{ $t('nazovi') }}
              </b-button>
              <b-button
                class="m-l-10"
                type="is-primary"
                pack="fal"
                icon-right="comments"
                rounded
                :loading="loadingMessegas"
                @click="submitMessage"
              >
                {{ $t('poaljiPoruku') }}
              </b-button>
            </div>
          </div>
        </template>
        <div v-else class="buttons m-t-20">
          <b-button
            tag="nuxt-link"
            :to="localePath('/trainer/' + user.id + '/edit')"
            class="m-t-5"
            type="is-primary"
            pack="fal"
            icon-right="user-edit"
            rounded
          >
            {{ $t('urediProfil') }}
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Thread from '@/models/Thread'
import Player from '~/models/Player'
import PageHeader from '~/components/headers/blankBack'

export default {
  name: 'Trainer',
  components: {
    TennisImage,
    PageHeader,
  },
  async fetch() {
    const id = this.$route.params.id
    this.player = await Player.include('trainer').$find(id)
  },
  data() {
    return {
      loadingMessegas: false,
      player: {
        trainer: {},
      },
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  methods: {
    submitMessage() {
      this.loadingMessegas = true
      const x = this.player
      Thread.whereIn('players_exact', [this.user.id, this.player.id])
        .get()
        .then((res) => {
          if (res.data.length) {
            this.$router.push(this.localePath(`/messages/${res.data[0].id}`))
          } else {
            const t = new Thread({ players: [x], message: this.$t('Upit za trening') })
            t.save().then((res) => {
              this.$router.push(this.localePath(`/messages/${res.id}`))
            })
          }
          this.loadingMessegas = false
        })
        .catch(() => {
          this.loadingMessegas = false
        })
    },
  },
}
</script>
