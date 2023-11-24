<template>
  <div>
    <hero :page="'school'" :options="heroImage">
      <h1 class="has-text-white">{{ $t('Akademija') }}</h1>
    </hero>
    <div class="x-container registration">
      <div class="tablelist">
        <div class="relative">
          <div v-if="schoolGroups.length">
            <div class="buttons m-t-5">
              <b-button
                class="fw600 m-t-20"
                type="is-primary"
                pack="fal"
                icon-right="plus-circle"
                rounded
                tag="nuxt-link"
                :to="localePath('/school/new')"
              >
                {{ $t('novaGrupa') }}
              </b-button>
            </div>
            <div id="inputsearch" class="search container m-t--10 m-b--10">
              <b-field>
                <b-input
                  v-model="search_term"
                  :placeholder="$t('pretrai')"
                  type="search"
                  pack="far"
                  class="search-icon-right"
                  :icon-right="search_icon"
                  icon-right-clickable
                  @icon-right-click="search_term = ''"
                >
                </b-input>
              </b-field>
            </div>
            <div v-if="$store.state.club.id !== 26" class="">
              <h6 class="fw600 flex align__centar__all">
                {{ $t('Ukupno grupa') }}:
                <span>{{ total }}</span>
              </h6>
            </div>
            <b-table :data="schoolGroups" :mobile-cards="false" :bordered="false" class="p-b-100">
              <b-table-column
                v-slot="props"
                :td-attrs="(row) => ({ class: row.id === user.id ? 'active list__image-col' : 'list__image-col' })"
              >
                <nuxt-link :to="localePath('/school/' + props.row.id)" class="fw600">
                  <div class="list__img">
                    <TennisImage :size="[180, 180]" :src="props.row.image" class="user_image" alt="" />
                  </div>
                  <div class="list__content">
                    <!--                        <div class="align__centar__y">-->
                    <!--                          <h4 class="has-text-grey-light fw600 is-size-7">-->
                    <!--                            Ukupno članova: <span class="has-text-lightblue">{{ props.row.users.length }}</span>-->
                    <!--                          </h4>-->
                    <!--                        </div>-->
                    <h4 class="fw600 is-size-5 m-t--2">
                      {{ props.row.name }}
                    </h4>
                    <div class="m-t--3">
                      <div
                        v-for="item in props.row.trainers"
                        :key="item.id"
                        class="has-text-lightblue fw600 is-size-65 m-r-10"
                      >
                        {{ item.display_name }}
                      </div>
                    </div>
                  </div>
                  <div class="x-tag--l m-l-auto is-primary nowrap">{{ props.row.players.length }}</div>
                </nuxt-link>
              </b-table-column>
            </b-table>
          </div>
          <transition name="fade">
            <div v-if="!schoolGroups.length && loading" class="align__centar__x loading_z_spinner">
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
        </div>
        <div v-if="!schoolGroups.length && !loading" class="flex flex__column align__centar__y m-t-30">
          <template v-if="true">
            <b-icon icon="exclamation-square" type="is-danger" size="is-large" pack="fal"></b-icon>
            <div class="fw600 is-size-4 has-text-centered has-text-danger m-b-10 m-t-10">
              {{ $t('Nema grupa') }}
            </div>
            <div class="fw600 is-size-6 has-text-centered p-l-10 p-r-10">
              {{ $t('Izradite novu grupu teniske škole klikom na gumb dolje') }}
            </div>
            <div class="buttons m-t-20">
              <b-button
                class="softshadow"
                type="is-small noborder"
                pack="fas"
                icon-right="plus"
                rounded
                tag="nuxt-link"
                :to="localePath('/school/new')"
              >
                {{ $t('Izradi novu grupu') }}
              </b-button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TennisImage from '@/components/TennisImage.vue'
import SchoolGroup from '@/models/SchoolGroup'
import _ from 'lodash'
import hero from '~/components/Hero'

export default {
  name: 'School',
  components: {
    hero,
    TennisImage,
  },
  async fetch() {
    await this.getGroups()
  },
  data() {
    return {
      isModalActive: false,
      loading: false,
      heroImage: '/hero_school.jpg',
      schoolGroups: [],
      total: [],
      search_term: '',
      meta: {},
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    search_icon() {
      if (this.search_term !== '') {
        return 'times'
      } else {
        return 'search'
      }
    },
  },
  watch: {
    search_term(term) {
      if (term.length) {
        document.getElementById('inputsearch').scrollTop = 20
        this.debouncedGetGroups()
      } else {
        this.getGroups()
      }
    },
  },
  created() {
    this.debouncedGetGroups = _.debounce(this.getGroups, 500)
  },
  methods: {
    isTrainerOfTheGroup(item) {
      return item.trainers.filter((t) => t.id === this.user.id).length > 0
    },
    getGroups() {
      this.loading = true
      const sg = new SchoolGroup().include('players', 'trainers')
      sg.limit(100).where('club', this.$store.state.club.id).where('name', this.search_term)
      if (!this.isAdmin) {
        sg.where('trainer', this.user.id)
      }
      sg.get()
        .then((res) => {
          this.schoolGroups = res.data
          this.total = res.meta.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
        })
    },
  },
  head() {
    return {
      title: 'Škole',
    }
  },
}
</script>
