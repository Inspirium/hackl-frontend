<template>
  <div class="members">
    <div class="member__info liga__header is-red">
      <!--      <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10" @click="isPopulateda">-->
      <!--        {{ liga.type === 'open' ? 'Korak 5. - Raspored igrača' : 'Korak 4. - Raspored igrača' }}-->
      <!--      </div>-->
    </div>

    <hero :options="heroImage" class="liga__hero--options">
      <!--      <h1 class="has-text-white">{{ liga.name }}</h1>-->
      <div class="buttons m-t-10">
        <b-button
          class="softshadow m-b-10"
          type="is-small noborder"
          pack="fal"
          icon-right="times-circle"
          rounded
          @click="deleteLiga"
        >
          {{ $t('obriiTurnir') }}
        </b-button>
        <b-button
          tag="nuxt-link"
          :to="localePath('edit')"
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
    <div class="x-container activity">
      <transition name="fade">
        <div v-show="playerList.length" class="activity__header m-b-5">
          <div class="fw600 is-size-5">{{ $t('nerasporeeniIgrai', { length: playerList.length }) }}</div>
        </div>
        <div key="2" class="activity__header--center m-b-5 m-t-20">
          <div class="fw600 is-size-5">{{ $t('dodajNoveIgraeUTurnir') }}</div>
        </div>
      </transition>

      <div class="cup__players-list">
        <div v-for="(player, index) in playerList" :key="index">
          <TennisImage :size="[42, 42]" :src="player.image" class="user_image" alt="" />
        </div>
      </div>
      <div v-if="true" class="buttons m-t-10 m-b-0">
        <b-button
          class="softshadow m-t-10"
          type="is-small noborder"
          pack="fal"
          icon-right="user-plus"
          rounded
          @click="isModalAddPlayerActive = true"
        >
          {{ $t('dodajIgrae') }}
        </b-button>
      </div>
      <transition v-if="!isPopulated">
        <div class="empty_red_empty activity__header--center m-b-5 m-t-20">
          <div class="fw600 is-size-6 has-text-centered">
            {{ $t('turnirMoetePokrenutiNakonToSvaMjestaUTurniruBuduPo') }}
          </div>
        </div>
      </transition>

      <transition v-else name="fade">
        <div class="buttons m-t-30">
          <b-button
            class="fw600"
            size="is-medium"
            type="is-primary"
            pack="far"
            icon-right="check"
            rounded
            :loading="loading2"
            @click="save"
          >
            {{ $t('zaponiTurnir') }}
          </b-button>
        </div>
      </transition>

      <transition name="fade">
        <nuxt-link v-show="playerList.length === 0" :to="localePath('/cup/')" class="buttons m-t-30">
          <b-button
            class="m-l-10 fw600"
            size="is-large"
            type="is-primary"
            pack="fal"
            icon-right="tennis-ball"
            rounded
            @click="save"
          >
            {{ $t('spremiTurnir') }}
          </b-button>
        </nuxt-link>
      </transition>

      <b-tabs position="is-centered">
        <b-tab-item :label="$t('drijeb')">
          <div class="activity__header--center m-b-5 m-t-10">
            <div class="fw600 is-size-5 has-text-centered">{{ $t('automatskoRasporeivanje') }}</div>
          </div>

          <div class="buttons">
            <b-button
              class="softshadow m-t-10"
              type="is-small noborder"
              pack="fal"
              icon-right="racquet"
              rounded
              :loading="loading1"
              @click="strength"
            >
              {{ $t('poJaini') }}
            </b-button>
            <b-button
              class="softshadow m-t-10"
              type="is-small noborder"
              pack="fal"
              icon-right="random"
              rounded
              :loading="loading4"
              @click="random"
            >
              {{ $t('nasumino') }}
            </b-button>
          </div>

          <div class="tablelist cup-lots-table">
            <b-table
              :data="defaultPlayerList"
              :bordered="false"
              :selected.sync="selectedPlayerIndex"
              :mobile-cards="false"
              draggable
              @dragstart="dragstart"
              @drop="drop"
              @dragover="dragover"
              @dragleave="dragleave"
            >
              <b-table-column v-slot="props" field="first_name" class="list__image-col">
                <div v-if="props.row.name !== ''" class="align__centar__y" @click="removePlayer(props.row)">
                  <div class="counter-sm">{{ props.index + 1 }}.</div>
                  <div class="list__img">
                    <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
                  </div>
                  <div class="list__content">
                    <h3>{{ props.row.display_name }}</h3>
                    <h4>{{ $t('bodova', { score: props.row.score }) }}</h4>
                  </div>
                  <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto"> </b-icon>
                </div>
                <div v-else class="activity__header" @click="isModalMembersActive = true">
                  <div class="counter-sm">{{ props.row.order + 1 }}.</div>
                  <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
                  <div class="list__content">
                    <h3>{{ $t('dodajIgraa') }}</h3>
                  </div>
                </div>
              </b-table-column>
              <svg class="cup__line" height="20" width="10">
                <line x1="0" y1="0" x2="0" y2="200" style="stroke: rgb(32, 156, 238); stroke-width: 4" />
              </svg>
              <template #empty>
                <section class="section">
                  <div class="content has-text-grey has-text-centered">
                    <b-icon icon="exclamation-circle" size="is-large" pack="fal"> </b-icon>
                    <p class="modal-title">{{ $t('razvrstajIgrae') }}</p>
                  </div>
                </section>
              </template>
            </b-table>
          </div>
        </b-tab-item>
        <b-tab-item :label="$t('nositelji')">
          <div class="buttons m-t-20">
            <b-button
              class="m-l-10"
              type="is-danger"
              icon-right="chevron-down"
              pack="fal"
              rounded
              @click="isModaSelectActive = true"
            >
              {{ seedsNumber === 0 ? $t('Odaberi broj nositelja') : seedsNumber + ' ' + $t('nositelja') }}
            </b-button>
          </div>
          <div class="tablelist cup-seeds-table">
            <b-table
              :data="seeds"
              :bordered="false"
              :selected.sync="selectedSeedIndex"
              :mobile-cards="false"
              draggable
              @dragstart="dragstart"
              @drop="drop"
              @dragover="dragover"
              @dragleave="dragleave"
            >
              <b-table-column v-slot="props" field="first_name" class="list__image-col">
                <div v-if="props.row.name !== ''" class="align__centar__y" @click="removeSeed(props.row)">
                  <div class="counter-sm">{{ props.row.isSeed + 1 }}.</div>
                  <div class="list__img">
                    <TennisImage :size="[42, 42]" :src="props.row.user_image" class="user_image" alt="" />
                  </div>
                  <div class="list__content">
                    <h3>{{ props.row.name }}</h3>
                    <h4>{{ $t('godina3', { age: props.row.age }) }}</h4>
                  </div>
                  <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto"> </b-icon>
                </div>
                <div v-else class="activity__header" @click="isModalSeedActive = true">
                  <div class="counter-sm">{{ props.row.isSeed + 1 }}.</div>
                  <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
                  <div class="list__content">
                    <h3>{{ $t('dodajNositelja') }}</h3>
                  </div>
                </div>
              </b-table-column>
              <template #empty>
                <section class="section">
                  <div class="content has-text-grey has-text-centered">
                    <b-icon icon="arrow-up" size="is-large" pack="fal"> </b-icon>
                    <p class="modal-title">{{ $t('odaberiteBrojNositelja') }}</p>
                  </div>
                </section>
              </template>
            </b-table>
          </div>
        </b-tab-item>
      </b-tabs>
    </div>

    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip" class="modal__members">
      <modalMembers :player-list="playerList" :title="$t('dodajteIgraa')" @update="updatePlayerList"></modalMembers>
    </b-modal>
    <b-modal :active.sync="isModalSeedActive" :width="640" scroll="clip" class="modal__members">
      <modalMembers :player-list="seedsList" :title="$t('dodajteNositelja')" @update="updateSeedList"></modalMembers>
    </b-modal>
    <b-modal :active.sync="isModaSelectActive" :width="640" scroll="clip" class="modal__members">
      <modalSelect
        :options="numOfSeeds"
        :title="$t('nositelji')"
        :subtitle="$t('Odaberite ukupni broj nositelja')"
        @update="seedsNumber = $event"
      ></modalSelect>
    </b-modal>
    <b-modal :active.sync="isModalAddPlayerActive" :width="640" scroll="clip" class="modal__members">
      <modalMembers
        :show-tennis-school="false"
        :title="$t('dodajteNoveIgraeUTurnir')"
        @player="addNewPlayer($event)"
      ></modalMembers>
    </b-modal>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import League from '@/models/League'
