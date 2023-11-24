<template>
  <div class="members">
    <template v-if="players">
      <div v-show="checkedRows.length !== players" class="total__selected m-t--30">
        <div class="is-text-center">{{ $t('key8', { length: checkedRows.length, players: players }) }}</div>
      </div>
      <transition name="fade">
        <div v-show="checkedRows.length === players" class="buttons m-t--20 m-b--16">
          <b-button class="m-l-10 fw600" type="is-danger" pack="fal" icon-right="chevron-right" rounded @click="next">
            {{ $t('dalje') }}
          </b-button>
        </div>
      </transition>
    </template>
    <b-tabs position="is-centered">
      <b-tab-item :label="$t('sviIgrai')" class="p-b-100">
        <div v-if="players" class="filters--two container p-t-0 m-b-10 p-b-100">
          <div class="filter">
            <div class="label">{{ $t('jainaIgraa') }}</div>
            <div class="buttons">
              <b-button type="is-primary" pack="far" icon-right="chevron-down" @click="isModalPowerActive = true">
                {{ filterPowerDisplay }}
              </b-button>
            </div>
          </div>
          <div class="filter">
            <div class="label">{{ $t('dobIgraa') }}</div>
            <div class="buttons">
              <b-button type="is-primary" pack="far" icon-right="chevron-down" @click="isModalAgeActive = true">
                {{ $t(filterAgeDisplay) }}
              </b-button>
            </div>
          </div>
        </div>

        <div class="search container p-t-0">
          <b-field>
            <b-input
              id="inputsearch"
              v-model="search_term"
              :placeholder="$t('pretraiIgrae')"
              type="search"
              pack="far"
              :icon-right="search_icon"
              icon-right-clickable
              @icon-right-click="search_term = ''"
            >
            </b-input>
          </b-field>
        </div>

        <div class="tablelist">
          <b-table
            :data="club_players"
            :checkbox-position="checkboxPosition"
            :checked-rows.sync="checkedRows"
            :bordered="false"
            :mobile-cards="false"
            checkbox-type="is-info"
            checkable
          >
            <template v-if="club_players.length">
              <b-table-column
                v-slot="props"
                cell-class="list__image-col p-l-0"
                field="first_name"
                class="list__image-col p-l-0"
              >
                <nuxt-link v-if="isDoubles" :to="localePath(props.row.link)">
                  <template class="for-doubles">
                    <div
                      v-if="props.row.image === 'https://api.tenis.plus/images/user.svg' && props.row.players.length"
                      class="list__img"
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
                    <div v-else class="list__img">
                      <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image border__white--2" alt="" />
                    </div>
                  </template>
                  <div class="list__content">
                    <h3 class="fw600 is-size-55 has-text-black80 line-height-14">{{ props.row.display_name }}</h3>
                  </div>
                  <b-tag v-if="props.row.rating_club !== null" type="is-info">{{
                    Math.round(props.row.rating_club)
                  }}</b-tag>
                </nuxt-link>

                <nuxt-link v-else :to="localePath(props.row.link)">
                  <div class="list__img">
                    <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
                  </div>
                  <div class="list__content">
                    <div class="fw600 is-size-55 has-text-black80">{{ props.row.display_name }}</div>
                    <div v-if="!isDoubles" class="fw600 is-size-7 has-text-lightblue">
                      {{ $t('godina range', { range: props.row.range }) }}
                    </div>
                  </div>
                  <b-tag type="is-info">{{ Math.round(props.row.rating_club) }}</b-tag>
                </nuxt-link>
              </b-table-column>
            </template>
            <template #empty>
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                  <p class="modal-title">{{ $t('nemaOdabranihIgraa') }}</p>
                </div>
              </section>
            </template>
          </b-table>
        </div>
      </b-tab-item>
      <b-tab-item :disabled="!checkedRows.length" :label="$t('odabrani')">
        <div class="tablelist p-b-100">
          <b-table
            :data="checkedRows"
            :checkbox-position="checkboxPosition"
            :checked-rows.sync="checkedRows"
            :bordered="false"
            :mobile-cards="false"
            checkbox-type="is-info"
            checkable
          >
            <template v-if="checkedRows.length">
              <b-table-column
                v-slot="props"
                cell-class="list__image-col p-l-0"
                field="first_name"
                class="list__image-col p-l-0"
              >
                <nuxt-link :to="localePath(props.row.link)">
                  <div class="list__img">
                    <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
                  </div>
                  <div class="list__content">
                    <div class="fw600 is-size-6 has-text-black80">{{ props.row.display_name }}</div>
                    <div v-if="!isDoubles" class="fw600 is-size-7 has-text-lightblue">
                      {{ $t('godina range', { range: props.row.range }) }}
                    </div>
                    <div v-else class="fw600 is-size-7 has-text-danger">{{ $t('teniskiPar') }}</div>
                  </div>
                  <b-tag type="is-info">{{ Math.round(props.row.rating) }}</b-tag>
                </nuxt-link>
              </b-table-column>
            </template>
            <template #empty>
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                  <p class="modal-title">{{ $t('nemaOdabranihLanova') }}</p>
                </div>
              </section>
            </template>
          </b-table>
        </div>
      </b-tab-item>
    </b-tabs>
    <b-modal :active.sync="isModalAgeActive" :width="640" scroll="clip">
      <modalrange
        :title="$t('dob')"
        :subtitle="$t('Filtriraj popis prema dobi igrača')"
        :suffix="$t('godina')"
        @update="updateAge"
      ></modalrange>
    </b-modal>
    <b-modal :active.sync="isModalPowerActive" :width="640" scroll="clip">
      <modalrange
        :title="$t('snage')"
        :subtitle="$t('Filtriraj popis prema snazi igrača')"
        suffix="%"
        @update="updatePower"
      ></modalrange>
    </b-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import ModalRange from '~/components/modal/ModalSelectRange'
