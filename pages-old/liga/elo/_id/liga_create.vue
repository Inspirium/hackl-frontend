<template>
  <div v-if="Object.keys(liga).length">
    <div class="member__info liga__header is-red">
      <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10">
        {{ liga.type === 'open' ? $t('Korak 5') : $t('Korak 4') }}
      </div>
    </div>
    <hero :options="heroImage" class="liga__hero--options">
      <h1 class="has-text-white">{{ liga.name }}</h1>
      <div class="buttons m-t-10">
        <b-button
          class="softshadow m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="times-circle"
          rounded
          @click="deleteLiga"
        >
          {{ $t('obriiLigu') }}
        </b-button>
        <b-button
          tag="nuxt-link"
          :to="localePath('/liga/elo/' + $route.params.id + '/edit')"
          class="softshadow m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="user-edit"
          rounded
        >
          {{ $t('urediLigu') }}
        </b-button>
      </div>
    </hero>
    <div class="members x-container">
      <transition name="fade">
        <div class="buttons m-b--10 m-t-30">
          <b-button
            class="fw600"
            size="is-medium"
            type="is-primary"
            pack="far"
            icon-right="check"
            rounded
            :loading="loading2 || loading"
            @click="save"
          >
            {{ $t('zaponiLigu') }}
          </b-button>
        </div>
      </transition>

      <div class="p-b-100">
        <div class="activity__header m-b-10 m-t-30">
          <div class="fw600 is-size-4">{{ $t('popisIgraa', { length: liga.players.length }) }}</div>
        </div>
        <div class="activity__box">
          <div v-for="(player, index) in liga.players" :key="index + 'b'" class="action__item__small--liga">
            <div v-if="Object.keys(player).length" class="align__centar__y">
              <div class="rank fw600">{{ $t('key3', { expr: index + 1 }) }}</div>
              <div class="list__img">
                <template v-if="liga.is_doubles" class="for-doubles">
                  <div v-if="player.image === 'https://api.tenis.plus/images/user.svg'" class="flex">
                    <TennisImage
                      :size="[42, 42]"
                      :src="player.players[0].image"
                      class="user_image border__white--2"
                      alt=""
                    />
                    <TennisImage
                      :size="[42, 42]"
                      :src="player.players[1].image"
                      class="user_image m-l--20 border__white--2"
                      alt=""
                    />
                  </div>
                  <div v-else class="list__img">
                    <TennisImage :size="[42, 42]" :src="player.image" class="user_image border__white--2" alt="" />
                  </div>
                </template>

                <TennisImage v-else :size="[42, 42]" :src="player.image" class="user_image" alt="" />
              </div>
              <div class="list__content">
                <h3>{{ player.display_name }}</h3>
                <h4>{{ $t('bodova', { score: player.score }) }}</h4>
              </div>
              <div
                class=""
                @click.stop="
                  deletePlayerObject = player
                  deletePlayer(player)
                "
              >
                <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto remove"> </b-icon>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!isCollapsed" class="buttons">
          <b-button
            class="softshadow m-t-20 invert-small-button"
            type="is-small noborder is-primary has-text-white"
            pack="fal"
            icon-right="user-plus"
            rounded
            :loading="loading3"
            @click="isModalAddPlayerActive = true"
          >
            {{ $t('dodajIgraa') }}
          </b-button>
        </div>
      </div>

      <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip" class="modal__members">
        <modalMembersCustom
          :players="filteredLeftovers"
          :title="$t('dodajteIgraa')"
          @update="updatePlayerList($event)"
        ></modalMembersCustom>
      </b-modal>
      <b-modal :active.sync="isModalAddPlayerActive" :width="640" scroll="clip" class="modal__members">
        <modalMembers
          :show-tennis-school="false"
          :is-doubles="liga.is_doubles ? true : false"
          :title="$t('dodajteNoveIgraeULigu')"
          @player="addNewPlayer($event)"
        ></modalMembers>
      </b-modal>
      <b-modal :active.sync="isModaSelectActive" :width="640" scroll="clip" class="modal__members">
        <modalSelect :title="$t('nositelji')" :subtitle="$t('Odaberite ukupni broj nositelja')"></modalSelect>
      </b-modal>
      <b-modal :active.sync="isModalActive" :width="640" scroll="clip" class="modal__confirmation">
        <modalConfirmation
          :title="$t('potvrdomEteIzbrisatiSveNerasporeeneIgraeIzLige')"
          :subtitle="$t('Jeste li sigurni?')"
        ></modalConfirmation>
      </b-modal>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import League from '@/models/League'
