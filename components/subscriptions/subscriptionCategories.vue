<template>
  <div>
    <div class="buttons m-t-20 m-b-10">
      <template v-if="!isSmall">
        <b-button
          v-if="activeTab === 0"
          class="fw600 softshadow"
          type="is-primary"
          pack="fal"
          icon-right="plus"
          rounded
          @click="newSubscriptionAction()"
        >
          {{ $t('Nova Članarina') }}
        </b-button>
      </template>
      <b-button
        v-if="activeTab === 1 && !hideList"
        class="fw600 softshadow"
        type="is-white"
        pack="fal"
        icon-left="chevron-left"
        rounded
        @click="
          activeTab = 0
          isTouched = 0
        "
      >
        {{ $t('nazad') }}
      </b-button>
    </div>
    <b-tabs v-model="activeTab" position="is-centered" class="hide_tab_navigation_impt p-b-150">
      <b-tab-item>
        <div class="relative m-t-20">
          <div v-if="subscriptions.length" class="tablelist">
            <!--            <div class="fw600 is-size-55 m-t-20 m-b-5 has-text-white">{{ $t('Odaberi pretplatu') }}</div>-->
            <transition name="fade">
              <div class="activity__box action__buttons">
                <div
                  v-for="(item, index) in subscriptions"
                  :key="item.id"
                  class="p-r-10 p-l-10 p-t-7 p-b-7 bb1-10 payment_accontation has-text-left"
                  @click.stop="sendEmit(item, index)"
                >
                  <div class="fw600 align__centar__all">
                    <div class="list__content">
                      <div
                        v-if="!isSmall"
                        class="inlineblock is-size-7 x-tag nav__notification has-text-white m-b-5"
                        :class="item.status === 'pause' ? 'is-red' : 'green'"
                      >
                        {{ $t(item.status) }}
                      </div>
                      <h4 class="fw600 is-size-5 has-text-black80 m-t--2">{{ item.name }}</h4>

                      <div class="fw600 has-text-black80 is-size-65 m-l-auto nowrap">
                        {{ $t('Cijena') }}
                        <span class="has-text-lightblue">{{ item.price | currency }}</span>
                      </div>
                      <template v-if="!isSmall">
                        <div class="fw600 has-text-black80 is-size-65 m-l-auto nowrap">
                          {{ item.description }}
                        </div>
                        <div class="fw600 has-text-black80 is-size-65 m-l-auto nowrap">
                          {{ $t('Broj korisnika') }}: <span class="has-text-black80">{{ item.id }}</span>
                        </div>
                      </template>
                    </div>
                    <div class="action m-l-auto">
                      <b-icon class="m-r--5" icon="chevron-right" size="is-smaller" pack="fal"> </b-icon>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
            <div v-if="subscriptions.length > 3 || isSmall" class="buttons m-t-20">
              <b-button
                class="softshadow"
                type="is-small noborder"
                pack="fas"
                icon-right="plus"
                rounded
                @click="newSubscriptionAction()"
              >
                {{ $t('Nova Članarina') }}
              </b-button>
            </div>
          </div>
          <div v-if="!subscriptions.length && !loading" class="flex flex__column align__centar__y m-t-30">
            <template v-if="true">
              <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
              <div class="fw600 is-size-5 has-text-centered has-text-white m-b-10 m-t-5">
                {{ $t('Nema spremljenih Članarina') }}
              </div>
              <div class="buttons m-t-10">
                <b-button
                  class="softshadow"
                  type="is-small noborder"
                  pack="fas"
                  icon-right="plus"
                  rounded
                  @click="activeTab = 1"
                >
                  {{ $t('Unesi članarinu') }}
                </b-button>
              </div>
            </template>
          </div>
          <transition v-if="!subscriptions.length && loading" name="fade">
            <div class="align__centar__x m-t-30 loading_z_spinner">
              <b-icon
                class="comment-send"
                custom-class="rotating"
                icon="spinner"
                size="is-large"
                type="is-primary"
                pack="far"
              ></b-icon>
            </div>
          </transition>
        </div>
      </b-tab-item>
      <b-tab-item>
        <!--        <div class="buttons m-t-15 m-b-5">-->
        <!--          <b-button-->
        <!--            class="softshadow"-->
        <!--            type="is-small noborder"-->
        <!--            pack="fal"-->
        <!--            icon-left="chevron-left"-->
        <!--            rounded-->
        <!--            @click="activeTab = 0"-->
        <!--          >-->
        <!--            {{ $t('nazad') }}-->
        <!--          </b-button>-->
        <!--        </div>-->
        <div class="reservation-categories-box">
          <div class="fw600 is-size-3 has-text-centered has-text-black80 subscription-title m-b--10">
            {{ isEditing ? $t('Uredi članarinu') : $t('Unesi novu članarinu') }}
          </div>
          <ValidationObserver v-slot="{ invalid }">
            <form class="p-b-150 m-t-30 registration" @submit.prevent="submit(invalid)">
              <ValidationProvider v-slot="{ errors, valid }" name="Naziv Članarine" rules="required">
                <b-field
                  :label="$t('Naziv')"
                  class="login__input__container"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-input
                    v-model="newSubscription.name"
                    :placeholder="$t('Upiši naziv članarine')"
                    type="text"
                    rounded
                  ></b-input>
                </b-field>
              </ValidationProvider>
              <div class="label">{{ $t('Status članarine') }}</div>
              <ValidationProvider v-slot="{ errors, valid }" name="Spol" rules="required" class="radio__box">
                <div class="block">
                  <b-radio
                    v-model="newSubscription.status"
                    :type="valid ? 'is-success' : 'is-danger'"
                    native-value="active"
                  >
                    {{ $t('Aktivna') }}
                  </b-radio>
                  <b-radio
                    v-model="newSubscription.status"
                    :type="valid ? 'is-danger' : 'is-danger'"
                    native-value="pause"
                  >
                    {{ $t('Pauzirana') }}
                  </b-radio>
                </div>
              </ValidationProvider>

              <ValidationProvider name="Opis Članarine">
                <b-field :label="$t('Opis')" class="login__input__container has-text-white">
                  <b-input
                    v-model="newSubscription.description"
                    :placeholder="$t('Upiši opis članarine')"
                    type="text"
                    rounded
                  ></b-input>
                </b-field>
              </ValidationProvider>
              <ValidationProvider name="Cijena Članarine">
                <b-field :label="$t('Cijena')" class="login__input__container has-text-white">
                  <b-input
                    v-model="newSubscription.price"
                    :placeholder="$t('Upiši cijenu članarine')"
                    type="number"
                    rounded
                  ></b-input>
                </b-field>
              </ValidationProvider>
              <div class="label">{{ $t('Porez') }}</div>

              <ValidationProvider name="Tax" rules="required" class="radio__box">
                <div class="block">
                  <b-radio
                    v-for="item in taxes"
                    :key="item.id"
                    v-model="newSubscription.tax_class"
                    :native-value="item"
                  >
                    {{ item.rate }}%
                  </b-radio>
                </div>
              </ValidationProvider>
              <template v-if="business_unit.length > 1">
                <div class="label--center m-t-20">{{ $t('Odaberi poslovnu jedinicu') }}</div>
                <div class="buttons m-t-10 m-b-5">
                  <b-button
                    v-for="(item, index) in business_unit"
                    :key="index"
                    class="m-t-5 m-b-5 m-l-5 m-r-5"
                    :class="{
                      softshadow: true,
                      'invert-small-button': newSubscription.business_unit?.name === item.name,
                    }"
                    :icon-right="newSubscription.business_unit?.name === item.name ? 'check' : ''"
                    :type="{
                      'is-small': true,
                      noborder: true,
                      'is-primary has-text-white': newSubscription.business_unit?.name === item.name,
                    }"
                    pack="fal"
                    rounded
                    @click.prevent="selectBusinessUnit(item)"
                  >
                    {{ item.name }}
                  </b-button>
                </div>
                <div class="divider-line-1 m-t-10"></div>
              </template>

              <!--              <ValidationProvider name="iban">-->
              <!--                <b-field :label="$t('IBAN')" class="login__input__container has-text-white">-->
              <!--                  <b-input-->
              <!--                    v-model="newSubscription.bank_account"-->
              <!--                    :placeholder="$t('Upiši broj IBAN računa')"-->
              <!--                    type="number"-->
              <!--                    rounded-->
              <!--                  ></b-input>-->
              <!--                </b-field>-->
              <!--              </ValidationProvider>-->
              <div class="label">{{ $t('Automatsko slanje računa') }}</div>

              <ValidationProvider
                v-slot="{ errors, valid }"
                name="automatic_bill_sending"
                rules="required"
                class="radio__box"
              >
                <div class="block">
                  <b-radio
                    v-model="newSubscription.automatic_bill_sending"
                    :type="valid ? 'is-success' : 'is-danger'"
                    :native-value="true"
                  >
                    {{ $t('da') }}
                  </b-radio>
                  <b-radio
                    v-model="newSubscription.automatic_bill_sending"
                    :type="valid ? 'is-danger' : 'is-danger'"
                    :native-value="false"
                  >
                    {{ $t('ne') }}
                  </b-radio>
                </div>
              </ValidationProvider>
              <div
                v-if="newSubscription.automatic_bill_sending"
                class="fw600 has-text-lightblue is-size-65 m-t-5 has-text-left"
              >
                {{ $t('Računi će se automatski poslati korisnicima na email') }}
              </div>
              <div
                v-if="!newSubscription.automatic_bill_sending"
                class="fw600 has-text-lightblue is-size-65 m-t-5 has-text-left"
              >
                {{ $t('Potvrda prije slanja') }}
              </div>

              <div class="">
                <div class="label">{{ $t('Dinamika plaćanja') }}</div>
                <ValidationProvider name="Freeze" rules="required" class="radio__box">
                  <div class="block">
                    <b-field class="has-text-left">
                      <b-radio v-model="newSubscription.interval" :native-value="'month'">
                        {{ $t('Mjesečno') }}
                      </b-radio>
                    </b-field>
                    <b-field class="has-text-left">
                      <b-radio v-model="newSubscription.interval" :native-value="'3months'">
                        {{ $t('Tromjesečno') }}
                      </b-radio>
                    </b-field>
                    <b-field class="has-text-left">
                      <b-radio v-model="newSubscription.interval" :native-value="'6months'">
                        {{ $t('Polugodišnje') }}
                      </b-radio>
                    </b-field>
                    <b-field class="has-text-left">
                      <b-radio v-model="newSubscription.interval" :native-value="'12months'">
                        {{ $t('Godišnje') }}
                      </b-radio>
                    </b-field>
                  </div>
                </ValidationProvider>
              </div>
              <div class="">
                <div class="label">{{ $t('Vrijeme slanje računa') }}</div>
                <ValidationProvider name="sending_bills" rules="required" class="radio__box">
                  <div class="block">
                    <b-field class="has-text-left">
                      <b-radio v-model="newSubscription.sending_bills" :native-value="'last'">
                        {{ $t('Zadnjeg u mjesecu') }}
                      </b-radio>
                    </b-field>
                    <b-field class="has-text-left">
                      <b-radio v-model="newSubscription.sending_bills" :native-value="'first'">
                        {{ $t('Prvog u mjesecu') }}
                      </b-radio>
                    </b-field>
                    <b-field class="has-text-left">
                      <b-radio v-model="newSubscription.sending_bills" :native-value="'middle'">
                        {{ $t('Sredina mjeseca') }}
                      </b-radio>
                    </b-field>
                  </div>
                </ValidationProvider>
              </div>
              <template>
                <div class="divider-line-1 m-t-30"></div>
                <div class="fw600 subscription-title is-size-3">{{ $t('Upozorenja') }}</div>
                <div class="fw600 is-size-6 has-text-lightblue">
                  {{ $t('Pošaljite upozorenja korisnicima koji nisu podmirili svoje račune') }}
                </div>
                <div
                  class="fw600 is-size-5 m-t-30 flex align__centar__all is-primary radius__12 has-text-white p-t-7 p-b-7 w100"
                >
                  <b-icon icon="exclamation-square" pack="fal" type="is-white" class="is-smaller m-r-10"> </b-icon>
                  {{ $t('Prvo upozorenje') }}
                </div>
                <ValidationProvider name="Upozorenje">
                  <div class="label--center m-t-20">
                    {{ $t('Koliko dana nakon poslanog račun se šalje prvo upozorenje') }}
                  </div>
                  <b-field v-if="newSubscription.warnings">
                    <b-numberinput
                      v-model="newSubscription.warnings[0].when"
                      class="m-t-10"
                      placeholder="0"
                      min="0"
                      type="is-white"
                      controls-rounded
                      rounded
                    ></b-numberinput>
                  </b-field>
                </ValidationProvider>

                <div class="">
                  <div class="label">{{ $t('Odaberi upozorenja') }}</div>
                  <ValidationProvider name="Freeze" rules="required" class="radio__box checkbox">
                    <div v-if="newSubscription.warnings" class="block">
                      <b-field class="has-text-left">
                        <b-checkbox v-model="newSubscription.warnings[0].app" :true-value="true">
                          {{ $t('Iskočni prozor na aplikaciji') }}
                        </b-checkbox>
                      </b-field>
                      <b-field class="has-text-left">
                        <b-checkbox v-model="newSubscription.warnings[0].push" :true-value="true">
                          {{ $t('Slanje push obavijesti') }}
                        </b-checkbox>
                      </b-field>
                      <b-field class="has-text-left">
                        <b-checkbox v-model="newSubscription.warnings[0].mail" :true-value="true">
                          {{ $t('Slanje e-maila') }}
                        </b-checkbox>
                      </b-field>
                    </div>
                  </ValidationProvider>
                </div>
                <div class="m-t-30 rounded-md">
                  <div class="activity__header m-b-5 m-t--10 has-text-centered">
                    <div class="fw600 is-size-6 has-text-black80 subscription-title has-text-centered">
                      {{ $t('Poruka upozorenja') }}
                    </div>
                  </div>
                  <b-field v-if="newSubscription.warnings">
                    <b-input
                      v-model="newSubscription.warnings[0].text"
                      type="textarea"
                      rows="5"
                      :placeholder="$t('ovdjeMoeteUpisatiPorukuZaBlokiranogKorisnikaIliUit')"
                    ></b-input>
                  </b-field>
                  <div
                    class="fw600 has-text-primary is-size-65 has-text-centered"
                    @click="newSubscription.warnings[0].text = pre_message"
                  >
                    {{ $t('popuniPredefiniranimTekstom') }}
                  </div>
                </div>
                <template>
                  <div
                    class="fw600 is-size-5 m-t-30 flex align__centar__all is-red radius__12 has-text-white p-t-7 p-b-7 w100"
                  >
                    <b-icon icon="exclamation-square" pack="fal" type="is-white" class="is-smaller m-r-2"> </b-icon>
                    <b-icon icon="exclamation-square" pack="fal" type="is-white" class="is-smaller m-r-10"> </b-icon>
                    {{ $t('Drugo upozorenje') }}
                  </div>
                  <ValidationProvider name="Upozorenje">
                    <div class="label--center m-t-20">
                      {{ $t('Koliko dana nakon poslanog račun se šalje drugo upozorenje') }}
                    </div>
                    <b-field v-if="newSubscription.warnings">
                      <b-numberinput
                        v-model="newSubscription.warnings[1].when"
                        class="m-t-10"
                        placeholder="0"
                        :min="newSubscription.warnings[0].when"
                        type="is-white"
                        controls-rounded
                        rounded
                      ></b-numberinput>
                    </b-field>
                  </ValidationProvider>
                  <div v-if="newSubscription.warnings" class="">
                    <div class="label">{{ $t('Odaberi upozorenja') }}</div>
                    <ValidationProvider name="Freeze" rules="required" class="radio__box checkbox">
                      <div class="block">
                        <b-field class="has-text-left">
                          <b-checkbox v-model="newSubscription.warnings[1].app" :true-value="true">
                            {{ $t('Iskočni prozor na aplikaciji') }}
                          </b-checkbox>
                        </b-field>
                        <b-field class="has-text-left">
                          <b-checkbox v-model="newSubscription.warnings[1].push" :true-value="true">
                            {{ $t('Slanje push obavijesti') }}
                          </b-checkbox>
                        </b-field>
                        <b-field class="has-text-left">
                          <b-checkbox v-model="newSubscription.warnings[1].mail" :true-value="true">
                            {{ $t('Slanje e-maila') }}
                          </b-checkbox>
                        </b-field>
                      </div>
                    </ValidationProvider>
                  </div>
                </template>
              </template>
              <div class="buttons m-t-30 m-b-5">
                <b-button
                  v-if="isEditing"
                  class="softshadow m-t-10 m-b-20 invert-small-button"
                  type="is-small noborder is-danger has-text-white"
                  pack="fal"
                  icon-right="times"
                  rounded
                  @click="isModalConfirmationActive = true"
                >
                  {{ $t('obrii') }}
                </b-button>
                <b-button
                  v-if="!hideList"
                  class="softshadow m-t-10 m-b-20 invert-small-button"
                  type="noborder is-small is-primary has-text-white"
                  pack="fal"
                  icon-right="check"
                  rounded
                  :loading="loading"
                  @click="submit()"
                >
                  {{ $t('spremi') }}
                </b-button>
              </div>
              <div v-show="activeTab === 1" :class="hideList ? '' : 'is-fixed'" class="buttons m-t-20 m-l--5 m-t-30">
                <b-button
                  v-if="!hideList"
                  class="m-l-10 fw600"
                  type="is-danger"
                  pack="fal"
                  icon-left="chevron-left"
                  rounded
                  @click="
                    activeTab = 0
                    isTouched = 0
                  "
                >
                  {{ $t('nazad') }}
                </b-button>
                <b-button
                  :class="{ blur_button: isTouched < 2 }"
                  class="m-l-10 fw600"
                  type="is-primary"
                  pack="fal"
                  rounded
                  :loading="loading"
                  @click="submit(invalid)"
                >
                  {{ $t('spremi') }}
                </b-button>
              </div>
            </form>
          </ValidationObserver>
        </div>
      </b-tab-item>
    </b-tabs>
    <div class="">
      <b-modal :active.sync="isModalConfirmationActive" :width="640" class="modal__confirmation z200" scroll="clip">
        <modalConfirmation
          :title="$t('eliteObrisatiKategoriju')"
          :subtitle="$t('Potvrdom će kategorija biti obrisana')"
          @update="deleteSubscription()"
        ></modalConfirmation>
      </b-modal>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import Subscription from '~/models/Subscription'
