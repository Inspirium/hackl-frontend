<template>
  <div class="p-b-100">
    <!--    Prikaži ako si admin ili liga admin-->
    <div v-if="isLigaAdmin.length || isAdmin" class="liga__active__header">
      <div class="member__info liga__header is-red">
        <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10">{{ $t('ligaJeZavrena') }}</div>
      </div>
      <hero
        :options="heroImage"
        :second="{
          name: $t('Lige'),
          link: '/liga',
        }"
        class="liga__hero"
      >
        <h1 class="has-text-white">{{ liga.name }}</h1>
      </hero>
      <div class="member__info liga__header primary-light p-t-10 p-l-10 p-r-10">
        <div class="help__text has-text-centered m-b-10 has-text-white">
          <span class="has-text-white">{{ $t('nastaviLigu') }} </span>{{ $t('ponovnoPokreniteAktualnuLigu') }}
        </div>
        <div class="x-container m-t-20">
          <div class="buttons m-b-5">
            <b-button
              class="softshadow m-b-10"
              type="is-small noborder"
              pack="fal"
              icon-right="lock-open-alt"
              rounded
              :loading="loading"
              @click="unFinishLiga()"
            >
              {{ $t('aktivirajLigu') }}
            </b-button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="true" class="x-container">
      <div class="activity__header">
        <div class="fw600 tranform__center is-size-3 m-t-15">{{ $t('nastaviNatjecanje') }}</div>
      </div>
      <div class="help__text has-text-centered m-t-5 m-b-40">
        <span>{{ $t('opcije2') }} </span>{{ $t('imateMogunostNastavkaLigePokretanjemNovogCiklusLig') }}
      </div>

      <div class="align__centar__all">
        <div
          v-for="(option, index) in ligaOptions"
          :key="index"
          class="member__info kid_selected m-l-20 m-r-20"
          :class="isSelected === option ? 'active' : ''"
          @click="isSelected = option"
        >
          <div class="">
            <b-icon
              :icon="option.icon"
              size="is-large"
              :type="isSelected === option ? 'is-white' : 'is-grey'"
              pack="fal"
            ></b-icon>
          </div>
          <div class="is-size-6 fw600 m-b-10 m-t-5">
            {{ option.name }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="isSelected.name === 'Novi ciklus'" class="x-container">
      <div class="help__text has-text-centered m-t-5 m-b-20">
        {{ $t('pokretanjemNovogCiklusaSustavEAutomatskiRaspodijel') }}
      </div>
      <div class="buttons m-t-0">
        <b-button
          class="fw600 m-t-10"
          type="is-primary"
          pack="fal"
          size="is-medium"
          icon-right="chevron-right"
          rounded
          :loading="loading1"
          @click="startNew"
        >
          {{ $t('aktivirajNoviCiklus') }}
        </b-button>
      </div>
    </div>
    <div v-if="isSelected.name === 'Izradi turnir'" class="x-container">
      <div class="help__text has-text-centered m-t-5 m-b-20">
        {{ $t('pokretanjemTurniraSustavEAutomatskiRaspodijelitiIg') }}
      </div>
      <div class="buttons m-t-0">
        <b-button
          class="fw600 m-t-10"
          type="is-primary"
          pack="fal"
          size="is-medium"
          icon-right="chevron-right"
          rounded
          @click="$router.push({ path: localePath('/cup/new'), query: { name: liga.name, id: liga.id } })"
        >
          {{ $t('pokreniTurnir') }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import League from '@/models/League'
import hero from '~/components/Hero'

export default {
  name: 'LigaFinish',
  components: {
    hero,
  },
  async fetch() {
    await this.getLeague()
  },
  data() {
    return {
      activeTab: 0,
      isMatchOptionsModal: false,
      heroImage: '/liga.jpg',
      liga: {},
      loading: false,
      loading1: false,
      isSelected: '',
      ligaOptions: [
        {
          name: 'Novi ciklus',
          icon: 'redo',
        },
        {
          name: 'Izradi turnir',
          icon: 'trophy',
        },
      ],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    isLigaAdmin() {
      return _.filter(this.liga.admins, (item) => {
        return item.id === this.user.id
      })
    },
  },
  methods: {
    getLeague() {
      League.include(['players', 'admins', 'groups', 'groups.games'])
        .find(this.$route.params.id)
        .then((res) => {
          this.liga = res
        })
    },
    unFinishLiga() {
      this.loading = true
      const l = new League({
        id: this.liga.id,
        status: 4,
      })
      l.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Liga je ponovno pokrenuta'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/liga/' + this.$route.params.id))
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 5000,
          })
          this.loading = false
        })
    },
    startNew() {
      this.loading1 = true
      const l = new League({
        id: this.liga.id,
      })
      League.custom(l, 'start_new')
        .get()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Novi ciklus lige uspješno je pokrenut'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/liga/' + res[0].id + '/cycle_create'))
          this.loading1 = false
        })
        .catch((res) => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
          })
          this.loading1 = false
        })
    },
  },
}
</script>
<style scoped>
.liga__group__settings {
  padding: 0;
  background-color: transparent;
}
.schoolgroup__messages {
  background-color: #ffffff50;
}
</style>