import Player from '@/models/Player'
import hero from '~/components/Hero'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import modalMembersCustom from '~/components/modal/ModalMembersCustom'
import modalSelect from '~/components/modal/ModalSelect'
import modalMembers from '~/components/modal/ModalMembersAll'

export default {
  name: 'LigaEloCreate',
  components: {
    modalMembersCustom,
    modalConfirmation,
    modalSelect,
    hero,
    modalMembers,
    TennisImage,
  },
  async fetch() {
    await this.getLeague()
  },
  data() {
    return {
      heroImage: '/liga.jpg',
      playersIn: [],
      leftovers: [],
      loading: false,
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      loading6: false,
      loading7: false,
      showGroupSettings: null,
      isModalActive: false,
      isModalMembersActive: false,
      isModalAddPlayerActive: false,
      isModaSelectActive: false,
      playerList: [],
      defaultPlayerList: [],
      selectedPlayer: [],
      selectedPlayerIndex: {},
      selectedMainGroup: null,
      selectedIndex: null,
      deletePlayerObject: {},
      liga: {},
      isCollapsed: false,
      ress: {},
      test: '',
      setingsSelectedGroup: {
        move_down: null,
        move_up: null,
        name: '',
        order: null,
        players: [],
        players_in_group: null,
      },
    }
  },
  computed: {
    filteredLeftovers() {
      return _.differenceWith(this.liga.players, this.playersIn, (all, out) => {
        return all.id === out.id
      })
    },
  },
  methods: {
    distributedPlayers() {
      this.playersIn = []
      for (let i = 0; i < this.liga.groups.length; i++) {
        this.playersIn = [...this.playersIn, ...this.liga.groups[i].players]
      }
    },
    deletePlayer(player) {
      this.loading = true
      const l = new League({ id: this.liga.id })
      const p = new Player({ id: player.id }).for(l)
      p.config({
        data: {
          player: true,
        },
        method: 'DELETE',
      })
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste uklonili igrače iz lige'),
            type: 'is-success',
            duration: 500,
          })
          this.getLeague()
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading = false
        })
    },
    getLeague() {
      League.include(['players', 'admins', 'groups'])
        .find(this.$route.params.id)
        .then((res) => {
          this.liga = res
          this.distributedPlayers()
        })
    },
    addNewPlayer(item) {
      this.loading3 = true
      const l = new League({ id: this.liga.id })
      l.save()
      l.players()
        .attach({ players: [item] })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste dodali igrače u ligu'),
            type: 'is-success',
            duration: 500,
          })
          this.loading3 = false
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
    deleteLiga() {
      this.loading = true
      const l = new League({ id: this.liga.id })
      l.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Liga je obrisana'),
            type: 'is-success',
          })
          this.loading = false
          this.$router.push(this.localePath('/liga'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    updatePlayerList(player) {
      this.selectedPlayer = player
      this.$set(player, 'order', this.selectedIndex)
      this.liga.players.splice(this.liga.players.indexOf(player), 1)
      this.liga.groups[this.selectedMainGroup].players.splice(this.selectedIndex, 1, player)
    },
    save() {
      this.loading2 = true
      const l = new League({ id: this.liga.id, status: '4' })
      this.$buefy.toast.open({
        message: this.$t('Aktiviranje lige može potrajati nešto više vremena. Pričekajte...'),
        type: 'is-primary',
        duration: 5000,
      })
      l.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Liga je aktivirana'),
            type: 'is-success',
          })
          this.loading2 = false
          this.$router.push(this.localePath('/liga/elo/' + this.$route.params.id))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading2 = false
        })
    },
  },
}
</script>
