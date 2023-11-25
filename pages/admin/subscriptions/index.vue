<template>
  <div class="member p-b-200">
    <PageHeader :title="$t('Članarine')" />

    <!--    <div class="align__centar__all is-primary has-text-white p-t-10 p-b-10">-->
    <!--      <div class="modal-subtitle is-uppercase m-r-10"></div>-->
    <!--      <img :src="club.logo" class="user_image m-r-10 border__white&#45;&#45;2" alt="" />-->
    <!--      <div class="is-text-center fw600 is-size-5">{{ club.name }}</div>-->
    <!--    </div>-->
    <div class="home-menu">
      <div class="home-menu-middle">
        <!--        <div :class="[activeMainTab === 0 ? 'active-menu-item' : 'menu-item']" @click="goToTab(0)">-->
        <!--          <div class="has-text-black80 flex flex__column align__centar__y">-->
        <!--            <b-icon class="m-b-5" pack="fal" icon="envelope-dot" type="is-black50"> </b-icon>-->
        <!--            <div class="is-size-6 fw600">{{ $t('Novo') }}</div>-->
        <!--          </div>-->
        <!--        </div>-->
        <div :class="[activeMainTab === 1 ? 'active-menu-item' : 'menu-item']" @click="goToTab(1)">
          <div class="has-text-black80 flex flex__column align__centar__y">
            <b-icon class="m-b-5" pack="fal" icon="arrows-repeat" type="is-black50"> </b-icon>
            <div class="is-size-6 fw600 has-text-centered">{{ $t('Članarine') }}</div>
          </div>
        </div>
        <div :class="[activeMainTab === 2 ? 'active-menu-item' : 'menu-item']" @click="goToTab(2)">
          <div class="has-text-black80 flex flex__column align__centar__y">
            <b-icon class="m-b-5" pack="fal" icon="cog" type="is-black50"> </b-icon>
            <div class="is-size-6 fw600 has-text-centered">{{ $t('Postavke') }}</div>
          </div>
        </div>
      </div>
    </div>

    <b-tabs v-model="activeMainTab" size="is-medium" position="is-centered" class="m-t-0 hide_tab_navigation_impt">
      <b-tab-item :label="$t('Narudžbe')" class="p-b-100">
        <billsNewList />
      </b-tab-item>
      <b-tab-item>
        <div class="p-x-16 subscription-categories-page">
          <subscriptionCategories />
        </div>
      </b-tab-item>
      <b-tab-item class="p-b-100 p-x-16">
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

        <div class="label">{{ $t('Status članarine') }}</div>
        <ValidationProvider v-slot="{ errors, valid }" name="Spol" rules="required" class="radio__box">
          <div class="block">
            <b-radio v-model="newSubscription.status" :type="valid ? 'is-success' : 'is-danger'" native-value="active">
              {{ $t('Aktivna') }}
            </b-radio>
            <b-radio v-model="newSubscription.status" :type="valid ? 'is-danger' : 'is-danger'" native-value="pause">
              {{ $t('Pauzirana') }}
            </b-radio>
          </div>
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
            <b-radio v-for="item in taxes" :key="item.id" v-model="newSubscription.tax" :native-value="item.rate">
              {{ item.rate }}%
            </b-radio>
          </div>
        </ValidationProvider>
        <template v-if="business_data.length > 1">
          <div class="label--center m-t-20">{{ $t('Odaberi poslovnu jedinicu') }}</div>
          <div class="buttons m-t-10 m-b-5">
            <b-button
              v-for="(item, index) in business_data"
              :key="index"
              class="m-t-5 m-b-5 m-l-5 m-r-5"
              :class="{ softshadow: true, 'invert-small-button': newSubscription.business_unit.name === item.name }"
              :icon-right="newSubscription.business_unit.name === item.name ? 'check' : ''"
              :type="{
                'is-small': true,
                noborder: true,
                'is-primary has-text-white': newSubscription.business_unit.name === item.name,
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
          {{ $t('Račune prije slanja morate potvrditi') }}
        </div>
        <ValidationProvider v-slot="{ errors, valid }" name=" IBAN" rules="required">
          <b-field
            :label="$t('Broj računa u banci')"
            class="login__input__container"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors"
          >
            <b-input
              v-model="newSubscription.bank_account"
              :placeholder="$t('Upiši broj računa')"
              type="number"
              rounded
            ></b-input>
          </b-field>
        </ValidationProvider>

        <div class="">
          <div class="label">{{ $t('Dinamika plaćanja') }}</div>
          <ValidationProvider name="Freeze" rules="required" class="radio__box">
            <div class="block">
              <b-field class="has-text-left">
                <b-radio v-model="newSubscription.interval" :native-value="'month'"> {{ $t('Mjesečno') }} </b-radio>
              </b-field>
              <b-field>
                <b-radio v-model="newSubscription.interval" :native-value="'3months'">
                  {{ $t('Tromjesečno') }}
                </b-radio>
              </b-field>
              <b-field>
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
          <div class="label">{{ $t('Vrijeme slanja računa') }}</div>
          <ValidationProvider name="Freeze" rules="required" class="radio__box">
            <div class="block">
              <b-field class="has-text-left">
                <b-radio v-model="newSubscription.sending_bills" :native-value="'first'">
                  {{ $t('Prvog u mjesecu') }}
                </b-radio>
              </b-field>
              <b-field>
                <b-radio v-model="newSubscription.sending_bills" :native-value="'between'">
                  {{ $t('Sredinom mjeseca') }}
                </b-radio>
              </b-field>
              <b-field>
                <b-radio v-model="newSubscription.sending_bills" :native-value="'last'">
                  {{ $t('Zadnjeg u mjesecu') }}
                </b-radio>
              </b-field>
            </div>
          </ValidationProvider>
        </div>

        <div class="divider-line-1 m-t-30"></div>
        <div class="fw600 is-size-3">{{ $t('Upozorenja') }}</div>
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
          <div class="label--center m-t-20">{{ $t('Koliko dana nakon poslanog račun se šalje prvo upozorenje') }}</div>
          <b-field>
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
            <div class="block">
              <b-field class="has-text-left">
                <b-checkbox v-model="newSubscription.warnings[0].app" :true-value="true">
                  {{ $t('Iskočni prozor na aplikaciji') }}
                </b-checkbox>
              </b-field>
              <b-field>
                <b-checkbox v-model="newSubscription.warnings[0].push" :true-value="true">
                  {{ $t('Slanje push obavijesti') }}
                </b-checkbox>
              </b-field>
              <b-field>
                <b-checkbox v-model="newSubscription.warnings[0].mail" :true-value="true">
                  {{ $t('Slanje e-maila') }}
                </b-checkbox>
              </b-field>
            </div>
          </ValidationProvider>
        </div>
        <div class="m-t-30 rounded-md">
          <div class="activity__header m-b-5 m-t--10 has-text-centered">
            <div class="fw600 is-size-6 has-text-black80 has-text-centered">{{ $t('Poruka upozorenja') }}</div>
          </div>
          <b-field>
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
          <div class="fw600 is-size-5 m-t-30 flex align__centar__all is-red radius__12 has-text-white p-t-7 p-b-7 w100">
            <b-icon icon="exclamation-square" pack="fal" type="is-white" class="is-smaller m-r-2"> </b-icon>
            <b-icon icon="exclamation-square" pack="fal" type="is-white" class="is-smaller m-r-10"> </b-icon>
            {{ $t('Drugo upozorenje') }}
          </div>
          <ValidationProvider name="Upozorenje">
            <div class="label--center m-t-20">
              {{ $t('Koliko dana nakon poslanog račun se šalje drugo upozorenje') }}
            </div>
            <b-field>
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

          <div class="">
            <div class="label">{{ $t('Odaberi upozorenja') }}</div>
            <ValidationProvider name="Freeze" rules="required" class="radio__box checkbox">
              <div class="block">
                <b-field class="has-text-left">
                  <b-checkbox v-model="newSubscription.warnings[1].app" :true-value="true">
                    {{ $t('Iskočni prozor na aplikaciji') }}
                  </b-checkbox>
                </b-field>
                <b-field>
                  <b-checkbox v-model="newSubscription.warnings[1].push" :true-value="true">
                    {{ $t('Slanje push obavijesti') }}
                  </b-checkbox>
                </b-field>
                <b-field>
                  <b-checkbox v-model="newSubscription.warnings[1].mail" :true-value="true">
                    {{ $t('Slanje e-maila') }}
                  </b-checkbox>
                </b-field>
              </div>
            </ValidationProvider>
          </div>
          <div v-if="isTouched > 0" class="buttons is-fixed m-t-15">
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
              type="is-primary"
              pack="fal"
              icon-right="check"
              rounded
              native-type="submit"
              @click.prevent="submit"
            >
              {{ $t('spremi') }}
            </b-button>
          </div>

          <div class="m-t-30 rounded-md">
            <div class="activity__header m-b-5 m-t--10 has-text-centered">
              <div class="fw600 is-size-6 has-text-black80 has-text-centered">{{ $t('poaljitePoruku') }}</div>
            </div>
            <b-field>
              <b-input
                v-model="newSubscription.warnings[1].text"
                type="textarea"
                rows="5"
                :placeholder="$t('ovdjeMoeteUpisatiPorukuZaBlokiranogKorisnikaIliUit')"
              ></b-input>
            </b-field>
            <div
              class="fw600 has-text-primary is-size-65 has-text-centered"
              @click="newSubscription.warnings[1].text = pre_message2"
            >
              {{ $t('popuniPredefiniranimTekstom') }}
            </div>
          </div></template
        >
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
// import _ from 'lodash'
import TaxClass from '~/models/TaxClass'
import PageHeader from '~/components/headers/blankBack'
import subscriptionCategories from '~/components/subscriptions/subscriptionCategories'
import billsNewList from '~/components/subscriptions/billsNewList'
import Invoice from '~/models/Invoice'
import BusinessUnit from '~/models/BusinessUnit'

