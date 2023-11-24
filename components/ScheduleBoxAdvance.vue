<template>
  <div
    :class="{
      result__box: true,
      unverified: result.verified === null,
    }"
    class="relative z-1"
  >
    <template v-if="totals !== undefined">
      <div v-if="totals.total > 0" class="">
        <div class="">
          <div class="flex flex__column m-b-10">
            <div class="result__header w100">
              <div class="modal-subtitle is-size-5 align__centar__y">
                <b-icon icon="clock" type="is-primary" pack="fal" size="is-smaller-12" class="m-r-5 p-t-2"></b-icon>
                <span class="is-size-7 capitalise"> </span>{{ result.from | moment('LT') }}
              </div>
              <div v-if="isDoubles" class="m-r-10 flex gap-1 m-l-auto">
                <img src="/topnav/players_1.svg" class="turnament-players-icon" alt="" />
                <img src="/topnav/players_1.svg" class="turnament-players-icon" alt="" />
              </div>
              <div :class="['x-tag badge', 'badge-' + result.court.surface.badge]">
                {{ result.court.name }}
              </div>
            </div>
            <div class="">
              <div v-if="$store.state.club.id === 26" class="flex align__centar__y">
                <TennisImage
                  v-if="true"
                  :size="[42, 42]"
                  :src="result.court.club.logo"
                  class="user_image-small border__white--2 m-l--5 m-r-5"
                  alt=""
                />
                <div class="fw600 is-size-65">{{ result.court.club.name }}</div>
              </div>
              <div class="divider-line-solid"></div>
            </div>
          </div>
          <!--      <div class="has-text-lightblue fw600 is-size-4 m-b-5 is-uppercase m-x-auto has-text-centered m-t-10">-->
          <!--        Najava meča-->
          <!--      </div>-->
          <div v-if="result.players.length > 1">
            <div class="comments__box">
              <div class="flex justify-between flex1 relative">
                <div :class="{ result__score: true, 'm-b-5': true }">
                  <nuxt-link
                    :to="localePath(isDoubles ? '/doubles/' + result.players[0].id : result.players[0].players[0].link)"
                    class="flex__column align__centar__y"
                  >
                    <template v-if="isDoubles && true" class="for-doubles">
                      <div
                        v-if="result.players[0].image === 'https://api.tenis.plus/images/user.svg'"
                        class="flex min-w-45"
                      >
                        <TennisImage
                          :size="[90, 90]"
                          :src="result.players[0].players[0].image"
                          class="user_image-90 border__white--4"
                          alt=""
                        />
                        <TennisImage
                          :size="[90, 90]"
                          :src="result.players[0].players[1].image"
                          class="user_image-90 m-l--50 border__white--4"
                          alt=""
                        />
                      </div>
                      <div v-else class="flex min-w-45">
                        <TennisImage
                          :size="[90, 90]"
                          :src="result.players[0].image"
                          class="user_image-90 border__white--4 mr-3"
                          alt=""
                        />
                      </div>
                    </template>
                    <TennisImage
                      v-else
                      :size="[130, 130]"
                      :src="result.players[0].image"
                      class="user_image-mediumlarge"
                      alt=""
                    />

                    <template v-if="isDoubles">
                      <div class="fw600 is-size-55 has-text-black80 m-t-5">
                        {{ result.players[0].players[0].last_name }} -
                      </div>
                      <div class="fw600 is-size-55 has-text-black80 m-t--5">
                        {{ result.players[0].players[1].last_name }}
                      </div>
                    </template>
                    <template v-else>
                      <div class="fw600 has-text-black30 is-uppercase letter-spacing-3 m-t-10">
                        {{ result.players[0].players[0].first_name }}
                      </div>
                      <div class="fw600 is-size-4 has-text-black80 m-t--5">
                        {{ result.players[0].players[0].last_name }}
                      </div>
                    </template>
                  </nuxt-link>
                </div>
                <div v-if="Object.keys(stats).length" class="versus-score-box">
                  <div
                    :class="whoWon === 0 ? 'versus-score-winner' : 'versus-score'"
                    class="is-black10 has-text-black80"
                  >
                    {{ stats[result.players[0].id]?.wins }}
                  </div>
                  <div class="versus-separator"></div>
                  <div :class="whoWon === 1 ? 'versus-score-winner' : 'versus-score'" class="is-primary has-text-white">
                    {{ stats[result.players[1].id]?.wins }}
                  </div>
                </div>
                <div :class="{ result__score: true }">
                  <nuxt-link
                    :to="localePath(isDoubles ? '/doubles/' + result.players[1].id : result.players[1].players[0].link)"
                    class="flex__column align__centar__y"
                  >
                    <template v-if="isDoubles && true" class="for-doubles">
                      <div
                        v-if="result.players[1].image === 'https://api.tenis.plus/images/user.svg'"
                        class="flex min-w-45"
                      >
                        <TennisImage
                          :size="[90, 90]"
                          :src="result.players[1].players[0].image"
                          class="user_image-90 border__white--4"
                          alt=""
                        />
                        <TennisImage
                          :size="[90, 90]"
                          :src="result.players[1].players[1].image"
                          class="user_image-90 m-l--50 border__white--4"
                          alt=""
                        />
                      </div>
                      <div v-else class="flex min-w-45">
                        <TennisImage
                          :size="[90, 90]"
                          :src="result.players[1].image"
                          class="user_image-90 border__white--4 mr-3"
                          alt=""
                        />
                      </div>
                    </template>

                    <TennisImage
                      v-else
                      :size="[130, 130]"
                      :src="result.players[1].image"
                      class="user_image-mediumlarge"
                      alt=""
                    />
                    <template v-if="isDoubles">
                      <div class="fw600 is-size-55 has-text-black80 m-t-5">
                        {{ result.players[1].players[0].last_name }} -
                      </div>
                      <div class="fw600 is-size-55 has-text-black80 m-t--5">
                        {{ result.players[1].players[1].last_name }}
                      </div>
                    </template>
                    <template v-else>
                      <div class="fw600 has-text-black30 is-uppercase letter-spacing-3 m-t-10">
                        {{ result.players[1].players[0].first_name }}
                      </div>
                      <div class="fw600 is-size-4 has-text-black80 m-t--5">
                        {{ result.players[1].players[0].last_name }}
                      </div>
                    </template>
                  </nuxt-link>
                </div>
              </div>
            </div>

            <template v-if="true">
              <div class="versus-statis-line m-t-5 m-b-5">
                <div class="flex flex1 justify-between align__centar__y w100">
                  <div class="is-size-6 fw600">{{ winProbabilitiy[0] }}%</div>
                  <div class="label--versus">{{ $t('vjerojatnostPobjede') }}</div>
                  <div class="is-size-6 fw600">{{ winProbabilitiy[1] }}%</div>
                </div>
                <div class="flex">
                  <div class="probability-win-box is-black10" :style="`width: ${winProbabilitiy[0]}%`"></div>
                  <div class="probability-win-box is-primary" :style="`width: ${winProbabilitiy[1]}%`"></div>
                </div>
              </div>

              <template v-if="$store.state.club.id !== 26">
                <div class="versus-statis-line m-t-5 m-b-5">
                  <div class="flex flex1 justify-between align__centar__y w100">
                    <div class="is-size-4 fw500">{{ result.players[0].rank_club }}.</div>
                    <div class="label--versus">{{ $t('rankUKlubu') }}</div>
                    <div class="is-size-4 fw500">{{ result.players[1].rank_club }}.</div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="versus-statis-line m-t-5 m-b-5">
                  <div class="flex flex1 justify-between align__centar__y w100">
                    <div class="is-size-4 fw500">{{ result.players[0].rank_global }}.</div>
                    <div class="label--versus">{{ $t('Globalni rank') }}</div>
                    <div class="is-size-4 fw500">{{ result.players[1].rank_global }}.</div>
                  </div>
                </div>
              </template>
              <div class="divider-line-1 m-t-0"></div>

              <div class="versus-statis-line m-t-5 m-b-5">
                <div class="flex flex1 justify-between align__centar__y w100">
                  <div class="is-size-4 fw500">{{ Math.round(result.players[0].rating_club) }}</div>
                  <div class="label--versus">{{ $t('eloBodovi') }}</div>
                  <div class="is-size-4 fw500">{{ Math.round(result.players[1].rating_club) }}</div>
                </div>
              </div>

              <div class="divider-line-1 m-t-0"></div>

              <div class="versus-statis-line m-t-5 m-b-5">
                <div class="flex flex1 justify-between align__centar__y w100">
                  <trend :player="result.players[0].id" :limit="10" class="m-b-5 m-t-5 vstrend-left w100"> </trend>
                  <div class="label--versus p-l-20 p-r-20">{{ $t('trend') }}</div>
                  <trend :player="result.players[1].id" :limit="10" class="m-b-5 m-t-5 vstrend-right w100"> </trend>
                </div>
              </div>

              <div class="divider-line-1 m-t-0"></div>

              <div class="versus-statis-line m-t-5 m-b-5">
                <div class="flex flex1 justify-between align__centar__y w100">
                  <!-- eslint-disable vue/no-v-html -->
                  <div class="is-size-6 fw600 has-text-green has-text-left" v-html="calculateDiff(0)"></div>
                  <div class="label--versus p-l-20 p-r-20">
                    {{ $t('moguiDobitakgubitakEloBodovaUSluajuPobjedeIliPoraz') }}
                  </div>
                  <div class="is-size-6 fw600 has-text-green has-text-right" v-html="calculateDiff(1)"></div>
                  <!-- eslint-enable vue/no-v-html -->
                </div>
              </div>

              <div class="divider-line-1 m-t-0"></div>

              <div class="buttons m-t-30 m-b--10">
                <b-button
                  class="softshadow invert-small-button"
                  :type="
                    !show_details
                      ? 'is-primary has-text-white is-small noborder'
                      : 'is-danger has-text-white is-small noborder'
                  "
                  pack="fal"
                  :icon-right="!show_details ? 'plus' : 'minus'"
                  rounded
                  @click="show_details = !show_details"
                >
                  {{ !show_details ? $t('Prikaži detaljnu statistiku') : $t('Sakriji detaljnu statistiku') }}
                </b-button>
              </div>
            </template>

            <template v-if="show_details">
              <div class="has-text-lightblue fw600 is-size-5 m-b-5 is-uppercase m-x-auto has-text-centered m-t-30">
                {{ $t('meusobniOgledi') }}
              </div>
              <div class="statistics_new m-b-20 is-bckg border-radius-0">
                <div class="statistic__item">
                  <div class="label--versus">{{ $t('meeva') }}</div>
                  <div class="label__num is-size-3 has-text-black50 border-white">
                    <span class="has-text-black80">{{ totals.total }}</span>
                  </div>
                </div>
                <div class="statistic__item">
                  <div class="label--versus">{{ $t('natjecanja') }}</div>
                  <div class="label__num is-size-3 has-text-black50 border-white">
                    <span class="has-text-black80">{{ totals.competition }}</span>
                  </div>
                </div>
                <div class="statistic__item">
                  <div class="label--versus">{{ $t('prijateljski') }}</div>
                  <div class="label__num is-size-3 has-text-black50 border-white">
                    <span class="has-text-black80">{{ totals.friendly }}</span>
                  </div>
                </div>
              </div>
              <template>
                <div class="versus-statis-line">
                  <div class="label--center">{{ $t('setovi') }}</div>
                  <div class="flex flex1 w100 m-t--2 relative">
                    <div
                      class="versus-stats-value-left is-bckg"
                      :style="precentage(stats[result.players[1].id].sets, stats[result.players[0].id].sets)"
                    >
                      {{ stats[result.players[0].id].sets }}
                    </div>
                    <div class="versus-separator-half"></div>
                    <div
                      class="versus-stats-value-right is-primary has-text-white has-text-right"
                      :style="precentage(stats[result.players[0].id].sets, stats[result.players[1].id].sets)"
                    >
                      {{ stats[result.players[1].id].sets }}
                    </div>
                  </div>
                </div>

                <div class="versus-statis-line m-t-15">
                  <div class="label--center">{{ $t('gemovi') }}</div>
                  <div class="flex flex1 w100 m-t--2">
                    <div
                      class="versus-stats-value-left is-bckg"
                      :style="precentage(stats[result.players[1].id].points, stats[result.players[0].id].points)"
                    >
                      {{ stats[result.players[0].id].points }}
                    </div>
                    <div class="versus-separator-half"></div>
                    <div
                      class="versus-stats-value-right is-primary has-text-white has-text-right"
                      :style="precentage(stats[result.players[0].id].points, stats[result.players[1].id].points)"
                    >
                      {{ stats[result.players[1].id].points }}
                    </div>
                  </div>
                </div>

                <div class="versus-statis-line m-t-15">
                  <div class="label--center">Tie-break</div>
                  <div class="flex flex1 w100 m-t--2">
                    <div
                      class="versus-stats-value-left is-bckg"
                      :style="
                        precentage(stats[result.players[1].id].tie_breaks, stats[result.players[0].id].tie_breaks)
                      "
                    >
                      {{ stats[result.players[0].id].tie_breaks }}
                    </div>
                    <div class="versus-separator-half"></div>
                    <div
                      class="versus-stats-value-right is-primary has-text-white has-text-right"
                      :style="
                        precentage(stats[result.players[0].id].tie_breaks, stats[result.players[1].id].tie_breaks)
                      "
                    >
                      {{ stats[result.players[1].id].tie_breaks }}
                    </div>
                  </div>
                </div>
              </template>
              <!--          <div class="divider-line-1 m-t-15"></div>-->
              <div v-if="false" class="versus-statis-line m-t-15">
                <!--            <div class="label&#45;&#45;center w80 m-x-auto line-height-11">-->
                <!--              Vjerojatnost pobjede u slučaju osvajanja prvog seta-->
                <!--            </div>-->
                <div class="label--center w80 m-x-auto line-height-11">
                  {{ $t('brojUkupnihPobjedaAkoJeDobivenPrviSet') }}
                </div>
                <div class="versus-statis-line m-t-5">
                  <div class="flex flex1 w100 m-t--2">
                    <div
                      class="versus-stats-value-left is-bckg"
                      :style="
                        precentage(
                          stats[result.players[1].id].first_set_wins,
                          stats[result.players[0].id].first_set_wins
                        )
                      "
                    >
                      {{ stats[result.players[0].id].first_set_wins }}
                    </div>
                    <div class="versus-separator-half"></div>
                    <div
                      class="versus-stats-value-right is-primary has-text-white has-text-right"
                      :style="
                        precentage(
                          stats[result.players[0].id].first_set_wins,
                          stats[result.players[1].id].first_set_wins
                        )
                      "
                    >
                      {{ stats[result.players[1].id].first_set_wins }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="true" class="statistics_new m-b-10 m-t-20 p-all-0">
                <div class="label--center w80 m-x-auto line-height-11">
                  {{ $t('vjerojatnostPobjedeAkoJeOsvojenPrviSet') }}
                </div>
                <div class="statistic__item">
                  <div class="chart__donut">
                    <VueApexCharts type="donut" :options="optionsSmall" :series="firstSets1"></VueApexCharts>
                  </div>
                  <div class="label__num-v1 is-size-6">
                    <span class="has-text-black50 fw600 is-size-7 is-uppercase flex align__centar__all"
                      >{{ $t('osvojenihPrvihSetovaukupnoMeeva') }}
                    </span>
                  </div>

                  <div class="label__num-v1 fw600 is-size-4 has-text-danger">
                    <span class="has-text-darkgreen"
                      >{{ stats[result.players[0].id].first_set_wins
                      }}<span class="has-text-black80"> / {{ stats[result.players[0].id]?.wins }}</span></span
                    >
                  </div>
                </div>
                <div class="statistic__item">
                  <div class="chart__donut">
                    <VueApexCharts type="donut" :options="optionsSmall" :series="firstSets2"></VueApexCharts>
                  </div>
                  <div class="label__num-v1 is-size-6">
                    <span class="has-text-black50 fw600 is-size-7 line-height-8 is-uppercase flex align__centar__all"
                      >{{ $t('osvojenihPrvihSetovaukupnoMeeva') }}
                    </span>
                  </div>
                  <div class="label__num-v1 fw600 is-size-4 has-text-danger">
                    <span class="has-text-darkgreen"
                      >{{ stats[result.players[1].id].first_set_wins
                      }}<span class="has-text-black80"> / {{ stats[result.players[1].id]?.wins }}</span></span
                    >
                  </div>
                </div>
              </div>
              <div class="divider-line-1 m-t-20"></div>
              <template>
                <div class="has-text-lightblue fw600 is-size-5 m-b-5 is-uppercase m-x-auto has-text-centered m-t-30">
                  {{ $t('posljednjiSusreti') }}
                </div>
                <div class="">
                  <div v-for="(game, index) in results" :key="index" class="m-b-10">
                    <versusLotPlayed v-if="game.result !== null" :show-date="true" :game="game"></versusLotPlayed>
                  </div>
                </div>
              </template>
            </template>
          </div>
          <div class="results__comments m-t-20 m-b-10" @click="saveWatchers">
            <div class="buttons">
              <div v-if="userWatching.length > 0" class="flex align__centar__y m-b-10">
                <b-icon icon="map-marker-minus" type="is-danger" pack="fal"></b-icon>
                <div class="has-text-black80 fw600 m-l-10 is-size-5">{{ $t('odjaviDolazak') }}</div>
              </div>
              <div v-else class="flex align__centar__y m-b-10">
                <b-icon icon="map-marker-plus" pack="fal" type="is-grey-lighter"> </b-icon>
                <div class="has-text-black80 fw600 m-l-10 is-size-5">{{ $t('prijaviDolazak') }}</div>
              </div>
            </div>
          </div>

          <div
            v-if="result.watchers.length"
            :class="['attenders__list', { 'attenders__list--expand': attenders_expand }]"
          >
            <span class="is-size-7 fw600"
              >{{ $t('najaviliDolazak') }}
              <span class="x-tag primary-light m-l-auto m-r-5">{{ result.watchers.length }}</span></span
            >
            <div v-for="player in result.watchers" :key="player.id" @click="attenders_expand = !attenders_expand">
              <div class="fw600 is-size-65 name m-r-10">{{ player.display_name }}</div>
              <TennisImage :size="[42, 42]" :src="player.image" class="user_image" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="">
        <div class="flex flex__column m-b-10">
          <div class="result__header w100">
            <div class="modal-subtitle is-size-5 align__centar__y">
              <b-icon icon="clock" type="is-primary" pack="fal" size="is-smaller-12" class="m-r-5 p-t-2"></b-icon>
              <span class="is-size-7 capitalise"> </span>{{ result.from | moment('LT') }}
            </div>
            <div v-if="isDoubles" class="m-r-10 flex gap-1 m-l-auto">
              <img src="/topnav/players_1.svg" class="turnament-players-icon" alt="" />
              <img src="/topnav/players_1.svg" class="turnament-players-icon" alt="" />
            </div>
            <div :class="['x-tag badge', 'badge-' + result.court.surface.badge]">
              {{ result.court.name }}
            </div>
          </div>
          <div class="">
            <div v-if="$store.state.club.id === 26" class="flex align__centar__y">
              <TennisImage
                :size="[42, 42]"
                :src="result.court.club.logo"
                class="user_image-small border__white--2 m-l--5 m-r-5"
                alt=""
              />
              <div class="fw600 is-size-65">
                {{ result.court.club.name }}
              </div>
            </div>
            <div class="divider-line-solid"></div>
          </div>
        </div>
        <div v-if="result.players.length > 1">
          <div class="comments__box">
            <div class="">
              <div :class="{ result__score: true, 'm-b-5': true }">
                <nuxt-link
                  :to="localePath(isDoubles ? '/doubles/' + result.players[0].id : result.players[0].players[0].link)"
                >
                  <template v-if="isDoubles && true" class="for-doubles">
                    <div
                      v-if="result.players[0].image === 'https://api.tenis.plus/images/user.svg'"
                      class="flex min-w-45"
                    >
                      <TennisImage
                        :size="[42, 42]"
                        :src="result.players[0].players[0].image"
                        class="user_image border__white--2"
                        alt=""
                      />
                      <TennisImage
                        :size="[42, 42]"
                        :src="result.players[0].players[1].image"
                        class="user_image m-l--20 border__white--2 mr-3"
                        alt=""
                      />
                    </div>
                    <div v-else class="flex min-w-45">
                      <TennisImage
                        :size="[42, 42]"
                        :src="result.players[0].image"
                        class="user_image border__white--2 mr-3"
                        alt=""
                      />
                    </div>
                  </template>

                  <TennisImage v-else :src="result.players[0].image" class="user_image m-r-10" alt="" />
                  <h3 class="result__score__box player__name">
                    {{ result.players[0].display_name }}
                  </h3>
                </nuxt-link>
              </div>
              <div :class="{ result__score: true }">
                <nuxt-link
                  :to="localePath(isDoubles ? '/doubles/' + result.players[1].id : result.players[1].players[0].link)"
                >
                  <template v-if="isDoubles && true" class="for-doubles">
                    <div
                      v-if="result.players[1].image === 'https://api.tenis.plus/images/user.svg'"
                      class="flex min-w-45"
                    >
                      <TennisImage
                        :size="[42, 42]"
                        :src="result.players[1].players[0].image"
                        class="user_image border__white--2"
                        alt=""
                      />
                      <TennisImage
                        :size="[42, 42]"
                        :src="result.players[1].players[1].image"
                        class="user_image m-l--20 border__white--2 mr-3"
                        alt=""
                      />
                    </div>
                    <div v-else class="flex min-w-45">
                      <TennisImage
                        :size="[42, 42]"
                        :src="result.players[1].image"
                        class="user_image border__white--2 mr-3"
                        alt=""
                      />
                    </div>
                  </template>

                  <TennisImage
                    v-else
                    :size="[42, 42]"
                    :src="result.players[1].image"
                    class="user_image m-r-10"
                    alt=""
                  />
                  <h3 class="result__score__box player__name">
                    {{ result.players[1].display_name }}
                  </h3>
                </nuxt-link>
              </div>
            </div>
            <div class="results__comments" @click="saveWatchers">
              <div class="buttons">
                <b-icon v-if="userWatching.length > 0" icon="map-marker-minus" type="is-danger" pack="fal"> </b-icon>
                <b-icon v-else icon="map-marker-plus" pack="fal" type="is-grey-lighter"> </b-icon>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="result.watchers.length"
          :class="['attenders__list', { 'attenders__list--expand': attenders_expand }]"
        >
          <span class="is-size-7 fw600"
            >{{ $t('najaviliDolazak') }}
            <span class="x-tag primary-light m-l-auto m-r-5">{{ result.watchers.length }}</span></span
          >
          <div v-for="player in result.watchers" :key="player.id" @click="attenders_expand = !attenders_expand">
            <div class="fw600 is-size-65 name m-r-10">{{ player.display_name }}</div>
            <TennisImage :size="[42, 42]" :src="player.image" class="user_image" alt="" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import VueApexCharts from 'vue-apexcharts'
import Reservation from '~/models/Reservation'
import versusLotPlayed from '~/components/versusLotPlayed'
import trend from '~/components/stats/trend'

export default {
  name: 'ScheduleBoxAdvance',
  components: {
    VueApexCharts,
    versusLotPlayed,
    trend,
    TennisImage,
  },
  props: {
    resultItem: {
      type: [Object, Array],
      required: true,
    },
  },

  data() {
    return {
      result: this.resultItem,
      attenders_expand: false,
      results: this.resultItem.vsStats.results,
      my_results: [],
      my_results_page: 1,
      my_results_total_pages: 1,
      show_details: false,
      stats: this.resultItem.vsStats.stats,
      optionsSmall: {
        colors: ['#ff3860', '#9acd32'],
        chartOptions: {
          chart: {
            id: 'liga-statistika',
            type: 'pie',
            width: '100%',
            parentHeightOffset: 0,
          },
        },
        stroke: {
          show: false,
        },
        legend: {
          show: false,
        },
        dataLabels: {
          style: {
            fontSize: '14px',
            fontFamily: 'Quicksand, sans-serif',
            fontWeight: 600,
          },
          formatter(val, opts) {
            return Math.round(val) + '%'
          },
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 3,
            color: '#000',
            opacity: 0.2,
          },
        },
        plotOptions: {
          pie: {
            dataLabels: {
              offset: 0,
              minAngleToShowLabel: 10,
            },
            donut: {
              size: '0%',
              background: 'transparent',
            },
          },
        },
      },
      totals: this.resultItem.vsStats.totals,
      clubs: [],
    }
  },
  computed: {
    winProbabilitiy() {
      let final0 = null
      let final1 = null
      // const positionPlayerOne = this.resultItem.players[0]
      // const positionPlayerTwo = this.resultItem.players[1]
      const p1wins = this.stats[this.resultItem.players[0].id]?.wins
      const p2wins = this.stats[this.resultItem.players[1].id]?.wins
      const player1 = this.resultItem.players[0].rating_club
      const player2 = this.resultItem.players[1].rating_club
      const diff = player1 - player2
      let p0 = 1 - 1 / (1 + 10 ** (diff / 400.0))
      p0 = Math.round(p0 * 100)
      const p1 = 100 - p0
      const VersusPointsForFirstPlayer = (p1wins / (p1wins + p2wins)) * 100
      const VersusPointsForSecondPlayer = (p2wins / (p1wins + p2wins)) * 100
      final0 = Math.round(p0 + VersusPointsForFirstPlayer) / 2
      final1 = Math.round(p1 + VersusPointsForSecondPlayer) / 2
      return [final0, final1]
    },
    firstSets1() {
      return [
        this.stats[this.result.players[0].id]?.wins - this.stats[this.result.players[0].id]?.first_set_wins,
        this.stats[this.result.players[0].id]?.first_set_wins,
      ]
    },
    firstSets2() {
      return [
        this.stats[this.result.players[1].id]?.wins - this.stats[this.result.players[1].id]?.first_set_wins,
        this.stats[this.result.players[1].id]?.first_set_wins,
      ]
    },
    firstSetsDiff1() {
      if (this.stats[this.result.players[0].id]?.wins >= this.stats[this.result.players[0].id].first_set_wins) {
        return this.stats[this.result.players[0].id]?.first_set_wins
      }
      return this.stats[this.result.players[0].id]?.wins
    },
    firstSetsDiff2() {
      if (this.stats[this.result.players[1].id]?.wins >= this.stats[this.result.players[1].id].first_set_wins) {
        return this.stats[this.result.players[1].id].first_set_wins
      }
      return this.stats[this.result.players[1].id]?.wins
    },
    whoWon() {
      if (this.stats[this.result.players[0].id]?.wins > this.stats[this.result.players[1].id]?.wins) {
        return 0
      }
      if (this.stats[this.result.players[0].id]?.wins < this.stats[this.result.players[1].id]?.wins) {
        return 1
      }
      if (this.stats[this.result.players[0].id]?.wins === this.stats[this.result.players[1].id]?.wins) {
        return 2
      }
      return null
    },
    user() {
      return this.$store.state.auth.user
    },
    userWatching() {
      return _.filter(this.result.watchers, (item) => {
        return item.id === this.user.id
      })
    },
    isDoubles() {
      return this.result.players[0].players.length === 2
    },
  },
  methods: {
    calculateDiff(player) {
      const rating1 = Math.round(this.resultItem.players[player === 0 ? 0 : 1].rating_club)
      const rating2 = Math.round(this.resultItem.players[player !== 0 ? 0 : 1].rating_club)
      const r1 = Math.pow(10, rating1 / 400)
      const r2 = Math.pow(10, rating2 / 400)
      const e1 = r1 / (r1 + r2)
      const win = Math.round(32 * (1 - e1))
      const lose = Math.round(32 * -e1)
      return '<div class="score_win">' + '+' + win + '</div><div class="score_lose m-t--5">' + lose + '</div>'
    },
    precentage(one, two) {
      const sum = one + two
      let precentTwo = (two / sum) * 100
      precentTwo = isNaN(precentTwo) ? 50 : precentTwo
      return 'width:' + precentTwo + '%'
    },
    precentageSecond(player) {
      const test = this.totals.total
        ? Math.round((this.stats[this.result.players[player].id].first_set_wins / this.totals.total) * 100)
        : 0
      return 'width:' + test + '%'
    },
    saveWatchers() {
      if (this.userWatching.length < 1) {
        const r = new Reservation({ id: this.result.id, watcher: { id: this.user.id } })
        r.save().then((res) => {
          this.result = res
        })
        this.$buefy.toast.open({
          message: this.$t('Uspješno ste najavili dolazak'),
          type: 'is-success',
        })
      } else {
        const r = new Reservation({ id: this.result.id, watcher: { id: this.user.id } })
        r.save().then((res) => {
          this.result = res
        })
        this.$buefy.toast.open({
          message: this.$t('Uspješno ste odjavili dolazak'),
          type: 'is-danger',
        })
      }
    },
  },
}
</script>
