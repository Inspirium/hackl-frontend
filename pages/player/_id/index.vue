<template>
  <div class="member">
    <template>
      <div class="breadcrumbs breadcrumbs-back m-t-10">
        <a
          class="fw600 is-size-55 has-text-black80 align__centar__y fade-in-left anim_delay_2 opacity-0"
          @click="$router.go(-1)"
        >
          <b-icon icon="arrow-circle-left" pack="fal" type="is-black80" class="m-r-5"> </b-icon>
          <span class="m-r-5">{{ $t('nazad') }}</span>
        </a>
      </div>
    </template>
    <template v-if="isBlocked && (isAdmin || isCashier())">
      <div class="x-container">
        <div class="m-t-20 m-b-20">
          <div class="is-red rounded-md softshadow4">
            <div class="align__centar__y flex__column p-l-20 p-r-20 p-t-20 p-b-10">
              <b-icon icon="exclamation-circle" size="is-large" type="is-white" pack="fal"></b-icon>
              <div class="fw600 is-size-5 has-text-centered has-text-white m-b--5 m-t-20">
                {{ $t('administratorBlokiraoJeVaPristupAplikacijiKluba', { name: club.name }) }}
              </div>
              <template v-if="player.club_member[club.id].message">
                <div class="divider-line-1-white m-t-20 w100"></div>
                <div class="fw600 is-size-5 has-text-centered has-text-white m-b--5 m-t-20">
                  {{ player.club_member[club.id].message }}
                </div>
                <div class="divider-line-1-white m-t-20 w100"></div>
              </template>
              <div class="buttons m-t-30 m-b-15">
                <b-button
                  class="softshadow m-l-10"
                  type="is-small noborder"
                  pack="fas"
                  icon-right="user-lock"
                  rounded
                  @click="
                    isBlocked ? updateMemberData.member.push(player) : updateMemberData.blocked.push(player)
                    updateMember()
                  "
                >
                  {{ $t('Odblokiraj korisnika') }}
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="activity x-container m-t--20">
      <div class="member__info">
        <template v-if="isAdmin">
          <div v-if="check === null || check === 'applicant'" class="m-t-20 m-b-20">
            <div class="birthday rounded-md softshadow4">
              <div class="align__centar__y flex__column p-l-20 p-r-20 p-t-10 p-b-10">
                <b-icon icon="check" size="is-large" type="is-white" pack="fal"></b-icon>
                <div class="fw600 is-size-6 has-text-centered has-text-white m-b--5">
                  {{ $t('dobiliSteZahtjevZaPotvrduNovogLanaKluba') }}
                </div>
                <div class="fw600 is-size-4 has-text-centered has-text-white">
                  {{ player.display_name }}
                </div>
                <div class="buttons m-t-20 m-b-0">
                  <b-button
                    class="softshadow m-b-10"
                    type="is-small noborder"
                    pack="far"
                    icon-right="user-plus"
                    rounded
                    @click="
                      updateMemberData.member.push(player)
                      updateMember()
                    "
                  >
                    {{ $t('potvrdiLanstvo') }}
                  </b-button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <TennisImage v-if="player.image" :size="[180, 180]" :src="player.image" class="user_image-large m-r-5" alt="" />
        <div class="title m-b-5 m-t-5">{{ player.display_name }}</div>
        <div class="modal-subtitle">{{ $t('godina range', { range: player.range }) }}</div>
        <template v-if="isAdmin || player.id === user.id">
          <template v-if="player.parents?.length">
            <div class="divider-line-1 m-t-10"></div>
            <div class="flex align__centar__all m-t-10">
              <b-icon class="m-r-10" pack="fal" icon="family" type="is-black50"> </b-icon>
              <nuxt-link
                v-for="item in player.parents"
                :key="item.id"
                :to="localePath(item.link)"
                class="flex align__centar__all"
              >
                <TennisImage
                  :size="[200, 200]"
                  style="transition: 0.3s all"
                  :src="item.image"
                  class="user_image-small border__white softshadow m-r-5"
                  alt=""
                />
                <div class="flex__column flex align-items-flex-start">
                  <div class="fw600 is-size-7 has-text-primary name m-r-10 m-b--2">{{ $t('Roditelj') }}:</div>
                  <div class="fw600 is-size-7 has-text-black50 name m-r-10">
                    {{ item.display_name }}
                  </div>
                </div>
              </nuxt-link>
            </div>

            <div class="divider-line-1 m-t-10"></div>
          </template>

          <template v-if="player.children?.length">
            <div class="divider-line-1 m-t-10"></div>
            <div class="flex align__centar__all m-t-10">
              <b-icon class="m-r-10" pack="fal" icon="child" type="is-black50"> </b-icon>
              <nuxt-link
                v-for="item in player.children"
                :key="item.id"
                :to="localePath(item.link)"
                class="flex align__centar__all"
              >
                <TennisImage
                  :size="[200, 200]"
                  style="transition: 0.3s all"
                  :src="item.image"
                  class="user_image-small border__white softshadow m-r-5"
                  alt=""
                />

                <div class="fw600 is-size-7 has-text-black50 name m-r-10">
                  {{ item.display_name }}
                </div>
              </nuxt-link>
            </div>

            <div class="divider-line-1 m-t-10"></div>
          </template>
        </template>
        <div v-if="user.id === 2" class="buttons m-t-15 m-b--10">
          <b-button
            class="softshadow m-b-10"
            type="is-small noborder"
            pack="fal"
            rounded
            :loading="loadingClub"
            @click="isModalClubActive = true"
          >
            {{ $t('ulaniUNoviKlub') }}
          </b-button>
        </div>
        <template v-show="player.club_member.length">
          <div class="flex flex-wrap align__centar__x m-b-15">
            <div v-for="item in player.club_member" :key="item.id" class="flex align__centar__all m-t-10">
              <TennisImage
                :size="[200, 200]"
                style="transition: 0.3s all"
                :src="item.logo"
                class="user_image-small border__white softshadow m-r-5"
                alt=""
              />

              <div class="fw600 is-size-7 has-text-black50 name m-r-10">
                {{ item.name }}
              </div>
            </div>
          </div>
        </template>

        <!--        <h2 class="is-text-center">{{ Math.round(player.rating) }} bodova</h2>-->
        <div v-if="user.is_admin || user.id === player.id" class="buttons m-t-20">
          <b-button
            tag="nuxt-link"
            :to="localePath('/player/' + player.id + '/edit')"
            class="softshadow m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-right="user-edit"
            rounded
          >
            {{ $t('urediProfil') }}
          </b-button>
          <b-button
            v-if="user.id === player.id"
            class="softshadow m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-right="user-times"
            rounded
            @click="isModalRemoveUserFromClubActiveSelf = true"
          >
            {{ $t('obriiProfil') }}
          </b-button>
        </div>
        <div v-if="user.id !== player.id" class="buttons m-t-20">
          <b-button
            v-if="(clubId !== 26 && !player.hidden_fields?.hide_my_phone) || isAdmin"
            :href="'tel:' + player.phone"
            tag="a"
            class="m-l-10"
            type="is-danger"
            pack="far"
            icon-right="phone"
            rounded
          >
            {{ $t('nazovi') }}
          </b-button>
          <b-button
            class="m-l-10"
            type="is-primary"
            pack="fal"
            icon-right="comments"
            rounded
            :loading="loadingMessage"
            @click.native.prevent="submitMessage"
          >
            {{ $t('poaljiPoruku') }}
          </b-button>
        </div>
        <div
          v-if="player_memberships.length"
          @click="$router.push(localePath('/admin/membership/' + player_memberships[0].membership_id))"
        >
          <div class="label">{{ $t('tipLanstva') }}</div>
          <div class="activity__reservation">
            <div class="activity__box action__buttons">
              <div
                v-if="player_memberships[0].membership !== null"
                :class="{
                  action__item__small: true,
                  fw600: true,
                  inactive: loading,
                }"
              >
                {{ player_memberships[0].membership.name }}
                <b-icon class="m-l-auto" icon="chevron-right" size="is-small-9" pack="fal"> </b-icon>
              </div>
            </div>
          </div>
        </div>
        <div v-if="user.is_admin && player_memberships.length" class="buttons m-t-20">
          <b-button
            v-if="player_memberships[0].membership.subscription"
            class="softshadow m-b-10"
            type="is-small noborder"
            pack="fal"
            icon-right="chevron-right"
            rounded
            :loading="sendingInvoiceLoading"
            @click="sendInvoice()"
          >
            {{ $t('Pošalji račun') }}
          </b-button>
        </div>
      </div>
      <template>
        <div v-if="user.is_admin" class="admin_box m-b-30 m-t-40 p-t-5 activity__reservation m-t-20">
          <div v-if="isAdmin && Object.keys(funds).length" class="m-t-20 m-b-20">
            <div class="activity__box prepaid p-t-5 p-b-5">
              <div class="prepaid-box" @click="$router.push(localePath(`/player/${$route.params.id}/payments`))">
                <div class="label--center">{{ $t('stanjeNaRaunu2') }}</div>
                <div v-if="Object.keys(funds).length" class="label__num has-text-black80 is-size-3">
                  {{ $t('key5', { currency: funds.amount }) | currency }}
                </div>
              </div>
            </div>
            <div class="buttons m-t-15 m-b-10">
              <b-button
                class="softshadow m-t-10 invert-small-button"
                type="is-small noborder is-success has-text-white"
                pack="fal"
                icon-right="plus-circle"
                rounded
                @click="isModalPrepaidActive = true"
              >
                {{ $t('Uplati na račun') }}
              </b-button>
              <b-button
                class="softshadow m-t-10 invert-small-button"
                type="is-small noborder is-danger has-text-white"
                pack="fal"
                icon-right="minus-circle"
                rounded
                @click="isModalPrepaidPaymentActive = true"
              >
                {{ $t('Naplati s računa') }}
              </b-button>
            </div>
          </div>
          <div v-else class="buttons m-t-15 m-b-10">
            <b-button
              class="softshadow m-t-10"
              type="is-small noborder"
              pack="fal"
              icon-right="euro-sign"
              rounded
              @click="
                isModalPrepaidActive = true
                firstTransaction = true
              "
            >
              {{ $t('unesiPrvuUplatu') }}
            </b-button>
          </div>

          <div class="label">{{ $t('upravljanjeLanom') }}</div>
          <div class="activity__box action__buttons">
            <div class="fw600">
              <div
                :class="
                  (player.is_admin ? 'active' : '',
                  { action__item: true, active: player.is_admin, inactive: loadingAdmin })
                "
                @click="updateAdmin"
              >
                <span class="m-r-15"> <b-icon icon="user-shield" pack="fal"></b-icon></span
                >{{ player.is_admin ? $t('Ukloni kao administratora') : $t('Postavi kao administratora') }}
              </div>
              <div
                :class="(player.is_trainer ? 'active' : '', { action__item: true, active: player.is_trainer })"
                @click="updateTrainer"
              >
                <span class="m-r-15"> <b-icon icon="user-graduate" pack="fal"></b-icon></span
                >{{ player.is_trainer ? $t('Ukloni kao trenera') : $t('Postavi kao trenera') }}
              </div>
              <div
                :class="(isCashier1 ? 'active' : '', { action__item: true, active: isCashier1 })"
                @click="
                  updateMemberData.cashier.push(player)
                  updateMember()
                "
              >
                <span class="m-r-15"> <b-icon icon="cash-register" pack="fal"></b-icon></span>{{ $t('Blagajnik') }}
              </div>

              <div
                :class="(isBlocked ? 'active' : '', { action__item: true, active: isBlocked })"
                @click="
                  isBlocked ? updateMemberData.member.push(player) : updateMemberData.blocked.push(player)
                  updateMember()
                "
              >
                <span class="m-r-15"> <b-icon icon="user-lock" pack="fas" type="is-danger"></b-icon></span
                >{{ isBlocked ? $t('Odblokiraj korisnika') : $t('Blokiraj korisnika') }}
              </div>
            </div>
          </div>
          <!--          Show if parent-->
          <assignChild :player="player" class="m-t-10 m-b-10" @update="getPlayer"></assignChild>

          <div class="label">{{ $t('tipLanstva') }}</div>
          <div class="activity__reservation">
            <transition name="fade">
              <div class="activity__box action__buttons">
                <div
                  v-for="membership in memberships"
                  :key="membership.id"
                  :class="{
                    action__item__small: true,
                    fw600: true,
                    inactive: loading,
                    active: playersMembershipClass(membership),
                  }"
                  @click="updateMembership(membership)"
                >
                  {{ membership.name }}
                </div>
              </div>
            </transition>
          </div>
          <div class="buttons">
            <b-button
              v-if="user.id === 2 || user.id === 1"
              class="m-t-20 m-b--20"
              type="is-danger"
              pack="fal"
              icon-right="user-times"
              rounded
              @click="isModalDeleteActive = true"
            >
              {{ $t('izbriiLana') }}
            </b-button>
          </div>
          <div class="buttons">
            <b-button
              class="m-t-20"
              type="is-danger"
              pack="fal"
              icon-right="user-times"
              rounded
              @click="isModalRemoveUserFromClubActive = true"
            >
              {{ $t('ukloniLanaIzKluba') }}
            </b-button>
          </div>
        </div>
        <template v-if="isAdmin || player.id === user.id">
          <div class="activity__header--center m-b-10 m-t-20">
            <div class="fw600 flex align__centar__y" @click="goToReservations()">
              <div class="fw600 is-size-35">{{ $t('Rezervacije') }}</div>
              <b-icon class="m-l-7 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
            </div>
          </div>
          <div
            v-if="reservations.length && (isAdmin || (player.id === user.id && reservations.length))"
            class="activity__box"
          >
            <div class="tablelist">
              <b-table :data="reservations" :checked-rows.sync="checkedRows" :bordered="false" :mobile-cards="false">
                <b-table-column v-slot="props" cell-class="list__image-col p-l-0">
                  <nuxt-link :to="localePath('/')">
                    <div class="list__content m-l-15">
                      <div class="fw600 is-size-65 has-text-lightblue m-r-10 nowrap align__centar__x flex__column w100">
                        <span class="is-uppercase">{{
                          $moment(reservations[props.index].from).format('Do' + 'MM' + ', ' + 'dddd')
                        }}</span>
                        <span class="fw600 title-num is-size-6">{{
                          $moment(reservations[props.index].from).format('LT') +
                          ' — ' +
                          $moment(reservations[props.index].to).format('LT')
                        }}</span>
                      </div>
                    </div>
                    <b-tag :type="props.row.court ? 'is-info' : 'is-danger'">{{
                      props.row.court ? props.row.court.name : 'Obrisan teren'
                    }}</b-tag>
                  </nuxt-link>
                </b-table-column>
              </b-table>
            </div>
          </div>
          <template v-if="!reservations.length">
            <section class="section has-text-centered m-t--10">
              <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
              <div class="fw600 is-size-55 has-text-centered has-text-black80 m-b-0 m-t--5">
                {{ $t('nemaRezervacija') }}
              </div>
            </section>
          </template>

          <div v-if="reservations.length" class="buttons m-t-10">
            <b-button
              class="softshadow m-t-10 m-b-10"
              type="is-small noborder"
              pack="fal"
              icon-right="long-arrow-right"
              rounded
              @click="goToReservations()"
            >
              {{ $t('Uredi rezervacije') }}
            </b-button>
          </div>
        </template>
        <widgetInvoices v-if="isAdmin || player.id === user.id" :player="player" />
        <template v-if="Object.keys(funds).length && (isAdmin || player.id === user.id)">
          <div class="activity__header--center m-b-5 m-t-40">
            <nuxt-link :to="localePath('/player/' + player.id + '/payments')" class="fw600"
              >{{ $t('acc') }}
              <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
            </nuxt-link>
          </div>
          <div class="modal-subtitle has-text-centered fw400 m-b-10 m-t--5">
            {{ $t('stanjeNaRaunu') }}
            <span class="has-text-primary is-size-5">{{ funds.amount | currency }}</span>
          </div>
          <template v-if="true">
            <b-table :data="splicedFundTransactions" :mobile-cards="false" :bordered="false">
              <b-table-column v-slot="props" cell-class="list__image-col">
                <nuxt-link
                  :to="localePath('/admin/payments/' + props.row.id + '/prepaid/edit')"
                  class="fw600 align__centar__all"
                >
                  <div class="list__img">
                    <TennisImage :size="[42, 42]" :src="player.image" class="user_image" alt="" />
                  </div>
                  <div class="list__content">
                    <div class="align__centar__y">
                      <h4 class="has-text-grey-light fw600 is-size-7">
                        {{ props.row.created_at | moment('DD.MM.YYYY.') }}
                      </h4>
                    </div>
                    <h4 class="fw600 is-size-5 m-t--2">{{ $t('key5', { currency: props.row.amount }) | currency }}</h4>
                    <h3 class="fw600 has-text-lightblue is-size-65">
                      {{ props.row.note }}
                    </h3>
                  </div>
                  <div class="x-tag m-l-auto nowrap" :class="props.row.amount > 0 ? 'is-primary' : 'is-red'">
                    {{ props.row.amount > 0 ? 'Uplata' : 'Plaćanje' }}
                  </div>
                </nuxt-link>
              </b-table-column>
            </b-table>
          </template>
          <div v-if="funds.transactions.length > 3" class="buttons m-t-10">
            <b-button
              class="softshadow m-t-10 m-b-10"
              type="is-small noborder"
              pack="fal"
              icon-right="long-arrow-right"
              rounded
              tag="nuxt-link"
              :to="localePath('/player/' + player.id + '/payments')"
            >
              {{ $t('prikaiVie') }}
            </b-button>
          </div>
        </template>
        <template>
          <template v-if="myTeams.length">
            <div class="activity__header--center m-b-10 m-t-20">
              <div class="fw600 is-size-35 has-text-centered">
                {{ user.id === player.id ? $t('Moji parovi') : $t('Teniski parovi') }}
              </div>
            </div>
            <div class="tablelist">
              <b-table class="softshadow" :data="myTeams" :mobile-cards="false" :bordered="false">
                <b-table-column v-slot="props" cell-class="list__image-col">
                  <div class="flex">
                    <nuxt-link :to="localePath('/team/' + props.row.id)" class="w100">
                      <div v-if="props.row.image === 'https://api.tenis.plus/images/user.svg'" class="list__img">
                        <TennisImage
                          :size="[42, 42]"
                          :src="props.row.players[0].image"
                          class="user_image border__white--2"
                          alt=""
                        />
                        <TennisImage
                          :size="[42, 42]"
                          :src="props.row.players[1].image"
                          class="user_image m-l--20 border__white--2"
                          alt=""
                        />
                      </div>
                      <div v-else class="list__img">
                        <TennisImage
                          :size="[42, 42]"
                          :src="props.row.image"
                          class="user_image border__white--2"
                          alt=""
                        />
                      </div>
                      <div class="list__content">
                        <h3 class="fw600 is-size-55 has-text-black80 line-height-14">{{ props.row.display_name }}</h3>
                      </div>
                      <b-tag type="is-info" class="m-l-auto">{{ Math.round(props.row.rating_club) }}</b-tag>
                    </nuxt-link>
                  </div>
                </b-table-column>
              </b-table>
            </div>
          </template>

          <template v-if="Object.keys(player).length">
            <playersVsStats
              v-if="user.id !== player.id"
              :result-item="playersForVsRecord"
              class="m-t-30"
            ></playersVsStats>
            <playersStats :team="player.team.id"></playersStats>
            <div id="profile">
              <div v-if="playerProfile.length" class="x-container">
                <div class="activity__header--center m-b-0 m-t-20">
                  <nuxt-link :to="localePath('/player/' + $route.params.id + '/profile')" class="fw600"
                    >{{ $t('profil') }}
                    <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
                  </nuxt-link>
                </div>
                <profileDisplay v-if="true" :player="player.team"></profileDisplay>
              </div>
              <div v-else class="">
                <div class="activity__header--center m-b-0 m-t-20">
                  <nuxt-link :to="localePath('/player/' + $route.params.id + '/profile')" class="fw600"
                    >{{ $t('profil') }}
                    <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
                  </nuxt-link>
                </div>

                <div class="fw600 is-size-5 has-text-black50 has-text-centered flex align__centar__all m-t-5 m-b-5">
                  <b-icon
                    icon="exclamation-square"
                    class="m-r-5"
                    type="is-danger"
                    size="is-smaller"
                    pack="fal"
                  ></b-icon>
                  {{ $t('igraNijeProfiliran') }}
                </div>
                <div class="buttons m-t-10 m-b-20">
                  <b-button
                    class="softshadow m-t-10 m-b-10"
                    type="is-small noborder"
                    pack="fal"
                    icon-right="chart-line"
                    rounded
                    @click="$router.push(localePath('/player/' + player.id + '/profile'))"
                  >
                    {{ $t('prviProfilirajIgraa') }}
                  </b-button>
                </div>
              </div>
            </div>
            <tournamentScore :team="player.team.id" class="m-b-20"></tournamentScore>
          </template>

          <template v-if="results.length">
            <div class="activity__header--center m-b-0 m-t-20">
              <nuxt-link :to="localePath('/player/' + $route.params.id + '/results')" class="fw600"
                >{{ $t('rezultati') }}
                <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
              </nuxt-link>
            </div>

            <div v-touch:swipe="swipeHandler">
              <b-tabs v-model="activeTab" position="is-centered">
                <b-tab-item :label="$t('ukupno')">
                  <div v-if="Object.keys(player).length" class="modal-subtitle has-text-centered fw400 m-b-20">
                    {{ $t('ukupnoMeeva') }}
                    <span class="has-text-primary">{{ totalMatches }}</span>
                    <div class="m-t-10">
                      <span class="is-size-7 x-tag green nav__notification has-text-white">{{
                        player.winslosses.wins
                      }}</span>
                      <span class="is-size-7 x-tag has-background-danger nav__notification has-text-white">{{
                        player.winslosses.losses
                      }}</span>
                    </div>
                  </div>
                  <div class="activity__results results">
                    <div class="activity__box">
                      <div class="results__list">
                        <div v-for="result in results" :key="result.id">
                          <resultBox :result="result"> </resultBox>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-tab-item>
                <b-tab-item v-if="player.id !== $auth.user.id && my_results.length" :label="$t('meusobno')">
                  <div class="modal-subtitle has-text-centered fw400 m-b-20">
                    {{ $t('ukupnoMeeva') }}
                    <span class="has-text-primary">{{ my_results.length }}</span>
                  </div>
                  <div class="activity__results results">
                    <div class="activity__box">
                      <div class="results__list">
                        <div v-for="result in my_results" :key="result.id">
                          <resultBox :result="result"> </resultBox>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-tab-item>
              </b-tabs>
            </div>
            <div v-if="results.length" class="buttons m-t--10">
              <b-button
                class="softshadow m-b-10"
                type="is-small noborder"
                pack="fal"
                icon-right="long-arrow-right"
                rounded
                tag="nuxt-link"
                :to="localePath('/player/' + player.id + '/results')"
              >
                {{ $t('sviRezultati') }}
              </b-button>
            </div>
          </template>
          <template v-else>
            <section class="section">
              <div class="content has-text-grey has-text-centered">
                <b-icon icon="exclamation-square" type="is-danger" size="is-large" pack="fal"> </b-icon>
                <p class="has-text-centerd fw600 m-t-10">
                  {{ $t('zaPrikazPopisaRezultataIStatistikeMorateImatiUnese') }}
                </p>
                <div class="buttons m-t-10">
                  <b-button
                    class="softshadow m-b-10"
                    type="is-small noborder"
                    pack="fal"
                    icon-right="tennis-ball"
                    rounded
                    tag="nuxt-link"
                    :to="localePath('/result')"
                  >
                    {{ $t('unesiRezultat') }}
                  </b-button>
                </div>
              </div>
            </section>
          </template>
        </template>
      </template>
    </div>
    <b-modal :active.sync="isModalAddPlayerToGroupActive" :width="640" scroll="clip" class="modal__members">
      <modalMembers
        :show-tennis-school="false"
        :is-doubles="false"
        :title="$t('Dodaj dijete')"
        @player="addNewChild($event)"
      ></modalMembers>
    </b-modal>
    <b-modal :active.sync="isModalDeleteActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('trajnoObriiKorisnika')"
        :subtitle="$t('Nakon brisanja korisnika svi podaci će biti obrisani')"
        @update="deletePlayer()"
      ></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalRemoveUserFromClubActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('uklanjanjeKorisnikaIzKluba')"
        :subtitle="$t('Nakon potvrde korisnik neće biti više član kluba')"
        @update="removeFromClub()"
      ></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalRemoveUserFromClubActiveSelf" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('brisanjeProfila')"
        :subtitle="$t('Nakon potvrde više nećete imati profil')"
        @update="deletePlayer()"
      ></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalPrepaidActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalPaymentPrepaid
        :title="$t('unesiUplatu')"
        :subtitle="$t('Unesi podatke o uplati')"
        :label="$t('uplata')"
        :user="player"
        type="payment"
        @update="getFunds()"
      ></modalPaymentPrepaid>
    </b-modal>
    <b-modal :active.sync="isModalPrepaidPaymentActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalPaymentPrepaid
        :title="$t('plaanjeRauna')"
        :subtitle="$t('Unesi podatke o plaćanju računa')"
        :label="$t('iznosPlaanjaRauna')"
        :user="player"
        type="paying"
        @update="getFunds()"
      ></modalPaymentPrepaid>
    </b-modal>
    <b-modal :active.sync="isModalClubActive" :width="640" scroll="clip">
      <modalClub
        :switch-club="false"
        :title="$t('odaberiNoviKlub')"
        style="min-height: 200px"
        @club="joinClub($event)"
      />
    </b-modal>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Thread from '@/models/Thread'
