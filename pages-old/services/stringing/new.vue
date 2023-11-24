<template>
  <div class="trainers">
    <hero :options="heroImage" :back="true">
      <h1 class="has-text-white">{{ $t('novoPananje') }}</h1>
    </hero>
    <div class="p-x-16">
      <div class="fw600 is-size-3 has-text-centered m-t-15">{{ $t('naruiteljPanunga') }}</div>
      <div class="activity__box action__buttons br100 m-t-15">
        <div class="action__item__small fw600 br100">
          <div v-if="Object.keys(workorder.client).length" class="align__centar__all w100">
            <TennisImage :size="[42, 42]" :src="workorder.client.image" class="user_image m-r-10 m-l--5" alt="" />
            <div class="list__content">
              <h3>{{ workorder.client.display_name }}</h3>
              <h4>{{ $t('godina range', { range: workorder.client.range }) }}</h4>
            </div>
            <div @click="workorder.client = {}">
              <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto m-r-10"> </b-icon>
            </div>
          </div>
          <div v-else class="activity__header" @click="isModalMembersActive = true">
            <b-icon icon="plus-circle" type="is-green" pack="fal" class="m-r-10"> </b-icon>
            <div class="list__content">
              <div class="has-text-black80 fw600 is-size-6">{{ $t('dodajNaruitelja') }}</div>
            </div>
          </div>
        </div>
      </div>
      <template v-if="Object.keys(workorder.client).length">
        <racquet :player="workorder.client" @racquet="workorder.racquet = $event" />
        <form @submit.prevent="submit">
          <div class="label">{{ $t('vlastitaIca') }}</div>
          <ValidationProvider v-slot="{ errors, valid }" name="Vlastita žica" class="radio__box">
            <div class="block">
              <b-radio v-model="workorder.clients_string" :type="valid ? 'is-success' : 'is-danger'" :native-value="1">
                {{ $t('da') }}
              </b-radio>
              <b-radio v-model="workorder.clients_string" :type="valid ? 'is-success' : 'is-danger'" :native-value="0">
                {{ $t('ne') }}
              </b-radio>
            </div>
          </ValidationProvider>
          <strings v-if="workorder.clients_string === 0" @string="workorder.strings = $event" />
          <ValidationProvider name="Napomena">
            <b-field :label="$t('napomena')" class="login__input__container">
              <b-input v-model="workorder.description" type="textarea" rounded> </b-input>
            </b-field>
          </ValidationProvider>
          <div class="buttons m-t-15 m-b-30">
            <b-button
              class="m-l-5 m-t-20 fw600"
              type="is-danger"
              pack="fal"
              icon-left="times"
              rounded
              @click="$router.go(-1)"
            >
              {{ $t('odustani') }}
            </b-button>
            <b-button
              class="m-l-5 m-t-20 fw600"
              type="is-primary"
              pack="fal"
              icon-right="check"
              rounded
              native-type="submit"
              :loading="loading"
              @click.prevent="submit"
            >
              {{ $t('spremi') }}
            </b-button>
          </div>
        </form>
      </template>
    </div>
    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip">
      <modalMembers
        :title="$t('naruitelj')"
        :show-tennis-school="false"
        :is-player="true"
        @player="client"
      ></modalMembers>
    </b-modal>
    <b-modal :active.sync="isModalConfirmationActive" :width="640" scroll="clip" class="modal__confirmation">
      <modalConfirmation
        :title="$t('potvrdomEteObrisatiReketSIgraogPopisa')"
        :subtitle="$t('Jeste li sigurni?')"
        @update="deleteRacquet()"
      ></modalConfirmation>
    </b-modal>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import racquet from '~/components/services/racquet'
import hero from '~/components/Hero'
import modalMembers from '~/components/modal/ModalMembersAll'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import strings from '~/components/services/strings'
import ShopOrder from '~/models/ShopOrder'
// import WorkOrder from '~/models/WorkOrder'
import ShopProduct from '~/models/ShopProduct'

export default {
  name: 'NewStringing',
  components: {
    hero,
    modalMembers,
    modalConfirmation,
    racquet,
    strings,
    TennisImage,
  },
  data() {
    return {
      isModalConfirmationActive: false,
      isModalMembersActive: false,
      loading: false,
      loadingMedia: false,
      heroImage: '/stringing.jpg',
      activeTab: 0,
      isCardModalActive: false,
      workorder: {
        racquet: {
          name: '',
          string: '',
          tension: null,
          image: '',
        },
        strings: {},
        client: {},
        took_order: {},
        clients_string: 0,
        description: '',
      },
      selected_racquet: null,
      order: {
        items: [],
        client: {},
      },
      stringingService: {},
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  mounted() {
    this.getStringing()
  },
  methods: {
    client(item) {
      this.workorder.client = item
    },
    getStringing() {
      ShopProduct.where('club', this.$store.state.club.id)
        .where('special', 'stringing')
        .get()
        .then((res) => {
          this.stringingService = res.data[0]
        })
    },
    submit() {
      this.loading = true
      this.order.items.push(this.stringingService)
      this.order.items.push(this.workorder.strings)
      for (let i = 0; i < this.order.items.length; i++) {
        this.order.items[i].quantity = 1
      }
      this.order.client = this.workorder.client
      const shopOrder = new ShopOrder(this.order)
      shopOrder
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste izradili narudžbu'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/shop'))
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.order.items = []
          this.loading = false
        })
    },
    // submit() {
    //   this.loading = true
    //   this.order.items.push(this.product)
    //   this.order.items[0].quantity = this.quantity
    //   const workOrder = new WorkOrder(this.order)
    //   workOrder
    //     .for(new ShopOrder({ id: 1 }))
    //     .save()
    //     .then(() => {
    //       this.$buefy.toast.open({
    //         message: this.$t('Uspješno ste izradili narudžbu'),
    //         type: 'is-success',
    //       })
    //       this.$router.push(this.localePath('/shop'))
    //       this.loading = false
    //     })
    //     .catch(() => {
    //       this.$buefy.toast.open({
    //         message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
    //         type: 'is-danger',
    //       })
    //       this.loading = false
    //     })
    // },
  },
}
</script>
