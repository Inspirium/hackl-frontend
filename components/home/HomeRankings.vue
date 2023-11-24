<template>
  <div v-if="rankings.length" class="home__rankings">
    <div class="activity x-container">
      <div class="activity__reservation">
        <div class="activity__header m-b-10">
          <nuxt-link :to="localePath('/rankings')" class="fw600"
            >{{ $t('rangLjestvica') }}
            <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
          </nuxt-link>
        </div>
        <div class="activity__box">
          <div class="tablelist">
            <b-table :data="rankings" :mobile-cards="hasMobileCards" :bordered="isBordered" default-sort="rank_club">
              <b-table-column
                v-slot="props"
                :td-attrs="(row) => ({ class: row.id === user.id ? 'active list__image-col' : 'list__image-col' })"
                field="rank_club"
                sortable
                numeric
              >
                <nuxt-link :to="localePath('/player/' + props.row.players[0].id)">
                  <div class="rank">{{ props.row.rank_club }}.</div>
                  <div class="list__img">
                    <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
                  </div>
                  <div class="list__content">
                    <h3>{{ props.row.display_name }}</h3>
                    <h4>{{ $t('godina range', { range: props.row.players[0].range }) }}</h4>
                  </div>
                  <b-tag type="is-info">{{ Math.round(props.row.rating_club) }}</b-tag>
                </nuxt-link>
              </b-table-column>
            </b-table>
            <nuxt-link :to="localePath('/rankings')" class="title-num">
              <div class="readmore readmore__activity">
                <div class="title-num">
                  {{ $t('pregledajCijeluRangLjestvicu') }}
                  <b-icon class="m-l-10" icon="arrow-right" size="is-small" pack="fal"></b-icon>
                </div>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
export default {
  name: 'HomeRankings',
  components: {
    TennisImage,
  },
  async fetch() {
    this.rankings = await this.$axios.$get('v2/ranking/home')
  },
  data() {
    return {
      selectedReservation: false,
      isModalAgeActive: false,
      hasMobileCards: false,
      isBordered: false,
      rankings: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
}
</script>