import Wallet from '@/models/Wallet'
import Payment from '@/models/Payment'
import Club from '@/models/Club'
import UserMembership from '@/models/UserMembership'
import assignChild from '~/components/find/assignChild'
import modalMembers from '~/components/modal/ModalMembersAll'
import Team from '~/models/Team'
import modalPaymentPrepaid from '~/components/modal/ModalPaymentPrepaid'
import Reservation from '~/models/Reservation'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import resultBox from '~/components/ResultBox'
import Player from '~/models/Player'
import Result from '~/models/Result'
import Trainer from '~/models/Trainer'
import modalClub from '~/components/modal/ModalClubs'
import profileDisplay from '~/components/stats/profileDisplay'
import playersVsStats from '~/components/stats/PlayersVsStats'
import playersStats from '~/components/stats/Stats'
import PlayerProfile from '~/models/PlayerProfile'
import tournamentScore from '~/components/stats/tournaments'
import widgetInvoices from '~/components/player/widgetInvoices'
import Invoice from '~/models/Invoice'
import Membership from '~/models/Membership'

export default {
  name: 'Member',
  components: {
    playersVsStats,
    modalConfirmation,
    modalMembers,
    modalPaymentPrepaid,
    resultBox,
    modalClub,
    profileDisplay,
    playersStats,
    tournamentScore,
    TennisImage,
    assignChild,
    widgetInvoices,
  },
  async fetch() {
    await this.$nextTick(() => {
      this.getPlayer().then((res) => {
        this.getFunds()
        this.player
          .memberships()
          .where('club', this.$store.state.club.id)
          .get()
          .then((res) => {
            if (this.$auth.loggedIn) {
              this.loadReservations()
            }
            this.player_memberships = res
            this.getResults()
            this.getMembership()
            this.getVSResults()
            this.getMyTeams()
            this.getPlayerProfile()
            this.backFromProfiling()
          })
        this.$root.$loading.finish()
      })
    })
  },
  data() {
    return {
      isModalClubActive: false,
      isModalRemoveUserFromClubActiveSelf: false,
      isModalRemoveUserFromClubActive: false,
      isModalAddPlayerToGroupActive: false,
      bottom: false,
      activeTab: 0,
      isCardModalActive: false,
      isModalDeleteActive: false,
      total_user_reservation: 1221,
      is_admin: {
        admin: [],
        winslosses: [],
        is_admin: false,
      },
      is_parent: false,
      player: {},
      playerProfile: [],
      player_memberships: [],
      reservations: [],
      checkboxPosition: 'left',
      checkedRows: [],
      results: [],
      results_page: 1,
      results_total_pages: 1,
      totalMatches: 0,
      my_results: [],
      my_results_page: 1,
      my_results_total_pages: 1,
      meta: '',
      memberships: [],
      loading: false,
      loadingClub: false,
      loadingAdmin: false,
      loadingParent: false,
      test1: '',
      test2: '',
      test3: '',
      test: '',
      loading1: false,
      updateMemberData: { member: [], applicant: [], blocked: [], cashier: [] },
      payments: [],
      myTeams: [],
      myTeam: {},
      paymentsMeta: {},
      funds: {},
      isModalPrepaidActive: false,
      isModalPrepaidPaymentActive: false,
      firstTransaction: false,
      loadingMessage: false,
      sendingInvoiceLoading: false,
    }
  },
  computed: {
    filterUsersClubWallet() {
      return this.player.wallets.filter((item) => {
        return item.club_id === this.clubId
      })
    },
    playersForVsRecord() {
      return { players: [this.user.team, this.player.team] }
    },
    splicedFundTransactions() {
      if (this.funds.transactions.length > 3) {
        const x = this.funds.transactions
        return [x[0], x[1], x[2]]
      }
      return this.funds.transactions
    },
    playerSelected() {
      return this.player
    },
    today() {
      return this.$moment().format('YYYY-MM-DD')
    },
    isBlocked() {
      if (
        Object.keys(this.player).length &&
        this.clubId !== null &&
        this.player.club_member[this.clubId.toString()] !== undefined
      ) {
        return this.player.club_member[this.clubId.toString()].type === 'blocked'
      }
      return false
    },
    isCashier1() {
      if (
        Object.keys(this.player).length &&
        this.clubId !== null &&
        this.player.club_member[this.clubId.toString()] !== undefined
      ) {
        return this.player.club_member[this.club.id.toString()].cashier === true
      }
      return false
    },
    check() {
      // if (this.user.id === 2) {
      //   return false
      // }
      if (
        Object.keys(this.player).length &&
        this.clubId !== null &&
        this.player.club_member[this.clubId.toString()] !== undefined
      ) {
        return this.player.club_member[this.clubId.toString()].type
      }
      return false
    },
    clubId() {
      return this.club.id
    },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    isAdmin() {
      return this.user.is_admin
    },
    hasWins() {
      return this.playerSelected.stats.stats.wins
    },
    hasLosses() {
      return this.playerSelected.stats.total.total - this.playerSelected.stats.stats.wins
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        this.getMore()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
  },
  methods: {
    sendInvoice() {
      this.sendingInvoiceLoading = true
      new Invoice({ name: this.player_memberships[0].membership.name, user: this.player })
        .for(new Membership({ id: this.player_memberships[0].membership.id }))
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste poslali račune'),
            type: 'is-success',
          })
          this.sendingInvoiceLoading = false
          this.$router.push(this.localePath('/admin/subscriptions/pending'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.sendingInvoiceLoading = false
        })
    },
    isCashier() {
      if (!this.user.club_member || !this.user.club_member[this.club.id.toString()]) return false
      return this.user.club_member[this.club.id.toString()].cashier === undefined
        ? false
        : this.user.club_member[this.club.id.toString()].cashier === true
    },
    addNewChild() {
      // console.log('bla bal')
    },
    // Scrool intoview if back from profiling
    backFromProfiling() {
      if (this.$route.query.profile) {
        setTimeout(function () {
          document.getElementById('profile').scrollIntoView({
            alignToTop: false,
            behavior: 'smooth',
          })
        }, 500)
      }
    },
    getPlayerProfile() {
      PlayerProfile.where('player', this.playerSelected.id)
        .get()
        .then((res) => {
          this.playerProfile = res.data
        })
    },
    getMyTeams() {
      Team.where('number_of_players', 2)
        .where('players', this.player.id)
        .get()
        .then((res) => {
          this.myTeams = res.data
        })
    },
    getMyTeam() {
      Team.find(this.player.id).then((res) => {
        this.myTeam = res
      })
    },
    async getFunds() {
      if (this.firstTransaction) {
        this.getPlayer().then(() => {
          this.getFunds()
        })
      }
      if (this.filterUsersClubWallet.length) {
        this.funds = await Wallet.where('club', this.$store.state.club.id)
          .include('transactions')
          .$find(this.filterUsersClubWallet[0].id)
      }
    },
    precentageSecond(item) {
      const test = this.playerSelected.stats.total.total
        ? Math.round((this.playerSelected.stats.stats.first_set_wins / this.playerSelected.stats.stats.wins) * 100)
        : 0
      return item === 1 ? test + '%' : 'width:' + test + '%'
    },
    removeFromClub() {
      this.loading = true
      this.$root.$loading.start()
      this.$axios
        .put('v2/club/member', { delete: [this.player] })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste se uklonili korisnika iz kluba'),
            type: 'is-success',
          })
          this.loading = false
          this.$root.$loading.finish()
          this.$router.push(this.localePath('/player'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loading = false
          this.$root.$loading.finish()
        })
    },
    getPayments() {
      Payment.where('user', this.$route.params.id)
        .include(['user', 'receiver', 'type'])
        .for(new Club({ id: this.$store.state.club.id }))
        .orderBy('-created_at')
        .limit(3)
        .get()
        .then((res) => {
          this.payments = res.data
          this.paymentsMeta = res.meta
        })
    },
    joinClub(club) {
      this.loadingClub = true
      this.$axios
        .put('v2/club/member', { member: [{ id: this.player.id }], club_id: club.id })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste korisnika prijavili u novi klub'),
            type: 'is-success',
          })
          this.loadingClub = false
          this.getPlayer()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loadingClub = false
        })
    },
    updateMember() {
      this.$axios
        .put('v2/club/member', this.updateMemberData)
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Izmjene su spremljene'),
            type: 'is-success',
          })
          this.getPlayer()
          this.updateMemberData = { member: [], applicant: [], blocked: [], cashier: [] }
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.getPlayer()
          this.updateMemberData = { member: [], applicant: [], blocked: [], cashier: [] }
        })
    },
    showIfMember() {
      return this.player.club_member[this.club.id.toString()].type === 'applicant'
    },
    goToReservations() {
      window.scrollTo(0, 0)
      this.$router.push(this.player.id + '/reservation')
    },
    isCancelable(item) {
      if (this.reservations.length && this.$store.state.club.memberships.length) {
        const a = this.$moment.utc(item.from)
        const b = this.$moment()
        return a.diff(b, 'hours') >= this.$auth.user.membership.reservation_cancelable || this.$auth.user.is_admin
      }
      return ''
    },
    loadReservations() {
      Reservation.where('from', this.today)
        .where('player', this.$route.params.id)
        .limit(3)
        .$get()
        .then((res) => (this.reservations = res))
    },
    playersMembershipClass(item) {
      if (this.player_memberships.length) {
        if (this.player_memberships[0].membership_id === item.id) {
          return true
        }
      }
    },
    getMembership() {
      this.$store.dispatch('club/init_club', { force: true })
      this.memberships = this.$store.state.club.memberships
    },
    async getPlayer() {
      let id
      if (this.$route.params.id) {
        id = this.$route.params.id
      } else {
        id = this.user.id
      }
      this.player = await Player.include('memberships', 'clubs', 'wallets', 'children', 'parents')
        .params({ wins: true, stats: true })
        .$find(id)
    },
    daj() {
      this.getPlayer().then(() => {
        this.player
          .memberships()
          .where('club', this.$store.state.club.id)
          .get()
          .then((res) => {
            this.player_memberships = res
            this.$auth.fetchUser()
          })
      })
    },
    deletePlayer() {
      const p = new Player({ id: this.player.id })
      p.delete()
        .then(() => {
          this.$router.push(this.localePath('/player/'))
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali profil'),
            type: 'is-success',
          })
          this.$auth.logout()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
        })
    },
    swipeHandler(direction) {
      if (direction === 'right') {
        this.activeTab = 0
      } else if (direction === 'left') {
        this.activeTab = 1
      }
    },
    submitMessage() {
      this.loadingMessage = true
      Thread.whereIn('players_exact', [this.user.id, this.player.id])
        .get()
        .then((res) => {
          if (res.data.length) {
            this.$router.push(this.localePath(`/messages/${res.data[0].id}`))
          } else {
            const t = new Thread({ players: [this.player] })
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
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
    getMore() {
      if (this.activeTab === 0 && this.results_total_pages >= this.results_page) {
        this.getResults()
      }
      if (this.activeTab === 1 && this.my_results_total_pages >= this.my_results_page) {
        this.getVSResults()
      }
    },
    getResults() {
      Result.where('player', this.player.id)
        .limit(3)
        .get()
        .then((res) => {
          this.results = res.data
          this.totalMatches = res.meta.total
          this.meta = res.meta
        })
    },
    getVSResults() {
      if (this.player.id !== this.$auth.user.id) {
        Result.where('players', this.player.team.id + ',' + this.user.team.id)
          .page(this.my_results_page)
          .get()
          .then((res) => {
            if (res.data) {
              this.my_results = [...this.my_results, ...res.data]
              this.my_results_total_pages = res.meta.last_page
              this.my_results_page++
            }
          })
      }
    },
    updateTrainer() {
      this.loadingAdmin = true
      let trainer
      if (this.player.is_trainer) {
        trainer = new Trainer({ id: this.player.is_trainer })
        trainer
          .delete()
          .then(() => {
            this.player.is_trainer = false
            this.$buefy.toast.open({
              message: this.player.display_name + ' ' + this.$t('nije više trener'),
              type: 'is-danger',
            })
            this.getPlayer()
            this.loadingAdmin = false
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
              type: 'is-danger',
            })
            this.loadingAdmin = false
          })
      } else {
        trainer = new Trainer({ user_id: this.player.id })
        trainer
          .save()
          .then(() => {
            this.player.is_trainer = true
            this.$buefy.toast.open({
              message: this.player.display_name + ' ' + this.$t('je postavljen kao trener'),
              type: 'is-success',
            })
            this.getPlayer()
            this.loadingAdmin = false
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
              type: 'is-danger',
            })
            this.loadingAdmin = false
          })
      }
    },
    updateParent() {
      this.loadingParent = true
      let trainer
      if (this.player.is_trainer) {
        trainer = new Trainer({ id: this.player.is_trainer })
        trainer
          .delete()
          .then(() => {
            this.player.is_trainer = false
            this.$buefy.toast.open({
              message: this.player.display_name + ' ' + this.$t('nije više trener'),
              type: 'is-danger',
            })
            this.getPlayer()
            this.loadingParent = false
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
              type: 'is-danger',
            })
            this.loadingParent = false
          })
      } else {
        trainer = new Trainer({ user_id: this.player.id })
        trainer
          .save()
          .then(() => {
            this.player.is_trainer = true
            this.$buefy.toast.open({
              message: this.player.display_name + ' ' + this.$t('je postavljen kao trener'),
              type: 'is-success',
            })
            this.getPlayer()
            this.loadingAdmin = false
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
              type: 'is-danger',
            })
            this.loadingAdmin = false
          })
      }
    },
    updateAdmin() {
      this.loadingAdmin = true
      const p = new Player({ id: this.player.id, update_admin: true })
      p.save().then((res) => {
        this.player = res
        this.$buefy.toast.open({
          message: this.$t('Podaci su uspješno osvježeni'),
          type: 'is-success',
        })
        this.loadingAdmin = false
        this.getPlayer()
      })
    },
    updateMembership(membership) {
      this.loading = true
      const p = new Player({ id: this.player.id })
      const ms = this.player_memberships.filter((m) => m.membership_id === membership.id)
      let m
      if (ms.length) {
        // already has membership
        m = new UserMembership(ms[0]).for(p)
        m.delete().then(() => {
          p.memberships()
            .get()
            .then((res) => {
              this.$buefy.toast.open({
                message: this.$t('Uspješno ste promijenili članstvo'),
                type: 'is-success',
              })
              this.player_memberships = res
              this.loading = false
              this.getPlayer()
              this.daj()
            })
            .catch(() => {
              this.$buefy.toast.open({
                message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
                type: 'is-danger',
              })
              this.loading = false
            })
        })
      } else if (this.player_memberships.length && !ms.length) {
        m = new UserMembership(this.player_memberships[0]).for(p)
        m.delete().then(() => {
          p.memberships()
            .get()
            .then((res) => {
              m = new UserMembership({ membership }).for(p)
              m.save().then(() => {
                p.memberships()
                  .get()
                  .then((res) => {
                    this.$buefy.toast.open({
                      message: this.$t('Uspješno ste promijenili članstvo'),
                      type: 'is-success',
                    })
                    this.daj()
                    this.player_memberships = res
                    this.loading = false
                  })
                  .catch(() => {
                    this.$buefy.toast.open({
                      message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
                      type: 'is-danger',
                    })
                    this.loading = false
                  })
              })
            })
            .catch(() => {
              this.$buefy.toast.open({
                message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
                type: 'is-danger',
              })
              this.loading = false
            })
        })
      } else {
        m = new UserMembership({ membership }).for(p)
        m.save().then(() => {
          p.memberships()
            .get()
            .then((res) => {
              this.$buefy.toast.open({
                message: this.$t('Uspješno ste promijenili članstvo'),
                type: 'is-success',
              })
              this.daj()
              this.player_memberships = res
              this.loading = false
            })
            .catch(() => {
              this.$buefy.toast.open({
                message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
                type: 'is-danger',
              })
              this.loading = false
            })
        })
      }
    },
  },
}
</script>
<style scoped>
.section {
  padding: 1rem;
}
</style>
