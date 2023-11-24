<template>
  <div v-if="Object.keys(liga).length" class="member">
    <div class="member__info liga__header" :class="ligaHeaderColor">
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
        name: $t('Turniri'),
        link: '/cup',
      }"
      class="liga__hero--options"
    >
      <h1 class="has-text-white">{{ liga.name }}</h1>
      <div class="buttons m-t-10">
        <b-button
          class="softshadow m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="times-circle"
          rounded
          :loading="loading_delete"
          @click="deleteLiga"
        >
          {{ $t('obriiTurnir') }}
        </b-button>
        <b-button
          tag="nuxt-link"
          :to="localePath('/cup/' + $route.params.id + '/edit')"
          class="softshadow m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="user-edit"
          rounded
        >
          {{ $t('urediTurnir') }}
        </b-button>
      </div>
    </hero>
    <hero
      v-else
      :second="{
        name: $t('Turniri'),
        link: '/cup',
      }"
      :options="heroImage"
      class="liga__hero"
    >
      <h1 class="has-text-white">{{ liga.name }}</h1>
    </hero>
    <div class="member__info liga__header">
      <div
        v-if="liga.access_level === 'open' && hasReachedLimitOfPlayers"
        class="fw600 is-size-55 has-text-white is-red p-t-10 p-b-10"
      >
        {{ $t('prijaveSuZavrene') }}
      </div>
    </div>

    <div v-if="isAdmin || isLigaAdmin.length" class="x-container m-t-20">
      <div class="admin_box">
        <div class="buttons m-t-0">
          <b-button
            class="fw600 m-t-10"
            type="is-primary"
            pack="fal"
            size="is-medium"
            icon-right="lock-alt"
            rounded
            @click="finish"
          >
            {{ $t('zavriPrijave') }}
          </b-button>
        </div>
        <div class="buttons m-t-10">
          <b-button
            tag="nuxt-link"
            :to="localePath('/cup/' + liga.id + '/liga_create')"
            class="softshadow m-b-10"
            type="is-small noborder"
            pack="fal"
            rounded
          >
            {{ $t('pripremiDrijebanje') }}
          </b-button>
        </div>
      </div>
    </div>

    <div v-if="liga.players.length !== 0" class="x-container has-text-centered m-b-20 m-t-20">
      <div class="fw600">{{ $t('brojPrijavljenihIgraa') }}</div>
      <div class="fw600 is-size-1 liga__group__list line-height-28">
        {{ liga.players.length
        }}<span
          v-if="liga.access_level === 'open' && liga.number_of_players !== 0"
          class="has-text-lightblue is-size-55"
          >/{{ liga.number_of_players }}</span
        >
      </div>
    </div>
    <div v-if="isInLiga.length" class="x-container m-b-0 m-t-10">
      <div class="fw600 is-size-3 has-text-centered">{{ $t('prijavljeniSteUTurnir') }}</div>
    </div>
    <div
      v-if="isInLiga.length === 0 && !hasDatePassed && !hasReachedLimitOfPlayers && !liga.is_doubles"
      class="buttons m-t-20"
    >
      <b-button
        class="fw600 m-t-10"
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
    <div v-if="isInLiga.length > 0 && !hasDatePassed" class="buttons m-t-0">
      <b-button
        class="fw600 m-t-20 invert-small-button"
        type="is-danger has-text-white"
        pack="fal"
        size="is-small noborder"
        icon-right="times"
        rounded
        :loading="liga.is_doubles ? loading2 : loading1"
        @click="liga.is_doubles ? deletePlayerTeam({ id: isInLiga[0].id }) : deletePlayer({ id: user.team.id })"
      >
        {{ $t('odjaviSe') }}
      </b-button>
    </div>
    <doubles
      v-if="!isInLiga.length && liga.is_doubles"
      :loading-it="loading3"
      class="m-t-20"
      @team="addPlayerTeam($event)"
    ></doubles>
    <div
      v-if="(hasDatePassed || hasReachedLimitOfPlayers) && !isInLiga.length && liga.status === '4'"
      class="x-container"
    >
      <div class="empty_red_empty activity__header--center flex__column m-b-5 m-t-0">
        <div class="fw600 is-size-5 has-text-centered">{{ $t('prijavi interes') }}</div>
        <div class="fw600 is-size-7 has-text-centered">
          {{ $t('ukolikoPrijavljeniIgraOdustaneOdNatjecanjaPrviSlje') }}
        </div>
        <div class="buttons m-t-5 m-b-1">
          <b-button
            class="fw600 m-t-10"
            type="is-primary"
            pack="fal"
            size="is-medium"
            icon-right="check"
            rounded
            @click="addPlayer()"
          >
            {{ $t('prijaviSe') }}
          </b-button>
        </div>
      </div>
    </div>
    <div class="x-container registration">
      <b-tabs size="is-medium" position="is-centered">
        <b-tab-item :label="$t('info')" class="p-b-100">
          <div class="activity__header m-b-10 m-t-10">
            <div class="fw600 is-size-3">{{ $t('osnovniPodaci') }}</div>
          </div>
          <adminEdit :options="liga"></adminEdit>
          <div class="display-data__box m-t-10">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('nazivTurnira') }}</div>
            <div class="fw600 is-size-5">{{ liga.name }}</div>
            <div class="fw600 is-size-65">{{ liga.is_doubles ? 'Turnir parova' : 'Turnir pojedinaca' }}</div>
          </div>
          <div v-if="liga.price" class="m-t-10 display-data__box m-b-10">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('kotizacija') }}</div>
            <div class="fw600 is-size-5">{{ $t('key5', { currency: liga.price }) | currency }}</div>
          </div>
          <div class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('rokZaPrijavu') }}</div>
            <div class="fw600 is-size-5">
              {{ $moment(liga.application_deadline).format('dddd' + ', ' + 'DD' + '.' + 'MM' + '.') }}
            </div>
          </div>
          <div class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('pocetak turnira') }}</div>
            <div class="fw600 is-size-5">
              {{ $moment(liga.active_from).format('dddd' + ', ' + 'DD' + '.' + 'MM' + '.') }}
            </div>
          </div>
          <div class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('datumZavretkaTurnira') }}</div>
            <div class="fw600 is-size-5">
              {{ $moment(liga.active_to).format('dddd' + ', ' + 'DD' + '.' + 'MM' + '.') }}
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
          <div v-if="newLiga.boarding_type === 0" class="activity__header has-text-centered m-b-5">
            <div class="fw600 is-size-7 has-text-danger">{{ $t('ovisnoOKonanomBrojuPrijavljenih') }}</div>
          </div>
          <div class="">
            <div class="m-t-20 fw600 is-size-4 has-text-left">{{ $t('kontaktPodaci') }}</div>
          </div>
          <p class="fw600 m-t-0 has-text-left has-text-lightblue is-size-65">{{ $t('Upiti za natjecanje') }}</p>

          <template>
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
                :href="'tel:' + adminAsPlayer.phone"
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
          <div class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">E-mail</div>
            <div class="fw600 is-size-55">{{ adminAsPlayer.email }}</div>
          </div>
          <div class="m-t-10 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('telefon') }}</div>
            <div class="fw600 is-size-55">{{ adminAsPlayer.phone }}</div>
          </div>

          <div class="activity__header m-b-10 m-t-30">
            <div class="fw600 is-size-3">{{ $t('postavkeTurnira') }}</div>
          </div>
          <section class="liga__open__info__box">
            <div class="display-data__box">
              <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('brojSetova') }}</div>
              <div class="fw600 is-size-5">
                {{ liga.playing_sets }}
              </div>
            </div>
            <div class="display-data__box">
              <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('gemovaPoSetu') }}</div>
              <div class="fw600 is-size-5">
                {{ liga.game_in_set }}
              </div>
            </div>
            <div class="display-data__box">
              <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('zadnjaIgra') }}</div>
              <div class="fw600 is-size-5">
                {{ $t(`tennis.cups.options.lastGame.${liga.last_set}`) }}
              </div>
            </div>
          </section>
          <div v-if="liga.description" class="m-t-15 display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('napomena') }}</div>
            <!-- eslint-disable-next-line -->
            <div class="has-text-left is-size-6 content-tiny m-t-10" v-html="liga.description"></div>
          </div>
          <template v-if="liga.documents !== undefined">
            <div v-if="liga.documents.length" class="m-b-10 m-t-20">
              <div class="fw600 is-size-3 m-b-10">{{ $t('dokumenti') }}</div>
              <div
                v-for="(item, index) in liga.documents"
                :key="index"
                class="list__documents list__image-col softshadow m-b-10"
              >
                <a :href="item.path" class="align__centar__y w100 document-list">
                  <div class="m-r-10 m-t-10">
                    <b-icon icon="file" size="is-larger" type="is-grey" pack="fal"></b-icon>
                  </div>
                  <div class="list__content m-r-auto doc-icons">
                    <h3 class="fw600 m-b-5">{{ item.title }}</h3>
                  </div>
                  <div class="m-l-auto m-t-10">
                    <b-icon icon="cloud-download" size="is-medium" type="is-primary" pack="fal"></b-icon>
                  </div>
                </a>
              </div>
            </div>
          </template>
        </b-tab-item>
        <b-tab-item :label="$t('prijavljeni')">
          <div class="registration">
            <div v-if="Object.keys(liga).length" class="tablelist p-b-100">
              <b-table :data="liga.players" :bordered="false" :mobile-cards="false">
                <b-table-column v-slot="props" cell-class="list__image-col">
                  <div
                    v-if="props.index === liga.number_of_players && liga.number_of_players !== 0"
                    class="below_the_line"
                  >
                    {{ $t('igraiIspodCrte') }}
                  </div>
                  <div class="flex align__centar__y">
                    <nuxt-link :to="localePath(props.row.link)">
                      <div
                        :class="tournament_expand && props.index === tournament_index ? 'display-none' : ''"
                        class="list__img"
                      >
                        <template v-if="liga.is_doubles" class="for-doubles">
                          <div
                            v-if="props.row.image === 'https://api.tenis.plus/images/user.svg'"
                            class="flex min-w-45"
                          >
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
                          <div v-else class="flex min-w-45">
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
                        <div class="fw600 is-size-55 has-text-black80 line-height-14">
                          {{ props.row.display_name }}
                        </div>

                        <div
                          :class="tournament_expand && props.index === tournament_index ? 'display-none' : ''"
                          class="fw600 is-size-7 has-text-lightblue"
                        >
                          {{ $t('bodova2', { round: Math.round(props.row.rating_club) }) }}
                          <template v-if="!liga.is_doubles">
                            <span class="has-text-black80"> • </span>
                            {{ props.row.players[0].range }} <span class="has-text-lightblue">{{ $t('godina2') }}</span>
                          </template>
                        </div>
                      </div>
                    </nuxt-link>
                    <span
                      v-if="isLigaAdmin.length || isAdmin"
                      class=""
                      @click.stop="
                        liga.is_doubles ? deletePlayerTeam({ id: props.row.id }) : deletePlayer({ id: props.row.id })
                      "
                    >
                      <b-icon
                        icon="times"
                        pack="fal"
                        type="is-danger"
                        size="is-smaller"
                        style="top: 3px"
                        class="m-l-10 relative"
                      />
                    </span>

                    <div
                      class="m-l-auto"
                      style="transition: 0.3s all"
                      :class="
                        tournament_expand && props.index === tournament_index
                          ? 'club-logo-list-display--extend'
                          : 'club-logo-list-display'
                      "
                    >
                      <div
                        v-for="clubIn in clubList(props.row.club_member)"
                        :key="clubIn.id"
                        style="transition: 0.3s all"
                        class="flex justify-content-end"
                        @click="
                          tournament_expand = !tournament_expand
                          tournament_index = props.index
                        "
                      >
                        <div style="transition: 0.3s all" class="fw600 is-size-7 has-text-black50 name m-r-10">
                          {{ clubIn.name }}
                        </div>
                        <TennisImage
                          :size="[42, 42]"
                          style="transition: 0.3s all"
                          :src="clubIn.logo"
                          class="user_image-small border__white softshadow"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
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
import Tournament from '@/models/Tournament'
import Player from '@/models/Player'
import Thread from '@/models/Thread'
import adminEdit from '~/components/cup/adminEdit'
import hero from '~/components/Hero'
import doubles from '~/components/liga/doubles'

