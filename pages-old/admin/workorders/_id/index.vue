<template>
  <div class="p-b-150">
    <PageHeader :title="$t('Radni nalog')" :background="returnBckg()" />
    <div class="flex has-text-white fw600 has-text-centered m-t--2 border-dashed-top w100">
      <div v-if="Object.keys(workorder).length" class="p-all-12 flex-grow-1" :class="returnBckg()">
        {{ $t(workorder.status) }}
      </div>

      <div
        v-if="workorder.orderable_id !== 0"
        :class="tempPay ? 'green' : 'is-red'"
        class="p-all-12 align__centar__all border-dashed-left flex-grow-1"
      >
        <h4 v-if="tempPay" class="has-text-white fw600 is-size-6 flex align__centar__y">
          {{ $t('Plaćeno') }}
          <font-awesome-icon class="m-r--5 m-l-5 has-text-white iw12" icon="fa-light fa-check" />
        </h4>
        <h4 v-else class="has-text-white fw600 is-size-6 flex align__centar__y">
          {{ $t('Nije plaćeno') }}
          <font-awesome-icon class="m-r--5 m-l-5 has-text-white iw12" icon="fa-light fa-times" />
        </h4>
      </div>
    </div>
    <!--    If is blank work order, show this:-->
    <template v-if="workorder.orderable_id === 0">
      <div class="fw600 is-size-6 has-text-centered has-text-primary m-t-20 p-t-5 p-b-5">
        {{ $t('Zadao') }}:
        <span class="has-text-black80">{{ workorder.assigner.display_name }}</span>
      </div>

      <div class="fw600 is-size-6 has-text-centered has-text-primary m-t-1 border-color-black10 p-t-5 p-b-5">
        {{ $t('vrijemeNarudbe') }}
        <span class="has-text-black80">{{ workorder.created_at | moment('DD.MM.YYYY.') }}</span>
      </div>
      <div
        v-if="workorder.completed_at"
        class="fw600 is-size-6 has-text-centered has-text-primary m-t-1 border-color-black10 p-t-5 p-b-5"
      >
        {{ $t('Završen') }}:
        <span class="has-text-black80">{{ workorder.completed_at | moment('DD.MM.YYYY.') }}</span>
      </div>

      <div
        v-if="workorder.note"
        class="fw600 is-size-6 has-text-centered has-text-primary m-t-1 border-color-black10 p-t-5 p-b-5 m-b-15"
      >
        {{ $t('Opis zadatka') }}:
        <span class="has-text-black80">{{ workorder.note }}</span>
      </div>

      <!--    Assignee -->

      <div v-if="Object.keys(workorder).length" class="p-x-16 m-t-20">
        <div class="fw600 is-size-5 m-t-5 has-text-centered">{{ $t('Izvršitelj') }}</div>
        <div class="activity__box action__buttons br100 m-t-10">
          <div class="action__item__small fw600 br100">
            <div v-if="Object.keys(workorder.assignee).length" class="align__centar__all w100">
              <TennisImage :size="[42, 42]" :src="workorder.assignee.image" class="user_image m-r-10 m-l--5" alt="" />
              <div class="list__content">
                <h3 class="fw600 has-text-black80">{{ workorder.assignee.display_name }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--Status-->

      <div v-if="Object.keys(workorder).length" class="m-t-20 p-x-16">
        <div class="fw600 is-size-55 m-l-5 m-b-7 has-text-centered">{{ $t('Status naloga') }}</div>
        <div class="activity__reservation">
          <transition name="fade">
            <div class="activity__box action__buttons">
              <div
                v-for="(item, index) in status"
                :key="index"
                :class="workorder.status === item ? returnBckg() : ''"
                class="action__item__small fw600"
                @click="
                  workorder.status = item
                  isTouched = true
                "
              >
                {{ $t(item) }}
              </div>
            </div>
          </transition>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-if="Object.keys(order).length" class="p-x-16">
        <!--        Payment-->
        <div class="is-primary has-text-white p-t-5 p-b-5 radius__12 m-b-15 m-t-30">
          <div class="fw600 is-size-6 has-text-centered m-b--5">{{ $t('ukupanIznosZaNaplatu') }}</div>
          <div class="fw600 is-size-3 has-text-centered">{{ order.total | currency }}</div>
        </div>

        <div class="fw600 is-size-6 has-text-centered has-text-primary m-t-1 border-color-black10 p-t-5 p-b-5">
          {{ $t('Naručitelj') }}:
          <span class="has-text-black80">{{ order.buyer.display_name }}</span>
        </div>
        <div
          v-if="workorder.assigner"
          class="fw600 is-size-6 has-text-centered has-text-primary m-t-1 border-color-black10 p-t-5 p-b-5"
        >
          {{ $t('Obradio narudžbu') }}
          <span class="has-text-black80">{{ workorder.assigner.display_name }}</span>
        </div>
        <div class="fw600 is-size-6 has-text-centered has-text-primary m-t-1 border-color-black10 p-t-5 p-b-5">
          {{ $t('vrijemeNarudbe') }}
          <span class="has-text-black80">{{ order.created_at | moment('DD.MM.YYYY.') }}</span>
        </div>
        <div
          v-if="workorder.note"
          class="fw600 is-size-6 has-text-centered has-text-primary m-t-1 border-color-black10 p-t-5 p-b-5 m-b-15"
        >
          {{ $t('Bilješka') }}:
          <span class="has-text-black80">{{ workorder.note }}</span>
        </div>

        <!--    Assignee -->
        <div v-if="Object.keys(order).length" class="p-x-16 m-t-20">
          <div class="fw600 is-size-5 m-t-5 has-text-centered">{{ $t('Izvršitelj') }}</div>
          <div class="activity__box action__buttons br100 m-t-10">
            <div class="action__item__small fw600 br100">
              <div v-if="Object.keys(workorder.assignee).length" class="align__centar__all w100">
                <TennisImage :size="[42, 42]" :src="workorder.assignee.image" class="user_image m-r-10 m-l--5" alt="" />
                <div class="list__content">
                  <h3 class="fw600 has-text-black80">{{ workorder.assignee.display_name }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--Status-->
        <div v-if="Object.keys(order).length" class="m-t-20 p-x-16">
          <div class="fw600 is-size-55 m-l-5 m-b-7 has-text-centered">{{ $t('Status naloga') }}</div>
          <div v-if="order.work_orders.length" class="activity__reservation">
            <transition name="fade">
              <div class="activity__box action__buttons">
                <div
                  v-for="(item, index) in status"
                  :key="index"
                  :class="workorder.status === item ? returnBckg() : ''"
                  class="action__item__small fw600"
                  @click="
                    workorder.status = item
                    isTouched = true
                  "
                >
                  {{ $t(item) }}
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!--stringing part-->
      <div v-if="Object.keys(order).length" class="tablelist p-x-16">
        <template v-if="order.items[0].product.special === 'stringing'">
          <div v-if="Object.keys(workorder.data.racquet).length" class="fw600 is-size-55 m-t-20 m-b-5">
            {{ $t('Reket') }}
          </div>
          <transition name="fade">
            <div v-if="Object.keys(workorder.data.racquet).length" class="activity__box action__buttons">
              <div class="p-r-10 p-l-10 p-t-7 p-b-7 bb1-10 payment_accontation">
                <div class="fw600 align__centar__all">
                  <div v-if="workorder.data.racquet.image" class="list__img">
                    <TennisImage :size="[42, 42]" :src="workorder.data.racquet.image" class="user_image" alt="" />
                  </div>
                  <div v-else class="">
                    <b-icon
                      icon="racquet"
                      pack="far"
                      size="is-medium m-r-15 m-l-5 top-5"
                      class="relative has-text-black30"
                    ></b-icon>
                  </div>
                  <div class="list__content">
                    <h4 class="fw600 is-size-5 has-text-black80 m-t--2">
                      {{ workorder.data.racquet.name }}
                    </h4>
                    <h3 v-if="workorder.data.racquet.description" class="fw600 m-t--2 has-text-black80 is-size-65">
                      {{ $t('opis2') }}
                      <span class="has-text-lightblue">{{ workorder.data.racquet.description }}</span>
                    </h3>
                    <div
                      v-if="workorder.data.racquet.data.tension"
                      class="has-text-black80 fw600 is-size-65 m-l-auto nowrap"
                    >
                      {{ $t('kilaa') }}
                      <span class="has-text-lightblue">{{
                        $t('kg', { tension: workorder.data.racquet.data.tension })
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </template>
        <div v-if="workorder.data.clients_string" class="has-text-centered w100 m-t-10">
          <div class="fw600 has-text-centered has-text-danger">{{ $t('Naručitelj je donio vlastite žice') }}</div>
        </div>
      </div>

      <!--Order information - client, item -->
      <div class="relative m-t-30">
        <div v-if="Object.keys(order).length" class="p-x-16">
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
    </template>
    <div v-show="isTouched" class="buttons is-fixed m-t-15">
      <b-button
        class="m-l-5 m-t-20 fw600"
        type="is-danger"
        pack="fal"
        icon-left="times"
        rounded
        tag="nuxt-link"
        :to="localePath('/admin/')"
      >
        {{ $t('odustani') }}
      </b-button>
      <b-button
        class="m-l-5 m-t-20 fw600"
        :type="paying ? 'is-success' : 'is-primary'"
        pack="fal"
        icon-right="check"
        rounded
        native-type="submit"
        :loading="loading"
        @click.prevent="saveWorkOrder"
      >
        {{ $t('Spremi promjene') }}
      </b-button>
    </div>

    <b-modal :active.sync="isModalMembersActiveAssignee" :width="640" scroll="clip">
      <modalMembers
        :title="$t('Izvršitelj')"
        :show-tennis-school="false"
        :is-player="true"
        @player="workorder.assignee = $event"
      />
    </b-modal>

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

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import PageHeader from '~/components/headers/blankBack'
import WorkOrder from '~/models/WorkOrder'
import modalMembers from '~/components/modal/ModalMembersAll'
import ShopOrder from '~/models/ShopOrder'

export default {
  name: 'WorkOrderItem',
  components: {
    PageHeader,
    TennisImage,
    modalMembers,
  },
  data() {
    return {
      isModalMembersActive: false,
      isModalMembersActiveAssignee: false,
      order: {},
      tempPay: true,
      isTouched: false,
      workorder: {},
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
    this.getWorkOrder()
  },
  methods: {
    returnBckg() {
      if (this.workorder.status === 'pending') {
        return 'is-primary has-text-white'
      } else if (this.workorder.status === 'completed') {
        return 'green has-text-white'
      } else if (this.workorder.status === 'cancelled') {
        return 'is-red has-text-white'
      } else {
        return ''
      }
    },
    payNow() {
      this.paying = !this.paying
    },
    getWorkOrder() {
      this.loading = true
      WorkOrder.include('assignee', 'assigner')
        .find(this.$route.params.id)
        .then((res) => {
          this.workorder = res
          this.loading = false
          if (res.orderable_id !== 0) {
            this.getOrder()
          }
        })
    },
    getOrder() {
      this.loading = true
      ShopOrder.include(
        'creator',
        'items',
        'buyer',
        'items.product',
        'work_orders',
        'work_orders.assignee',
        'work_orders.assigner'
      )
        .find(this.workorder.orderable_id)
        .then((res) => {
          this.order = res
          this.loading = false
        })
    },
    saveWorkOrder() {
      if (this.workorder.orderable_id === 0) {
        this.saveWorkOrderOnly()
      } else {
        this.loading = true
        const workOrder = new WorkOrder(this.workorder).for(new ShopOrder({ id: this.order.id }))
        workOrder
          .save()
          .then(() => {
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste izradili radni nalog'),
              type: 'is-success',
            })
            this.loading = false
            this.$router.push(this.localePath('/admin/workorders/'))
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
              type: 'is-danger',
            })
            this.loading = false
          })
      }
    },
    saveWorkOrderOnly() {
      this.loading = true
      const workOrder = new WorkOrder({ id: this.workorder.id, status: this.workorder.status })
      workOrder
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili radni nalog'),
            type: 'is-success',
          })
          this.loading = false
          this.$router.push(this.localePath('/admin/workorders/'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    deleteOrder() {
      this.loading = true
      const so = new ShopOrder({ id: this.workorder.orderable_id })
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