// import Player from '~/models/Player'
import Team from '~/models/Team'

export default {
  name: 'MemberSearch',
  components: {
    modalrange: ModalRange,
    TennisImage,
  },
  props: {
    players: {
      type: Number,
      required: false,
      default: 0,
    },
    prepopulated: {
      type: Array,
      required: false,
      default() {
        return []
      },
    },
    isDoubles: {
      type: Boolean,
      required: false,
      default: false,
    },
    isTeams: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      club_players: [],
      offset: 1,
      bottom: false,
      nomore: false,
      total: 0,
      search_term: '',
      last_page: 1,
      activeTab: 0,
      checkboxPosition: 'left',
      checkedRows: [...this.prepopulated],
      isModalPowerActive: false,
      isModalAgeActive: false,
      filterAgeDisplay: 'Sve',
      filterPowerDisplay: 'Sve',
      ageRange: [],
      powerRange: [],
    }
  },
  computed: {
    search_icon() {
      if (this.search_term !== '') {
        return 'times'
      } else {
        return 'search'
      }
    },
  },
  watch: {
    isDoubles: {
      immediate: true,
      handler() {
        setTimeout(() => {
          this.getPlayers()
        }, 500)
      },
    },
    search_term(term) {
      if (term.length) {
        document.getElementById('inputsearch').scrollTop = 20
        this.offset = 1
        this.debouncedGetPlayers()
      }
      if (this.search_term === '') {
        this.getPlayers()
      }
    },
    bottom(bottom) {
      if (bottom && !this.nomore) {
        this.offset++
        this.getPlayers()
      }
    },
    checkedRows: {
      handler() {
        this.$emit('update', this.checkedRows)
      },
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.offset = 1
  },
  created() {
    this.debouncedGetPlayers = _.debounce(this.getPlayers, 500)
  },
  methods: {
    getPlayers() {
      if (this.last_page < this.offset) return
      const d = this.isDoubles
      console.log(d)
      let r = Team.page(this.offset)
        .where('number_of_players', d ? 2 : 1)
        .where('display_name', this.search_term)
      if (this.$store.state.club.id !== 26) {
        r = r.where('club', this.$store.state.club.id)
      }
      r.get().then((res) => {
        if (this.offset === 1) {
          this.club_players = res.data
        } else {
          this.club_players = [...this.club_players, ...res.data]
        }
        this.total = res.meta.total
        this.last_page = res.meta.last_page
      })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
    updateAge(data) {
      this.offset = 1
      this.filterAgeDisplay = data.label
      this.ageRange = data.range
      this.getPlayers()
    },
    updatePower(data) {
      this.offset = 1
      this.filterPowerDisplay = data.label
      this.powerRange = data.range
      this.getPlayers()
    },
    next() {
      this.$emit('next')
    },
  },
}
</script>
