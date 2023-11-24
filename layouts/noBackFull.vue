<template>
  <div class="nema" :class="selectedLanguageStyle">
    <topnav class="bodyWrap" />
    <nuxt v-if="(isMember || !validateUser) && !isBlocked" />
    <!--    <p>isMember: {{ isMember }}</p>-->
    <!--    <p>isApplicant: {{ isApplicant }}</p>-->
    <!--    <p>isNew: {{ isNew }}</p>-->
    <!--    <p>isBlocked: {{ isBlocked }}</p>-->
    <!--    <p>validateUser: {{ validateUser }}</p>-->
    <div v-if="isNew && club.validate_user === 1" class="notify p-b-150">
      <!--      <div class="member__info liga__header is-red">-->
      <!--        <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10 p-l-10 p-r-10">-->
      <!--          Za rezervaciju terena u {{ club.name }} morate biti član kluba-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="m-b-20">
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

      <div class="x-container">
        <template v-if="isAdmin">
          <div v-if="check === null || check === 'applicant'" class="m-t-20 m-b-20">
            <div class="birthday rounded-md softshadow4">
              <div class="align__centar__y flex__column p-l-20 p-r-20 p-t-10 p-b-10">
                <b-icon icon="check" size="is-large" type="is-white" pack="fal"></b-icon>
                <div class="fw600 is-size-6 has-text-centered has-text-white m-b--5">
                  {{ $t('dobiliSteZahtjevZaPotvrduNovogLanaKluba') }}
                </div>
                <div class="fw600 is-size-4 has-text-centered has-text-white">
                  {{ player.display_name }}
                </div>
                <div class="buttons m-t-20 m-b-0">
                  <b-button
                    class="softshadow m-b-10"
                    type="is-small noborder"
                    pack="far"
                    icon-right="user-plus"
                    rounded
                    @click="
                      updateMemberData.member.push(player)
                      updateMember()
                    "
                  >
                    {{ $t('potvrdiLanstvo') }}
                  </b-button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <TennisImage
          :size="[180, 180]"
          :src="club.logo"
          class="user_image-large m-r-auto m-l-auto m-t-10 m-b-10"
          alt=""
        />
        <div class="title m-b-5 m-t-5 has-text-centered">{{ club.name }}</div>
        <div class="modal-subtitle is-size-5 has-text-lightblue has-text-centered">{{ club.city }}</div>
        <template>
          <div class="m-b-10 m-t-10 has-text-centered">
            <div class="fw600 is-size-6 has-text-centered">
              {{ $t('sveOUvjetimaLanstvaMoeteSaznatiPozivomNaOvajBroj') }}
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
        </template>
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

        <div class="">
          <div class="m-t-20 fw600 is-size-4 has-text-left m-b--10">{{ $t('vrsteLanstva') }}</div>
        </div>
        <div v-for="item in club.memberships" :key="item.id" class="">
          <div class="m-t-30 display-data__box is-black30">
            <div class="fw600 is-size-4 has-text-white has-text-centered">{{ item.name }}</div>
          </div>
          <!--          <div class="fw600 is-size-3 m-t-20 has-text-lightblue has-text-centered">{{ item.name }}</div>-->

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
          <div v-if="item.hasDiscount" class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('iznosPopusta') }}</div>
            <div v-if="item.discount_type === 1" class="fw600 is-size-55">
              {{ $t('key5', { currency: item.discount_amount }) | currency }}
            </div>
            <div v-else class="fw600 is-size-55">{{ item.discount_amount }}%</div>
          </div>
          <div class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('godinjaCijena') }}</div>
            <div class="fw600 is-size-55">{{ $t('key5', { currency: item.price }) | currency }}</div>
          </div>
          <div v-if="item.description" class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('napomene') }}</div>
            <div class="fw600 is-size-6">{{ item.description }}</div>
          </div>
        </div>
      </div>
      <div class="buttons m-t-15 m-b-15">
        <b-button
          class="m-l-5 m-t-20 fw600"
          type="is-primary"
          pack="fal"
          icon-right="user-plus"
          rounded
          tag="nuxt-link"
          to="/admin/"
        >
          {{ $t('poaljiZahtjevZaLanstvo') }}
        </b-button>
      </div>
    </div>
    <template v-if="isApplicant">
      <div class="x-container">
        <TennisImage
          :size="[180, 180]"
          :src="club.logo"
          class="user_image-large m-r-auto m-l-auto m-t-20 m-b-10"
          alt=""
        />
        <div class="title m-b-5 m-t-5 has-text-centered">{{ club.name }}</div>
        <div class="modal-subtitle is-size-5 has-text-lightblue has-text-centered">{{ club.city }}</div>
        <div class="m-t-10 m-b-20">
          <div class="birthday rounded-md softshadow4 p-b-30">
            <div class="fw600 is-size-4 has-text-centered has-text-white p-t-20">{{ $t('lanstvoUKlubu') }}</div>
            <div class="align__centar__y flex__column p-l-20 p-r-20 p-b-10">
              <TennisImage
                :size="[72, 72]"
                :src="user.image"
                class="user_image-medium border__white--2 m-r-auto m-l-auto m-t-20 m-b-10"
                alt=""
              />
              <!--              <b-icon icon="clock" size="is-large" type="is-white" pack="fal"></b-icon>-->
              <div class="fw600 is-size-6 has-text-centered has-text-white m-b--5 m-t-20">
                {{ $t('vaSeZahtjevZaLanstvomURazmatra', { display_name: user.display_name, name: club.name }) }}
              </div>
            </div>
            <div class="buttons m-t-20">
              <b-button
                class="softshadow m-l-10"
                type="is-small noborder"
                pack="far"
                icon-right="repeat"
                rounded
                @click="checkStatus()"
              >
                {{ $t('provjeriStatusZahtjeva') }}
              </b-button>
            </div>
          </div>
          <div class="fw600 is-size-6 has-text-centered has-text-black80 m-b--5 m-t-20">
            {{ $t('zaDetaljneInformacijeOStatusuVaegZahtjevaNazoviteO') }}
          </div>
          <div class="fw600 is-size-4 has-text-centered has-text-black80 m-b-5 m-t-20">
            {{ club.phone }}
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
    </template>
    <template v-if="isBlocked">
      <div class="x-container">
        <div class="fw600 is-size-3 has-text-centered m-t-20">{{ $t('blokiraniSte') }}</div>
        <div class="m-t-20 m-b-20">
          <div class="is-red rounded-md softshadow4">
            <div class="align__centar__y flex__column p-l-20 p-r-20 p-t-20 p-b-10">
              <b-icon icon="exclamation-circle" size="is-large" type="is-white" pack="fal"></b-icon>
              <div class="fw600 is-size-5 has-text-centered has-text-white m-b--5 m-t-20">
                {{ $t('administratorBlokiraoJeVaPristupAplikacijiKluba', { name: club.name }) }}
              </div>
              <div class="fw600 is-size-7 has-text-centered has-text-white m-b--5 m-t-20">
                {{ $t('zaDetaljneIndormacijeORazlozimaBlokadeNazoviteOvaj', { phone: club.phone }) }}
              </div>
              <div class="buttons m-t-30 m-b-15">
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
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { Capacitor } from '@capacitor/core'
import TennisImage from '@/components/TennisImage.vue'
import { TextZoom } from '@capacitor/text-zoom'
import { App } from '@capacitor/app'
import TopNav from '~/components/TopNav'