import TaxClass from '~/models/TaxClass'
import BusinessUnit from '~/models/BusinessUnit'

export default {
  name: 'Subscription1',
  components: {
    modalConfirmation,
  },
  props: {
    listPrepopulated: {
      type: Object,
      required: false,
      default() {
        return {
          subscription: {},
        }
      },
    },
    hideList: {
      type: Boolean,
      required: false,
      default: false,
    },
    isSmall: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      loadingDelete: false,
      isLoaded: null,
      loadingMedia: false,
      activeTab: 0,
      total: 0,
      isTouched: 0,
      category: [],
      taxes: [],
      business_unit: [],
      subscriptions: [],
      selected_subscriptions: null,
      selected_subscriptions_delete: null,
      isModalConfirmationActive: false,
      newSubscription: {
        name: '',
        description: '',
        interval: 'month',
        price: null,
        tax_class: null,
        bank_account: null,
        status: 'active',
        sending_bills: 'first',
        automatic_bill_sending: false,
        start_date: new Date(),
        business_unit: {},
        warnings: [
          {
            when: 10,
            text: '',
            app: false,
            push: false,
            mail: false,
          },
          {
            when: 20,
            text: '',
            app: false,
            push: false,
            mail: false,
          },
        ],
      },
      newSubscriptionPlaceholder: {
        name: '',
        description: '',
        interval: 'month',
        price: null,
        tax_class: null,
        bank_account: null,
        status: 'active',
        sending_bills: 'first',
        automatic_bill_sending: false,
        start_date: new Date(),
        business_unit: {},
        warnings: [
          {
            when: 10,
            text: '',
            app: false,
            push: false,
            mail: false,
          },
          {
            when: 20,
            text: '',
            app: false,
            push: false,
            mail: false,
          },
        ],
      },
      isEditing: false,
    }
  },
  computed: {
    pre_message() {
      return `${this.$t(
        'Poštovani, ovim putem Vas želimo upozoriti da niste podmirili svoje dugovanje prema računu koji Vam je poslan prije'
      )}${this.newSubscription.warnings[0].when}${this.$t(
        ' dana. Molimo Vas da što prije izvršite plaćanje kako bismo izbjegli daljnje komplikacije. Za dodatne informacije obratiti te se voditelju kluba.'
      )}`
    },
    pre_message2() {
      return `${this.$t(
        'Poštovani, ovim putem Vas želimo upozoriti da ste i nakon našeg prethodnog upozorenja i dalje u kašnjenju s podmirenjem vašeg dugovanja prema računu koji Vam je poslan prije'
      )}${this.newSubscription.warnings[1].when}${this.$t(
        ' dana. Molimo Vas da što prije izvršite plaćanje kako bismo izbjegli daljnje komplikacije. Za dodatne informacije obratiti te se voditelju kluba.'
      )}`
    },
    isAdmin() {
      return this.user.is_admin
    },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
  },
  watch: {
    hideList: {
      immediate: true,
      handler() {
        if (this.hideList) {
          this.activeTab = 1
        }
      },
    },
    listPrepopulated: {
      immediate: true,
      handler() {
        if (this.listPrepopulated) {
          Object.assign(this.newSubscription, this.listPrepopulated)
        }
      },
    },
    newSubscription: {
      deep: true,
      handler() {
        this.isTouched++
      },
    },
    activeTab() {
      this.activeTab === 1 ? this.$emit('isEditing', true) : this.$emit('isEditing', false)
    },
  },
  mounted() {
    this.getSubscription()
    this.getTaxes()
    this.getBusinessUnit()
  },
  methods: {
    selectBusinessUnit(item) {
      this.newSubscription.business_unit = item
    },
    getBusinessUnit() {
      BusinessUnit.where('club', this.club.id)
        .get()
        .then((res) => {
          this.business_unit = res.data
          this.newSubscription.business_unit = res.data[0]
          this.newSubscriptionPlaceholder.business_unit = res.data[0]
        })
    },
    getTaxes() {
      TaxClass.get().then((res) => {
        this.taxes = res.data
        this.newSubscription.tax_class = res.data[0]
        this.newSubscriptionPlaceholder.tax_class = res.data[0]
      })
    },
    newSubscriptionAction() {
      this.isEditing = false
      this.newSubscription = _.cloneDeep(this.newSubscriptionPlaceholder)
      this.activeTab = 1
    },
    sendEmit(item, index) {
      this.selected_subscriptions = index
      this.newSubscription = this.subscriptions[this.selected_subscriptions]
      this.isEditing = true
      this.activeTab = 1
      this.$emit('update', this.selected_subscriptions === null ? {} : item)
    },
    getSubscription() {
      this.loading = true
      Subscription.where('club', this.club.id)
        .include('business_unit', 'tax_class')
        .get()
        .then((res) => {
          this.subscriptions = res.data
          this.loading = false
        })
    },
    deleteSubscription() {
      this.loadingDelete = true
      const subscriptionDelete = new Subscription({ id: this.subscriptions[this.selected_subscriptions_delete]?.id })
      const subscriptionDeleteFromEdit = new Subscription({ id: this.newSubscription.id })
      const whatID = this.activeTab === 0 ? subscriptionDelete : subscriptionDeleteFromEdit
      whatID
        .delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali kategoriju'),
            type: 'is-success',
          })
          this.activeTab = 0
          this.getSubscription()
          this.loadingDelete = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadingDelete = false
        })
    },
    submit(invalid) {
      // console.log(invalid)
      // if (!invalid) {
      //   this.$buefy.toast.open({
      //     message: this.$t('Forma nije ispravno popunjena'),
      //     type: 'is-danger',
      //   })
      //   return
      // }
      if (this.hideList) {
        this.$emit('update', this.newSubscription)
        this.$buefy.toast.open({
          message: this.$t('Uspješno spremljeno'),
          type: 'is-success',
        })
        return
      }
      this.loading = true
      const subscription = new Subscription(this.newSubscription)
      subscription
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili kategoriju'),
            type: 'is-success',
          })
          this.getSubscription()
          this.activeTab = 0
          this.loading = false
          Object.assign(this.newSubscription, this.newSubscriptionPlaceholder)
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
<style scoped>
.cropper {
  width: 100vw;
}
</style>
