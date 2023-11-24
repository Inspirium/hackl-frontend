<template>
  <div class="mh-40">
    <transition name="fade">
      <div v-if="loading" class="align__centar__x loading_z_spinner m-t-30">
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
    <template v-if="!loading">
      <div class="">
        <div class="divider-line-1 m-t-7"></div>
        <div v-for="player in schoolGroup.players" :key="player.id" class="flex align__centar__y m-t-5">
          <TennisImage :size="[32, 32]" class="user_image-smaller m-l-5 m-r-10" :src="player.image" />
          <div class="is-size-7 has-text-black80 align-self-center fw500 flex flex__column line-height-11 fw600">
            {{ player.display_name }}
          </div>
        </div>
        <div class="divider-line-1 m-t-7"></div>
        <div v-for="player in schoolGroup.trainers" :key="player.id" class="flex align__centar__y m-t-5">
          <TennisImage :size="[32, 32]" class="user_image-smaller m-l-5 m-r-10" :src="player.image" />
          <div class="is-size-7 has-text-black80 align-self-center fw500 flex flex__column line-height-11 fw600">
            {{ player.display_name }}
          </div>
        </div>
      </div>
      <div class="">
        <div class="divider-line-1 m-t-7"></div>
        <b-button
          class="m-t-7"
          type="is-reservation"
          pack="fal"
          rounded
          size="is-smaller"
          @click="isAddPlayerModalSchool = true"
          >{{ $t('Dodaj igrača') }}</b-button
        >
      </div>
      <div class="divider-line-1 m-t-7"></div>
    </template>
    <b-modal :active.sync="isAddPlayerModalSchool" class="hidescrollbar">
      <modalMembers
        :title="$t('dodajIgraa')"
        :subtitle="$t('Nakon odabira, odabrani igrač dobiti će obavijest o ovoj rezervaciji')"
        :reservation="reservation"
        :show-options="false"
        @update="getCourts()"
      />
    </b-modal>
  </div>
</template>

<script>
// import _ from 'lodash'
import SchoolGroup from '@/models/SchoolGroup'
import modalMembers from '~/components/modal/ModalCourtReservationAddOnly'

export default {
  name: 'CourtSchoolGroupBox',
  components: {
    modalMembers,
  },
  props: {
    group: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      schoolGroup: {},
      loading: false,
      isAddPlayerModalSchool: false,
    }
  },
  computed: {
    isAdmin() {
      return this.$store.state.auth.user.is_admin
    },
    club() {
      return this.$store.state.club
    },
  },
  mounted() {
    this.getGroups()
  },
  methods: {
    getGroups() {
      this.loading = true
      const id = this.group.players[0].id
      SchoolGroup.include(['players', 'players.subscriptions', 'players.parents'])
        .params({ include_invoices: true })
        .$find(id)
        .then((res) => {
          this.schoolGroup = res
          this.loading = false
        })
    },
  },
}
</script>