export default {
  name: 'Layout',
  components: {
    topnav: TopNav,
    TennisImage,
  },
  meta: [
    {
      name: 'viewport',
      content: 'user-scalable=no',
    },
  ],
  data() {
    return {
      heroImage: '/club-brand-image.jpg',
      loading: false,
      backListener: null,
    }
  },
  computed: {
    selectedLanguageStyle() {
      const selectedLanguage = this.$i18n.locale
      if (selectedLanguage === 'el') {
        return 'bodyWrap greek'
      } else {
        return 'bodyWrap'
      }
    },
    heroLogo() {
      return this.$store.state.club.logo
    },
    isMember() {
      return (
        this.$auth.loggedIn &&
        this.user.club_member[this.club.id] &&
        this.user.club_member[this.club.id].type === 'member'
      )
    },
    isApplicant() {
      return (
        this.$auth.loggedIn &&
        this.user.club_member[this.club.id] &&
        this.user.club_member[this.club.id.toString()].type === 'applicant'
      )
    },
    isNew() {
      return (
        this.$auth.loggedIn &&
        (!this.user.club_member[this.club.id] ||
          this.user.club_member[this.club.id.toString()].type === null ||
          this.user.club_member[this.club.id.toString()].type === undefined)
      )
    },
    isBlocked() {
      return (
        this.$auth.loggedIn &&
        this.user.club_member[this.club.id] &&
        this.user.club_member[this.club.id.toString()].type === 'blocked'
      )
    },
    validateUser() {
      return this.club.validate_user === 1
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    club() {
      return this.$store.state.club
    },
  },
  async mounted() {
    if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios') {
      const fontSize = await TextZoom.get()
      if (fontSize.value > 1.1) {
        await TextZoom.set({ value: 1.1 })
      }
    }
    if (Capacitor.getPlatform() === 'android') {
      this.backListener = await App.addListener('backButton', (e) => {
        if (this.$route.name === 'index') {
          App.exitApp()
        } else {
          this.$router.go(-1)
        }
      })
    }
  },
  beforeDestroy() {
    if (Capacitor.getPlatform() === 'android') {
      this.backListener.remove()
    }
  },
  methods: {
    swipeHandler(direction) {
      if (direction === 'right') {
        // this.direction = 'right'
        this.$router.go(-1)
      } else if (direction === 'left') {
        // this.direction = 'left'
        this.$router.go(1)
      }
    },
    checkStatus() {
      this.$router.go()
    },
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
    redirectToFindClub() {
      if (!this.$store.state.club.id) {
        this.$router.push(this.localePath('/login/club'))
      }
    },
  },
}
</script>
