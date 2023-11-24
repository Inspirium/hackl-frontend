<template>
  <div class="members">
    <div v-show="prepopulated.length" class="search container p-t-0">
      <b-field>
        <b-input
          id="inputsearch"
          v-model="search_term"
          :placeholder="$t('pretraiIgrae')"
          type="search"
          pack="far"
          autocomplete="off"
          :icon-right="search_icon"
          icon-right-clickable
          @icon-right-click="search_term = ''"
        >
        </b-input>
      </b-field>
    </div>
    <div v-show="filteredList.length" class="modal-subtitle has-text-centered fw400 m-b-15 m-t--5">
      {{ $t('ukupnoIgraa') }}
      <span class="has-text-primary">{{ filteredList.length }}</span>
    </div>
    <div class="tablelist x-container p-b-100">
      <b-table :data="filteredList" :bordered="false" :mobile-cards="false">
        <b-table-column v-slot="props" cell-class="list__image-col" field="first_name">
          <a>
            <div class="list__img">
              <template v-if="isDoubles" class="for-doubles">
                <div
                  v-if="props.row.image === 'https://api.tenis.plus/images/user.svg' && props.row.players.length"
                  class="flex"
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
                    class="user_image m-l--30 border__white--2"
                    alt=""
                  />
                </div>
                <div v-else class="">
                  <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image border__white--2" alt="" />
                </div>
              </template>

              <TennisImage v-else :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
            </div>
            <div class="list__content">
              <div class="fw600 is-size-6 has-text-black80">{{ props.row.display_name }}</div>
              <div v-if="!props.row.is_doubles" class="fw600 is-size-7 has-text-lightblue">
                {{ $t('godina range', { range: props.row.players[0].range }) }}
              </div>
              <div v-else class="fw600 is-size-7 has-text-danger">{{ $t('teniskiPar') }}</div>
            </div>
            <div class="flex">
              <b-button class="" type="is-danger" rounded size="is-smaller" @click.stop="update(props.row)">{{
                $t('ukloni')
              }}</b-button>

              <b-button
                v-if="showProfile"
                class="m-l-5"
                type="is-primary"
                rounded
                size="is-smaller"
                @click.stop="$router.push('/player/' + props.row.players[0].id)"
                >{{ $t('profil') }}</b-button
              >
            </div>
          </a>
        </b-table-column>
        <template #empty>
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
              <p class="modal-title">{{ $t('nemaIgraa') }}</p>
            </div>
          </section>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'

export default {
  name: 'MemberSearchWithEdit',
  components: { TennisImage },
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
    showProfile: {
      type: Boolean,
      required: false,
      default: false,
    },
    isDoubles: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      club_players: [],
      search_term: '',
      last_page: 1,
      activeTab: 0,
      checkboxPosition: 'left',
      checkedRows: [],
    }
  },
  computed: {
    filteredList() {
      if (this.prepopulated.length) {
        return this.prepopulated.filter((post) => {
          return post.display_name !== undefined
            ? post.display_name.toLowerCase().includes(this.search_term.toLowerCase())
            : []
        })
      }
      return []
    },
    search_icon() {
      if (this.search_term !== '') {
        return 'times'
      } else {
        return 'search'
      }
    },
  },
  methods: {
    update(item) {
      this.$emit('update', item)
    },
  },
}
</script>
