<template>
  <div class="modal-reservation">
    <div id="tu" class="absolute top0"></div>
    <div class="members">
      <div class="modal-title has-text-light m-b-5">{{ title }}</div>
      <div class="modal-subtitle has-text-light m-b-5">
        {{ subtitle }}
      </div>
      <div class="fw600 is-size-5 has-text-centered has-text-lightblue is-uppercase mt-5">
        {{ $t('rezerviraj2') }}
      </div>
      <div v-if="showOptions" class="buttons m-t-10">
        <b-button
          v-if="!listTypeSchool && !guestReservation && !is_doubles && isAdmin && !specialReservation"
          type="is-small noborder"
          pack="far"
          :icon-right="forSomeoneElse ? 'times' : ''"
          :class="{ active: forSomeoneElse }"
          rounded
          @click="forSomeoneElse = !forSomeoneElse"
        >
          {{ $t('naDrugoIme') }}
        </b-button>
        <!--        <b-button-->
        <!--          v-if="!listTypeSchool && isAdmin && !forSomeoneElse && !is_doubles && !specialReservation"-->
        <!--          type="is-small noborder"-->
        <!--          pack="far"-->
        <!--          :icon-right="guestReservation ? 'times' : ''"-->
        <!--          :class="{ active: guestReservation }"-->
        <!--          rounded-->
        <!--          @click="guestReservation = !guestReservation"-->
        <!--        >-->
        <!--          {{ $t('naImeGosta') }}-->
        <!--        </b-button>-->
        <b-button
          v-if="!listTypeSchool && !guestReservation && !forSomeoneElse && !specialReservation"
          type="is-small noborder"
          pack="far"
          :icon-right="is_doubles ? 'times' : ''"
          :class="[{ active: is_doubles }]"
          rounded
          @click="getDoubles()"
        >
          {{ $t('zaParove') }}
        </b-button>
        <b-button
          v-if="user.is_trainer && !forSomeoneElse && !guestReservation && !is_doubles && !specialReservation"
          type="is-small noborder"
          :icon-right="listTypeSchool ? 'times' : ''"
          :class="{ active: listTypeSchool }"
          pack="far"
          rounded
          @click="
            listTypeSchool ? getPlayers() : getGroups()
            listTypeSchool = !listTypeSchool
          "
        >
          {{ $t('zaKoluTenisa') }}
        </b-button>
      </div>
      <template v-if="specialReservation">
        <reservationCategories @update="specialReservationSelected = $event" />
      </template>
      <template v-if="!specialReservation">
        <template v-if="!guestReservation">
          <div v-if="!listTypeSchool" class="for-list p-b-40">
            <template v-if="!is_doubles">
              <div v-if="loadingPlayers" class="align__centar__x">
                <b-icon
                  class="comment-send m-b-20"
                  custom-class="rotating"
                  icon="spinner"
                  size="is-large"
                  type="is-white"
                  pack="far"
                ></b-icon>
              </div>
              <div class="search container">
                <b-field>
                  <b-input
                    ref="filter"
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
              <div v-if="loading" class="align__centar__x">
                <b-icon
                  class="comment-send m-b-20"
                  custom-class="rotating"
                  icon="spinner"
                  size="is-large"
                  type="is-white"
                  pack="far"
                ></b-icon>
              </div>
              <template v-if="!loading">
                <transition-group name="fade">
                  <div
                    v-for="(item, index) in members"
                    v-show="item.id !== $auth.user.team.id"
                    :key="index + 'single'"
                    class="list__image-col cursor align__centar__y"
                    @click="
                      selected_player = item
                      is_group = false
                      invitePlayer()
                    "
                  >
                    <TennisImage :size="[32, 32]" :src="item.image" class="user_image-small m-r-10" alt="" />
                    <div class="list__content">
                      <h3>{{ item.display_name }}</h3>
                    </div>
                    <span v-if="item.is_doubles" class="is-size-7 x-tag nav__notification has-text-white">{{
                      $t('par')
                    }}</span>
                  </div>
                </transition-group>
              </template>
            </template>
            <div v-if="is_doubles" class="my-rank m-t-20">
              <div class="has-text-white fw500 has-text-centered is-size-4 m-b-3">
                {{
                  selected_teams.length === 0
                    ? $t('Odaberi prvi par')
                    : selected_teams.length === 1
                    ? $t('Odaberi drugi par')
                    : $t('Parovi su odabrani')
                }}
              </div>
              <div v-if="selected_teams.length > 0" class="list__image-col softshadow">
                <div v-if="selected_teams.length > 0" class="align__centar__y">
                  <div v-if="selected_teams[0].image === 'https://api.tenis.plus/images/user.svg'" class="list__img">
                    <TennisImage
                      :size="[42, 42]"
                      :src="selected_teams[0].players[0].image"
                      class="user_image border__white--2"
                      alt=""
                    />
                    <TennisImage
                      :size="[42, 42]"
                      :src="selected_teams[0].players[1].image"
                      class="user_image m-l--20 border__white--2"
                      alt=""
                    />
                  </div>
                  <div v-else class="list__img">
                    <TennisImage
                      :size="[42, 42]"
                      :src="selected_teams[0].image"
                      class="user_image border__white--2"
                      alt=""
                    />
                  </div>
                  <div class="list__content m-r-auto">
                    <div class="has-text-black80 fw600">{{ selected_teams[0].display_name }}</div>
                  </div>
                  <div class="buttons m-l-auto">
                    <b-button
                      class="m-l-auto"
                      type="is-danger"
                      pack="fal"
                      rounded
                      size="is-smaller"
                      @click="selected_teams.splice(0, 1)"
                      >{{ $t('ukloni') }}</b-button
                    >
                  </div>
                </div>
                <div v-else class="buttons">
                  <div class="fw600 has-text-white is-size-5 p-b-10">{{ $t('odaberiPrviParSListe') }}</div>
                </div>
              </div>
              <div v-if="selected_teams.length > 1" class="list__image-col softshadow">
                <div v-if="selected_teams.length > 1" class="align__centar__y">
                  <div v-if="selected_teams[1].image === 'https://api.tenis.plus/images/user.svg'" class="list__img">
                    <TennisImage
                      :size="[42, 42]"
                      :src="selected_teams[1].players[0].image"
                      class="user_image border__white--2"
                      alt=""
                    />
                    <TennisImage
                      :size="[42, 42]"
                      :src="selected_teams[1].players[1].image"
                      class="user_image m-l--20 border__white--2"
                      alt=""
                    />
                  </div>
                  <div v-else class="list__img">
                    <TennisImage
                      :size="[42, 42]"
                      :src="selected_teams[1].image"
                      class="user_image border__white--2"
                      alt=""
                    />
                  </div>
                  <div class="list__content m-r-auto">
                    <div class="has-text-black80 fw600">{{ selected_teams[1].display_name }}</div>
                  </div>
                  <div class="buttons m-l-auto">
                    <b-button
                      class="m-l-auto"
                      type="is-danger"
                      rounded
                      size="is-smaller"
                      @click="selected_teams.splice(1, 1)"
                      >{{ $t('ukloni') }}</b-button
                    >
                  </div>
                </div>
                <div v-else class="buttons">
                  <div class="fw600 has-text-black20 p-b-10">{{ $t('odaberiDrugiParSListe') }}</div>
                </div>
              </div>
              <div v-if="selected_teams.length < 2" class="search container m-b--10">
                <b-field>
                  <b-input
                    ref="filter"
                    v-model="search_term"
                    :placeholder="$t('pretraiParove')"
                    type="search"
                    pack="far"
                    :icon-right="search_icon"
                    icon-right-clickable
                    @icon-right-click="search_term = ''"
                  >
                  </b-input>
                </b-field>
              </div>
            </div>
            <!--            For Doubles list-->
            <template v-if="is_doubles && selected_teams.length < 2">
              <div v-if="loadingPlayers" class="align__centar__x">
                <b-icon
                  class="comment-send m-b-7"
                  custom-class="rotating"
                  icon="spinner"
                  size="is-large"
                  type="is-white"
                  pack="far"
                ></b-icon>
              </div>
              <div
                v-for="(item, index) in members"
                :key="index + 'doubles'"
                class="list__image-col cursor align__centar__y"
                @click="
                  addTeam(item)
                  is_group = false
                "
              >
                <div
                  v-if="item.image === 'https://api.tenis.plus/images/user.svg' && item.players.length"
                  class="list__img"
                >
                  <TennisImage
                    :size="[42, 42]"
                    :src="item.players[0].image"
                    class="user_image border__white--2"
                    alt=""
                  />
                  <TennisImage
                    :size="[42, 42]"
                    :src="item.players[1].image"
                    class="user_image m-l--20 border__white--2"
                    alt=""
                  />
                </div>
                <div v-else class="list__img">
                  <TennisImage :size="[42, 42]" :src="item.image" class="user_image border__white--2" alt="" />
                </div>

                <div class="list__content">
                  <h3>{{ item.display_name }}</h3>
                </div>
                <span v-if="item.is_doubles" class="is-size-7 x-tag nav__notification has-text-white">{{
                  $t('par')
                }}</span>
              </div>
            </template>
            <!--            <template v-else>-->
            <!--              <div class="buttons m-t-40">-->
            <!--                <b-button-->
            <!--                  icon-right="check"-->
            <!--                  pack="far"-->
            <!--                  type="is-primary"-->
            <!--                  rounded-->
            <!--                  :loading="loading"-->
            <!--                  @click="invitePlayer()"-->
            <!--                >-->
            <!--                  {{ buttonNext }}-->
            <!--                </b-button>-->
            <!--              </div>-->
            <!--            </template>-->
          </div>
          <div v-else class="for-list p-b-40">
            <div
              v-for="(item, index) in schoolGroup"
              :key="index + 'school'"
              class="list__image-col cursor align__centar__y"
              @click="
                selected_player = item
                is_group = true
                invitePlayer()
              "
            >
              <TennisImage :size="[32, 32]" :src="item.image" class="user_image-small m-r-10" alt="" />
              <div class="list__content">
                <h3>{{ item.name }}</h3>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="">
          <ValidationProvider v-slot="{ errors }" name="Ime gosta" rules="required">
            <b-field
              :label="$t('imeGosta')"
              class="login__input__container has-text-lightblue"
              :type="{ 'is-danger': errors[0] }"
              :message="errors"
            >
              <b-input v-model="guestName" type="text" rounded> </b-input>
            </b-field>
          </ValidationProvider>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import SchoolGroup from '@/models/SchoolGroup'
