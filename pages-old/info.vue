<template>
  <div class="ranglist p-b-150">
    <hero :options="heroImage">
      <h1 class="has-text-white">{{ $t('oAplikaciji') }}</h1>
    </hero>
    <div class="x-container m-t-30">
      <img class="info__logo m-b-20 m-x-auto" src="/logo__login-dark.svg" alt="" />
      <!--      <p class="fw600">Tenis.plus je sustav za upravljanje teniskim klubovima i online rezervaciju terena.</p>-->
      <p class="fw600">
        {{ $t('tennisplusJeAplikacijaKojaPospjeujeProcesUpravljan') }}
      </p>
      <template v-if="club.country.code === 'GR'">
        <div class="">
          <div class="m-t-20 fw600 is-size-4 has-text-left">{{ $t('Podrška za aplikaciju') }}</div>
        </div>
        <p class="fw600 m-t-10">{{ $t('zaSveUpitePoaljitePoruku') }}</p>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">E-mail</div>
          <a href="mailto:jlabro@gmail.com" class="fw600 is-size-55">jlabro@gmail.com</a>
        </div>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('telefon') }}</div>
          <a href="tel:6936982305" class="fw600 is-size-55">6936982305</a>
        </div>
        <div class="buttons m-t-20">
          <b-button
            :href="'tel:00385914502752'"
            tag="a"
            class="softshadow m-l-10"
            type="is-small noborder"
            pack="far"
            icon-right="phone"
            rounded
          >
            {{ $t('nazovi') }}
          </b-button>
        </div>
      </template>
      <template v-else>
        <div class="">
          <div class="m-t-20 fw600 is-size-4 has-text-left">{{ $t('Podrška za aplikaciju') }}</div>
        </div>
        <p class="fw600 m-t-10">{{ $t('zaSveUpitePoaljitePoruku') }}</p>
        <div class="m-t-10 display-data__box">
          <a class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">E-mail</a>
          <a href="mailto:info@tenis.plus" class="fw600 is-size-55">info@tenis.plus</a>
        </div>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('telefon') }}</div>
          <a href="tel:00385914502752" class="fw600 is-size-55">+385-91-4502-752</a>
        </div>
        <div class="buttons m-t-20">
          <b-button
            class="softshadow"
            type="is-small noborder"
            pack="fal"
            icon-right="comments"
            rounded
            :loading="loadingMessage"
            @click="submitMessage()"
          >
            {{ $t('poaljiPoruku') }}
          </b-button>
          <b-button
            :href="'tel:00385914502752'"
            tag="a"
            class="softshadow m-l-10"
            type="is-small noborder"
            pack="far"
            icon-right="phone"
            rounded
          >
            {{ $t('nazovi') }}
          </b-button>
        </div>
      </template>
      <div class="">
        <div class="">
          <div class="m-t-20 fw600 is-size-4 has-text-left">{{ $t('Podrška za klub') }}</div>
        </div>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('adresa') }}</div>
          <div class="fw600 is-size-55">{{ club.address }}</div>
        </div>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">E-mail</div>
          <a :href="'mailto:' + club.email" class="fw600 is-size-55">{{ club.email }}</a>
        </div>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('telefon') }}</div>
          <a href="tel:00385914502752" class="fw600 is-size-55">{{ club.phone }}</a>
        </div>
        <div class="buttons m-t-20">
          <b-button
            :href="'tel:' + club.phone"
            tag="a"
            class="softshadow m-l-10"
            type="is-small noborder"
            pack="far"
            icon-right="phone"
            rounded
          >
            {{ $t('nazovi') }}
          </b-button>
        </div>
      </div>
      <a href="https://www.tenis.plus/" class="m-t-30">
        <div class="fw600 is-size-3 has-text-centered has-text-black80 w100">www.tenis.plus</div>
        <div class="fw600 is-size-6 has-text-centered has-text-lightblue w100">
          {{ $t('Posjetite web stranicu za više informacija') }}
        </div>
        <div class="buttons m-t-20">
          <b-button class="softshadow" type="is-small noborder" pack="fal" icon-right="long-arrow-right" rounded>
            {{ $t('Posjeti') }}
          </b-button>
        </div>

        <img src="/web.png" class="p-all-12 m-t--10" alt="" />
      </a>
    </div>
  </div>
</template>

<script>
import Thread from '@/models/Thread'
import hero from '~/components/Hero'
import Player from '~/models/Player'

export default {
  name: 'Players',
  components: {
    hero,
  },
  data() {
    return {
      heroImage: '/hero_ranks.jpg',
      loadingMessage: false,
      player: {},
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
  },
  mounted() {
    this.getPlayer()
  },
  methods: {
    getPlayer() {
      Player.find(2).then((res) => {
        this.player = res
      })
    },
    submitMessage() {
      this.loadingMessage = true
      Thread.whereIn('players_exact', [this.user.id, 2])
        .get()
        .then((res) => {
          if (res.data.length) {
            this.$router.push(this.localePath(`/messages/${res.data[0].id}`))
          } else {
            const t = new Thread({ players: [this.player] })
            t.save().then((res) => {
              this.$router.push(this.localePath(`/messages/${res.id}`))
            })
          }
          this.loadingMessage = false
        })
        .catch(() => {
          this.loadingMessage = false
        })
    },
  },
}
</script>
