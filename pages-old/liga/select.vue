<template>
  <div class="ranglist">
    <hero
      :options="heroImage"
      :second="{
        name: $t('Lige'),
        link: '/liga',
      }"
    >
      <h1 class="has-text-white">{{ $t('vrsteNatjecanja') }}</h1>
    </hero>

    <div class="tablelist">
      <h5 class="m-t-15 m-b-15">{{ $t('odaberiJednuOdPonuenihOpcija') }}</h5>
      <div class="my-rank">
        <div class="list__image-col softshadow">
          <nuxt-link :to="localePath('/liga/new')">
            <!--            <div class="list__img">-->
            <!--              <img :src="user.image" class="user_image" alt="" />-->
            <!--            </div>-->
            <div class="list__content m-r-auto">
              <h3 class="fw600 is-size-5 m-b-5">{{ $t('ligaPiramida') }}</h3>
              <h4 class="m-r-10">
                {{ $t('piramidalnaLigaOmoguujeIzraduLigeSVieGrupaOpcijama') }}
              </h4>
            </div>
            <div class="x-tag--xl m-l-auto primary-light nowrap">{{ $t('pokreni') }}</div>
          </nuxt-link>
        </div>
      </div>
      <div class="my-rank">
        <div class="list__image-col softshadow">
          <nuxt-link :to="localePath('/liga/elo/new')">
            <!--            <div class="list__img">-->
            <!--              <img :src="user.image" class="user_image" alt="" />-->
            <!--            </div>-->
            <div class="list__content m-r-auto">
              <h3 class="fw600 is-size-5 m-b-5">{{ $t('ligaElo') }}</h3>
              <h4 class="m-r-10">
                {{ $t('jednostavnaEloLigaImaJednuGrupuUnutarKojeSvakiIgra') }}
              </h4>
            </div>
            <div class="x-tag--xl m-l-auto primary-light nowrap">{{ $t('pokreni') }}</div>
          </nuxt-link>
        </div>
      </div>
      <!--      <div class="my-rank disable_opaq_5">-->
      <!--        <div class="list__image-col softshadow">-->
      <!--          <nuxt-link :to="localePath('/liga/elo/new')">-->
      <!--            &lt;!&ndash;            <div class="list__img">&ndash;&gt;-->
      <!--            &lt;!&ndash;              <img :src="user.image" class="user_image" alt="" />&ndash;&gt;-->
      <!--            &lt;!&ndash;            </div>&ndash;&gt;-->
      <!--            <div class="list__content m-r-auto">-->
      <!--              <h3 class="fw600 is-size-5 m-b-5">Kup</h3>-->
      <!--              <h4 class="m-r-10">Kup natjecanje omogućuje izradu kupa s dodatnim opcijama.</h4>-->
      <!--            </div>-->
      <!--            <div class="x-tag&#45;&#45;xl m-l-auto primary-light nowrap">Pokreni</div>-->
      <!--          </nuxt-link>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
import hero from '~/components/Hero'

export default {
  name: 'Players',
  components: {
    hero,
  },
  data() {
    return {
      heroImage: '/hero_ranks.jpg',
      club_players: [],
      offset: 1,
      bottom: false,
      nomore: false,
      total: 0,
      search_term: '',
      isModalPowerActive: false,
      isModalAgeActive: false,
      filterAgeDisplay: 'Sve',
      filterPowerDisplay: 'Sve',
      last_page: 1,
      ageRange: [],
      powerRange: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
}
</script>