import hero from '~/components/Hero'
import modalMembers from '~/components/modal/ModalMembers'
import modalSelect from '~/components/modal/ModalSelect'

export default {
  name: 'CupLots',
  components: {
    modalMembers,
    modalSelect,
    hero,
    TennisImage,
  },
  // props: {
  //   players: {
  //     type: Array,
  //     required: true,
  //   },
  //   numOfPlayers: {
  //     type: Number,
  //     required: true,
  //   },
  // },
  data() {
    return {
      heroImage: '/liga.jpg',
      loading1: false,
      loading2: false,
      loading4: false,
      numOfPlayers: 16,
      isModalAddPlayerActive: false,
      isModalMembersActive: false,
      isModalSeedActive: false,
      isModaSelectActive: false,
      playerList1: [],
      selectedSeedIndex: {},
      seedsNumber: 4,
      seeds: [],
      seedsList: [],
      playerList: [
        {
          id: 867,
          display_name: 'Stjepan Drmić',
          first_name: 'Stjepan',
          last_name: 'Drmić',
          email: 'stjepan@inspirium.hr',
          image: 'https://api.tenis.plus/storage/avatars/2022/4/1649320008_624ea048c3927.png',
          gender: 'M',
          phone: '0914502752',
          address: 'Z. Lozancica 4',
          postal_code: null,
          city: 'Zapresic',
          county: null,
          country: null,
          birthyear: 1978,
          birth_date: '1978-06-19',
          rating: 1500.1016378697,
          power_club: 50.31,
          power_global: 42.5,
          rank_club: 25,
          rank_global: 128,
          range: '40-50',
          link: '/player/2',
          power: 42.96,
          rounded_power: 50,
          club_member: { 1: 'member', 2: 'member', 4: 'member', 5: 'member' },
          admin: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16],
          score: 1500,
          is_trainer: null,
          is_admin: true,
          pivot: {
            league_id: 304,
            user_id: 2,
            admin: null,
            player: 1,
            rank: null,
            score: null,
            created_at: '2022-04-19T11:55:42.000000Z',
            updated_at: '2022-04-19T11:55:42.000000Z',
          },
          primary_club_id: 1,
        },
        {
          id: 442,
          display_name: 'Stjepan Drmić',
          first_name: 'Stjepan',
          last_name: 'Drmić',
          email: 'stjepan@inspirium.hr',
          image: 'https://api.tenis.plus/storage/avatars/2022/4/1649320008_624ea048c3927.png',
          gender: 'M',
          phone: '0914502752',
          address: 'Z. Lozancica 4',
          postal_code: null,
          city: 'Zapresic',
          county: null,
          country: null,
          birthyear: 1978,
          birth_date: '1978-06-19',
          rating: 1500.1016378697,
          power_club: 50.31,
          power_global: 42.5,
          rank_club: 25,
          rank_global: 128,
          range: '40-50',
          link: '/player/2',
          power: 42.96,
          rounded_power: 50,
          club_member: { 1: 'member', 2: 'member', 4: 'member', 5: 'member' },
          admin: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16],
          score: 1500,
          is_trainer: null,
          is_admin: true,
          pivot: {
            league_id: 304,
            user_id: 2,
            admin: null,
            player: 1,
            rank: null,
            score: null,
            created_at: '2022-04-19T11:55:42.000000Z',
            updated_at: '2022-04-19T11:55:42.000000Z',
          },
          primary_club_id: 1,
        },
        {
          id: 122,
          display_name: 'Stjepan Drmić',
          first_name: 'Stjepan',
          last_name: 'Drmić',
          email: 'stjepan@inspirium.hr',
          image: 'https://api.tenis.plus/storage/avatars/2022/4/1649320008_624ea048c3927.png',
          gender: 'M',
          phone: '0914502752',
          address: 'Z. Lozancica 4',
          postal_code: null,
          city: 'Zapresic',
          county: null,
          country: null,
          birthyear: 1978,
          birth_date: '1978-06-19',
          rating: 1500.1016378697,
          power_club: 50.31,
          power_global: 42.5,
          rank_club: 25,
          rank_global: 128,
          range: '40-50',
          link: '/player/2',
          power: 42.96,
          rounded_power: 50,
          club_member: { 1: 'member', 2: 'member', 4: 'member', 5: 'member' },
          admin: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16],
          score: 1500,
          is_trainer: null,
          is_admin: true,
          pivot: {
            league_id: 304,
            user_id: 2,
            admin: null,
            player: 1,
            rank: null,
            score: null,
            created_at: '2022-04-19T11:55:42.000000Z',
            updated_at: '2022-04-19T11:55:42.000000Z',
          },
          primary_club_id: 1,
        },
        {
          id: 235,
          display_name: 'Stjepan Drmić',
          first_name: 'Stjepan',
          last_name: 'Drmić',
          email: 'stjepan@inspirium.hr',
          image: 'https://api.tenis.plus/storage/avatars/2022/4/1649320008_624ea048c3927.png',
          gender: 'M',
          phone: '0914502752',
          address: 'Z. Lozancica 4',
          postal_code: null,
          city: 'Zapresic',
          county: null,
          country: null,
          birthyear: 1978,
          birth_date: '1978-06-19',
          rating: 1500.1016378697,
          power_club: 50.31,
          power_global: 42.5,
          rank_club: 25,
          rank_global: 128,
          range: '40-50',
          link: '/player/2',
          power: 42.96,
          rounded_power: 50,
          club_member: { 1: 'member', 2: 'member', 4: 'member', 5: 'member' },
          admin: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16],
          score: 1500,
          is_trainer: null,
          is_admin: true,
          pivot: {
            league_id: 304,
            user_id: 2,
            admin: null,
            player: 1,
            rank: null,
            score: null,
            created_at: '2022-04-19T11:55:42.000000Z',
            updated_at: '2022-04-19T11:55:42.000000Z',
          },
          primary_club_id: 1,
        },
        {
          id: 32,
          display_name: 'Stjepan Drmić',
          first_name: 'Stjepan',
          last_name: 'Drmić',
          email: 'stjepan@inspirium.hr',
          image: 'https://api.tenis.plus/storage/avatars/2022/4/1649320008_624ea048c3927.png',
          gender: 'M',
          phone: '0914502752',
          address: 'Z. Lozancica 4',
          postal_code: null,
          city: 'Zapresic',
          county: null,
          country: null,
          birthyear: 1978,
          birth_date: '1978-06-19',
          rating: 1500.1016378697,
          power_club: 50.31,
          power_global: 42.5,
          rank_club: 25,
          rank_global: 128,
          range: '40-50',
          link: '/player/2',
          power: 42.96,
          rounded_power: 50,
          club_member: { 1: 'member', 2: 'member', 4: 'member', 5: 'member' },
          admin: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16],
          score: 1500,
          is_trainer: null,
          is_admin: true,
          pivot: {
            league_id: 304,
            user_id: 2,
            admin: null,
            player: 1,
            rank: null,
            score: null,
            created_at: '2022-04-19T11:55:42.000000Z',
            updated_at: '2022-04-19T11:55:42.000000Z',
          },
          primary_club_id: 1,
        },
        {
          id: 220,
          display_name: 'Test Test',
          first_name: 'Test',
          last_name: 'Test',
          email: 'igor.kuhada@gmail.com',
          image: 'https://www.gravatar.com/avatar/de3027bdfb6eec955e89f7b87be09804?s=200&d=robohash',
          gender: 'M',
          phone: '0917977284',
          address: 'M. Krleze',
          postal_code: null,
          city: 'Zapresic',
          county: null,
          country: null,
          birthyear: 1979,
          birth_date: '1979-01-01',
          rating: 1500,
          power_club: 0,
          power_global: 42.48,
          rank_club: 0,
          rank_global: 130,
          range: '40-50',
          link: '/player/220',
          power: 42.94,
          rounded_power: 50,
          club_member: { 1: null },
          admin: [],
          score: 1500,
          is_trainer: null,
          is_admin: false,
          membership: 1,
          pivot: {
            league_id: 304,
            user_id: 220,
            admin: null,
            player: 1,
            rank: null,
            score: null,
            created_at: '2022-04-19T11:55:42.000000Z',
            updated_at: '2022-04-19T11:55:42.000000Z',
          },
          primary_club_id: 1,
        },
        {
          id: 150,
          display_name: 'Test Galic',
          first_name: 'Test',
          last_name: 'Galic',
          email: 'galic.danijel1@gmail.com',
          image: 'https://www.gravatar.com/avatar/f5ce043aeb3bef4e18413cba966a1a9f?s=200&d=robohash',
          gender: 'M',
          phone: '0913000740',
          address: 'Grobljanska 11',
          postal_code: null,
          city: 'Ivankovo',
          county: null,
          country: null,
          birthyear: 1979,
          birth_date: null,
          rating: 1500,
          power_club: 38.23,
          power_global: 42.48,
          rank_club: 0,
          rank_global: 130,
          range: '40-50',
          link: '/player/150',
          power: 42.94,
          rounded_power: 50,
          club_member: { 1: null },
          admin: [],
          score: 1500,
          is_trainer: null,
          is_admin: false,
          membership: 2,
          pivot: {
            league_id: 304,
            user_id: 150,
            admin: null,
            player: 1,
            rank: null,
            score: null,
            created_at: '2022-04-19T11:55:42.000000Z',
            updated_at: '2022-04-19T11:55:42.000000Z',
          },
          primary_club_id: 1,
        },
      ],
      defaultPlayerList: [],
      defaultPlayerList1: [],
      selectedPlayer: [],
      selectedPlayerIndex: {},
      draggingRow: null,
      draggingRowIndex: null,
      droppedOnRowIndex: null,
    }
  },
  computed: {
    isPopulated() {
      return this.defaultPlayerList.some((s) => s.name !== '')
    },
    numOfSeeds() {
      switch (this.numOfPlayers) {
        case 4:
          return [2]
        case 8:
          return [2, 4]
        case 16:
          return [2, 4, 8]
        case 32:
          return [2, 4, 8, 16]
        case 64:
          return [2, 4, 8, 16, 32]
        case 128:
          return [2, 4, 8, 16, 32, 64]
        case 256:
          return [2, 4, 8, 16, 32, 64]
      }
      return ''
    },
  },
  watch: {
    // players: {
    //   handler() {
    //     this.playerList = _.clone(this.players)
    //     this.seedsList = this.playerList
    //   },
    // },
    defaultPlayerList: {
      handler() {
        if (this.defaultPlayerList.length > 0) {
          for (let i = 0; i < this.defaultPlayerList.length; i++) {
            this.defaultPlayerList[i].order = i
          }
        }
      },
    },
    seeds: {
      handler() {
        if (this.seeds.length > 0) {
          for (let i = 0; i < this.seeds.length; i++) {
            this.seeds[i].isSeed = i
          }
        }
      },
    },
    numOfPlayers: {
      handler() {
        this.defaultPlayerList = []
        for (let i = 0; i < this.numOfPlayers; i++) {
          this.defaultPlayerList.push({
            order: i,
            name: '',
          })
        }
      },
    },
    seedsNumber: {
      handler() {
        this.seeds = []
        for (let i = 0; i < this.seedsNumber; i++) {
          this.seeds.push({
            order: i,
            name: '',
          })
        }
      },
    },
  },
  methods: {
    removePlayer(item) {
      const index = this.defaultPlayerList.indexOf(item)
      this.playerList.push(item)
      this.defaultPlayerList.splice(index, 1, { order: 1, name: '' })
    },
    addNewPlayer(item) {
      this.loading = true
      const l = new League({ id: this.liga.id })
      l.save()
      l.players()
        .attach({ players: [item] })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste dodali igrače u turnir'),
            type: 'is-success',
            duration: 500,
          })
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
        })

      this.loading = false
    },
    deleteLiga() {
      this.loading = true
      const l = new League({ id: this.liga.id })
      l.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Turnir je obrisan'),
            type: 'is-success',
          })
          this.loading = false
          this.$router.push(this.localePath('/cup'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    random() {
      this.loading4 = true
      const l = new League({ id: this.$route.params.id })
      League.custom(l, 'random')
        .get()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Raspodijelili ste igrače nasumično po grupama'),
            type: 'is-success',
            queue: false,
          })
          this.loading4 = false
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
            queue: false,
          })
          this.loading4 = false
        })
    },
    strength() {
      this.loading1 = true
      const l = new League({ id: this.$route.params.id })
      League.custom(l, 'strength')
        .get()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Raspodijelili ste igrače po jačini'),
            type: 'is-success',
          })
          this.loading1 = false
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading1 = false
        })
    },
    updatePlayerList(player) {
      this.selectedPlayer.splice(0, 1, player)
      this.playerList.splice(this.playerList.indexOf(player), 1)
      player.order = this.selectedPlayerIndex.order
      this.defaultPlayerList.splice(this.selectedPlayerIndex.order, 1, player)
    },
    updateSeedList(player) {
      this.seedsList.splice(this.seedsList.indexOf(player), 1)
      // this.selectedPlayer.splice(0, 1, player)
      this.seeds.splice(this.selectedSeedIndex.isSeed, 1, player)
      this.$set(player, 'isSeed', 1)
    },
    removeSeed(item) {
      this.seedsList.push(item)
      const index = this.seeds.indexOf(item)
      this.seeds.splice(index, 1, { isSeed: 0, order: 1, name: '' })
      this.$set(item, 'isSeed', 0)
    },
    dragstart(payload) {
      this.draggingRow = payload.row
      this.draggingRowIndex = payload.index
      payload.event.dataTransfer.effectAllowed = 'copy'
    },
    dragover(payload) {
      payload.event.dataTransfer.dropEffect = 'copy'
      payload.event.target.closest('tr').classList.add('is-selected')
      payload.event.preventDefault()
    },
    dragleave(payload) {
      payload.event.target.closest('tr').classList.remove('is-selected')
      payload.event.preventDefault()
    },
    drop(payload) {
      payload.event.target.closest('tr').classList.remove('is-selected')
      this.droppedOnRowIndex = payload.index
      const droppedOnRowIndex = payload.index
      this.defaultPlayerList.splice(payload.index, 1, this.defaultPlayerList[this.draggingRowIndex])
      this.defaultPlayerList.splice(this.draggingRowIndex, 1, payload.row)
      this.$buefy.toast.open(
        `Premješten igrač ${this.draggingRow.name} s pozicije ${this.draggingRowIndex + 1} na ${droppedOnRowIndex + 1}`
      )
    },
    save() {
      return ''
    },
  },
}
</script>
