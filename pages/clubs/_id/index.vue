<script src="../../../plugins/tinymce.js"></script>
<template>
  <div>
    <div v-if="Object.keys(club).length" class="p-b-75">
      <hero
        :page="'clubs'"
        :options="club.hero_images.home"
        :back="true"
        :second="{
          name: $t('Klubovi'),
          link: '/clubs',
        }"
      >
      </hero>
      <div class="x-container">
        <div v-if="isNew && club.validate_user === 1" class="notify m-t-20 m-b-20 radius__12 overflow-hidden">
          <div class="birthday softshadow4">
            <div class="align__centar__y flex__column p-l-20 p-r-20 p-t-20 p-b-10">
              <b-icon icon="user-plus" size="is-large" type="is-white" pack="fal"></b-icon>
              <div class="fw600 is-size-6 has-text-centered has-text-white m-b--5 m-t-20">
                {{ $t('akoEliteIgratiNaTerenimaMoratePodnijetiZahtjevZaLa', { name: club.name }) }}
              </div>
              <div class="buttons m-t-20 m-b-0" @click="newApplicant()">
                <b-button
                  class="softshadow m-b-10"
                  type="is-small noborder"
                  pack="far"
                  icon-right="check"
                  rounded
                  :loading="loading"
                >
                  {{ $t('poaljiZahtjevZaLanstvo') }}
                </b-button>
              </div>
            </div>
          </div>
        </div>
        <TennisImage
          :size="[180, 180]"
          :src="club.logo"
          class="user_image-large-noborder m-r-auto m-l-auto m-t-20 m-b-10"
          alt=""
        />
        <div class="title m-b-5 m-t-5 has-text-centered">{{ club.name }}</div>
        <div class="modal-subtitle is-size-5 has-text-lightblue has-text-centered">{{ club.city }}</div>
        <div class="buttons m-t-20">
          <b-button
            class="softshadow m-l-10"
            type="is-small noborder"
            pack="far"
            icon-right="chevron-right"
            rounded
            @click="submit"
          >
            Posjeti web stranicu mjesnog odbora
          </b-button>
        </div>
        <!-- eslint-disable-next-line -->
        <div class="has-text-left is-size-6 content-tiny m-t-20" v-html="club.description"></div>
        <div class="">
          <div class="m-t-20 fw600 is-size-4 has-text-left">{{ $t('kontaktPodaci') }}</div>
        </div>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('adresa') }}</div>
          <div class="fw600 is-size-55">{{ club.address }}</div>
        </div>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">E-mail</div>
          <div class="fw600 is-size-55">{{ club.email }}</div>
        </div>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('telefon') }}</div>
          <div class="fw600 is-size-55">{{ club.phone }}</div>
        </div>
        <div v-if="club.validate_user !== 1" class="empty__box m-t-20">
          <div class="fw600 is-size-5 has-text-centered">{{ $t('zaRezervacijuTerenaNijePotrebnoBitiLanKluba') }}</div>
          <div class="fw600 is-size-65 has-text-centered has-text-black50">
            {{ $t('svakuRezervacijuTerenaMoratEOdobritiAdministratora') }}
          </div>
        </div>

        <div v-else class="empty_red_empty m-t-20">
          <div class="fw600 is-size-5 has-text-centered">{{ $t('zaRezervacijuTerenaPotrebnoJeBitiLanKluba') }}</div>
          <div class="m-b-10 m-t-10 has-text-centered">
            <div class="fw600 is-size-65 has-text-centered has-text-black50">
              {{ $t('sveOUvjetimaLanstvaMoeteSaznatiPozivomNaOvajBroj2') }}
              <span class="is-size-5 has-text-lightblue">{{ club.phone }}</span>
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
        </div>

        <div class="">
          <div class="m-t-20 fw600 is-size-4 has-text-left">{{ $t('tereni') }}</div>
        </div>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('ukupnoTerena') }}</div>
          <div class="fw600 is-size-55">{{ courts.length }}</div>
        </div>
        <div v-if="courts.length !== activeCourts.length" class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('trenutnoAktivnih') }}</div>
          <div class="fw600 is-size-55">{{ activeCourts.length }}</div>
        </div>

        <div class="">
          <div class="m-t-30 fw600 is-size-4 has-text-left m-b--20">{{ $t('vrsteLanstva') }}</div>
        </div>
        <div v-for="item in club.memberships" :key="item.id" class="">
          <div class="m-t-30 display-data__box is-primary">
            <div class="fw600 is-size-7 has-text-white has-text-centered is-uppercase">{{ $t('lanstvo2') }}</div>
            <div class="fw600 is-size-4 m-t--5 has-text-white has-text-centered">{{ item.name }}</div>
          </div>
          <div class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('rezervacijaTerena') }}</div>
            <div class="fw600 is-size-55">
              {{ $t('danaUnaprijed', { max_reservation_span: item.max_reservation_span }) }}
            </div>
          </div>
          <div class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
              {{ $t('otkazivanjeRezervacije') }}
            </div>
            <div class="fw600 is-size-55">{{ item.is_reservation_cancelable ? 'Moguće' : 'Nije moguće' }}</div>
          </div>
          <div v-if="item.is_reservation_cancelable" class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
              {{ $t('rokOtkazivanjaRezervacije') }}
            </div>
            <div class="fw600 is-size-55">
              {{ $t('satiRanije', { reservation_cancelable: item.reservation_cancelable }) }}
            </div>
          </div>
          <div class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
              {{ $t('popustNaCijeneRezervacije') }}
            </div>
            <div class="fw600 is-size-55">{{ item.hasDiscount ? 'Da' : 'Ne' }}</div>
          </div>
          <!--          <div v-if="item.hasDiscount" class="m-t-10 display-data__box">-->
          <!--            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('iznosPopusta') }}</div>-->
          <!--            <div v-if="item.discount_type === 1" class="fw600 is-size-55">-->
          <!--              {{ $t('key5', { currency: item.discount_amount }) | currency }}-->
          <!--            </div>-->
          <!--            <div v-else class="fw600 is-size-55">{{ item.discount_amount }}%</div>-->
          <!--          </div>-->
          <div class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
              {{ $t('Limit na broj rezervacija') }}
            </div>
            <div class="fw600 is-size-55">
              {{ item.max_reservation_per_period ? $t('da') : $t('ne') }}
            </div>
          </div>
          <div v-if="item.max_reservation_per_period" class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
              {{ $t('Maksimalan broj ativnih rezervacija u satima') }}
            </div>
            <div class="fw600 is-size-55">
              {{ item.max_reservation_per_period_days }}
            </div>
          </div>
          <div class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('godinjaCijena') }}</div>
            <div class="fw600 is-size-55">{{ $t('key5', { currency: item.price }) | currency }}</div>
          </div>
          <div v-if="item.description" class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('napomene') }}</div>
            <!-- eslint-disable-next-line -->
            <div class="has-text-left is-size-6 content-tiny" v-html="item.description"></div>
          </div>
        </div>
        <footer
          v-if="
            club.social !== null &&
            (club.social.facebook !== null || club.social.instagram !== null || club.social.twitter !== null)
          "
          class="m-t-20"
        >
          <div class="divider-line-1 m-t-10"></div>
          <div class="activity__header--center m-b-10 m-t-10">
            <div class="fw600 is-size-5 has-text-centered">{{ $t('pratite', { name: club.name }) }}</div>
          </div>
          <div class="flex align__centar__x">
            <a v-if="club.social.facebook !== null" :href="club.social.facebook" class="">
              <b-icon icon="facebook" pack="fab" type="is-primary" class="is-larger m-r-10 m-l-10"></b-icon>
            </a>
            <a v-if="club.social.instagram !== null" :href="club.social.instagram" class="">
              <b-icon icon="instagram" pack="fab" type="is-primary" class="is-larger m-r-10 m-l-10"></b-icon>
            </a>
            <a v-if="club.social.twitter !== null" :href="club.social.twitter" class="">
              <b-icon icon="twitter" pack="fab" type="is-primary" class="is-larger m-r-10 m-l-10"></b-icon>
            </a>
          </div>
        </footer>
      </div>
    </div>
    <transition v-else name="fade">
      <div class="align__centar__x m-t-100 loading_z_spinner">
        <b-icon
          class="comment-send m-b-20"
          custom-class="rotating"
          icon="spinner"
          size="is-large"
          type="is-primary"
          pack="far"
        ></b-icon>
      </div>
    </transition>
  </div>
