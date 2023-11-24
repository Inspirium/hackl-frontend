<template>
  <div class="">
    <!--    For trainers-->
    <div v-if="$auth.user.is_trainer" class="home-menu x-container m-t-10">
      <div class="activity__header m-b-10">
        <!--        <nuxt-link :to="localePath('/school')" class="fw600"-->
        <!--          >{{ $t('Akademija') }}-->
        <!--          <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>-->
        <!--        </nuxt-link>-->
      </div>
      <div class="school-box">
        <div class="is-size-4 fw600 m-b-15 has-text-white">{{ $t('Akademija') }}</div>
        <div class="m-t-10 m-b--10">
          <b-button
            class="softshadow m-b-10"
            tag="nuxt-link"
            :to="localePath('/school')"
            type="is-small noborder"
            pack="fal"
            icon-right="users"
            rounded
          >
            {{ $t('mojeGrupe') }}
          </b-button>
          <b-button
            tag="nuxt-link"
            :to="localePath('/trainer/' + user.id + '/edit')"
            class="softshadow m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-right="user-graduate"
            rounded
          >
            {{ $t('Ponudi trenerske usluge') }}
          </b-button>
        </div>
      </div>
      <!--    <div class="home-menu-middle">-->
      <!--      <div class="">-->
      <!--        <nuxt-link :to="localePath('/trainer/' + user.id + '/edit')" class="has-text-black50">-->
      <!--          <b-icon class="m-b-5" pack="fal" icon="user-graduate"> </b-icon>-->
      <!--          <div class="nav__menu">Moji podaci</div>-->
      <!--        </nuxt-link>-->
      <!--      </div>-->
      <!--      <div class="">-->
      <!--        <nuxt-link :to="localePath('/school')" class="has-text-black50">-->
      <!--          <b-icon class="m-b-5" pack="fal" icon="users"> </b-icon>-->
      <!--          <div class="nav__menu">Moje grupe</div>-->
      <!--        </nuxt-link>-->
      <!--      </div>-->
      <!--    </div>-->
    </div>
    <!--    For students-->
    <div v-if="schoolGroups.length" class="home-menu x-container m-t-10">
      <div class="activity__header m-b-10">
        <nuxt-link :to="localePath('/school')" class="fw600"
          >{{ $t('Akademija') }}
          <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
        </nuxt-link>
      </div>
      <div class="school-box">
        <nuxt-link
          v-for="item in schoolGroups"
          :key="item.id"
          :to="localePath('/school/' + item.id)"
          class="flex align__centar__y m-t-5 m-b-5"
        >
          <div class="list__img">
            <TennisImage :size="[180, 180]" :src="item.image" class="user_image" alt="" />
          </div>
          <div class="is-size-4 fw600 has-text-white">{{ item.name }}</div>
        </nuxt-link>
      </div>
      <div v-if="schoolGroups.length === 1" class="home-menu-middle">
        <div class="">
          <nuxt-link :to="localePath('/school/' + schoolGroups[0].id)" class="has-text-black50">
            <TennisImage :size="[180, 180]" :src="schoolGroups[0].image" class="user_image" alt="" />
            <div class="nav__menu">{{ schoolGroups[0].name }}</div>
          </nuxt-link>
        </div>
        <div class="">
          <nuxt-link :to="localePath('/school/' + schoolGroups[0].id + '/' + user.id)" class="has-text-black50">
            <b-icon class="m-b-5" pack="fal" icon="user-graduate"> </b-icon>
            <div class="nav__menu">{{ $t('mojiPodaci') }}</div>
          </nuxt-link>
        </div>
      </div>
    </div>
    <!--    For parents-->
    <template v-if="isLoaded">
      <template v-if="Object.keys(player).length">
        <div v-if="player.children.length" class="home-menu x-container m-t-10">
          <div class="activity__header m-b-10">
            <nuxt-link :to="localePath('/school')" class="fw600"
              >{{ $t('Akademija') }}
              <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
            </nuxt-link>
          </div>
          <div v-for="item in player.children" :key="item.id + 'kid'" class="">
            <div class="school-box">
              <nuxt-link
                :to="localePath('/school/' + schoolGroupsByChild[item.id][0]?.id + '/' + item.id)"
                class="flex align__centar__y"
              >
                <div class="list__img">
                  <TennisImage :size="[180, 180]" :src="item.image" class="user_image" alt="" />
                </div>
                <div class="">
                  <div class="is-size-4 fw600 has-text-white">{{ item.display_name }}</div>
                  <div v-if="schoolGroupsByChild[item.id]?.length === 1" class="is-size-65 fw600 has-text-white m-t--2">
                    {{ schoolGroupsByChild[item.id][0].name }}
                  </div>
                </div>
              </nuxt-link>
            </div>
            <template v-if="Object.keys(schoolGroupsByChild).length">
              <div v-if="schoolGroupsByChild[item.id]?.length > 1" class="is-white radius__12 softshadow m-b-10">
                <div class="bb1-10"></div>
                <div
                  v-for="group in schoolGroupsByChild[item.id]"
                  :key="group + 'or'"
                  class="p-r-10 p-l-10 p-t-10 p-b-10 bb1-10"
                >
                  <nuxt-link :to="localePath('/school/' + group.id + '/' + item.id)" class="fw600 align__centar__all">
                    <div v-if="group.image" class="list__img">
                      <TennisImage :size="[80, 80]" :src="group.image" class="user_image-smaller" alt="" />
                    </div>
                    <div class="list__content">
                      <h4 class="fw600 is-size-6 m-t--2">{{ group.name }}</h4>
                    </div>
                  </nuxt-link>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
// import _ from 'lodash'
import SchoolGroup from '@/models/SchoolGroup'
import Player from '~/models/Player'

export default {
  name: 'SchoolHome',
  components: {},
  data() {
    return {
      loading1: false,
      isLoaded: false,
      schoolGroups1: [],
      schoolGroups: [],
      schoolGroupsByChild: {},
      player: {},
    }
  },
  computed: {
    birthday() {
      return this.$moment(this.user.birth_date).format('MM-DD')
    },
    today() {
      return this.$moment().format('MM-DD')
    },
    isBirthday() {
      if (this.birthday === this.today) {
        return true
      } else {
        return false
      }
    },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
  },
  mounted() {
    this.getGroups()
    this.getPlayer()
  },
  methods: {
    async getPlayer() {
      this.player = await Player.include('children').$find(this.user.id)
      if (this.player.children.length) {
        this.getGroupsParent()
      }
    },
    async getGroupsParent() {
      // Initialize an object to store school groups by child ID
      this.schoolGroupsByChild = {}

      // Create an array to hold promises for each child
      const promises = this.player.children.map(async (child) => {
        const groups = await SchoolGroup.include('players')
          .where('club', this.$store.state.club.id)
          .where('player', child.id)
          .get()

        // Assign the school groups to the object using the child's ID as the key
        this.schoolGroupsByChild[child.id] = groups.data
      })
      // Wait for all promises to resolve
      await Promise.all(promises)
      this.isLoaded = true
    },
    getGroups() {
      SchoolGroup.include('players')
        .where('club', this.$store.state.club.id)
        .where('player', this.user.id)
        .get()
        .then((res) => {
          this.schoolGroups = res.data
        })
    },
  },
}
</script>
