<template>
  <div v-if="Object.keys(newMembership).length && isAdmin">
    <hero :options="heroImage">
      <nuxt-link :to="localePath('/admin/membership')" class="hero__navigation">
        <h1 class="has-text-white m-l--20">
          <span
            ><b-icon
              icon="long-arrow-left"
              class="m-r-20"
              style="display: inline-block"
              size="is-navigation"
              type="is-white"
              pack="fal"
            >
            </b-icon></span
          >{{ $t('lanstvo2') }}
        </h1>
      </nuxt-link>
    </hero>
    <indicator class="m-t-20 m-b-20" :options="indicator" :active-step="activeStep"></indicator>
    <b-steps
      v-model="activeStep"
      :has-navigation="hasNavigation"
      :animated="true"
      type="is-info"
      class="x-container m-t-15 p-b-150"
    >
      <b-step-item clickable="true" step="1" :label="$t('upiiNazivLanstva')" class="m-t-10">
        <div class="activity__reservation">
          <b-field class="has-text-centered m-t-10">
            <b-input
              v-model="newMembership.name"
              wrap="hard"
              custom-class="input__title"
              :placeholder="$t('upiiNazivLanstva')"
            ></b-input>
          </b-field>
        </div>
      </b-step-item>
      <b-step-item clickable="true" step="2" :label="$t('rezervacijaTerena')">
        <div class="fw600 has-text-centered m-b-15">{{ $t('kolikoSeDanaUnaprijedMoeRezerviratiTeren') }}</div>
        <ValidationProvider v-slot="{ errors }" name="Uplata" rules="required">
          <b-field class="login__input__container m-b-30" :type="{ 'is-danger': errors[0] }" :message="errors">
            <b-numberinput
              v-model="newMembership.max_reservation_span"
              min="0"
              :max="360"
              step="1"
              type="is-white"
              rounded
              controls-rounded
            ></b-numberinput>
          </b-field>
        </ValidationProvider>

        <div class="activity__reservation">
          <transition name="fade">
            <div class="activity__box action__buttons">
              <div
                v-for="span in maxReservationSpan"
                :key="span"
                :class="span === newMembership.max_reservation_span ? 'active' : ''"
                class="action__item__small fw600"
                @click="newMembership.max_reservation_span = span"
              >
                {{ $t('dana', { span: span }) }}
              </div>
            </div>
          </transition>
        </div>
      </b-step-item>
      <b-step-item clickable="true" step="3" :label="$t('otkazivanjeRezervacije')">
        <ValidationProvider name="Je li moguće otkazati rezervaciju" class="radio__box__center" rules="required">
          <div class="block">
            <b-radio v-model="newMembership.is_reservation_cancelable" :native-value="1"> {{ $t('mogue') }} </b-radio>
            <b-radio v-model="newMembership.is_reservation_cancelable" :native-value="0">
              {{ $t('nijeMogue') }}
            </b-radio>
          </div>
        </ValidationProvider>
        <template v-if="newMembership.is_reservation_cancelable">
          <div class="fw600 has-text-centered m-t-30 m-b-15">
            {{ $t('kolikoSeSatiPrijePoetkaTerminaMoeOtkazatiRezervaci') }}
          </div>
          <div class="buttons m-b-0">
            <b-button
              class="softshadow"
              type="is-small noborder__small"
              rounded
              @click="newMembership.reservation_cancelable = 12"
            >
              {{ $t('polaDan') }}
            </b-button>
            <b-button
              class="softshadow"
              type="is-small noborder__small"
              rounded
              @click="newMembership.reservation_cancelable = 24"
            >
              {{ $t('1Dan') }}
            </b-button>
            <b-button
              class="softshadow"
              type="is-small noborder__small"
              rounded
              @click="newMembership.reservation_cancelable = 48"
            >
              {{ $t('2Dana') }}
            </b-button>
          </div>

          <ValidationProvider v-slot="{ errors, valid }" name="Otkazivanje rezervacije" rules="required">
            <b-field
              class="login__input__container"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-numberinput
                v-model="newMembership.reservation_cancelable"
                :placeholder="$t('0Sati')"
                type="is-white"
                rounded
                controls-rounded
              ></b-numberinput>
            </b-field>
          </ValidationProvider>
        </template>
      </b-step-item>
      <b-step-item clickable="true" step="4" :label="$t('Limit')">
        <!--        Limit to number of reservations-->
        <div class="fw600 has-text-centered m-b-10">{{ $t('Limit na broj rezervacija') }}</div>
        <ValidationProvider name="Je li moguće otkazati rezervaciju" class="radio__box__center" rules="required">
          <div class="block">
            <b-radio v-model="newMembership.max_reservation_per_period" :native-value="false">
              {{ $t('Bez limita') }}
            </b-radio>
            <b-radio v-model="newMembership.max_reservation_per_period" :native-value="true">
              {{ $t('Limit') }}
            </b-radio>
          </div>
        </ValidationProvider>
        <template v-if="newMembership.max_reservation_per_period">
          <template>
            <div class="fw600 has-text-centered m-t-30 is-size-6">
              {{ $t('Maksimalan broj rezervacija koje član istovremeno može imati') }}
            </div>
            <div class="fw600 has-text-centered m-b-10 is-size-65 has-text-lightblue">({{ $t('U satima') }})</div>
            <ValidationProvider v-slot="{ errors, valid }" name="Popust" rules="required">
              <b-field
                class="login__input__container"
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-numberinput
                  v-model="newMembership.max_reservation_per_period_days"
                  placeholder="0"
                  min="0"
                  type="is-white"
                  rounded
                  controls-rounded
                ></b-numberinput>
              </b-field>
            </ValidationProvider>
            <!--            <div class="fw600 has-text-centered m-t-30 is-size-6">-->
            <!--              {{ $t('Unutar kojeg vremenskog perioda?') }}-->
            <!--            </div>-->
            <!--            <div class="fw600 has-text-centered m-b-10 is-size-65 has-text-lightblue">-->
            <!--              {{ $t('(U danima)') }}-->
            <!--            </div>-->

            <!--            <ValidationProvider v-slot="{ errors, valid }" name="Popust" rules="required">-->
            <!--              <b-field-->
            <!--                class="login__input__container"-->
            <!--                :type="{ 'is-danger': errors[0], 'is-success': valid }"-->
            <!--                :message="errors"-->
            <!--              >-->
            <!--                <b-numberinput-->
            <!--                  v-model="newMembership.max_reservation_per_period_total"-->
            <!--                  placeholder="0"-->
            <!--                  min="0"-->
            <!--                  type="is-white"-->
            <!--                  rounded-->
            <!--                  controls-rounded-->
            <!--                ></b-numberinput>-->
            <!--              </b-field>-->
            <!--            </ValidationProvider>-->
          </template>
        </template>

        <template v-if="false">
          <div class="fw600 has-text-centered m-b-15">{{ $t('eliteLiOmoguitiPopustZaRezervacijuTerena') }}</div>
          <ValidationProvider name="Je li moguće otkazati rezervaciju" class="radio__box__center" rules="required">
            <div class="block">
              <b-radio v-model="newMembership.has_discount" :native-value="true"> {{ $t('popust') }} </b-radio>
              <b-radio v-model="newMembership.has_discount" :native-value="false"> {{ $t('bezPopusta') }} </b-radio>
            </div>
          </ValidationProvider>
          <template v-if="newMembership.has_discount">
            <div class="fw600 has-text-centered m-b-15 m-t-30 is-size-6">
              {{ $t('eliteLiPopustIzrazitiUApsolutnomIznosuIliPostotkuC') }}
            </div>
            <ValidationProvider name="Je li moguće otkazati rezervaciju" class="radio__box__center" rules="required">
              <div class="block">
                <b-radio v-model="newMembership.discount_type" :native-value="1"> {{ $t('apsolutniIznos') }} </b-radio>
                <b-radio v-model="newMembership.discount_type" :native-value="2"> {{ $t('popust') }} </b-radio>
              </div>
            </ValidationProvider>
            <template v-if="newMembership.discount_type !== null">
              <div class="fw600 has-text-centered m-b-15 m-t-15 is-size-6">{{ $t('unesiIznosPopusta') }}</div>
              <ValidationProvider v-slot="{ errors, valid }" name="Popust" rules="required">
                <b-field
                  class="login__input__container"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  :message="errors"
                >
                  <b-numberinput
                    v-model="newMembership.discount_amount"
                    placeholder="0"
                    type="is-white"
                    rounded
                    controls-rounded
                  ></b-numberinput>
                </b-field>
              </ValidationProvider>

              <div
                v-if="newMembership.discount_type === 1 && newMembership.discount_amount !== null"
                class="fw600 has-text-centered m-b-15 m-t-15 is-size-65"
              >
                {{ $t('regularnaCijenaTerenaBitiEUmanjenaZa') }}
                <span class="is-size-65 fw800 has-text-lightblue">{{
                  $t('key5', { currency: newMembership.discount_amount }) | currency
                }}</span>
              </div>
              <div
                v-if="newMembership.discount_type === 2 && newMembership.discount_amount !== null"
                class="fw600 has-text-centered m-b-15 m-t-15 is-size-65"
              >
                {{ $t('regularnaCijenaTerenaBitiEUmanjenaZa') }}
                <span class="is-size-65 fw800 has-text-lightblue">{{ newMembership.discount_amount }}%</span
                >{{ $t('zaokruenaNaNajbliiOkrugliIznos') }}
              </div>
            </template>
          </template>
        </template>
      </b-step-item>
      <b-step-item clickable="true" step="5" :label="$t('Plaćanje rezervacije')">
        <div v-if="club.payment_online === 0" class="fw600 is-size-65 empty_red_empty has-text-centered">
          {{ $t('Za korištenje ove opcije morate imati omogućeno online plaćanje') }}
        </div>
        <ValidationProvider
          v-if="club.payment_online === 1"
          name="Je li moguće otkazati rezervaciju"
          class="radio__box__center m-t-20"
          rules="required"
        >
          <div class="block">
            <b-radio v-model="newMembership.reservation_prepayment" :native-value="true">
              {{ $t('Unaprijed') }}
            </b-radio>
            <b-radio v-model="newMembership.reservation_prepayment" :native-value="false">
              {{ $t('Nakon korištenja') }}
            </b-radio>
          </div>
        </ValidationProvider>

        <div class="m-t-20 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
            {{ $t('Obvezno plaćanje rezervacije') }}
          </div>
          <div class="fw600 is-size-5">
            {{ newMembership.reservation_prepayment ? $t('Da') : $t('Ne') }}
          </div>
        </div>
      </b-step-item>
      <b-step-item clickable="true" step="6" :label="$t('cijenaLanstva')">
        <div class="fw600 has-text-centered m-b-10">
          {{
            $t(
              'Želite li postaviti cijenu informativno ili želite i opciju automatskog slanja računa korisnicima ove članarine?'
            )
          }}
        </div>

        <ValidationProvider name="" class="radio__box__center" rules="required">
          <div class="block">
            <b-radio v-model="priceType" :native-value="1">
              {{ $t('Bez pretplate') }}
            </b-radio>
            <b-radio v-model="priceType" :native-value="2">
              {{ $t('Pretplata') }}
            </b-radio>
          </div>
        </ValidationProvider>

        <template v-if="priceType === 1">
          <div class="fw600 has-text-centered m-b-15 m-t-15">
            {{ $t('upiiteGodinjuCijenuZaLanstvo', { name: newMembership.name }) }}
          </div>

          <ValidationProvider v-slot="{ errors, valid }" name="Popust" rules="required">
            <b-field
              class="login__input__container"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-numberinput
                v-model="newMembership.price"
                :placeholder="newMembership.price ? newMembership.price : 'besplatno'"
                step="5"
                min="0"
                type="is-white"
                rounded
                controls-rounded
              ></b-numberinput>
            </b-field>
          </ValidationProvider>
          <div class="is-size-65 has-text-centered fw600">{{ $t('Cijena je izražena u eurima') + ' ' + currency }}</div>
        </template>
        <template v-if="priceType === 2">
          <!--          <membershipSubscriptions @isOpen="hidebuttons = true" @isClose="hidebuttons = false" />-->
          <div class="subscription-categories-page">
            <subscriptionCategories
              :hide-list="true"
              :list-prepopulated="newMembership.subscription"
              @update="
                newMembership.subscription = $event
                activeStep++
              "
            />
          </div>
        </template>
      </b-step-item>
      <b-step-item clickable="true" step="7" :label="$t('dodatneNapomene')">
        <div class="fw600 has-text-centered m-b-15">
          {{ $t('upiiteDodatnePogodnostiVezaneUzOvoLanstvoNapomeneU') }}
        </div>
        <tinymce-editor v-model="newMembership.description" />
      </b-step-item>
      <b-step-item clickable="true" step="8" :label="$t('provjera')">
        <div class="display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('nazivLanstva') }}</div>
          <div class="fw600 is-size-5">{{ newMembership.name }}</div>
        </div>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('rezervacijaTerena') }}</div>
          <div class="fw600 is-size-5">
            {{ $t('danaUnaprijed', { max_reservation_span: newMembership.max_reservation_span }) }}
          </div>
        </div>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('otkazivanjeRezervacije') }}</div>
          <div class="fw600 is-size-55">
            {{ newMembership.is_reservation_cancelable ? $t('mogue') : $t('nijeMogue') }}
          </div>
        </div>
        <div v-if="newMembership.is_reservation_cancelable" class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
            {{ $t('rokOtkazivanjaRezervacije') }}
          </div>
          <div class="fw600 is-size-5">
            {{ $t('satiRanije', { reservation_cancelable: newMembership.reservation_cancelable }) }}
          </div>
        </div>
        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
            {{ $t('Preplata') }}
          </div>
          <div class="fw600 is-size-5">{{ newMembership.hasDiscount ? $t('da') : $t('ne') }}</div>
        </div>

        <div class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
            {{ $t('Limit na broj rezervacija') }}
          </div>
          <div class="fw600 is-size-55">
            {{ newMembership.max_reservation_per_period ? $t('da') : $t('ne') }}
          </div>
        </div>
        <div v-if="newMembership.max_reservation_per_period" class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
            {{ $t('Maksimalan broj ativnih rezervacija u satima') }}
          </div>
          <div class="fw600 is-size-55">
            {{ newMembership.max_reservation_per_period_days }}
          </div>
        </div>

        <div v-if="newMembership.hasDiscount" class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('iznosPopusta') }}</div>
          <div v-if="newMembership.discount_type === 1" class="fw600 is-size-5">
            {{ $t('key5', { currency: newMembership.discount_amount }) | currency }}
          </div>
          <div v-else class="fw600 is-size-5">{{ newMembership.discount_amount }}%</div>
        </div>

        <div v-if="newMembership.subscription" class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('Cijena') }}</div>
          <div class="fw600 is-size-55">{{ newMembership.subscription.price | currency }} — {{ $t('Pretplata') }}</div>
        </div>
        <div v-else class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('Cijena') }}</div>
          <div class="fw600 is-size-55">{{ $t('key5', { currency: newMembership.price }) | currency }}</div>
        </div>
        <div v-if="newMembership.reservation_prepayment" class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
            {{ $t('Obvezno plaćanje rezervacije') }}
          </div>
          <div class="fw600 is-size-5">{{ newMembership.reservation_prepayment ? $t('Da') : $t('Ne') }}</div>
        </div>

        <div v-if="newMembership.description" class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('napomene') }}</div>
          <!-- eslint-disable-next-line -->
          <div class="has-text-left is-size-6 content-tiny" v-html="newMembership.description"></div>
        </div>
        <div class="buttons m-t-30 p-b-30">
          <b-button
            :class="['m-l-10', 'fw600']"
            type="is-danger"
            pack="fal"
            icon-left="chevron-left"
            rounded
            @click.prevent="
              activeStep = 1
              is_saved = false
            "
          >
            {{ $t('izmijeni') }}
          </b-button>
          <b-button
            :class="['m-l-10', 'fw600']"
            type="is-primary"
            pack="fal"
            icon-right="check"
            rounded
            @click.prevent="submit"
          >
            {{ $t('spremi') }}
          </b-button>
        </div>
      </b-step-item>
    </b-steps>
    <div v-if="activeStep !== 7 && !hidebuttons" class="buttons is-fixed m-t-30">
      <b-button
        v-if="activeStep !== 0"
        :class="['m-l-10', 'fw600']"
        type="is-danger"
        pack="fal"
        icon-left="chevron-left"
        rounded
        @click.prevent="activeStep--"
      >
        {{ $t('nazad') }}
      </b-button>
      <b-button
        :class="['m-l-10', 'fw600', nextArrow ? '' : 'blur_button']"
        type="is-primary"
        pack="fal"
        icon-right="chevron-right"
        rounded
        @click.prevent="activeStep++"
      >
        {{ $t('dalje') }}
      </b-button>
    </div>

    <b-modal :active.sync="isModalDeleteActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('eliTrajnoObrisatiOdabranoLanstvo')"
        :subtitle="$t('Nakon brisanja svi korisnici tog članstva biti će prebačeni na standardno članstvo')"
        @update="deleteMemebership()"
      ></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalConfirmation" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmationLeave
        :title="$t('nisteSpremiliPodatkeSigurnoEliteOtii')"
        :subtitle="$t('Potvrdom će uneseni podaci biti izbrisani')"
        @discardChanges="discardChanges()"
        @closeDialog="closeDialog()"
      ></modalConfirmationLeave>
    </b-modal>
  </div>