</template>
<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Club from '@/models/Club'
import { Capacitor } from '@capacitor/core'
import hero from '~/components/Hero'
import Court from '~/models/Court'

export default {
  name: 'Clubs',
  components: {
    hero,
    TennisImage,
  },
  async fetch() {
    await this.getClubs()
  },
  data() {
    return {
      heroImage: '/hero_clubs.jpg',
      selectedClub: {},
      isModalActive: false,
      club: {},
      courts: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    cluby() {
      return this.$store.state.club
    },
    isAdmin() {
      return this.user.is_admin
    },
    clubCurrent() {
      return this.$store.state.club
    },
    activeCourts() {
      return this.courts.filter((item) => {
        return item.is_active
      })
    },
    isNew() {
      return (
        this.$auth.loggedIn &&
        (!this.user.club_member[this.cluby.id] ||
          this.user.club_member[this.cluby.id.toString()].type === null ||
          this.user.club_member[this.cluby.id.toString()].type === undefined)
      )
    },
  },
  methods: {
    newApplicant() {
      this.loading = true
      this.$axios
        .put('v2/club/member', { member: [], applicant: [this.user], blocked: [] })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste poslali zatražili članstvo u klubu'),
            type: 'is-success',
          })
          this.$auth.fetchUser()
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    getClubs() {
      Club.include('memberships')
        .find(this.$route.params.id)
        .then((res) => {
          this.club = res
          this.getCourts()
        })
    },
    getCourts() {
      Court.where('club_id', this.club.id)
        .get()
        .then((res) => {
          this.courts = res.data
        })
    },
    submit() {
      if (Capacitor.getPlatform() === 'web') {
        window.location.href = `https://${this.club.subdomain}.inspirium.hr`
      } else {
        this.$store.commit('club/setId', this.club.id)
        this.$store.dispatch('club/init_club', { force: true })
        this.$router.push(this.localePath('/'))
      }
    },
  },
}
</script>