export default {
  name: 'Subscriptions',
  components: {
    subscriptionCategories,
    PageHeader,
    billsNewList,
  },
  data() {
    return {
      isTouched: 0,
      heroImage: '/stringing.jpg',
      activeMainTab: 0,
      activeTab: 0,
      loading: false,
      loadingInvoices: false,
      walletTransaction: [],
      walletTransactionMeta: {},
      bottom: false,
      newStringingImage: '',
      page: 1,
      userSaldo: [{ name: 'Prikaži stanje svih korisnika' }],
      prepaidType: [{ name: 'Sve' }, { name: 'Nezavršeno' }],
      orderTimeRange: 'Sve',
      orderBuyersTimeRange: 'Sve',
      orderAssignersTimeRange: 'Sve',
      newString: {
        name: '',
        description: '',
        price: null,
        tax: null,
      },
      business_data: [],
      orders: [],
      orderBuyers: [],
      orderAssigners: [],
      offsetOrderBuyers: 1,
      offsetOrder: 1,
      offsetOrderAssigners: 1,
      total: 0,
      last_page: 0,
      order_totals: 0,
      category: [],
      subscriptions: [],
      ivoices: [],
      taxes: [],
      selected_category: null,
      newSubscription: {
        name: '',
        description: '',
        interval: 'month',
        price: null,
        tax: null,
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
    }
  },
  computed: {
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
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        this.offset++
        this.getInvoices()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.getBusinessUnit()
    this.getInvoices()
    this.getTaxes()
    this.goToTab(1)
  },
  methods: {
    selectBusinessUnit(item) {
      this.newSubscription.business_unit = item
    },
    getBusinessUnit() {
      BusinessUnit.where('club', this.club.id)
        .get()
        .then((res) => {
          this.business_data = res.data
          this.newSubscription.business_unit = res.data[0]
        })
    },
    goToTab(tab) {
      this.activeMainTab = tab
      window.history.replaceState(null, null, `#${tab}`)
    },
    getTaxes() {
      TaxClass.get().then((res) => {
        this.taxes = res.data
        this.newSubscription.tax = res.data[0].rate
      })
    },
    getInvoices() {
      this.loadingInvoices = true
      const i = Invoice
      i.where('club', this.$store.state.club.id)
        .get()
        .then((res) => {
          this.ivoices = res.data
          this.loadingInvoices = false
        })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
  },
}
</script>
<style scoped>
.section {
  padding: 1rem;
}
</style>
