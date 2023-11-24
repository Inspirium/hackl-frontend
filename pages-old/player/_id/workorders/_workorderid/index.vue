<template>
  <div class="p-b-150">
    <PageHeader :title="$t('Narudžba')" :background="returnBckg()" />
    <div v-if="user.is_admin" class="buttons m-t-30 m-b--10">
      <b-button
        v-for="(item, index) in actionButtons"
        :key="index"
        :class="{ softshadow: true, 'invert-small-button': selectedActionButtons === item }"
        :icon-right="selectedActionButtons === item ? 'times' : ''"
        :type="{
          'is-small': true,
          noborder: true,
          'is-primary has-text-white': selectedActionButtons === item,
        }"
        pack="fal"
        rounded
        @click="selectedActionButtons === item ? (selectedActionButtons = '') : (selectedActionButtons = item)"
      >
        {{ $t(item) }}
      </b-button>
    </div>
    <!--    Actions-->
    <div v-if="true" class="is-bg-high m-t-20">
      <transition name="fade">
        <div v-if="selectedActionButtons === 'Naplati' && club.payment_accontation === 1" class="p-x-16 p-t-25 p-b-25">
          <div class="fw600 is-size-5 has-text-centered m-b-20 m-t--10">{{ $t('nainPlaanja') }}</div>
          <div class="buttons m-t-5">
            <b-button
              :class="{ softshadow: true, 'invert-small-button': !isCash }"
              :type="{
                'is-small': true,
                noborder: true,
                'is-primary has-text-white': !isCash,
              }"
              pack="fal"
              rounded
              @click.prevent="isCash = false"
            >
              {{ $t('akontacija') }}
            </b-button>
            <b-button
              :class="{ softshadow: true, 'invert-small-button': isCash }"
              :type="{
                'is-small': true,
                noborder: true,
                'is-primary has-text-white': isCash,
              }"
              pack="fal"
              rounded
              @click.prevent="isCash = true"
            >
              {{ $t('gotovina') }}
            </b-button>
          </div>
          <div v-if="!isCash && club.payment_accontation === 1" class="has-text-centered fw600">
            <h4 class="fw600 flex align__centar__all m-t--15 is-size-6">
              {{ $t('stanje2') }}
              <span
                class="m-l-5 fw600"
                :class="[
                  filteredClubWallet.amount > 0
                    ? 'has-text-lightblue'
                    : 'has-text-danger is-white rounded-md p-l-5 p-r-5',
                ]"
                >{{ $t('key5', { currency: filteredClubWallet.amount }) | currency }}
              </span>
            </h4>
          </div>
          <div class="is-primary has-text-white p-t-5 p-b-5 rounded-md m-t-20">
            <div class="fw600 is-size-6 has-text-centered m-b--5">{{ $t('ukupanIznosZaNaplatu') }}</div>
            <div class="fw600 is-size-3 has-text-centered">{{ order.total | currency }}</div>
          </div>

          <ValidationProvider name="Napomena">
            <b-field :label="$t('napomena')" class="login__input__container">
              <b-input v-model="order.note" type="textarea" rounded> </b-input>
            </b-field>
          </ValidationProvider>
          <div class="buttons m-t-15">
            <b-button
              class="m-l-5 m-t-20 fw600"
              :type="paying ? 'is-success' : 'is-success'"
              pack="fal"
              icon-right="check"
              rounded
              native-type="submit"
              :loading="loading"
              @click.prevent="submit"
            >
              {{ $t('Naplati') }}
            </b-button>
          </div>
        </div>
      </transition>
      <transition name="fade">
        <div
          v-if="selectedActionButtons === 'Izradi radni nalog' && club.payment_accontation === 1"
          class="p-x-16 p-t-25 p-b-25"
        >
          <div class="fw600 is-size-5 has-text-centered m-b-20 m-t--10">{{ $t('Izradi radni nalog') }}</div>
          <div class="activity__box action__buttons br100 m-t-10">
            <div class="action__item__small fw600 br100">
              <div v-if="Object.keys(workOrderUser).length" class="align__centar__all w100">
                <TennisImage :size="[42, 42]" :src="workOrderUser.image" class="user_image m-r-10 m-l--5" alt="" />
                <div class="list__content">
                  <h3 class="fw600 has-text-black80">{{ workOrderUser.display_name }}</h3>
                </div>
                <div @click="workOrderUser = {}">
                  <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto m-r-10"> </b-icon>
                </div>
              </div>
              <div v-else class="activity__header" @click="isModalMembersActive = true">
                <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
                <div class="list__content">
                  <div class="has-text-black80 fw600 is-size-6">{{ $t('Dodaj korisnika') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!--Order information - status, client, item -->
    <div class="relative">
      <div v-if="Object.keys(order).length" class="p-x-16">
        <div class="m-t-20">
          <div class="fw600 is-size-55 m-l-5 m-b-7 has-text-centered">{{ $t('Status naloga') }}</div>
          <div class="activity__reservation">
            <transition name="fade">
              <div class="activity__box action__buttons">
                <div
                  v-for="(item, index) in status"
                  :key="index"
                  :class="selectedStatus === item ? returnBckg() : ''"
                  class="action__item__small fw600"
                  @click="selectedStatus = item"
                >
                  {{ $t(item) }}
                </div>
              </div>
            </transition>
          </div>
        </div>

        <div class="m-b-20">
          <div class="fw600 is-size-5 has-text-centered m-t-15">{{ $t('naruitelj') }}</div>
          <div class="activity__box action__buttons br100 m-t-10">
            <div class="action__item__small fw600 br100">
              <div class="align__centar__all w100">
                <TennisImage :size="[42, 42]" :src="order.buyer.image" class="user_image m-r-10 m-l--5" alt="" />
                <div class="list__content">
                  <h3 class="fw600 has-text-black80">{{ order.buyer.display_name }}</h3>
                  <template v-if="club.payment_accontation === 1">
                    <h4 class="flex align__centar__y m-t-3 is-size-65">
                      {{ $t('stanje2') }}
                      <span
                        class="m-l-5"
                        :class="[
                          filteredClubWallet.amount > 0
                            ? 'has-text-black80'
                            : 'has-text-danger is-white rounded-md p-l-5 p-r-5',
                        ]"
                        >{{ $t('key5', { currency: filteredClubWallet.amount }) | currency }}
                      </span>
                    </h4>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="fw600 is-size-5 has-text-centered m-t-15">{{ $t('Narudžba') }}</div>
        <div class="fw600 is-size-6 has-text-centered has-text-primary m-t-1 border-color-black10 p-t-5 p-b-5">
          {{ $t('naruio') }} <span class="has-text-black80">{{ order.creator.display_name }}</span>
        </div>
        <div class="fw600 is-size-6 has-text-centered has-text-primary m-t-1 border-color-black10 p-t-5 p-b-5 m-b-15">
          {{ $t('vrijemeNarudbe') }}
          <span class="has-text-black80">{{ order.created_at | moment('DD.MM.YYYY.') }}</span>
        </div>

        <div class="">
          <div v-for="(item, index) in order.items" :key="index" class="">
            <div class="product-order-list radius__16 softshadow overflow-hidden">
              <div class="grid-list-item">
                <nuxt-link v-if="item.product" :to="localePath('/shop/' + item.id)" class="has-text-black50 flex">
                  <template v-if="Object.keys(item.product.main_image).length">
                    <div class="shop-listing-img-box m-b-7 mw40 m-r-15">
                      <TennisImage
                        v-if="item.product.main_image.link"
                        :size="[500, 500]"
                        :src="item.product.main_image.link"
                        class="shop-listing-img softshadow"
                      />
                      <div v-else class="shop-img-placeholder radius__16"></div>
                    </div>
                  </template>
                  <div class="shop-meta-content">
                    <div class="fw600 is-size-5 has-text-black80 line-height-14">{{ item.product.name }}</div>
                    <div class="fw600 is-size-6 has-text-primary m-t-1">
                      {{ $t('key5', { currency: item.price }) | currency }} {{ 'x' }} {{ item.quantity }}
                    </div>
                    <div v-if="user.wallets.length" class="shop-meta-content flex__column align__centar__x w100">
                      <div
                        class="fw600 is-size-65 has-text-primary m-t-1 border-color-black10 p-t-3 m-t-7 p-b-3 flex align__centar__y"
                      >
                        {{ $t('ukupno2') }}
                        <span class="has-text-black80 is-size-5 m-l-7">{{
                          (item.price * item.quantity) | currency
                        }}</span>
                      </div>
                    </div>
                    <div v-else class="fw600 is-size-65 has-text-black30 m-t--2">
                      {{ $t('nemaAkontacijskiRaun') }}
                    </div>
                  </div>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <transition v-if="!Object.keys(order).length && loading" name="fade">
        <div class="align__centar__x m-t-30 loading_z_spinner">
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
    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip">
      <modalMembers
        :title="$t('Zaduži osobu')"
        :show-tennis-school="false"
        :is-player="true"
        @player="workOrderUser = $event"
      />
    </b-modal>
  </div>
</template>
s

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import PageHeader from '~/components/headers/blankBack'
import ShopOrder from '~/models/ShopOrder'
import modalMembers from '~/components/modal/ModalMembersAll'

export default {
  name: 'OrderItem',
  components: {
    PageHeader,
    TennisImage,
    modalMembers,
  },
  data() {
    return {
      isModalMembersActive: false,
      order: {},
      workOrderUser: {},
      total: 0,
      last_page: 0,
      offset: 1,
      loading: false,
      paying: false,
      isCash: false,
      selectedActionButtons: '',
      actionButtons: ['Naplati', 'Izradi radni nalog'],
      status: ['pending', 'completed', 'cancelled'],
      selectedStatus: '',
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    filteredClubWallet() {
      const x = this.user.wallets.find((item) => {
        return item.club_id === this.club.id
      })
      return x
    },
  },
  mounted() {
    this.getOrder()
  },
  methods: {
    returnBckg() {
      if (this.selectedStatus === 'U izradi') {
        return 'is-primary has-text-white'
      } else if (this.selectedStatus === 'Završeno') {
        return 'green has-text-white'
      } else if (this.selectedStatus === 'Otkazano') {
        return 'is-red has-text-white'
      } else {
        return ''
      }
    },
    payNow() {
      this.paying = !this.paying
    },
    getOrder() {
      this.loading = true
      ShopOrder.include('creator', 'items', 'buyer', 'items.product')
        .find(this.$route.params.id)
        .then((res) => {
          this.order = res
          this.loading = false
        })
    },
    deleteOrder() {
      this.loading = true
      const so = new ShopOrder({ id: this.order.id })
      so.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Narudžba je uspješno osvježena'),
            type: 'is-success',
          })
          this.loading = false
          this.$router.push(this.localePath('/liga'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
  },
}
</script>