import moment from 'moment'
import TennisImage from '@/components/TennisImage.vue'
import Team from '~/models/Team'
import Reservation from '~/models/Reservation'
import reservationCategories from '~/components/court/reservationCategories'

export default {
  name: 'ModalCourtReservation',
  components: {
    TennisImage,
    reservationCategories,
  },
  filters: {
    parseTime(value, m) {
      const hour = Math.floor(value / 100)
      let minutes = ((value % 100) / 100) * 60
      if (minutes === 0) {
        minutes = '00'
      }
      if (m) {
        return hour + ':' + minutes
      }
      return hour
    },
  },
  props: {
    reservation: {
      type: Object,
      required: true,
      default() {
        return {}
      },
    },
    reservations: {
      type: [Object, String],
      required: true,
    },
    isDoubles: {
      type: Boolean,
      required: false,
      default: false,
    },
    reservationDate: {
      type: [Object, String],
      required: false,
      default() {
        return {}
      },
    },
    showOptions: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  async fetch() {
    await this.debouncedGetPlayers()
  },
  data() {
    return {
      loading: false,
      last_page: 1,
      offset: 1,
      page: 1,
      bottom: false,
      nomore: false,
      teams: [],
      selected_teams: [],
      is_doubles: false,
      loadingPlayers: false,
      activeTab: 0,
      isModalMembersActive: true,
      selected_times: [],
      search_term: '',
      members: [],
      schoolGroup: [],
      selected_player: {},
      is_group: false,
      listTypeSchool: false,
      guestReservation: false,
      guestName: '',
      forSomeoneElse: false,
      specialReservation: false,
      specialReservationSelected: {},
      selected_times_sorted: [],
      repeatReservationsWeeks: null,
      title: 'Dodaj suigrača',
      subtitle: 'Nakon odabira, suigrač će dobiti obavijest o rezerviranom terminu',
      test: null,
    }
  },
  computed: {
    reservationSpanWeeks() {
      return this.club.id !== 26 && !this.user.is_admin
        ? Math.round(this.user.membership.max_reservation_span / 7)
        : this.user.is_admin
        ? 52
        : 1
    },
    search_icon() {
      if (this.search_term !== '') {
        return 'times'
      } else {
        return 'search'
      }
    },
    user() {
      return this.$store.state.auth.user
    },
    date() {
      return this.$moment(this.$route.params.date).format('dddd' + ', ' + 'l')
    },
    realDate() {
      if (Object.keys(this.reservationDate).length) {
        return this.$moment(this.reservationDate).format('YYYY-MM-DD')
      }
      return this.$route.params.date
    },
    realDateDisplay() {
      if (Object.keys(this.reservationDate).length) {
        return this.$moment(this.reservationDate).format('dddd' + ', ' + 'l')
      }
      return this.$moment(this.$route.params.date).format('dddd' + ', ' + 'l')
    },
    price() {
      return _.sumBy(this.selected_times, 'price')
    },
    reservationSpan() {
      const mapTimes = _.map(this.selected_times, 'time')
      const spanRange = (_.max(mapTimes) - _.min(mapTimes)) / ((this.court.reservation_duration / 30) * 50) + 1
      const minRange = _.min(mapTimes)
      const fullRange = []
      for (let i = 0; i < spanRange; i++) {
        if (this.reservations[minRange + i * ((this.court.reservation_duration / 30) * 50)].id !== 0) {
        } else {
          fullRange.push(this.reservations[minRange + i * ((this.court.reservation_duration / 30) * 50)])
        }
      }
      return fullRange
    },
    reservationSpanPrice() {
      const mapPrice = _.map(this.reservationSpan, 'price')
      const mapPriceDiscount = []
      for (let i = 0; i < mapPrice.length; i++) {
        if (this.club.id !== 26) {
          if (this.user.membership.has_discount) {
            if (this.user.membership.discount_type === 1) {
              mapPriceDiscount.push(mapPrice[i] - this.user.membership.discount_amount)
            } else if (this.user.membership.discount_type === 2) {
              mapPriceDiscount.push(
                Math.round(mapPrice[i] - (mapPrice[i] / 100) * this.user.membership.discount_amount)
              )
            }
          } else {
            mapPriceDiscount.push(mapPrice[i])
          }
        } else {
          mapPriceDiscount.push(mapPrice[i])
        }
      }
      return _.sum(mapPriceDiscount)
    },
    buttonNext() {
      switch (this.activeTab) {
        case 0:
          return this.$t('Rezerviraj')
        case 1:
          return this.$t('dalje')
        case 2:
        case 3:
          return this.$t('Rezerviraj')
      }
      return ''
    },
    buttonNextIcon() {
      switch (this.activeTab) {
        case 0:
        case 1:
          return 'arrow-right'
        case 2:
        case 3:
          return 'check'
      }
      return ''
    },
    buttonCancel() {
      switch (this.activeTab) {
        case 0:
          return this.$t('Otkaži')
        case 1:
          return this.$t('Otkaži')
        case 2:
          return this.$t('izmijeni')
        case 3:
          return this.$t('Otkaži')
        case 4:
          return this.$t('5. Ždrijeb')
      }
      return ''
    },
    buttonCancelIcon() {
      switch (this.activeTab) {
        case 0:
          return 'times'
        case 1:
          return 'times'
        case 2:
          return 'undo-alt'
        case 3:
          return 'times'
      }
      return ''
    },
    isAdmin() {
      return this.user.is_admin
    },
    club() {
      return this.$store.state.club
    },
    disableNextButton() {
      return {
        disable:
          this.selected_times.length === 0 ||
          (this.activeTab === 3 && this.repeatReservationsWeeks === null) ||
          (this.activeTab === 1 && this.forSomeoneElse && Object.keys(this.selected_player)),
      }
    },
    isToday() {
      const today = moment(this.reservationDate)
      return moment().isSame(today, 'day')
    },
  },
  watch: {
    selected_player: {
      handler() {
        if (Object.keys(this.selected_player).length) this.activeTab++
      },
    },
    repeatReservationsWeeks: {
      handler() {
        if (this.repeatReservationsWeeks > this.reservationSpanWeeks)
          this.repeatReservationsWeeks = this.reservationSpanWeeks
      },
    },
    selected_times: {
      handler() {
        this.selected_times_sorted = [...this.selected_times].sort((a, b) => a.time - b.time)
      },
    },
    search_term(term) {
      if (term.length) {
        this.debouncedGetPlayers()
      }
    },
    activeTab: {
      handler() {
        this.scrollToTop()
      },
    },
    selected_teams: {
      handler() {
        if (!this.isAdmin) {
          this.getPlayers()
        }
      },
    },
  },
  created() {
    this.debouncedGetPlayers = _.debounce(this.getPlayers, 500)
  },
  methods: {
    timeHasPassed(item) {
      if (this.isToday) {
        const matchTime = moment(item.toString(), 'hmm').format('HHmm')
        const currentTime = moment().format('HHmm')
        if (matchTime < currentTime) {
          if (this.isAdmin) {
            return true
          }
          return false
        }
        return true
      }
      return true
    },
    resetSelectedPlayers() {
      this.selected_player = {}
      this.selected_teams = []
    },
    scrollToTop() {
      document.getElementById('tu').scrollIntoView({
        top: 10,
        behavior: 'smooth',
      })
    },
    hoursPrice(item) {
      if (this.court.id === 163) {
        return item
      }
      return item
    },
    focusInput() {
      this.$refs.filter.focus()
    },
    getDoubles() {
      this.is_doubles = !this.is_doubles
      this.page = 1
      this.resetSelectedPlayers()
      this.debouncedGetPlayers()
    },
    addTeam(item) {
      if (this.selected_teams.length < 2) {
        this.selected_teams.push(item)
      } else {
        this.$buefy.toast.open({
          message: this.$t('Uklonite prvo jedan od odabrana para'),
          type: 'is-danger',
        })
      }
    },
    getGroups() {
      this.$root.$loading.start()
      SchoolGroup.where('club', this.$store.state.club.id)
        .get()
        .then((res) => {
          this.schoolGroup = res.data
          this.$root.$loading.finish()
        })
    },
    getPlayers() {
      // if (this.last_page < this.page) return
      this.loadingPlayers = true
      const t = Team.page(1)
        .where('number_of_players', this.is_doubles ? 2 : 1)
        .where('display_name', this.search_term)
        .where('club', this.$store.state.club.id)

      if (this.is_doubles && !this.isAdmin && this.selected_teams.length === 0) {
        t.where('players', this.user.id)
      }

      t.get().then((res) => {
        this.members = res.data
        this.total = res.meta.total
        this.last_page = res.meta.last_page
        this.loadingPlayers = false
      })
    },
    buttonCancelAction() {
      if (this.activeTab === 2) {
        this.activeTab = 0
      } else {
        this.$parent.close()
      }
    },
    buttonNextAction() {
      if (this.activeTab === 2 || this.activeTab === 3) {
        this.send()
      } else if (this.ifReservationHole()) {
        this.activeTab++
      }
    },
    selectTime(hour, part) {
      if (hour.players[0]) {
        return
      }
      if (_.indexOf(this.reservationSpan, hour) > -1) {
        this.selected_times.splice(_.indexOf(this.selected_times, hour), 1)
      } else {
        this.selected_times.push(hour)
      }
    },
    ifReservationHoleAlert() {
      this.$buefy.toast.open({
        message: this.$t('Ne možete ostaviti rupu od 30 minuta na rezervaciji terena'),
        type: 'is-danger',
        duration: 3000,
      })
    },
    ifReservationHole() {
      if (this.court.reservation_hole === 0 && this.court.reservation_duration === 30) {
        const firstSlot = this.selected_times_sorted[0].time
        const lastSlot = this.selected_times_sorted[this.selected_times_sorted.length - 1].time
        const lastSlotLastSelectedSlot = this.selected_times_sorted[0].time

        const firstSlotSelected =
          this.reservations[firstSlot - 50] === undefined && this.reservations[firstSlot - 100] === undefined
        const secondSlotSelected =
          this.reservations[firstSlot - 50] !== undefined && this.reservations[firstSlot - 100] === undefined
        const lastSlotSelected =
          this.reservations[lastSlot + 50] === undefined && this.reservations[lastSlot + 100] === undefined
        const secondLastSlotSelected =
          this.reservations[lastSlot + 50] !== undefined && this.reservations[lastSlot + 100] === undefined

        // ako je odabrana prva rezervacija
        if (firstSlotSelected) {
          if (this.reservations[lastSlot + 50].id === 0 && this.reservations[lastSlot + 100].id !== 0) {
            this.ifReservationHoleAlert()
            return false
          }
        }
        // ako je odabrana druga rezervacija
        if (secondSlotSelected) {
          if (this.reservations[firstSlot - 50].id === 0) {
            this.ifReservationHoleAlert()
            return false
          } else if (this.reservations[lastSlot + 100].id !== 0 && this.reservations[lastSlot + 50].id === 0) {
            this.ifReservationHoleAlert()
            return false
          }
        }
        // ako je odabrana zadnja rezervacija
        if (lastSlotSelected) {
          if (
            this.reservations[lastSlot - 50].id === 0 &&
            this.reservations[lastSlotLastSelectedSlot - 50].id === 0 &&
            this.reservations[lastSlotLastSelectedSlot - 100].id !== 0
          ) {
            this.ifReservationHoleAlert()
            return false
          }
        }
        // ako je odabrana predzadnja rezervacija
        if (secondLastSlotSelected) {
          if (this.reservations[lastSlot - 50].id === 0 && this.reservations[lastSlot - 100].id !== 0) {
            this.ifReservationHoleAlert()
            return false
          } else if (this.reservations[lastSlot + 50].id === 0 && this.reservations[lastSlot - 50].id !== 0) {
            this.ifReservationHoleAlert()
            return false
          }
        }
        // ako nisu odabrani prvi i zadnji termini u danu
        if (!firstSlotSelected && !secondSlotSelected && !lastSlotSelected && !secondLastSlotSelected) {
          const checkFirstHole = this.reservations[firstSlot - 50].id === 0
          const checkLastHole = this.reservations[lastSlot + 50].id === 0
          const checkFirstHoleAfter = this.reservations[firstSlot - 100].id === 0
          const checkLastHoleAfter = this.reservations[lastSlot + 100].id === 0

          const canReserveForward = (checkFirstHole && checkFirstHoleAfter) || !checkFirstHole
          const canReserveBackward = (checkLastHole && checkLastHoleAfter) || !checkLastHole

          const isHoleAvoided = canReserveForward && canReserveBackward

          if (!isHoleAvoided) {
            this.ifReservationHoleAlert()
            return false
          }
        }
        return true
      }
      return true
    },
    getClass(hour) {
      return {
        'select-item': true,
        active: _.indexOf(this.reservationSpan, hour) > -1,
        'modal-reserved-input': true,
        'modal-reserved': hour.id !== 0,
      }
    },
    repeatReservation() {
      this.$axios
        .post('club/reservation/' + this.reservation + '/repeat', { times: this.repeat, repeat: this.canRepeat })
        .then(() => {
          this.$router.push(this.localePath('/me/reservations'))
        })
        .catch((err) => {
          if (err.response.status === 409) {
            this.errors = err.response.data.errors
            this.canRepeat = true
            this.$refs.modalTimetable.hide()
            this.$refs.reservationTaken.show()
          }
        })
    },
    invitePlayer() {
      this.loading = true
      let players = [
        this.forSomeoneElse ? this.selected_player : this.user.team,
        this.forSomeoneElse ? {} : this.selected_player,
      ]
      if (this.is_group) {
        players = [this.user.team, {}]
      }
      if (this.is_doubles) {
        players = this.selected_teams
      }
      if (this.forSomeoneElse) {
        players = [this.selected_player]
      }
      if (this.specialReservation) {
        players = []
      }
      const reservation = new Reservation(this.reservation)
      reservation.players = players
      reservation.group = this.is_group ? this.selected_player : {}
      if (this.guestReservation) {
        reservation.name = this.guestName
      }
      if (this.specialReservation) {
        reservation.category = this.specialReservationSelected
      }
      reservation
        .save()
        .then(() => {
          this.$parent.close()
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste rezervirali teren'),
            type: 'is-success',
          })
          this.loading = false
          this.$emit('update')
          this.$parent.close()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
  },
}
</script>
