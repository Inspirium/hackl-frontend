<template>
  <div v-if="term.players" v-touch:swipe="swipeHandler" class="show_tab_navigation">
    <PageHeader
      :close-function="true"
      :title="isTermPaid ? $t('Plaćeno!') : isTermPartialyPaid ? $t('Djelomično plaćeno') : $t('Naplata termina')"
      :background="isTermPaid ? 'green' : isTermPartialyPaid ? 'is-orange' : ''"
      @back="cancel()"
    ></PageHeader>
    <template v-if="loading">
      <transition name="fade">
        <div class="align__centar__x loading_z_spinner--bottom m-t-20">
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
    </template>

    <div v-if="isLoaded && !loading" class="x-container p-b-150 m-t-10">
      <div v-if="reservation.payment_user !== null && reservation.is_paid" class="align__centar__all m-t-10">
        <div class="fw600 is-size-6 m-l-5 has-text-black80">{{ $t('unos') }}</div>
        <TennisImage
          :size="[52, 52]"
          class="user_image-mediumsmall m-r-10 m-l-10 border__white--2"
          :src="reservation.payment_user.image"
        />
        <div class="player__name is-size-6 has-text-black80">
          {{ reservation.payment_user.display_name }}
        </div>
      </div>

      <!--    show if paid-->
      <div v-if="isTermPaid" class="activity__reservation">
        <div
          class="activity x-container m-b--5 m-t-20 p-t-10 p-b-10 statistics_new softshadow"
          :class="{ green: isTermPaid, 'has-text-white': isTermPaid }"
        >
          <div class="flex align__centar__all">
            <img class="w26 h26" src="/reservation.svg" alt="" />
            <div class="fw600 m-l-10">{{ termDisplay }}</div>
          </div>

          <div class="w100 m-t-7 m-b-5" :class="[!isTermPaid ? 'divider-line-1' : 'divider-line-1-white']"></div>
          <div
            class="has-text-centered fw600 is-size-6 has-text-lightblue m-l-auto m-r-auto m-b--20 m-t-5 w100"
            :class="{ 'has-text-white': isTermPaid }"
          >
            {{ $t('ukupnaCijena2') }}
          </div>
          <div class="has-text-centered fw600 is-size-2 m-l-auto m-r-auto m-t-10 m-b-0">
            {{ reservation.payments.length !== reservation.prices.length ? totalPricePaid : totalPrice }}
          </div>
          <template v-if="selected_payee.length > 1">
            <div
              class="has-text-centered fw600 is-size-65 has-text-black50 m-l-auto m-r-auto w100 is-bckg p-t-4 p-b-4"
              :class="{ 'has-text-white': isTermPaid }"
            >
              {{ $t('razradaPlaanja') }}
            </div>
            <div class="action__buttons w100 p-l-5 p-r-5" :class="{ 'm-b--10': selected_payee.length > 1 }">
              <div v-for="(player, index) in selected_payee" :key="player.id + index" class="action__item__small fw600">
                <div class="m-l--16 flex__column">
                  <div class="has-text-black80">{{ player.display_name }}</div>
                </div>
                <div class="m-l-auto has-text-right m-r--15">
                  <span class="has-text-black30 is-size-65">{{ player.id + ' €/' + selected_payee.length }}</span>
                  <span>{{ (' = ' + player.id / selected_payee.length) | currency }}</span>
                </div>
              </div>
            </div>
          </template>
          <template v-if="isTermPaid">
            <div class="divider-line-1-white w100 m-b-5" />
            <div
              v-if="paymentReceiverAdmin?.image"
              class="w100 fw600 is-size-45 has-text-centered flex align__centar__all"
            >
              <TennisImage
                :size="[32, 32]"
                :src="paymentReceiverAdmin.image"
                class="user_image-small m-r-10 border__white"
                alt=""
              />
              <div class="fw600 is-size-45 has-text-centered flex align__centar__all">
                {{ paymentReceiverAdmin.display_name }}
              </div>
            </div>
            <div class="divider-line-1-white w100 m-b-5 m-t-5" />

            <div v-if="reservation.payment_date !== null" class="fw600 is-size-6 m-l-5 m-t-5 m-b-10 has-text-white">
              <span class="has-text-white">{{ $t('uplaeno') }} </span
              >{{ $moment(reservation.payment_date).format('dddd' + ', ' + 'DD' + '.' + 'MM' + '.') }}
            </div>
          </template>
        </div>
        <div v-if="true" class="activity__box action__buttons">
          <div v-for="(player, index) in filterPlayers" :key="player.id + index" class="action__item__small fw600">
            <TennisImage :size="[32, 32]" :src="player.image" class="user_image-small m-r-10 border__white" alt="" />
            <div class="flex__column" @click="$router.push(localePath('/player/' + player.id))">
              <div class="fw600 is-size-55">{{ player.display_name }}</div>
              <div v-if="filterCorrectMembership(player)" class="fw600 is-size-65 has-text-lightblue flex">
                {{ filterCorrectMembership(player) }}
              </div>
              <div v-else class="fw600 is-size-65 has-text-lightblue flex">{{ $t('nijeLan') }}</div>
              <!--              <p>{{ player.id }}</p>-->
              <!--              <p>{{ findPlayersPaymentInfo(player.id) }}</p>-->
              <template v-if="findPlayersPaymentInfo(player.id).length">
                <div class="fw600 is-size-6 has-text-black50 flex align__centar__y m-t-3">
                  {{ $t(findPlayersPaymentInfo(player.id)[0].data.payment_method) }}
                  <span class="has-text-black50 m-l-5">{{
                    findPlayersPaymentInfo(player.id)[0].amount | currency
                  }}</span>
                </div>
                <div
                  v-if="findPlayersPaymentInfo(player.id)[0].data.note"
                  class="fw600 is-size-65 has-text-black50 flex align__centar__y"
                >
                  {{ $t('napomena2', { note: findPlayersPaymentInfo(player.id)[0].data.note }) }}
                </div>
                <div
                  v-if="findPlayersPaymentInfo(player.id)[0].data.payment_fiskal !== null"
                  class="fw600 is-size-65 has-text-black50 flex align__centar__y"
                >
                  {{
                    $t('brojFiskalnogRauna2', {
                      payment_fiskal: findPlayersPaymentInfo(player.id)[0].data.payment_fiskal,
                    })
                  }}
                </div>
              </template>
            </div>
            <div v-if="isTermPaid && findPlayersPaymentInfo(player.id).length" class="buttons m-l-auto m-t-5">
              <b-button
                :class="{
                  softshadow: true,
                  'invert-small-button': true,
                  active: true,
                }"
                :type="{
                  'is-smaller': true,
                  noborder__small: true,
                  'is-danger has-text-white': true,
                }"
                pack="fal"
                rounded
                @click="checkWhatDelete(player)"
              >
                {{ $t('storniraj') }}
              </b-button>
            </div>
          </div>
        </div>
      </div>

      <!--    show if not paid-->
      <template v-if="!isTermPaid && true">
        <div class="m-t-20">
          <div class="">
            <template v-if="isAdmin">
              <div class="">
                <div v-if="clubPaymentBoth" class="buttons m-t-20">
                  <b-button
                    :class="{ softshadow: true, 'invert-small-button': paymentMethod === 'cash' }"
                    :type="{
                      'is-small': true,
                      noborder: true,
                      'is-primary has-text-white': paymentMethod === 'cash',
                    }"
                    pack="fal"
                    rounded
                    @click.prevent="paymentMethod = 'cash'"
                  >
                    {{ $t('gotovina') }}
                  </b-button>
                  <b-button
                    v-if="club.payment_accontation"
                    :class="{ softshadow: true, 'invert-small-button': paymentMethod === 'acc' }"
                    :type="{
                      'is-small': true,
                      noborder: true,
                      'is-primary has-text-white': paymentMethod === 'acc',
                    }"
                    pack="fal"
                    rounded
                    @click.prevent="paymentMethod = 'acc'"
                  >
                    {{ $t('akontacija') }}
                  </b-button>
                  <b-button
                    v-if="club.payment_online"
                    :class="{ softshadow: true, 'invert-small-button': paymentMethod === 'card' }"
                    :type="{
                      'is-small': true,
                      noborder: true,
                      'is-primary has-text-white': paymentMethod === 'card',
                    }"
                    pack="fal"
                    rounded
                    @click.prevent="
                      paymentMethod = 'card'
                      singleOrSplit('single')
                    "
                  >
                    {{ $t('Kartica') }}
                  </b-button>
                </div>
                <div v-else class="fw600 is-size-4 w100 has-text-centered has-text-black80 m-t--5">
                  {{ $t('cash') }}
                </div>
                <div v-if="clubPaymentBoth" class="divider-line-1 m-t--15"></div>
              </div>
              <div v-if="term.players.length > 1 && !isTermPartialyPaid" class="buttons m-t-20">
                <b-button
                  :class="{ softshadow: true, 'invert-small-button': !split }"
                  :type="{
                    'is-small': true,
                    noborder: true,
                    'is-primary has-text-white': !split,
                  }"
                  pack="fal"
                  rounded
                  @click.prevent="singleOrSplit('single')"
                >
                  {{ $t('jedanPlatitelj') }}
                </b-button>
                <b-button
                  v-if="paymentMethod !== 'card'"
                  :class="{ softshadow: true, 'invert-small-button': split }"
                  :type="{
                    'is-small': true,
                    noborder: true,
                    'is-primary has-text-white': split,
                  }"
                  pack="fal"
                  rounded
                  @click.prevent="singleOrSplit('multi')"
                >
                  {{ $t('razdijeliRaun') }}
                </b-button>
              </div>
              <div v-if="term.players.length > 1 && !split && !isTermPartialyPaid" class="divider-line-1 m-t--15"></div>
              <div v-if="term.players.length > 1 && !split && !isTermPartialyPaid" class="buttons m-t-20">
                <b-button
                  :class="{ softshadow: true, 'invert-small-button': !payAll }"
                  :type="{
                    'is-small': true,
                    noborder: true,
                    'is-primary has-text-white': !payAll,
                  }"
                  pack="fal"
                  rounded
                  @click.prevent="payAll = false"
                >
                  {{ $t('Samo dio računa') }}
                </b-button>

                <b-button
                  :class="{ softshadow: true, 'invert-small-button': payAll }"
                  :type="{
                    'is-small': true,
                    noborder: true,
                    'is-primary has-text-white': payAll,
                  }"
                  pack="fal"
                  rounded
                  @click.prevent="payAll = true"
                >
                  {{ $t('naplatiCijeliRaun') }}
                </b-button>
              </div>
              <div v-if="!isTermPartialyPaid && term.players.length > 1" class="divider-line-1 m-t--15"></div>
            </template>
            <!--            <template v-else>-->
            <!--              <template v-if="clubPaymentBoth">-->
            <!--                <div class="has-text-black80 fw600 is-size-5 p-l-10 p-r-10 has-text-centered line-height-22 m-t&#45;&#45;5">-->
            <!--                  {{ $t('odaberiNainPlaanja') }}-->
            <!--                </div>-->
            <!--              </template>-->

            <!--              <div v-if="clubPaymentBoth" class="buttons m-t-15 m-b-5">-->
            <!--                <b-button-->
            <!--                  :class="{ softshadow: true, 'invert-small-button': paymentMethod === 'acc' }"-->
            <!--                  :type="{-->
            <!--                    'is-small': true,-->
            <!--                    noborder: true,-->
            <!--                    'is-primary has-text-white': paymentMethod === 'acc',-->
            <!--                  }"-->
            <!--                  pack="fal"-->
            <!--                  rounded-->
            <!--                  @click.prevent="paymentMethod = 'acc'"-->
            <!--                >-->
            <!--                  {{ $t('akontacijom') }}-->
            <!--                </b-button>-->
            <!--                <b-button-->
            <!--                  :class="{ softshadow: true, 'invert-small-button': paymentMethod === 'card' }"-->
            <!--                  :type="{-->
            <!--                    'is-small': true,-->
            <!--                    noborder: true,-->
            <!--                    'is-primary has-text-white': paymentMethod === 'card',-->
            <!--                  }"-->
            <!--                  pack="fal"-->
            <!--                  rounded-->
            <!--                  @click.prevent="paymentMethod = 'card'"-->
            <!--                >-->
            <!--                  {{ $t('karticom') }}-->
            <!--                </b-button>-->
            <!--                <div class="divider-line-1 m-t-5 w100 m-b-10"></div>-->
            <!--              </div>-->

            <!--              <div-->
            <!--                v-if="userClubWallet.length && paymentMethod === 'accontation'"-->
            <!--                class="fw600 is-size-6 has-text-white has-text-centered m-b-15"-->
            <!--              >-->
            <!--                {{ $t('stanjeAkontacijskogRauna') }}-->
            <!--              </div>-->

            <!--              <div-->
            <!--                v-if="user.wallets.length && userClubWallet.length && paymentMethod === 'accontation'"-->
            <!--                class="fw600 has-text-centered is-size-3 has-text-black30 m-t&#45;&#45;15"-->
            <!--                :class="[userClubWallet[0].amount > 0 ? 'has-text-white' : 'has-text-danger']"-->
            <!--              >-->
            <!--                <span v-if="userClubWallet.length" class="m-l-5 has-text-centered"-->
            <!--                  >{{ $t('key5', { currency: userClubWallet[0].amount }) | currency }}-->
            <!--                </span>-->
            <!--              </div>-->

            <!--              <div v-if="term.players.length > 1" class="buttons m-t-10 m-b-5">-->
            <!--                <b-button-->
            <!--                  :class="{ softshadow: true, 'invert-small-button': !payAll }"-->
            <!--                  :type="{-->
            <!--                    'is-small': true,-->
            <!--                    noborder: true,-->
            <!--                    'is-primary has-text-white': !payAll,-->
            <!--                  }"-->
            <!--                  pack="fal"-->
            <!--                  rounded-->
            <!--                  @click.prevent="payAll = false"-->
            <!--                >-->
            <!--                  {{ $t('platiSvojDio') }}-->
            <!--                </b-button>-->
            <!--                <b-button-->
            <!--                  :class="{ softshadow: true, 'invert-small-button': payAll }"-->
            <!--                  :type="{-->
            <!--                    'is-small': true,-->
            <!--                    noborder: true,-->
            <!--                    'is-primary has-text-white': payAll,-->
            <!--                  }"-->
            <!--                  pack="fal"-->
            <!--                  rounded-->
            <!--                  @click.prevent="payAll = true"-->
            <!--                >-->
            <!--                  {{ $t('platiSve') }}-->
            <!--                </b-button>-->
            <!--              </div>-->
            <!--              <div class="divider-line-1 m-t-1"></div>-->
            <!--            </template>-->
            <div class="fw600 is-size-6 has-text-black80 has-text-centered m-b-10 m-t-7">
              {{ $t('popisIgraaNaRezervaciji') }}
            </div>
            <div class="activity__reservation">
              <div class="activity__box action__buttons">
                <div
                  v-for="(player, index) in filterPlayers"
                  :key="player.id + index"
                  class="action__item__small fw600 payment_accontation"
                  :class="{ selected_payee: isSelected(player), selected_payee_paid: isPlayerPaid(player) }"
                >
                  <TennisImage
                    :size="[42, 42]"
                    :src="player.image"
                    class="user_image-small m-r-10 m-l--5 border__white"
                    alt=""
                  />
                  <div class="flex__column">
                    <div class="has-text-black80 is-size-55">{{ player.display_name }}</div>
                    <template>
                      <div
                        v-if="filterCorrectMembership(player)"
                        class="fw600 is-size-65 has-text-lightblue m-t--2 flex"
                      >
                        {{ filterCorrectMembership(player) }}
                      </div>
                      <div v-else class="fw600 is-size-65 has-text-lightblue m-t--2 flex">{{ $t('nijeLan') }}</div>

                      <template v-if="showAccOrCashMenu">
                        <div v-if="player.wallets.length" class="fw600 is-size-65 has-text-black30 m-t--2 flex">
                          {{ $t('stanjeRauna') }}
                          <span
                            class="m-l-5"
                            :class="[
                              player.wallets[0].amount > 0
                                ? 'has-text-black80'
                                : 'has-text-danger is-white rounded-md p-l-5 p-r-5',
                            ]"
                            >{{ player.wallets[0].amount | currency }}
                          </span>
                        </div>

                        <div v-else class="fw600 is-size-65 has-text-black30 m-t--2">
                          {{ $t('nemaAkontacijskiRaun') }}
                        </div>
                      </template>
                      <div
                        v-if="isPlayerPaid(player)"
                        class="fw600 has-text-white is-size-65 m-t-4 flex align__centar__y"
                      >
                        <b-icon icon="check-circle" type="is-white" pack="fal" class="m-r-7"> </b-icon>
                        {{ $t('plaeno') }}
                      </div>
                      <div v-if="findPlayersPaymentInfo(player.id)[0]" class="has-text-black80">
                        {{ $t(findPlayersPaymentInfo(player.id)[0].data?.payment_method) }}
                      </div>
                    </template>
                  </div>

                  <div v-if="!(!split && isSelected(player))" class="buttons m-l-auto">
                    <b-button
                      v-if="!isPlayerPaid(player)"
                      :class="{
                        softshadow: true,
                        'invert-small-button': !isSelected(player),
                        active: !isSelected(player),
                      }"
                      :type="{
                        'is-smaller': true,
                        noborder__small: true,
                        'is-primary has-text-white': !isSelected(player),
                      }"
                      pack="fal"
                      rounded
                      @click.prevent="selectIt(player, index)"
                    >
                      {{ isSelected(player) ? $t('platitelj') : $t('Odaberi') }}
                    </b-button>
                    <div v-else class="buttons m-l-auto m-t-5">
                      <b-button
                        :class="{
                          softshadow: true,
                          'invert-small-button': true,
                          active: true,
                        }"
                        :type="{
                          'is-smaller': true,
                          noborder__small: true,
                          'is-danger has-text-white': true,
                        }"
                        pack="fal"
                        rounded
                        @click="checkWhatDelete(player)"
                      >
                        {{ $t('storniraj') }}
                      </b-button>
                    </div>
                  </div>
                  <div v-if="!split && isSelected(player)" class="buttons m-l-auto">
                    <b-button
                      :class="{
                        softshadow: true,
                        'invert-small-button': !isSelected(player),
                        active: !isSelected(player),
                      }"
                      icon-right="check"
                      :type="{
                        'is-smaller': true,
                        noborder__small: true,
                        'is-primary has-text-white': !isSelected(player),
                      }"
                      pack="fal"
                      rounded
                      @click.prevent="selectIt(player, index)"
                    >
                      {{ $t('platitelj') }}
                    </b-button>
                  </div>
                </div>
              </div>
            </div>

            <!--            Summary-->
            <div
              v-if="selected_payee.length || isTermPaid"
              class="activity x-container m-b--5 m-t-20 p-t-10 p-b-10 statistics_new softshadow"
              :class="{ green: isTermPaid, 'has-text-white': isTermPaid }"
            >
              <div class="flex align__centar__all">
                <img class="w26 h26" src="/reservation.svg" alt="" />
                <div class="fw600 m-l-10">{{ termDisplay }}</div>
              </div>

              <div class="w100 m-t-7 m-b-5" :class="[!isTermPaid ? 'divider-line-1' : 'divider-line-1-white']"></div>
              <div
                class="has-text-centered fw600 is-size-6 has-text-lightblue m-l-auto m-r-auto m-b--20 m-t-5 w100"
                :class="{ 'has-text-white': isTermPaid }"
              >
                {{ $t('ukupnaCijena2') }}
              </div>
              <div class="has-text-centered fw600 is-size-2 m-l-auto m-r-auto m-t-10 m-b-0">
                {{ totalPrice }}
              </div>
              <template v-if="selected_payee.length > 0 || isTermPaid">
                <div
                  class="has-text-centered fw600 is-size-65 has-text-black50 m-l-auto m-r-auto w100 is-bckg p-t-4 p-b-4"
                  :class="{ 'has-text-white': isTermPaid }"
                >
                  {{ $t('razradaPlaanja') }}
                </div>
                <!--                For single players-->
                <div v-if="!isDoubles" class="action__buttons w100 p-l-5 p-r-5 m-b--10">
                  <div
                    v-for="(player, index) in reservation.players"
                    :key="player.id + index"
                    class="action__item__small fw600"
                  >
                    <div class="m-l--16 flex__column">
                      <div class="has-text-black80">
                        {{ player.display_name }}
                        <b-icon
                          v-if="split || payAll || (!payAll && player.players[0].id === selected_payee[0].id)"
                          class="m-r-10"
                          type="is-success"
                          pack="fal"
                          size="is-small-9"
                          icon="check"
                        >
                        </b-icon>
                      </div>
                    </div>
                    <div class="m-l-auto has-text-right m-r--15">
                      <span v-if="reservation.players.length > 0" class="has-text-black30 is-size-65"
                        >{{
                          Math.round(reservation.prices[index] * reservation.prices.length * 100) / 100 +
                          ' €/' +
                          reservation.players.length
                        }}
                        {{ $t('igrača') }}</span
                      >
                      <span>
                        =
                        {{
                          ((reservation.prices[index] * reservation.prices.length) / reservation.players.length)
                            | currency
                        }}</span
                      >
                    </div>
                  </div>
                </div>
                <!--                For doubles-->
                <div v-else class="action__buttons w100 p-l-5 p-r-5 m-b--10">
                  <div
                    v-for="(player, index) in filterPlayers"
                    :key="player.id + index"
                    class="action__item__small fw600"
                  >
                    <div class="m-l--16 flex__column">
                      <div class="has-text-black80">
                        {{ player.display_name }}
                        <b-icon
                          v-if="split || payAll || (!payAll && player.id === selected_payee[0].id)"
                          class="m-r-10"
                          type="is-success"
                          pack="fal"
                          size="is-small-9"
                          icon="check"
                        >
                        </b-icon>
                      </div>
                    </div>
                    <div class="m-l-auto has-text-right m-r--15">
                      <span v-if="filterPlayers.length > 0" class="has-text-black30 is-size-65"
                        >{{
                          Math.round(reservation.prices[index] * reservation.prices.length) +
                          ' €/' +
                          filterPlayers.length
                        }}
                        {{ $t('igrača') }}</span
                      >
                      <span>
                        =
                        {{
                          ((reservation.prices[index] * reservation.prices.length) / filterPlayers.length) | currency
                        }}</span
                      >
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="isTermPaid">
                <div class="divider-line-1-white w100 m-b-5" />
                <div class="w100 fw600 is-size-45 has-text-centered flex align__centar__all">
                  {{ $t('terminJePlaen') }} <b-icon class="m-l-5" icon="check" size="is-medium" pack="fal"></b-icon>
                </div>
                <div class="divider-line-1-white w100 m-b-5 m-t-5" />

                <div v-if="reservation.payment_date !== null" class="fw600 is-size-6 m-l-5 m-t-5 m-b-10 has-text-white">
                  <span class="has-text-white">{{ $t('uplaeno') }} </span
                  >{{ $moment(reservation.payment_date).format('dddd' + ', ' + 'DD' + '.' + 'MM' + '.') }}
                </div>
              </template>
            </div>
            <template v-if="paymentMethod === 'cash'">
              <div class="label">{{ $t('brojFiskalnogRauna') }}</div>
              <ValidationProvider v-slot="{ errors }" name="Napomena">
                <b-field class="login__input__container has-text-black80" :message="errors">
                  <b-input v-model="payment_fiskal" :placeholder="$t('brojFiskalnogRauna')" type="text" rounded>
                  </b-input>
                </b-field>
              </ValidationProvider>
            </template>
            <div class="label">{{ $t('napomena') }}</div>
            <ValidationProvider v-slot="{ errors }" name="Napomena">
              <b-field class="login__input__container has-text-black80" :message="errors">
                <b-input v-model="note" :placeholder="$t('napomena')" type="text" rounded> </b-input>
              </b-field>
            </ValidationProvider>
            <template v-if="paymentMethod === 'cash'">
              <div class="divider-line-1 m-t-20"></div>
              <div class="has-text-centered m-t-20 m-b-20">
                <div class="label--center">{{ $t('Izradi gotovinski račun') }}</div>
                <div class="radio__box--smaller">
                  <div class="block">
                    <b-radio v-model="receipt" type="is-danger" :native-value="false">
                      {{ $t('ne') }}
                    </b-radio>
                    <b-radio v-model="receipt" type="is-success" :native-value="true">
                      {{ $t('da') }}
                    </b-radio>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="paymentMethod === 'card' || (paymentMethod === 'cash' && receipt)">
              <div class="has-text-centered m-t-20 m-b-20">
                <div class="label--center">{{ $t('Želite li R1 račun?') }}</div>
                <div class="radio__box--smaller">
                  <div class="block">
                    <b-radio v-model="is_business_invoice" type="is-danger" :native-value="false">
                      {{ $t('ne') }}
                    </b-radio>
                    <b-radio v-model="is_business_invoice" type="is-success" :native-value="true">
                      {{ $t('da') }}
                    </b-radio>
                  </div>
                </div>
              </div>
              <transition name="fade">
                <payment-company v-if="is_business_invoice" :invert="false" @update="selected_company = $event" />
              </transition>
            </template>
          </div>
        </div>

        <div class="buttons is-fixed">
          <b-button class="m-l-10 fw600" type="is-danger" pack="fal" icon-right="times" rounded @click="cancel()">
            {{ $t('otkai') }}
          </b-button>
          <b-button
            :loading="loading"
            class="m-l-10 fw600"
            type="is-primary"
            pack="fal"
            icon-right="check"
            rounded
            @click="makePayment()"
          >
            {{ $t('Naplati') }}
          </b-button>
        </div>
      </template>

      <div v-if="isTermPaid" class="buttons m-t-20 m-l--5 m-t-30">
        <b-button
          class="m-l-10 fw600"
          type="is-primary"
          pack="fal"
          icon-left="chevron-left"
          rounded
          @click="$emit('close')"
        >
          {{ $t('nazad') }}
        </b-button>
      </div>
    </div>
    <b-modal :active.sync="showStripe" :width="640" scroll="clip" class="z200" @close="$emit('close')">
      <modal-payment-stripe :secret="clientSecret" />
    </b-modal>
    <b-modal :active.sync="isModalConfirmActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('Upozorenje')"
        :subtitle="
          $t(
            'Uplate preko kartice moguće je samo stornirati na način da se iznos uplate vrati na akontacijski račun. Želite li nastaviti?'
          )
        "
        @update="deletePaymentRefundCard()"
      ></modalConfirmation>
    </b-modal>
  </div>