export default {
  name: 'LigaOnboarding',
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
      tournament_expand: false,
      tournament_index: 0,
      loading: false,
      loading1: false,
      loading2: false,
      loading3: false,
      loading_delete: false,
      loadingMessage: false,
      activeTab: 0,
      heroImage: '/liga.jpg',
      dataLoaded: false,
      liga: {},
      newDocument: { file: {}, title: '' },
      adminAsPlayer: {},
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
    isMemberOfTheClub() {
      return !!this.user.club_member[this.club.id]
    },
    ligaHeaderColor() {
      switch (this.liga.status) {
        case '0': // Kreirana liga
          return 'primary-light'
        case '1': // Ždrijeb
          return 'primary-light'
        case '2': // Privatna liga - priprema prijave
          return 'primary-light'
        case '3': // Otvorena liga - otvorene prijave
          return 'green'
        case '4':
          return 'green'
        case '5':
          return 'is-red'
      }
      return ''
    },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    isAdmin() {
      return this.user.is_admin && this.user.admin.includes(this.liga.club_id)
    },
    isLigaAdmin() {
      return _.filter(this.liga.admins, (item) => {
        return item.id === this.$store.state.auth.user.id
      })
    },
    howManyDays() {
      return this.$moment(this.liga.application_deadline).endOf('day').fromNow('String')
    },
    hasDatePassed() {
      const a = this.$moment.utc(this.liga.application_deadline)
      const b = this.$moment()
      if (a.diff(b, 'days') >= 0) {
        return false
      } else {
        return true
      }
    },
    hasReachedLimitOfPlayers() {
      if (
        this.liga.access_level === 'open' && this.liga.number_of_players !== 0
          ? this.liga.players.length >= this.liga.number_of_players
          : false
      ) {
        return true
      } else {
        return false
      }
    },
    isInLiga() {
      if (this.liga.is_doubles) {
        return _.filter(this.liga.players, (item) => {
          // if single player joined
          if (item.players.length === 1) {
            return item.players[0].id === this.user.id
          }
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
    submitMessage() {
      this.loadingMessage = true
      Thread.whereIn('players_exact', [this.user.id, this.adminAsPlayer.id])
        .get()
        .then((res) => {
          if (res.data.length) {
            this.$router.push(this.localePath(`/messages/${res.data[0].id}`))
          } else {
            const t = new Thread({ players: [this.adminAsPlayer] })
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
    getAdmin() {
      Player.find(this.liga.admins[0].id).then((res) => {
        this.adminAsPlayer = res
      })
    },
    clubList(list) {
      const keys = Object.keys(list).slice(0, 5)
      const limitedObject = {}

      keys.forEach((key) => {
        limitedObject[key] = list[key]
      })

      return limitedObject
    },
    getLeague() {
      Tournament.include(['players', 'admins', 'documents'])
        .find(this.$route.params.id)
        .then((res) => {
          res.active_to = new Date(Date.parse(res.active_to))
          res.active_from = new Date(Date.parse(res.active_from))
          res.application_deadline = new Date(Date.parse(res.application_deadline))
          res.boarding_type = res.boarding_type === null ? 0 : res.boarding_type
          this.liga = res
          this.getAdmin()
          this.$nextTick(() => {
            this.dataLoaded = true
          })
        })
    },
    finish() {
      this.loading = true
      const l = new Tournament({
        id: this.liga.id,
        status: 1,
      })
      l.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Turnir je zaključen. Slijedi ždrijebanje'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/cup/' + this.$route.params.id + '/liga_create'))
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
      const l = new Tournament({
        id: this.liga.id,
      })
      l.save()
      l.players()
        .attach({ players: [this.$store.state.auth.user] })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste se prijavili u turnir'),
            type: 'is-success',
          })
          this.loading1 = false
          this.getLeague()
          if (!this.isMemberOfTheClub) {
            this.joinClub()
          }
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
    joinClub() {
      this.$axios
        .put('v2/club/member', { member: [{ id: this.$store.state.auth.user.id }], club_id: this.club.id })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste korisnika prijavili u novi klub'),
            type: 'is-success',
          })
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
        })
    },
    addPlayerTeam(item) {
      this.loading3 = true
      const l = new Tournament({
        id: this.liga.id,
      })
      l.save()
      l.players()
        .attach({ players: [item], type: 'team' })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste se prijavili u turnir'),
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
    deletePlayer(id) {
      this.loading = true
      const l = new Tournament({ id: this.liga.id })
      const p = new Player(id).for(l)
      p.config({
        data: {
          player: true,
        },
        method: 'DELETE',
      })
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno se odjavili iz turnira'),
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
    deletePlayerTeam(id) {
      this.loading2 = true
      const l = new Tournament({ id: this.liga.id })
      const p = new Player(id).for(l)
      p.config({
        data: {
          player: true,
        },
        method: 'DELETE',
      })
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno se odjavili s turnira'),
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
      const l = new Tournament({
        id: this.liga.id,
        status: 3,
        active_to: this.liga.active_to,
        active_from: this.liga.active_from,
        application_deadline: this.liga.application_deadline,
      })
      l.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Prijave u turnir su otvorene'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/cup/'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
          })
        })
      this.loading = false
    },
    deleteLiga() {
      this.loading_delete = true
      const l = new Tournament({ id: this.liga.id })
      l.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Turnir je obrisan'),
            type: 'is-success',
          })
          this.loading_delete = false
          this.$router.push(this.localePath('/cup'))
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