</template>
<script>
// import _ from 'lodash'
import Membership from '@/models/Membership'
import Club from '@/models/Club'
import hero from '~/components/Hero'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import indicator from '~/components/IndicatorSteps'
import modalConfirmationLeave from '~/components/modal/ModalConfirmationLeave'
import subscriptionCategories from '~/components/subscriptions/subscriptionCategories'

export default {
  name: 'MembershipEdit',
  components: {
    hero,
    modalConfirmation,
    subscriptionCategories,
    indicator,
    modalConfirmationLeave,
  },
  data() {
    return {
      activeTab: 0,
      indicator: {
        steps: 8,
      },
      priceType: 1,
      hidebuttons: false,
      isModalDeleteActive: false,
      isModalConfirmation: false,
      deleteMembershipId: null,
      heroImage: '/hero_court.jpg',
      hasNavigation: false,
      activeStep: 0,
      name: '',
      maxReservationSpan: [7, 14, 21, 30, 60, 90, 120, 180, 360],
      to: '',
      is_saved: false,
      was_edited: false,
      newMembership: {},
    }
  },
  computed: {
    club() {
      return this.$store.state.club
    },
    isAdmin() {
      return this.$store.state.auth.user.is_admin
    },
    nextArrow() {
      if (this.activeStep === 0 && this.newMembership.name) {
        return true
      }
      if (this.activeStep === 1 && this.newMembership.max_reservation_span) {
        return true
      }
      if (this.activeStep === 2 && this.newMembership.is_reservation_cancelable !== null) {
        return true
      }
      if (this.activeStep === 3 && this.newMembership.has_discount !== null) {
        return true
      }
      if (this.activeStep === 4) {
        return true
      }
      if (this.activeStep === 5) {
        return true
      }
      if (this.activeStep === 6) {
        return true
      } else {
        return false
      }
    },
    selectedMembership() {
      const c = this.$store.state.club.memberships.filter((item) => {
        return item.id === parseInt(this.$route.params.id)
      })
      if (c.length) {
        return c[0]
      }
      return {
        name: '',
        max_reservation_span: null,
        is_reservation_cancelable: null,
        reservation_cancelable: null,
        has_discount: null,
        discount_type: null,
        discount_amount: null,
        price: 0,
        description: '',
      }
    },
    currency() {
      return this.$store.state.club.country.currency
    },
  },
  watch: {
    selectedMembership() {
      this.was_edited = true
      this.newMembership = { ...this.selectedMembership }
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.to || this.newMembership.name === '' || this.was_edited) {
      next()
    } else {
      next()
      // this.to = to
      // this.isModalConfirmation = true
    }
  },
  mounted() {
    this.newMembership = { ...this.selectedMembership }
    if (this.newMembership.subscription?.price) {
      this.priceType = 2
    } else {
      this.priceType = 1
    }
  },
  methods: {
    closeDialog() {
      this.isModalConfirmation = false
      this.to = null
    },
    discardChanges() {
      this.isModalConfirmation = false
      this.$router.push(this.to)
    },
    submit() {
      const club = new Club(this.$store.state.club)
      const membership = new Membership(this.newMembership).for(club)
      membership
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili izmjene'),
            type: 'is-success',
          })
          this.is_saved = true
          this.$store.dispatch('club/init_club', { force: true })
          this.$router.push(this.localePath('/admin/membership'))
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
        })
    },
  },
}
</script>
