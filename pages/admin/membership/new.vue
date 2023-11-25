<template>
  <div v-if="isAdmin">
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
      <b-step-item step="1" :label="$t('upiiNazivLanstva')" class="m-t-10" :clickable="true">
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
      <b-step-item step="2" :label="$t('rezervacijaTerena')">
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
      <b-step-item step="3" :label="$t('otkazivanjeRezervacije')">
        <ValidationProvider name="Je li moguće otkazati rezervaciju" class="radio__box__center" rules="required">
          <div class="block">
            <b-radio v-model="newMembership.is_reservation_cancelable" :native-value="true">
              {{ $t('mogue') }}
            </b-radio>
            <b-radio v-model="newMembership.is_reservation_cancelable" :native-value="false">
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
                type="is-white"
                rounded
                controls-rounded
              ></b-numberinput>
            </b-field>
          </ValidationProvider>
        </template>
      </b-step-item>
      <b-step-item step="4" :label="$t('Limit')">
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
      <b-step-item step="5" :label="$t('Plaćanje rezervacije')">
        <div v-if="club.payment_online === 0" class="fw600 is-size-65 empty_red_empty has-text-centered">
          {{ $t('Za korištenje ove opcije morate imati omogućeno online plaćanje') }}
        </div>
        <div v-else class="fw600 is-size-65 has-text-centered">
          {{ $t('Ova opcija omogućava da korisnici prvo moraju izvršiti plaćanje prije rezervacije terena') }}
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
      </b-step-item>

      <b-step-item step="6" :label="$t('cijenaLanstva')">
        <ValidationProvider name="Je li moguće otkazati rezervaciju" class="radio__box__center" rules="required">
          <div class="block">
            <b-radio v-model="showPriceInput" :native-value="0"> {{ $t('besplatno') }} </b-radio>
            <b-radio v-model="showPriceInput" :native-value="1"> {{ $t('unesiCijenu') }} </b-radio>
          </div>
        </ValidationProvider>

        <template v-if="showPriceInput">
          <ValidationProvider name="" class="radio__box__center m-t-20" rules="required">
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
            <div class="fw600 has-text-centered m-b-15 m-t-20">
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
            <div v-if="newMembership.price" class="is-size-65 has-text-centered fw600">
              {{ $t('Cijena je izražena u eurima') }}
              <span class="m-l-5">{{ $store.state.club.country.currency }}</span>
            </div>
            <div v-else class="is-size-65 has-text-centered fw600">
              {{ $t('Članstvo je besplatno') }}
            </div>
          </template>
          <template v-if="priceType === 2">
            <!--          <membershipSubscriptions @isOpen="hidebuttons = true" @isClose="hidebuttons = false" />-->
            <div class="subscription-categories-page">
              <subscriptionCategories
                :hide-list="true"
                @update="
                  newMembership.subscription = $event
                  activeStep++
                "
              />
            </div>
          </template>
        </template>
      </b-step-item>
      <b-step-item step="7" :label="$t('dodatneNapomene')">
        <div class="fw600 has-text-centered m-b-15">
          {{ $t('upiiteDodatnePogodnostiVezaneUzOvoLanstvoNapomeneU') }}
        </div>
        <tinymce-editor v-model="newMembership.description" />
      </b-step-item>
      <b-step-item step="8" :label="$t('provjera')">
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
          <div class="fw600 is-size-5">
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
        <!--        <div class="m-t-10 display-data__box">-->
        <!--          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">-->
        <!--            {{ $t('popustNaCijeneRezervacije') }}-->
        <!--          </div>-->
        <!--          <div class="fw600 is-size-5">{{ newMembership.discount_amount ? $t('Da') : $t('Ne') }}</div>-->
        <!--        </div>-->
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
        <div v-if="true" class="m-t-10 display-data__box">
          <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('godinjaCijena') }}</div>
          <div class="fw600 is-size-5">{{ $t('key5', { currency: newMembership.price }) | currency }}</div>
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
            :loading="loading"
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
  name: 'MembershipNew',
  components: {
    hero,
    subscriptionCategories,
    modalConfirmation,
    indicator,
    modalConfirmationLeave,
  },
  data() {
    return {
      indicator: {
        steps: 8,
      },
      hidebuttons: false,
      showPriceInput: 0,
      isModalDeleteActive: false,
      isModalConfirmation: false,
      deleteMembershipId: null,
      heroImage: '/hero_court.jpg',
      hasNavigation: false,
      activeStep: 0,
      name: '',
      maxReservationSpan: [0, 7, 14, 21, 30, 60, 90, 120, 180, 360],
      newMembership: {
        name: '',
        max_reservation_span: 7,
        is_reservation_cancelable: true,
        reservation_cancelable: true,
        max_reservation_per_period: false,
        max_reservation_per_period_days: 0,
        has_discount: false,
        discount_type: null,
        discount_amount: null,
        reservation_prepayment: false,
        price: 0,
        description: '',
      },
      to: '',
      is_saved: false,
      loading: false,
      priceType: 1,
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
  },
  beforeRouteLeave(to, from, next) {
    if (this.to || this.newMembership.name === '' || this.is_saved) {
      next()
    } else {
      this.to = to
      this.isModalConfirmation = true
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
      this.loading = true
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
          this.loading = false
          this.$router.push(this.localePath('/admin/membership'))
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
