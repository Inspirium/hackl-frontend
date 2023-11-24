<template>
  <div v-if="Object.keys(liga).length" class="member">
    <div class="member__info liga__header is-red">
      <div
        v-if="liga.boarding_type === 1 && hasReachedLimitOfPlayers"
        class="fw600 is-size-55 has-text-white p-t-10 p-b-10"
      >
        {{ $t('prijavljenJeDovoljanBrojIgraa') }}
      </div>
      <div v-if="hasDatePassed" class="fw600 is-size-55 has-text-white p-t-10 p-b-10">
        {{ $t('istekoJeRokZaPrijave') }}
      </div>
      <div v-if="!hasDatePassed && !hasReachedLimitOfPlayers" class="fw600 is-size-55 has-text-white p-t-10 p-b-10">
        {{ $t('prijaveTrajuJo', { howManyDays: howManyDays }) }}
      </div>
    </div>
    <hero
      v-if="isAdmin || isLigaAdmin.length"
      :options="heroImage"
      :second="{
        name: $t('Lige'),
        link: '/liga',
      }"
      class="liga__hero--options"
    >
      <h1 class="has-text-white">{{ liga.name }}</h1>
      <div class="buttons m-t-10">
        <b-button
          class="softshadow m-b-10"
          type="is-small noborder is-rounded"
          pack="fal"
          icon-right="times-circle"
          rounde
          :loading="loading_delete"
          @click="deleteLiga"
        >
          {{ $t('obriiLigu') }}
        </b-button>
        <b-button
          class="softshadow m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="user-edit"
          rounded
          @click="$router.push(localePath('/liga/elo/' + $route.params.id + '/edit'))"
        >
          {{ $t('urediLigu') }}
        </b-button>
      </div>
    </hero>
    <hero
      v-else
      :options="heroImage"
      :second="{
        name: $t('Lige'),
        link: '/liga',
      }"
      class="liga__hero"
    >
      <h1 class="has-text-white">{{ liga.name }}</h1>
    </hero>

    <div v-if="isAdmin || isLigaAdmin.length" class="x-container m-b-30 m-t-20">
      <div class="buttons admin_box m-t-0">
        <b-button
          class="fw600 m-t-10"
          type="is-danger"
          pack="fal"
          size="is-medium"
          icon-right="lock-alt"
          rounded
          @click="finish"
        >
          {{ $t('zavriPrijave') }}
        </b-button>
      </div>
    </div>

    <div class="x-container has-text-centered m-b-10 m-t-30">
      <div class="fw600">{{ $t('brojPrijavljenihIgraa') }}</div>
      <div class="fw600 is-size-1 liga__group__list line-height-28">
        {{ liga.players.length
        }}<span v-if="liga.boarding_type === 1" class="has-text-danger"
          >/{{ liga.players_in_groups * liga.players_in_groups }}</span
        >
      </div>
    </div>
    <div v-if="isInLiga.length" class="x-container m-b-0 m-t-10">
      <div class="fw600 is-size-3 has-text-centered">{{ $t('prijavljeniSteULigu') }}</div>
    </div>
    <div
      v-if="isInLiga.length === 0 && !hasDatePassed && !hasReachedLimitOfPlayers && !liga.is_doubles"
      class="buttons m-t-20"
    >
      <b-button
        class="fw600 m-t-20"
        type="is-primary"
        pack="fal"
        size="is-medium"
        icon-right="check"
        rounded
        :loading="loading1"
        @click="addPlayer()"
      >
        {{ $t('prijaviSe') }}
      </b-button>
    </div>
    <div v-if="hasDatePassed || hasReachedLimitOfPlayers" class="x-container">
      <div class="empty_red_empty activity__header--center m-b-5 m-t-0">
        <div class="fw600 is-size-6 has-text-centered">{{ $t('prijaveULiguSuZavrene') }}</div>
      </div>
    </div>
    <div v-if="isInLiga.length > 0 && !hasDatePassed" class="buttons m-t-0">
      <b-button
        class="fw600 m-t-20 invert-small-button"
        type="is-danger has-text-white"
        pack="fal"
        size="is-small noborder"
        icon-right="times"
        rounded
        :loading="liga.is_doubles ? loading2 : loading1"
        @click="liga.is_doubles ? deletePlayerTeam() : deletePlayer()"
      >
        {{ $t('odjaviSe') }}
      </b-button>
    </div>
    <doubles v-if="!isInLiga.length && liga.is_doubles" :loading-it="loading3" @team="addPlayerTeam($event)"></doubles>

    <!--    <section class="x-container registration">-->
    <!--      <div class="fw600 is-size-6 has-text-centered">-->
    <!--        Rok za prijave:-->
    <!--        <span class="has-text-danger">{{-->
    <!--          $moment(liga.finish_onboarding).format('dddd' + ', ' + 'DD' + '.' + 'MM' + '.')-->
    <!--        }}</span>-->
    <!--      </div>-->
    <!--    </section>-->
    <div class="x-container registration">
      <b-tabs size="is-medium" position="is-centered">
        <b-tab-item :label="$t('info')" class="p-b-100">
          <div class="activity__header m-b-10 m-t-10">
            <div class="fw600 is-size-3">{{ $t('osnovniPodaci') }}</div>
          </div>
          <adminEdit :options="liga"></adminEdit>
          <div class="display-data__box m-t-10">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('nazivLige') }}</div>
            <div class="fw600 is-size-5">{{ liga.name }}</div>
            <div class="fw600 is-size-65">{{ liga.is_doubles ? 'Liga parova' : 'Liga pojedinaca' }}</div>
          </div>
          <div class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('brojPrijava') }}</div>
            <div class="fw600 is-size-5">
              {{
                liga.boarding_type === 0
                  ? 'Neograničen'
                  : 'Limit: ' + liga.players_in_groups * liga.number_of_groups + ' igrača'
              }}
            </div>
          </div>
          <div class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('rokZaPrijavu') }}</div>
            <div class="fw600 is-size-5">
              {{ $moment(liga.finish_onboarding).format('dddd' + ', ' + 'DD' + '.' + 'MM' + '.') }}
            </div>
          </div>
          <div class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('datumZavretkaLige') }}</div>
            <div class="fw600 is-size-5">
              {{ $moment(liga.finish_date).format('dddd' + ', ' + 'DD' + '.' + 'MM' + '.') }}
            </div>
          </div>
          <div class="m-t-10 m-b-15 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
              {{ $t('trenutniBrojNatjecatelja') }}
            </div>
            <div v-if="liga.players !== undefined" class="fw600 is-size-5">
              {{ liga.players.length ? liga.players.length : 'Nema prijavljenih' }}
            </div>
          </div>
          <div v-if="liga.description" class="m-t-15 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('napomene') }}</div>
            <!-- eslint-disable-next-line -->
            <div class="has-text-left is-size-6 content-tiny m-t-10" v-html="liga.description"></div>
          </div>
          <template v-if="liga.documents !== undefined">
            <div class="m-b-10 m-t-20">
              <div class="fw600 is-size-3">{{ $t('dokumenti') }}</div>
              <div
                v-for="(item, index) in liga.documents"
                :key="index"
                class="list__documents list__image-col softshadow m-b-10"
              >
                <div class="align__centar__y w100 document-list">
                  <div class="m-r-10 m-t-10">
                    <b-icon icon="file" size="is-larger" type="is-grey" pack="fal"></b-icon>
                  </div>
                  <div class="list__content m-r-auto doc-icons">
                    <h3 class="fw600 m-b-5">{{ item.title }}</h3>
                  </div>
                  <div class="m-l-auto m-t-10">
                    <b-icon icon="cloud-download" size="is-medium" type="is-primary" pack="fal"></b-icon>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </b-tab-item>
        <b-tab-item :label="$t('prijavljeni')">
          <div class="registration">
            <div class="tablelist p-b-100">
              <b-table :data="liga.players" :bordered="false" :mobile-cards="false">
                <b-table-column v-slot="props" cell-class="list__image-col">
                  <nuxt-link :to="localePath(props.row.link)">
                    <div class="list__img">
                      <template v-if="liga.is_doubles" class="for-doubles">
                        <div v-if="props.row.image === 'https://api.tenis.plus/images/user.svg'" class="flex">
                          <TennisImage
                            :size="[42, 42]"
                            :src="props.row.players[0].image"
                            class="user_image border__white--2"
                            alt=""
                          />
                          <TennisImage
                            :size="[42, 42]"
                            :src="props.row.players[1].image"
                            class="user_image m-l--20 border__white--2"
                            alt=""
                          />
                        </div>
                        <div v-else class="">
                          <TennisImage
                            :size="[42, 42]"
                            :src="props.row.image"
                            class="user_image border__white--2"
                            alt=""
                          />
                        </div>
                      </template>

                      <TennisImage v-else :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
                    </div>
                    <div class="list__content">
                      <div class="fw600 is-size-55 has-text-black80 line-height-14">{{ props.row.display_name }}</div>
                      <div v-if="!liga.is_doubles" class="fw600 is-size-7 has-text-lightblue">
                        {{ $t('godina range', { range: props.row.players[0].range }) }}
                      </div>
                    </div>
                    <b-tag type="is-info">{{ Math.round(props.row.rating_club) }}</b-tag>
                  </nuxt-link>
                </b-table-column>
                <template #empty>
                  <section class="section">
                    <div class="content has-text-grey has-text-centered">
                      <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                      <p class="modal-title">{{ $t('nemaPrijavljenihIgraa') }}</p>
                    </div>
                  </section>
                </template>
              </b-table>
            </div>
          </div>
        </b-tab-item>
      </b-tabs>
    </div>
    <div v-if="!dataLoaded" class="buttons m-t-10 is-fixed">
      <b-button class="fw600" type="is-danger" pack="fal" icon-right="times" rounded @click="getLeague()">
        {{ $t('otkai') }}
      </b-button>
      <b-button
        class="m-l-10 fw600"
        type="is-primary"
        pack="fal"
        icon-right="check"
        rounded
        :loading="loading"
        @click="submit()"
      >
        {{ $t('spremiIzmjene') }}
      </b-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import League from '@/models/League'
