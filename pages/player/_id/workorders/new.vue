<template>
  <div class="p-b-150">
    <PageHeader :title="$t('Narudžbe')" :background="'is-primary'" />
    <div class="empty__box m-t-30">
      <div class="">
        <div class="fw600 is-size-3 m-l-5 m-b-7 has-text-centered">{{ $t('Radni nalog') }}</div>
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
      <div class="fw600 is-size-5 m-t-20 has-text-centered">{{ $t('Izvršitelj') }}</div>

      <div class="activity__box action__buttons br100 m-t-10">
        <div class="action__item__small fw600 br100">
          <div v-if="Object.keys(assignee).length" class="align__centar__all w100">
            <TennisImage :size="[42, 42]" :src="assignee.image" class="user_image m-r-10 m-l--5" alt="" />
            <div class="list__content">
              <h3>{{ assignee.display_name }}</h3>
            </div>
            <div @click="assignee = {}">
              <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto m-r-10"> </b-icon>
            </div>
          </div>
          <div v-else class="activity__header" @click="isModalMembersActiveAssignee = true">
            <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
            <div class="list__content">
              <div class="has-text-black80 fw600 is-size-6">{{ $t('Dodaj osobu') }}</div>
            </div>
          </div>
        </div>
      </div>
      <ValidationProvider name="Napomena">
        <b-field :label="$t('Opis posla')" class="login__input__container">
          <b-input v-model="order.note" type="textarea" rounded> </b-input>
        </b-field>
      </ValidationProvider>
    </div>

    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip">
      <modalMembers :title="$t('naruitelj')" :show-tennis-school="false" :is-player="true" @player="client" />
    </b-modal>
    <b-modal :active.sync="modalPayment" :width="640" scroll="clip">
      <modalPayment :title="$t('plaanje')" />
    </b-modal>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import ShopOrder from '~/models/ShopOrder'
import PageHeader from '~/components/headers/blankBack'
import modalMembers from '~/components/modal/ModalMembersAll'
import modalPayment from '~/components/modal/ModalPayment'

export default {
  name: 'NewOrder',
  components: {
    PageHeader,
    TennisImage,
    modalMembers,
    modalPayment,
  },
  data() {
    return {
      isCash: false,
      modalPayment: false,
      isModalMembersActive: false,
      loading: false,
      quantity: 1,
      data: {},
      order: {
        items: [],
        client: {},
        note: '',
      },
      product: {
        quantity: null,
        id: null,
        name: '',
        description: '',
        price: null,
        tax_percent: 25,
        type: 'simple',
        special: 0,
        image: null,
        image_id: null,
        club_id: null,
      },
      paying: false,
      clients_string: 0,
      string: {},
      note: '',
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
  },
  mounted() {
    // this.getProduct()
  },
  methods: {
    payNow() {
      this.paying = !this.paying
    },
    client(item) {
      this.order.client = item
    },
    submit() {
      this.loading = true
      this.product.quantity = this.quantity
      this.product.data = this.data
      this.product.clients_string = this.clients_string
      this.order.items.push(this.product)
      if (this.clients_string === 1 && Object.keys(this.string).length) {
        this.string.quantity = this.quantity
        this.order.items.push(this.string)
      }
      const shopOrder = new ShopOrder(this.order)
      shopOrder
        .save()
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste izradili narudžbu'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/admin/orders/' + res.id))
          this.loading = false
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