</template>

<script>
// import _ from 'lodash'
// import WalletTransaction from '@/models/WalletTransaction'
import TennisImage from '@/components/TennisImage.vue'
import Reservation from '~/models/Reservation'
import ReservationPayment from '~/models/ReservationPayment'
import PageHeader from '~/components/headers/blankBack'
import Player from '~/models/Player'
import modalConfirmation from '~/components/modal/ModalConfirmation'

export default {
  name: 'CourtPaymentTerm',
  components: {
    PageHeader,
    TennisImage,
    modalConfirmation,
  },
  props: {
    term: {
      type: Object,
      required: true,
      default() {
        return {}
      },
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      activeTabPayment: 0,
      is_business_invoice: false,
      isModalConfirmActive: false,
      loading: false,
      isLoaded: false,
      edit: false,
      is_paid: false,
      payment_invoice: null,
      payment_note: null,
      reservation: {},
      markAsPaid: false,
      split: false,
      selected_payee: [],
      cash: false,
      transaction: {
        player: {},
        amount: null,
      },
      note: '',
      payAll: false,
      payment_fiskal: null,
      paymentReceiverAdmin: {},
      showStripe: false,
      receipt: false,
      clientSecret: '',
      paymentMethod: 'cash',
      selectedPlayerForRefund: '',
      selected_company: {},
    }
  },
  computed: {
    clubPaymentBoth() {
      return this.club.payment_accontation === 1 || this.club.payment_online === 1
    },
    userClubWallet() {
      return this.user.wallets.filter((item) => {
        return item.club_id === this.club.id
      })
    },
    showAccOrCashMenu() {
      if (this.club.payment_accontation === 0) {
        return false
      } else {
        return true
      }
    },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    memberships() {
      return this.$store.state.club.memberships
    },
    termDisplay() {
      return (
        this.reservation.court.name +
        ', ' +
        this.$moment(this.reservation.from).format('DD.MM') +
        ', ' +
        this.$moment(this.reservation.from).format('HH.mm') +
        ' — ' +
        this.$moment(this.reservation.to).format('HH.mm') +
        'h'
      )
    },
    filterPlayers() {
      const allPlayers = []
      for (let i = 0; i < this.reservation.players.length; i++) {
        for (let p = 0; p < this.reservation.players[i].players.length; p++) {
          allPlayers.push(this.reservation.players[i].players[p])
        }
      }
      return allPlayers
    },
    totalPricePaid() {
      if (this.reservation.payments.length) {
        const sum = this.reservation.payments.reduce((acc, val) => {
          return acc + val.amount
        }, 0)
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(sum)
      }
      return 0
    },
    totalPrice() {
      if (this.split || (!this.split && this.payAll)) {
        let x = null
        for (let i = 0; i < this.reservation.prices.length; i++) {
          const y = (this.reservation.prices[i] * this.reservation.prices.length) / this.reservation.prices.length
          x = x + y
        }
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(x)
      } else {
        const sum = this.selected_payee.reduce((acc, val) => {
          return acc + val.price
        }, 0)
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(sum)
      }
    },
    isTermPaid() {
      if (this.is_paid) {
        return true
      }
      return false
    },
    // isTermPaidOld() {
    //   if (this.reservation.payments !== undefined) {
    //     if (this.reservation.players.length <= this.reservation.payments.length) {
    //       return true
    //     }
    //   }
    //   return false
    // },
    isTermPartialyPaid() {
      if (this.reservation.payments !== undefined) {
        if (this.reservation.payments.length < this.reservation.players.length && this.reservation.payments.length) {
          return true
        }
      }
      return false
    },
    // isTermPartialyPaidOld() {
    //   if (this.reservation.payments !== undefined) {
    //     if (this.reservation.payments.length < this.reservation.players.length && this.reservation.payments.length) {
    //       return true
    //     }
    //   }
    //   return false
    // },
    isDoubles() {
      if (this.reservation.players[0].players.length > 1) {
        return true
      }
      return false
    },
  },
  watch: {
    term() {
      this.getReservation()
    },
    payment_invoice() {
      if (this.payment_invoice === null) {
        this.is_paid = false
        this.markAsPaid = false
      } else {
        this.is_paid = true
        this.markAsPaid = true
      }
    },
  },
  mounted() {
    this.is_paid = false
    this.receipt = false
    this.payment_invoice = null
    this.note = ''
    if (this.club.payment_accontation === 0 && this.club.payment_online === 0) {
      this.paymentMethod = 'cash'
    }
    if (this.club.payment_accontation === 0 && this.club.payment_online) {
      this.paymentMethod = 'cash'
    }
  },
  methods: {
    filterCorrectMembership(player) {
      if (this.term.type === 'school_group') {
        return false
      }
      const x = this.term.players.filter((item) => {
        return item.id === player.id
      })
      return x[0].membership
    },
    onePlayerOnly() {
      if (this.reservation.players.length === 1) {
        this.selected_payee = this.filterPlayers[0]
        this.selectIt(this.selected_payee, 0)
        this.isSelected(this.selected_payee[0])
      }
      return false
    },
    paymentReceiver() {
      if (this.isTermPaid) {
        Player.find(this.reservation.payments[0].receiver_id).then((res) => {
          this.paymentReceiverAdmin = res
          this.isLoaded = true
        })
      } else {
        this.isLoaded = true
      }
    },
    findPlayersPaymentInfo(id) {
      return this.reservation.payments.filter((item) => {
        return item.user_id === id
      })
    },

    swipeHandler(direction) {
      if (direction === 'right') {
        this.cancel()
      }
    },
    cancel() {
      this.selected_payee = []
      this.$emit('close')
    },
    isSelected(item) {
      const x = this.selected_payee.filter((player) => {
        return player.id === item.id
      })
      if (x.length) {
        return true
      }
      return false
    },
    selectIt(item, index) {
      if (this.split) {
        return
      }
      this.selected_payee = []
      this.selected_payee.push(item)
      this.selected_payee[0].price = this.reservation.prices[index]
    },
    singleOrSplit(type) {
      if (type === 'single') {
        this.split = false
        this.selected_payee = []
      } else {
        this.split = true
        this.selected_payee = []
        // Push price for the user
        if (this.isDoubles) {
          for (let i = 0; i < this.reservation.players.length; i++) {
            this.selected_payee.push(this.reservation.players[i].players[0])
            this.selected_payee.push(this.reservation.players[i].players[1])
            this.selected_payee[i].price = this.reservation.prices[i]
          }
        } else {
          for (let i = 0; i < this.reservation.players.length; i++) {
            this.selected_payee.push(this.reservation.players[i].players[0])
            this.selected_payee[i].price = this.reservation.prices[i]
          }
        }
      }
    },
    getReservation() {
      this.reservation = {}
      this.loading = true
      Reservation.include('payments')
        .find(this.term.id)
        .then((res) => {
          this.loading = false
          this.reservation = res
          this.selected_payee = []
          if (res.payment_invoice !== null) {
            this.edit = true
            this.payment_note = res.payment_note
          }
          this.is_paid = res.is_paid
          this.payment_invoice = res.payment_invoice
          this.paymentReceiver()
          this.onePlayerOnly()
        })
    },
    deletePayment(id) {
      let forAnotherMemeberReservation = false
      if (this.findPlayersPaymentInfo(id)[0] === undefined) {
        forAnotherMemeberReservation = true
      }
      const r = new Reservation({
        id: this.reservation.id,
      })
      const p = forAnotherMemeberReservation
        ? new ReservationPayment(this.reservation.payments[0])
        : new ReservationPayment(this.findPlayersPaymentInfo(id)[0])
      p.for(r)
        .delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste stornirali uplatu'),
            type: 'is-success',
          })
          this.note = ''
          this.payment_fiskal = null
          this.markAsPaid = false
          this.$emit('close')
        })
        .catch(() => {
          this.$parent.close()
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
        })
    },
    isPlayerPaid(player) {
      const x = this.reservation.payments.filter((item) => {
        return item.user_id === player.id && item.paid_at
      })
      return !!x.length
    },
    checkWhatDelete(player) {
      if (this.isPlayerPaid(player)) {
        if (this.findPlayersPaymentInfo(player.id)[0].data?.payment_method === 'card') {
          this.selectedPlayerForRefund = player.id
          this.isModalConfirmActive = true
        } else {
          this.deletePayment(player.id)
        }
      }
    },
    deletePaymentRefundCard() {
      const payeeRefund = this.findPlayersPaymentInfo(this.selectedPlayerForRefund)
      const r = new Reservation({
        id: this.reservation.id,
      })
      const p = new ReservationPayment(payeeRefund[0])
      p.for(r)
        .delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste stornirali uplatu i prebacili sredstva na akontacijski račun'),
            type: 'is-success',
          })
          this.note = ''
          this.payment_fiskal = null
          this.markAsPaid = false
          this.$emit('close')
        })
        .catch(() => {
          this.$parent.close()
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
        })
    },
    filteredClubWallet(w) {
      return w.find((item) => {
        return item.club_id === this.club.id
      })
    },
    makePayment() {
      if (!this.selected_payee.length) {
        this.$buefy.toast.open({
          message: this.$t('Odabrite barem jednog platitelja'),
          type: 'is-danger',
        })
        return
      }
      this.loading = true
      for (let i = 0; i < this.selected_payee.length; i++) {
        const clubsWallet = this.filteredClubWallet(this.selected_payee[i].wallets)
        const r = new Reservation(this.reservation)
        const p = new ReservationPayment({
          player: this.selected_payee[i],
          wallet: clubsWallet,
          receiver_id: this.user.id,
          buyer: this.selected_payee[i],
          cash: this.paymentMethod === 'cash',
          for_all: this.payAll,
          receipt: this.receipt,
          note: this.note,
          payment_fiskal: this.payment_fiskal,
          payment_method: this.paymentMethod,
        }).for(r)
        if (this.selected_company) {
          p.company = this.selected_company
        }
        p.save()
          .then((res) => {
            if (this.paymentMethod === 'card') {
              this.showStripe = true
              this.clientSecret = res.client_secret
            } else {
              this.$buefy.toast.open({
                message: this.$t('Uspješno ste izvšili plaćanja'),
                type: 'is-success',
              })
              this.loading = false
              this.split = false
              this.note = ''
              this.payment_fiskal = null
              this.$emit('close')
            }
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške, pokušajte ponovno'),
              type: 'is-danger',
            })
            this.loading = false
          })
      }
    },
  },
}
</script>
