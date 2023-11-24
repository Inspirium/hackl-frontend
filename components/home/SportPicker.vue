<template>
  <div
    v-if="Object.keys(sports).length && isMultisport"
    class="role_header flex align__centar__all p-all-12"
    :class="{ is_open: isOpenRoleMenu }"
  >
    <div v-if="!isOpenRoleMenu" class="align__centar__all" @click="isOpenRoleMenu = true">
      <img class="role_logo" :src="sportIconPath(preferenceSport.slug)" alt="" />
      <div class="fw600 is-size-55 has-text-white m-l-10">
        {{ $t(preferenceSport.name) }}
      </div>
      <b-icon
        icon="chevron-down"
        type="is-white"
        pack="fal"
        size="is-smaller-12"
        class="m-l-10 opacity3"
        @click="isOpenRoleMenu = true"
      >
      </b-icon>
    </div>
    <template v-else>
      <div class="flex__column p-t-15">
        <div
          v-for="sport in club.sports"
          :key="sport.id"
          class="align__centar__y m-b-15 is_role_element cursor"
          @click="updateSport(sport)"
        >
          <img class="role_logo" :src="sportIconPath(sport.slug)" alt="" />
          <div class="fw600 is-size-55 has-text-white m-l-10">
            {{ $t(sport.name) }}
          </div>
          <b-icon icon="chevron-right" type="is-white" pack="fal" size="is-smaller-12 opacity3" class="m-l-10 m-t-4">
          </b-icon>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
/* eslint-disable */
// import _ from 'lodash'
import Sport from '@/models/Sport'

export default {
  name: 'SportPicker',
  components: {
  },
  data() {
    return {
      isOpenRoleMenu: false,
      sports: [],
    }
  },
  computed: {
    preferenceSport() {
      return this.$store.state.userPreference.preference.selectedSport
    },
    club() {
      return this.$store.state.club
    },
    isMultisport() {
      return this.club.sports.length > 1
    },
  },
  mounted() {
    this.getSports()
  },
  methods: {
    sportIconPath(item) {
      return require(`../../static/sport/${item.toLowerCase()}.svg`);
    },
    getSports() {
      Sport.get().then((res) => {
        this.sports = res
      })
    },
    updateSport(sport) {
      this.isOpenRoleMenu = false
      this.$store.commit('userPreference/setSport', sport)
    },
  },
}
</script>