import Player from '@/models/Player'
import adminEdit from '~/components/liga/adminEdit'
import hero from '~/components/Hero'
import doubles from '~/components/liga/doubles'

export default {
  name: 'LigaPlayers',
  components: {
    hero,
    adminEdit,
    doubles,
    TennisImage,
  },
  async fetch() {
    await this.getLeague()
  },
  data() {
    return {
      loading: false,
      loading1: false,
      loading2: false,
      loading3: false,
      loading_delete: false,
      activeTab: 0,
      heroImage: '/liga.jpg',
      dataLoaded: false,
      liga: {},
      newDocument: { file: {}, title: '' },
      newLiga: {
        boardingType: 0,
        id: 1,
        name: 'Liga nacija',
        groups: 2,
        playersInGroups: 8,
        roundsOfPlay: 2,
        points: 2,
        moveUp: 2,
        moveDown: 3,
        playingSets: 2,
        gemInSet: null,
        lastSet: null,
        description: 'Za dodatna pojašnjenja kontaktirajte administratora',
        type: 'open', // open or privat
        players: [],
        ligaFinishDate: new Date(),
        ligaFinishOnboarding: new Date(),
        admin: {
          id: 1,
          display_name: 'Stjepan Administrator',
          image: '/hero_courts.jpg',
        },
      },
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
        return item.id === this.$store.state.auth.user.id
      })
    },
    howManyDays() {
      return this.$moment(this.liga.finish_onboarding).endOf('day').fromNow('String')
    },
    hasDatePassed() {
      const a = this.$moment.utc(this.liga.finish_onboarding)
      const b = this.$moment()
      if (a.diff(b, 'days') >= 0) {
        return false
      } else {
        return true
      }
    },
    hasReachedLimitOfPlayers() {
      if (
        this.liga.boarding_type === 1 &&
        this.liga.players_in_groups * this.liga.players_in_groups === this.liga.players.length
      ) {
        return true
      } else {
        return false
      }
    },
    isInLiga() {
      if (this.liga.is_doubles) {
        return _.filter(this.liga.players, (item) => {
          return item.players[0].id === this.user.id || item.players[1].id === this.user.id
        })
      } else {
        return _.filter(this.liga.players, (item) => {
          return item.id === this.user.team.id
        })
      }
    },
  },
  watch: {
    liga: {
      immediate: true,
      deep: true,
      handler() {
        this.dataLoaded = false
      },
    },
  },
  methods: {
    getLeague() {
      League.include(['players', 'admins'])
        .find(this.$route.params.id)
        .then((res) => {
          res.finish_date = new Date(Date.parse(res.finish_date))
          res.finish_onboarding = new Date(Date.parse(res.finish_onboarding))
          res.boarding_type = res.boarding_type === null ? 0 : res.boarding_type
          this.liga = res
          this.$nextTick(() => {
            this.dataLoaded = true
          })
        })
    },
    finish() {
      this.loading = true
      const l = new League({
        id: this.liga.id,
        status: 4,
      })
      l.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Liga je zaključena. Slijedi raspored igrača po grupama'),
            type: 'is-success',
          })
          this.$router.push(
            this.localePath('/liga/' + this.isElo(this.liga.classification) + this.$route.params.id + '/liga_create')
          )
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 5000,
          })
        })
      this.loading = false
    },
    addPlayer() {
      this.loading1 = true
      const l = new League({
        id: this.liga.id,
      })
      l.save()
      l.players()
        .attach({ players: [this.$store.state.auth.user] })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste se prijavili u ligu'),
            type: 'is-success',
          })
          this.loading1 = false
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading1 = false
        })
    },
    addPlayerTeam(item) {
      this.loading3 = true
      const l = new League({
        id: this.liga.id,
      })
      l.save()
      l.players()
        .attach({ players: [item], type: 'team' })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste se prijavili u ligu'),
            type: 'is-success',
          })
          this.loading3 = false
          this.activeTabInfo = 1
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading3 = false
        })
    },
    deletePlayer() {
      this.loading = true
      const l = new League({ id: this.liga.id })
      const p = new Player({ id: this.user.team.id }).for(l)
      p.config({
        data: {
          player: true,
        },
        method: 'DELETE',
      })
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno se odjavili iz lige'),
            type: 'is-success',
          })
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    deletePlayerTeam() {
      this.loading2 = true
      const l = new League({ id: this.liga.id })
      const p = new Player({ id: this.isInLiga[0].id }).for(l)
      p.config({
        data: {
          player: true,
        },
        method: 'DELETE',
      })
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno se odjavili iz lige'),
            type: 'is-success',
          })
          this.activeTabInfo = 0
          this.loading2 = false
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading2 = false
        })
    },
    submit() {
      this.loading = true
      const l = new League({
        id: this.liga.id,
        status: 3,
        finish_date: this.liga.finish_date,
        finish_onboarding: this.liga.finish_onboarding,
      })
      l.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Prijave u ligu su otvorene'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/liga/'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
          })
        })
      this.loading = false
    },
    isElo(e) {
      if (e === 'elo') {
        return 'elo/'
      }
      return ''
    },
    deleteLiga() {
      this.loading_delete = true
      const l = new League({ id: this.liga.id })
      l.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Liga je obrisana'),
            type: 'is-success',
          })
          this.loading_delete = false
          this.$router.push(this.localePath('/liga'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading_delete = false
        })
    },
  },
}
</script>
