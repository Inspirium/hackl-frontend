<template>
  <div class="cups">
    <div v-if="cup.status === '5'" class="member__info liga__header is-red">
      <div class="fw600 is-size-55 has-text-white p-t-10 p-b-10">{{ $t('turnirJeZavren') }}</div>
    </div>
    <hero
      :second="{
        name: $t('Turniri'),
        link: '/cup',
      }"
    >
      <h1 class="has-text-white p-l-50 p-r-50">
        {{ cup.name }}
      </h1>
    </hero>
    <div v-if="isLigaAdmin.length > 0 || isAdmin" class="buttons m-t-20 m-b-5">
      <b-button
        class="softshadow m-b-10"
        type="is-small noborder"
        pack="fal"
        icon-right="cog"
        rounded
        @click="$router.push(localePath('/cup/' + cup.id + '/edit'))"
      >
        {{ $t('urediTurnir') }}
      </b-button>
      <b-button
        v-if="cup.status !== '5'"
        class="softshadow m-b-10"
        type="is-small noborder"
        pack="fal"
        icon-right="user-edit"
        rounded
        @click="$router.push(localePath('/cup/' + cup.id + '/liga_create'))"
      >
        {{ $t('urediIgrae2') }}
      </b-button>
    </div>
    <!--    <div v-if="cup.status !== '5' && userInCup.length" class="buttons m-t-20">-->
    <!--      <b-button class="fw600" size="is-medium" type="is-primary" pack="far" rounded @click="newResult()">-->
    <!--        Unesi rezultat-->
    <!--      </b-button>-->
    <!--    </div>-->

    <b-tabs v-model="activeTabMain" size="is-medium" position="is-centered" class="">
      <b-tab-item :label="$t('turnir')">
        <transition name="fade">
          <div v-if="loading1 && (fwd || activeTab === 0)" class="align__centar__x loading_z_spinner">
            <b-icon
              class="comment-send m-b-20 m-t-100"
              custom-class="rotating"
              icon="spinner"
              size="is-large"
              type="is-primary"
              pack="far"
            ></b-icon>
          </div>
        </transition>
        <transition name="fade">
          <div v-if="Object.keys(tournamentRound).length" class="x-container">
            <div class="tab__navigation m-b-0 m-t-10 no-double-zoom">
              <div
                class="tab__navigation__arrow__left"
                :class="activeTab === 0 ? 'blur_button' : ''"
                @click="
                  activeTab--
                  fwd = false
                  activeTabMain = 0
                "
              >
                <b-icon v-if="!loading1" icon="chevron-left" pack="fal" custom-class="asd"> </b-icon>
                <b-icon v-else icon="spinner" pack="far" custom-class="rotating"> </b-icon>
              </div>
              <div
                class="tab__navigation__arrow__right"
                :class="gamesLength === 1 ? 'blur_button' : ''"
                @click="
                  activeTab++
                  fwd = true
                  activeTabMain = 0
                "
              >
                <b-icon v-if="!loading" icon="chevron-right" pack="fal" custom-class="asd"> </b-icon>
                <b-icon v-else icon="spinner" pack="far" custom-class="rotating"> </b-icon>
              </div>
            </div>
            <div @click="showMiniPop = !showMiniPop">
              <div class="flex align__centar__all relative">
                <div
                  class="has-text-black80 is-size-5 has-text-centered fw600 m-t--50 w70 m-l-auto m-r-auto line-height-19"
                >
                  {{ roundName }}
                  <b-icon
                    class="m-l--5"
                    style="transition: 0.25s all"
                    icon="chevron-down"
                    size="is-small-9"
                    type="is-primary"
                    pack="fas"
                  ></b-icon>
                </div>
              </div>
              <indicator
                v-if="Object.keys(cup).length"
                class="m-t--5 m-b-20"
                :active-tab="activeTab"
                :options="indicator"
                :number-of-tabs="cup.rounds.length"
              ></indicator>
            </div>
            <div class="buttons m-t-20 m-b-5">
              <b-button
                class="softshadow m-b-10"
                type="is-small noborder"
                pack="fal"
                icon-right="tennis-ball"
                rounded
                @click="showDraw = true"
              >
                {{ $t('Prikaži cijeli ždrijeb') }}
              </b-button>
            </div>

            <transition name="minipop">
              <div v-if="showMiniPop" class="minipop m-t-75">
                <div
                  v-for="(item, index) in miniPopContent"
                  v-show="index < cup.rounds.length"
                  :key="index"
                  class="minipop-item"
                  :class="cup.rounds.length - 1 - index === activeTab ? 'has-text-primary' : ''"
                  @click="
                    activeTab = cup.rounds.length - 1 - index
                    loading1 = true
                    fwd = true
                    showMiniPop = false
                  "
                >
                  {{ item.name }}
                </div>
              </div>
            </transition>
          </div>
        </transition>
        <div
          v-if="(isLigaAdmin.length > 0 || isAdmin) && cup.status !== '5' && activeTabRepassage === 0 && losers.length"
          class="buttons m-t-20 m-b-5"
        >
          <b-button class="softshadow m-b-10" type="is-small noborder" rounded @click="activeTabRepassage = 1">
            {{ $t('izradiRepasaOvogKola') }}
          </b-button>
        </div>
        <b-tabs v-model="activeTabRepassage" position="is-centered" class="hide_tab_navigation">
          <b-tab-item>
            <transition name="fade">
              <div v-if="Object.keys(tournamentRound).length" :class="{ loading_opaq: swipeLoading }">
                <div v-if="tournamentRound.games.length" class="activity trs x-container m-t--10">
                  <div
                    v-for="(game, index) in tournamentRound.games"
                    :key="game.id + index"
                    v-touch:swipe="swipeHandler"
                    class="cup-table zdrijeb"
                  >
                    <span v-if="$auth.user.id === 1">{{ game.id }}</span>
                    <cupLotEmpty
                      v-if="game.result === null"
                      :game="game"
                      :is-doubles="!!cup.is_doubles"
                      :is-first-round="activeTab === 0"
                      :is-finish="cup.status === '5'"
                      :isligaadmin="isLigaAdmin.length"
                      @openIt="
                        partner = game.players
                        gameid = game.id
                        isMyResultPrepopulatedModalActive = true
                      "
                      @openItAdmin="
                        openMatchAdmin(game)
                        gameid = game.id
                      "
                      @openItReservation="
                        openReservation(game)
                        gameid = game.id
                      "
                    ></cupLotEmpty>
                    <cupLotPlayed
                      v-else
                      :game="game"
                      :is-doubles="!!cup.is_doubles"
                      :show-date="true"
                      :isligaadmin="isLigaAdmin.length"
                      @refresh="getLeague()"
                      @verified="getTournamentRound()"
                    ></cupLotPlayed>
                    <div class="line-container">
                      <svg class="cup__line" height="15">
                        <!--                  <line x1="0" y1="0" x2="0" y2="15" style="stroke: rgb(32, 156, 238); stroke-width: 4" />-->
                      </svg>
                    </div>
                    <div v-if="tournamentRound.games.length !== 1" class="line-container--small m-t-1">
                      <svg class="cup__line--small" height="30">
                        <line x1="0" y1="0" x2="0" y2="30" style="stroke: #b5b5b5; stroke-width: 4" />
                        <line x1="0" y1="15" x2="550" y2="15" style="stroke: #b5b5b5; stroke-width: 1" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div
                  v-if="
                    cup.status !== '5' &&
                    gamesLength === 1 &&
                    (tournamentFinals.games[0].result || tournamentFinals.games[0].is_surrendered) &&
                    (isLigaAdmin.length || isAdmin)
                  "
                  class="buttons m-t-5"
                >
                  <b-button
                    class="fw600"
                    size="is-medium"
                    type="is-danger"
                    pack="far"
                    icon-right="check"
                    rounded
                    @click="submit()"
                  >
                    {{ $t('zavriTurnir') }}
                  </b-button>
                </div>
              </div>
            </transition>
          </b-tab-item>
          <b-tab-item>
            <div
              v-if="
                (isLigaAdmin.length > 0 || isAdmin) && cup.status !== '5' && activeTabRepassage === 1 && losers.length
              "
              class="buttons m-t-20 m-b-5"
            >
              <b-button
                class="softshadow m-b-10"
                type="is-danger"
                pack="fal"
                icon-left="chevron-left"
                rounded
                @click="activeTabRepassage = 0"
              >
                {{ $t('nazad') }}
              </b-button>
              <b-button
                class="softshadow m-b-10"
                type="is-primary"
                rounded
                :loading="loading2"
                @click="createRepassage()"
              >
                {{ $t('izradiRespasa') }}
              </b-button>
            </div>
            <div class="activity__header--center m-b-5 m-t-15 p-l-15 p-r-15 has-text-centered">
              <div class="fw600 is-size-6">{{ $t('izradiNovoNatjecanjeOdIgraaKojiSuIzgubiliOvoKolo') }}</div>
            </div>
            <div v-if="true" class="buttons m-t-20 m-b-0">
              <b-button
                class="softshadow m-b-10"
                type="is-small noborder"
                pack="fal"
                icon-right="user-plus"
                rounded
                @click="isModalMembersAddToTournament = true"
              >
                {{ $t('dodajIgraa') }}
              </b-button>
            </div>

            <membersSearch :prepopulated="losers" @update="deleteRepasagePlayer($event.id)"></membersSearch>
          </b-tab-item>
        </b-tabs>
      </b-tab-item>
      <b-tab-item
        v-if="(userInCup !== false || isLigaAdmin.length > 0 || isAdmin) && cup.status !== '5'"
        :label="$t('poruke')"
        class="p-b-100 x-container"
      >
        <template v-if="messagesLiga.length">
          <div class="is-size-5 fw600 m-t-20 m-b-5">{{ $t('poruke') }}</div>
          <div class="schoolgroup__messages">
            <template>
              <div v-chat-scroll="{ always: false, smooth: true, window: true }" class="comments p-b-10">
                <div
                  v-for="comment in messagesLiga"
                  :key="comment.id"
                  :class="{
                    'comments-item': true,
                    my_comments: $auth.user.id === comment.player.id && comment.multimedia_type !== 'terms',
                    terms: comment.multimedia_type === 'terms',
                  }"
                >
                  <text-message v-if="!comment.multimedia_type" :comment="comment" />
                  <term-message
                    v-if="comment.multimedia_type === 'terms'"
                    :players="thread.players"
                    :comment="comment"
                  />
                  <image-message v-if="comment.multimedia_type === 'image'" :comment="comment" />
                </div>
              </div>
            </template>
          </div>
          <div class="buttons m-t-20">
            <b-button
              tag="nuxt-link"
              :to="localePath('/messages/' + cup.thread.id)"
              class="m-l-10 softshadow"
              pack="fal"
              type="is-small noborder"
              icon-right="comments"
              rounded
            >
              {{ $t('prikaiOstalePoruke') }}
            </b-button>
          </div>
        </template>
        <template v-else>
          <div class="buttons m-t-20">
            <b-button
              class="softshadow m-b-20"
              type="is-small noborder"
              pack="fal"
              icon-right="comments"
              rounded
              :loading="loadingMessages"
              @click="submitMessageCup()"
            >
              {{ $t('poaljiGrupnuPoruku') }}
            </b-button>
          </div>
        </template>
      </b-tab-item>
      <b-tab-item v-if="cup.status === '5'" :label="$t('igrai')" class="p-b-100 x-container">
        <div class="registration">
          <div class="modal-subtitle has-text-centered fw400 m-b-15">
            {{ $t('ukupnoIgraa') }}
            <span class="has-text-primary">{{ cup.players.length }}</span>
          </div>
          <div class="tablelist p-b-100">
            <b-table :data="cup.players" :bordered="false" :mobile-cards="false">
              <b-table-column v-slot="props" cell-class="list__image-col">
                <nuxt-link :to="localePath(props.row.link)">
                  <div class="list__img">
                    <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
                  </div>
                  <div class="list__content">
                    <div class="fw600 is-size-55 has-text-black80 line-height-14">{{ props.row.display_name }}</div>
                    <div v-if="!props.row.is_doubles" class="fw600 is-size-7 has-text-lightblue">
                      {{ $t('godina range', { range: props.row.players[0].range }) }}
                    </div>
                  </div>
                </nuxt-link>
              </b-table-column>
              <template #empty>
                <section class="section">
                  <div class="content has-text-grey has-text-centered">
                    <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                    <p class="modal-title">{{ $t('nemaPrijavljenihIgraa') }}</p>
                  </div>
                </section>
              </template>
            </b-table>
          </div>
        </div>
      </b-tab-item>
      <b-tab-item :label="$t('info')" class="p-b-100 x-container">
        <template v-if="cup.status === '5' && cup.winner_user !== null">
          <div class="activity__header--center m-t-10">
            <div class="fw600 is-size-3">{{ $t('pobjednikTurnira') }}</div>
          </div>
          <div
            v-if="Object.keys(cup).length && cup.winner.image !== null && true"
            class="winner-box m-t-20 align__centar__y flex__column rotate-3"
          >
            <TennisImage v-if="cup.winner.image !== null" :size="[180, 180]" class="" :src="cup.winner.image" alt="" />
            <div
              v-if="Object.keys(tournamentFinals).length && !tournamentFinals.games[0].is_surrendered"
              class="is-size-5 m-l-5 m-t-10 fw600 has-text-lightblue"
            >
              {{
                $t('key', {
                  expr:
                    cup.winner.description === null
                      ? checkIfFinalsSurrender
                        ? tournamentFinals.games[0].result.players[1].display_name
                        : tournamentFinals.games[0].result.players[0].display_name
                      : cup.winner.description,
                })
              }}
            </div>
            <div v-else class="is-size-5 m-l-5 m-t-10 fw600 has-text-lightblue">
              {{
                $t('key', {
                  expr:
                    cup.winner.description === null
                      ? tournamentFinals.games[0].result.is_surrendered === 2
                        ? tournamentFinals.games[0].result.players[1].display_name
                        : tournamentFinals.games[0].result.players[0].display_name
                      : cup.winner.description,
                })
              }}
            </div>
          </div>
          <div
            v-if="Object.keys(cup).length && cup.winner.image === null && Object.keys(tournamentFinals).length"
            class="m-t-20 align__centar__y flex__column"
          >
            <div v-if="!tournamentFinals.games[0].is_surrendered" class="member__info">
              <div
                @click="
                  $router.push(
                    checkIfFinalsSurrender
                      ? '/player/' + tournamentFinals.games[0].result.players[1].id.toString()
                      : '/player/' + tournamentFinals.games[0].result.players[0].id.toString()
                  )
                "
              >
                <TennisImage
                  :size="[180, 180]"
                  :src="
                    checkIfFinalsSurrender
                      ? tournamentFinals.games[0].result.players[1].image
                      : tournamentFinals.games[0].result.players[0].image
                  "
                  class="user_image-large m-r-5"
                  alt=""
                />
                <div class="fw600 is-size-4 has-text-centered m-b-10 m-t-5">
                  {{
                    checkIfFinalsSurrender
                      ? tournamentFinals.games[0].result.players[1].display_name
                      : tournamentFinals.games[0].result.players[0].display_name
                  }}
                </div>
                <div class="buttons m-t-10 m-b-0">
                  <b-button
                    class="softshadow m-t-10"
                    type="is-small noborder"
                    pack="fal"
                    icon-right="chevron-right"
                    rounded
                    @click="
                      $router.push(
                        checkIfFinalsSurrender
                          ? '/player/' + tournamentFinals.games[0].result.players[1].id.toString()
                          : '/player/' + tournamentFinals.games[0].result.players[0].id.toString()
                      )
                    "
                  >
                    {{ $t('idiNaProfilIgraa') }}
                  </b-button>
                </div>
              </div>
            </div>
            <div v-else class="member__info">
              <div
                @click="
                  $router.push(
                    '/doubles/' +
                      tournamentFinals.games[0].players[
                        tournamentFinals.games[0].is_surrendered === 1 ? 1 : 0
                      ].id.toString()
                  )
                "
              >
                <div v-if="cup.is_doubles && true" class="for-doubles">
                  <div
                    v-if="
                      tournamentFinals.games[0].players[tournamentFinals.games[0].is_surrendered === 1 ? 1 : 0]
                        .image === 'https://api.tenis.plus/images/user.svg'
                    "
                    class="flex m-r-20"
                  >
                    <TennisImage
                      :size="[180, 180]"
                      :src="
                        tournamentFinals.games[0].players[tournamentFinals.games[0].is_surrendered === 1 ? 1 : 0]
                          .players[0].image
                      "
                      class="user_image-large border__white--4 softshadow border__white--2"
                      alt=""
                    />
                    <TennisImage
                      :size="[180, 180]"
                      :src="
                        tournamentFinals.games[0].players[tournamentFinals.games[0].is_surrendered === 1 ? 1 : 0]
                          .players[1].image
                      "
                      class="user_image-large border__white--4 softshadow m-l--20 border__white--2"
                      alt=""
                    />
                  </div>
                  <div v-else class="list__img">
                    <TennisImage
                      :size="[42, 42]"
                      :src="
                        tournamentFinals.games[0].players[tournamentFinals.games[0].is_surrendered === 1 ? 1 : 0].image
                      "
                      class="user_image border__white--2"
                      alt=""
                    />
                  </div>
                </div>

                <TennisImage
                  v-else
                  :size="[180, 180]"
                  :src="tournamentFinals.games[0].players[tournamentFinals.games[0].is_surrendered === 1 ? 1 : 0].image"
                  class="user_image-large m-r-5"
                  alt=""
                />
                <div class="fw600 is-size-4 has-text-centered m-b-10 m-t-5">
                  {{
                    tournamentFinals.games[0].players[tournamentFinals.games[0].is_surrendered === 1 ? 1 : 0]
                      .display_name
                  }}
                </div>
                <div v-if="false" class="buttons m-t-10 m-b-0">
                  <b-button
                    class="softshadow m-t-10"
                    type="is-small noborder"
                    pack="fal"
                    icon-right="chevron-right"
                    rounded
                    @click="
                      $router.push(
                        '/doubles/' +
                          tournamentFinals.games[0].players[
                            tournamentFinals.games[0].is_surrendered === 1 ? 1 : 0
                          ].id.toString()
                      )
                    "
                  >
                    {{ $t('idiNaProfilIgraa') }}
                  </b-button>
                </div>
              </div>
            </div>
          </div>

          <div class="activity__header m-t-10">
            <div class="fw600 is-size-4">{{ $t('finalniMe') }}</div>
          </div>
          <template v-if="Object.keys(tournamentFinals).length">
            <cupLotEmpty
              v-if="tournamentFinals.games[0].is_surrendered"
              :game="tournamentFinals.games[0]"
              :is-doubles="!tournamentFinals.games[0].is_doubles"
              :is-first-round="activeTab === 0"
              :is-finish="cup.status === '5'"
              :isligaadmin="isLigaAdmin.length"
            ></cupLotEmpty>

            <cupLotPlayed
              v-else
              :game="tournamentFinals.games[0]"
              :show-date="true"
              :is-doubles="!!tournamentFinals.games[0].is_doubles"
            ></cupLotPlayed>
          </template>
        </template>
        <div class="activity__header m-t-20">
          <div class="fw600 is-size-3">{{ $t('osnovniPodaci') }}</div>
        </div>
        <adminEdit class="m-t--10" :options="cup"></adminEdit>

        <div class="display-data__box m-t-10">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('nazivTurnira') }}</div>
          <div class="fw600 is-size-5">{{ cup.name }}</div>
        </div>
        <div v-if="cup.type !== 'private' && cup.status !== '5'" class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('rokZaPrijavu') }}</div>
          <div class="fw600 is-size-5">
            {{ $moment(cup.finish_onboarding).format('dddd' + ', ' + 'DD' + '.' + 'MM' + '.') }}
          </div>
        </div>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('datumZavretkaTurnira') }}</div>
          <div class="fw600 is-size-5">
            {{ $moment(cup.finish_date).format('dddd' + ', ' + 'DD' + '.' + 'MM' + '.') }}
          </div>
        </div>
        <div class="m-t-10 m-b-15 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('brojNatjecatelja') }}</div>
          <div v-if="cup.players !== undefined" class="fw600 is-size-5">
            {{ cup.players.length ? cup.players.length : 'Nema prijavljenih' }}
          </div>
        </div>

        <div class="">
          <div class="m-t-0 fw600 is-size-4 has-text-left">{{ $t('kontaktPodaci') }}</div>
        </div>
        <p class="fw600 m-t-0 has-text-left has-text-lightblue is-size-65">{{ $t('Upiti za natjecanje') }}</p>
        <template>
          <div class="buttons m-t-20">
            <b-button
              class="softshadow"
              type="is-small noborder"
              pack="fal"
              icon-right="comments"
              rounded
              :loading="loadingMessage"
              @click="submitMessage()"
            >
              {{ $t('poaljiPoruku') }}
            </b-button>
            <b-button
              :href="'tel:' + adminAsPlayer.phone"
              tag="a"
              class="softshadow m-l-10"
              type="is-small noborder"
              pack="far"
              icon-right="phone"
              rounded
            >
              {{ $t('nazovi') }}
            </b-button>
          </div>
        </template>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">E-mail</div>
          <div class="fw600 is-size-55">{{ adminAsPlayer.email }}</div>
        </div>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('telefon') }}</div>
          <div class="fw600 is-size-55">{{ adminAsPlayer.phone }}</div>
        </div>

        <div class="activity__header m-b-10 m-t-30">
          <div class="fw600 is-size-3">{{ $t('postavkeTurnira') }}</div>
        </div>
        <section class="liga__open__info__box">
          <div class="display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('brojSetova') }}</div>
            <div class="fw600 is-size-5">
              {{ cup.playing_sets }}
            </div>
          </div>
          <div class="display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('gemovaPoSetu') }}</div>
            <div class="fw600 is-size-5">
              {{ cup.game_in_set }}
            </div>
          </div>
          <div class="display-data__box">
            <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('zadnjaIgra') }}</div>
            <div class="fw600 is-size-5">
              {{ $t(`tennis.cups.options.lastGame.${cup.last_set}`) }}
            </div>
          </div>

          <template v-if="cup.documents !== undefined">
            <div v-if="cup.documents.length" class="m-b-10 m-t-20">
              <div class="fw600 is-size-3 m-b-10">{{ $t('dokumenti') }}</div>
              <div
                v-for="(item, index) in cup.documents"
                :key="index"
                class="list__documents list__image-col softshadow m-b-10"
              >
                <a :href="item.path" class="align__centar__y w100 document-list">
                  <div class="m-r-10 m-t-10">
                    <b-icon icon="file" size="is-larger" type="is-grey" pack="fal"></b-icon>
                  </div>
                  <div class="list__content m-r-auto doc-icons">
                    <h3 class="fw600 m-b-5">{{ item.title }}</h3>
                  </div>
                  <div class="m-l-auto m-t-10">
                    <b-icon icon="cloud-download" size="is-medium" type="is-primary" pack="fal"></b-icon>
                  </div>
                </a>
              </div>
            </div>
          </template>
        </section>
        <div v-if="cup.description" class="m-t-15 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('napomene') }}</div>
          <!-- eslint-disable-next-line -->
          <div class="has-text-left is-size-6 content-tiny m-t-10" v-html="cup.description"></div>
        </div>
      </b-tab-item>
    </b-tabs>
    <b-modal :active.sync="isModalMembersAddToTournament" :width="640" scroll="clip" class="modal__members">
      <modalMembers
        :show-tennis-school="false"
        :is-doubles="!!cup.is_doubles"
        :title="$t('dodajteIgraa')"
        @player="addRepasagePlayer($event)"
      ></modalMembers>
    </b-modal>
    <b-modal :active.sync="isMatchOptionsModal" :width="640" scroll="clip">
      <modalOptions
        :options="selectedResult"
        :is-doubles="!!cup.is_doubles"
        :is-liga-admin="isLigaAdmin.length ? true : false"
        :title="$t('opcijeMea')"
        :subtitle="$t('Ako je došlo po problema u dogovoru za meč, imate sljedeće opcije:')"
        @update="getLeague()"
        @result="adminResultInput($event)"
        @refresh="getLeague()"
      ></modalOptions>
    </b-modal>
    <b-modal :active.sync="isMyResultPrepopulatedModalActive" :width="640" class="hidescrollbar" scroll="clip">
      <modalResult
        :title="$t('upiiRezultat')"
        :is-doubles="!!cup.is_doubles"
        :partner="opponent"
        :redirect="false"
        :options="{
          prepopulated: true,
          game_id: gameid,
          bothPlayers: partner,
        }"
        @close="getLeague()"
      ></modalResult>
    </b-modal>
    <b-modal :active.sync="isResultPrepopulatedModalActive" class="hidescrollbar" :width="640" scroll="clip">
      <modalResult
        :is-doubles="!!cup.is_doubles"
        :title="$t('upiiRezultat')"
        :redirect="false"
        :options="{ prepopulated: true, game_id: gameid, bothPlayers: adminResultPlayers }"
        @close="getLeague()"
      ></modalResult>
    </b-modal>
    <b-modal :active.sync="showDraw" class="hidescrollbar draw-modal" :width="640" scroll="clip">
      <draw :tournament="cup"></draw>
    </b-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Tournament from '@/models/Tournament'
import TournamentRound from '@/models/TournamentRound'
import Thread from '@/models/Thread'
import Player from '@/models/Player'
import TextMessage from '@/components/messages/textMessage'
import TermMessage from '@/components/messages/termsMessage'
import ImageMessage from '@/components/messages/imageMessage'
import Hero from '~/components/Hero'
import cupLotEmpty from '~/components/cup/CupLotEmpty'
import cupLotPlayed from '~/components/cup/CupLotPlayed'
import modalOptions from '~/components/cup/ModalMatchAdminOptions'
import indicator from '~/components/IndicatorTab'
import modalResult from '~/components/modal/ModalResult'
import adminEdit from '~/components/cup/adminEdit'
import membersSearch from '~/components/membersSearchWithEdit'
import modalMembers from '~/components/modal/ModalMembersAll'
import draw from '~/components/cup/Draw'

export default {
  name: 'Cup',
  components: {
    hero: Hero,
    draw,
    cupLotEmpty,
    modalMembers,
    modalResult,
    cupLotPlayed,
    modalOptions,
    adminEdit,
    indicator,
    membersSearch,
    ImageMessage,
    TermMessage,
    TextMessage,
    TennisImage,
  },
  async fetch() {
    await this.getLeague()
  },
  data() {
    return {
      showDraw: false,
      swipeLoading: false,
      loading: false,
      loading1: false,
      loading2: false,
      loadingMessage: false,
      indicator: {
        tabs: 6,
      },
      playersOrder: [],
      activeTabMain: 0,
      activeTab: 0,
      activeTabRepassage: 0,
      gameid: null,
      isModalMembersAddToTournament: false,
      isCardModalActive: false,
      hasMobileCards: false,
      loadingMessages: false,
      isBordered: false,
      cup: {},
      roundName: '',
      tournamentRound: {},
      isMatchOptionsModal: false,
      partner: {},
      adminResultPlayers: [],
      isResultPrepopulatedModalActive: false,
      isMyResultPrepopulatedModalActive: false,
      selectedResult: '',
      fwd: false,
      messagesLiga: [],
      threadLiga: [],
      tournamentFinals: [],
      losers: [],
      showMiniPop: false,
      adminAsPlayer: {},
      miniPopContent: [
        { name: this.$t('Finale') },
        { name: this.$t('Polufinale') },
        { name: this.$t('Četvrtina finala') },
        { name: this.$t('Osmina finala') },
        { name: this.$t('Šesnaestina finala') },
        { name: this.$t('1/32 finala') },
        { name: this.$t('1/64 finala') },
      ],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin && this.user.admin.includes(this.cup.club_id)
    },
    opponent() {
      const opp = []
      if (Object.keys(this.tournamentRound).length) {
        for (let i = 0; i < this.tournamentRound.games.length; i++) {
          if (this.tournamentRound.games[i].players.length > 1) {
            if (
              this.tournamentRound.games[i].players[0].id === this.user.team.id &&
              this.tournamentRound.games[i].result === null
            ) {
              opp.push(this.tournamentRound.games[i].players[1])
              return opp
            } else if (
              this.tournamentRound.games[i].players[1].id === this.user.team.id &&
              this.tournamentRound.games[i].result === null
            ) {
              opp.push(this.tournamentRound.games[i].players[0])
              return opp
            }
          }
        }
      }
      return opp
    },
    userInCup() {
      return _.filter(this.cup.players, (item) => {
        return item.id === this.user.team.id
      })
    },
    isLigaAdmin() {
      return _.filter(this.cup.admins, (item) => {
        return item.id === this.user.id
      })
    },
    gamesLength() {
      return this.tournamentRound.games.length
    },
    checkIfFinalsSurrender() {
      if (this.tournamentFinals.games[0].result !== null) {
        return this.tournamentFinals.games[0].result.winner
      }
      return false
    },
  },
  watch: {
    activeTab: {
      handler() {
        this.getTournamentRound()
      },
    },
    activeTabMain: {
      immediate: true,
      handler() {
        if (this.cup.status === '5') {
          this.activeTabMain = 2
        }
      },
    },
  },
  methods: {
    submitMessage() {
      this.loadingMessage = true
      Thread.whereIn('players_exact', [this.user.id, this.adminAsPlayer.id])
        .get()
        .then((res) => {
          if (res.data.length) {
            this.$router.push(this.localePath(`/messages/${res.data[0].id}`))
          } else {
            const t = new Thread({ players: [this.adminAsPlayer] })
            t.save().then((res) => {
              this.$router.push(this.localePath(`/messages/${res.id}`))
            })
          }
          this.loadingMessage = false
        })
        .catch(() => {
          this.loadingMessage = false
        })
    },
    getAdmin() {
      Player.find(this.cup.admins[0].id).then((res) => {
        this.adminAsPlayer = res
      })
    },
    createRepassage() {
      this.$buefy.toast.open({
        message: this.$t('Izrada repasaža će malo potrajati'),
        type: 'is-primary',
      })
      this.loading2 = true
      this.cup.status = 2
      this.cup.name = this.cup.name + ' — Re[' + this.activeTab + ']'
      this.cup.id = null
      const c = new Tournament(this.cup)
      c.save()
        .then((res) => {
          const li = new Tournament({ id: res.id })
          li.players()
            .attach({ players: this.losers }, { admins: this.cup.admins })
            .then(() => {
              this.$buefy.toast.open({
                message: this.$t('Uspješno ste spremili novi kup'),
                type: 'is-success',
              })
              this.loading2 = false
              this.$router.push(this.localePath('/cup/' + res.id + '/liga_create'))
            })
        })
        .catch((res) => {
          this.$buefy.toast.open({
            message: this.$t(
              'Došlo je do greške. Provjerite jeste li upisali sve potrebne podatke te pokušajte ponovno'
            ),
            type: 'is-danger',
            duration: 5000,
          })
          this.loading2 = false
        })
    },
    deleteRepasagePlayer(removePlayerId) {
      const index = this.losers.findIndex((item) => {
        return item.id === removePlayerId
      })
      this.losers.splice(index, 1)
    },
    addRepasagePlayer(addPlayer) {
      const index = this.losers.findIndex((item) => {
        return item.id === addPlayer.id
      })
      if (index === -1) {
        this.losers.push(addPlayer)
      }
    },
    losersInRound() {
      const losers = []
      if (Object.keys(this.tournamentRound).length) {
        for (let i = 0; i < this.tournamentRound.games.length; i++) {
          if (this.tournamentRound.games[i].players.length > 1) {
            if (this.tournamentRound.games[i].result !== null) {
              this.tournamentRound.games[i].result.winner
                ? losers.push(this.tournamentRound.games[i].players[0])
                : losers.push(this.tournamentRound.games[i].players[1])
            }
          }
        }
      }
      this.losers = losers
      return losers
    },
    submit() {
      this.cup.status = '5'
      this.cup
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili promjene'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/cup/' + this.cup.id + '/edit'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t(
              'Došlo je do greške. Provjerite jeste li upisali sve potrebne podatke te pokušajte ponovno'
            ),
            type: 'is-danger',
            duration: 5000,
          })
        })
    },
    swipeHandler(direction) {
      if (direction === 'right') {
        this.activeTab--
      } else if (direction === 'left') {
        this.activeTab++
      }
    },
    openReservation(game) {
      this.$router.push({
        path: this.localePath('/courts/reservation'),
        query: { game: game.id, clubid: this.cup.club_id },
      })
    },
    newResult() {
      this.adminResultPlayers.push(this.user)
      this.adminResultPlayers.push(this.opponent)
      this.isMyResultPrepopulatedModalActive = true
    },
    adminResultInput(item) {
      this.adminResultPlayers = item
      this.isResultPrepopulatedModalActive = true
    },
    tabTitle() {
      if (this.cup.rounds.length <= 6) {
        if (this.gamesLength === 1) {
          this.roundName = this.$t('Finale')
        } else if (this.gamesLength === 2) {
          this.roundName = this.$t('Polufinale')
        } else if (this.gamesLength === 4) {
          this.roundName = this.$t('Četvrtina finala')
        } else if (this.gamesLength === 8) {
          this.roundName = this.$t('Osmina finala')
        } else if (this.gamesLength === 16) {
          this.roundName = this.$t('Šesnaestina finala')
        } else if (this.gamesLength === 32) {
          this.roundName = this.$t('Prvo kolo')
        }
      } else if (this.cup.rounds.length === 7) {
        if (this.gamesLength === 64) {
          this.roundName = this.$t('Prvo kolo')
        } else if (this.gamesLength === 32) {
          this.roundName = this.$t('Drugo kolo')
        }
      } else if (this.cup.rounds.length === 8) {
        if (this.gamesLength === 128) {
          this.roundName = this.$t('Prvo kolo')
        } else if (this.gamesLength === 64) {
          this.roundName = this.$t('Drugo kolo')
        } else if (this.gamesLength === 32) {
          this.roundName = this.$t('Treće kolo')
        }
      }
    },
    openMatchAdmin(item) {
      this.selectedResult = item
      this.isMatchOptionsModal = true
    },
    getLeague() {
      Tournament.include(['admins', 'players', 'rounds', 'documents', 'thread'])
        .find(this.$route.params.id)
        .then((res) => {
          if (res.winner === undefined) {
            res.winner = { description: '', image: null, new_image: null }
          }
          this.cup = res
          this.getTournamentRound()
          this.getTournamentFinals()
          this.getMessagesCup()
          this.getAdmin()
        })
    },
    getTournamentRound() {
      this.swipeLoading = true
      if (this.fwd) {
        this.loading = true
      } else {
        this.loading1 = true
      }
      TournamentRound.include(['games'])
        .params({ seed: 1 })
        .find(this.cup.rounds[this.activeTab].id)
        .then((res) => {
          this.swipeLoading = false
          this.tournamentRound = res
          this.tabTitle()
          this.losersInRound()
          this.loading = false
          this.loading1 = false
        })
        .catch(() => {
          this.swipeLoading = false
          this.loading = false
          this.loading1 = false
        })
    },
    getTournamentFinals() {
      const lastRound = this.cup.rounds.length
      TournamentRound.include(['games'])
        .find(this.cup.rounds[lastRound - 1].id)
        .then((res) => {
          this.tournamentFinals = res
        })
    },
    submitMessageCup() {
      this.loadingMessages = true
      const t = new Thread({
        id: this.cup.thread.id,
        message: this.$t('Dobrodošli u kup') + ' ' + this.cup.name + ' ' + this.$t('možete razmijenjivati poruke'),
        title: this.cup.id + '-' + this.cup.name + '2',
      })
      t.save()
        .then((res) => {
          this.$router.push(this.localePath(`/messages/${res.id}`))
          this.loadingMessages = false
        })
        .catch(() => {
          this.loadingMessages = false
        })
    },
    getMessagesCup() {
      this.thread = new Thread({ id: this.cup.thread.id })
      this.thread
        .messages()
        .limit(10)
        .get()
        .then((res) => {
          this.messagesLiga = res.data.reverse()
        })
    },
    test(e, location) {
      this.$set(this.newCup, location, e)
    },
    playerList(data) {
      this.$set(this.newCup, 'playerList', data)
    },
  },
}
</script>
<style scoped>
h1 {
  text-transform: initial;
}
</style>
