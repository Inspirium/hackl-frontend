<template>
  <div>
    <PageHeader :title="selectedMembership[0].name" :background="'is-primary'" />
    <b-tabs v-model="activeTab" position="is-centered" size="is-medium" :class="{ hide_tab_navigation: !isAdmin }">
      <b-tab-item :label="$t('info')" class="p-b-100">
        <div class="activity x-container">
          <div class="">
            <div class="m-t-10 display-data__box">
              <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('rezervacijaTerena') }}</div>
              <div class="fw600 is-size-55">
                {{ $t('danaUnaprijed', { max_reservation_span: selectedMembership[0].max_reservation_span }) }}
              </div>
            </div>
            <div class="m-t-10 display-data__box">
              <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
                {{ $t('otkazivanjeRezervacije') }}
              </div>
              <div class="fw600 is-size-55">
                {{ selectedMembership[0].is_reservation_cancelable ? $t('mogue') : $t('nijeMogue') }}
              </div>
            </div>
            <div v-if="selectedMembership[0].is_reservation_cancelable" class="m-t-10 display-data__box">
              <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
                {{ $t('rokOtkazivanjaRezervacije') }}
              </div>
              <div class="fw600 is-size-55">
                {{ $t('satiRanije', { reservation_cancelable: selectedMembership[0].reservation_cancelable }) }}
              </div>
            </div>
            <div class="m-t-10 display-data__box">
              <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
                {{ $t('Limit na broj rezervacija') }}
              </div>
              <div class="fw600 is-size-55">
                {{ selectedMembership[0].max_reservation_per_period ? $t('da') : $t('ne') }}
              </div>
            </div>
            <div v-if="selectedMembership[0].max_reservation_per_period" class="m-t-10 display-data__box">
              <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
                {{ $t('Maksimalan broj ativnih rezervacija u satima') }}
              </div>
              <div class="fw600 is-size-55">
                {{ selectedMembership[0].max_reservation_per_period_days }}
              </div>
            </div>
            <div v-if="selectedMembership[0].subscription" class="m-t-10 display-data__box">
              <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('Cijena') }}</div>
              <div class="fw600 is-size-55">
                {{ selectedMembership[0].subscription.price | currency }} — {{ $t('Pretplata') }}
              </div>
            </div>
            <div v-else class="m-t-10 display-data__box">
              <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('Cijena') }}</div>
              <div class="fw600 is-size-55">{{ $t('key5', { currency: selectedMembership[0].price }) | currency }}</div>
            </div>
            <div v-if="isAdmin" class="m-t-10 display-data__box flex justify-between align__centar__y">
              <div class="" @click="activeTab = 1">
                <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
                  {{ $t('ukupnoclanova', { membership: selectedMembership[0].name }) }}
                </div>
                <div v-if="total" class="fw600 is-size-55">{{ total }}</div>
              </div>
              <div class="tab__navigation__arrow__right">
                <b-icon icon="chevron-right" pack="fal"> </b-icon>
              </div>
            </div>
            <div class="m-t-10 display-data__box">
              <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">
                {{ $t('Obvezno plaćanje rezervacije') }}
              </div>
              <div class="fw600 is-size-5">
                {{ selectedMembership[0].reservation_prepayment ? $t('Da') : $t('Ne') }}
              </div>
            </div>

            <div v-if="selectedMembership[0].description" class="m-t-10 display-data__box">
              <div class="modal-subtitle has-text-lightblue is-size-7 is-uppercase">{{ $t('napomene') }}</div>
              <!-- eslint-disable-next-line -->
              <div class="has-text-left is-size-6 content-tiny" v-html="selectedMembership[0].description"></div>
              <!--              <div class="fw600 is-size-6">{{ selectedMembership[0].description }}</div>-->
            </div>
          </div>
          <div v-if="isAdmin" class="buttons m-t-20">
            <b-button icon-left="times" pack="fal" type="is-danger" rounded @click="isModalDeleteActive = true">
              {{ $t('obrii') }}
            </b-button>
            <b-button
              pack="fal"
              icon-left="edit"
              type="is-primary"
              rounded
              @click="$router.push(localePath('/admin/membership/' + selectedMembership[0].id + '/edit'))"
            >
              {{ $t('Uredi') }}
            </b-button>
          </div>
        </div>
      </b-tab-item>
      <b-tab-item :label="$t('lanovi')" class="p-b-100">
        <div v-if="selectedMembership[0].subscription && club_players.length" class="buttons m-t-20 p-b-10">
          <b-button
            class="fw600"
            type="is-primary"
            pack="fal"
            icon-right="check"
            rounded
            :loading="sendingInvoiceLoading"
            @click.prevent="isModalSendInvoices = true"
          >
            {{ $t('Pošalji račune') }}
          </b-button>
        </div>

        <div v-if="!checkedRows.length" class="">
          <h6 class="fw600 flex align__centar__all">
            {{ $t('ukupnoLanova') }}
            <span>{{ total }}</span>
          </h6>
        </div>
        <div v-else class="">
          <h6 class="fw600 flex align__centar__all">
            {{ $t('oznaenoLanova') }}
            <span>{{ checkedRows.length }}</span>
          </h6>
        </div>
        <div class="tablelist p-b-100">
          <b-table
            :data="club_players"
            :checkbox-position="checkboxPosition"
            :checked-rows.sync="checkedRows"
            :bordered="false"
            :mobile-cards="false"
            checkbox-type="is-info"
            checkable
          >
            <b-table-column v-slot="props" cell-class="list__image-col p-l-0">
              <nuxt-link :to="localePath(props.row.link)">
                <div class="list__img">
                  <TennisImage :size="[42, 42]" :src="props.row.image" class="user_image" alt="" />
                </div>
                <div class="list__content">
                  <div class="fw600 is-size-55 has-text-black80">{{ props.row.display_name }}</div>
                  <div class="fw600 is-size-65 has-text-primary m-t--3">{{ selectedMembership[0].name }}</div>
                </div>

                <div class="has-text-right">
                  <b-tag v-if="props.row.is_admin" type="is-success">{{ $t('admin') }}</b-tag>
                  <b-tag v-if="props.row.club_member[club.id].type === 'applicant'" type="is-danger">{{
                    $t('aplikant')
                  }}</b-tag>
                  <b-tag v-if="props.row.club_member[club.id].type === 'blocked'" type="is-danger" class="m-l-5">{{
                    $t('blokiran')
                  }}</b-tag>
                </div>
              </nuxt-link>
            </b-table-column>
            <template #empty>
              <section class="section">
                <div class="content has-text-grey has-text-centered">
                  <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                  <p class="modal-title">{{ $t('nemaOdabranihLanova') }}</p>
                </div>
              </section>
            </template>
          </b-table>
        </div>
      </b-tab-item>
    </b-tabs>
    <b-modal :active.sync="isModalDeleteActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('eliTrajnoObrisatiOdabranoLanstvo')"
        :subtitle="$t('Nakon brisanja svi korisnici tog članstva biti će prebačeni na osnovno članstvo')"
        @update="deleteMemebership()"
      ></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalSendInvoices" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('Želite li članovima poslati račune?')"
        :subtitle="$t('Na sljedećem koraku možete doraditi račune ili poništiti slanje')"
        @update="sendInvoices()"
      ></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalMembershipActive" :width="640" scroll="clip">
      <modal-options
        :options="memberships"
        :title="$t('osnovnoLanstvo')"
        :subtitle="
          $t(
            'Svim korisnicima aplikacije, koji nemaju dodijeljeno članstvo, primjenjivat će se odredbe osnovnog članstva'
          )
        "
        @update="submit($event)"
      ></modal-options>
    </b-modal>
  </div>
</template>
<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Membership from '@/models/Membership'
import Club from '@/models/Club'
import Invoice from '@/models/Invoice'
import Player from '~/models/Player'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import ModalOptions from '~/components/modal/ModalOptionsMembershipBasic'
import PageHeader from '~/components/headers/blankBack'

export default {
  name: 'Membership',
  components: {
    ModalOptions,
    PageHeader,
    modalConfirmation,
    TennisImage,
  },
  data() {
    return {
      activeTab: 0,
      checkboxPosition: 'left',
      isModalSendInvoices: false,
      isModalMembershipActive: false,
      indicator: {
        steps: 8,
      },
      isModalDeleteActive: false,
      deleteMembershipId: null,
      heroImage: '/hero_court.jpg',
      club_players: [],
      total: 0,
      sendingInvoiceLoading: false,
      bottom: false,
      offset: 1,
      last_page: 1,
      checkedRows: [],
      search_term: '',
    }
  },
  computed: {
    selectedMembership() {
      const sm = this.$store.state.club.memberships.filter((item) => {
        return item.id === parseInt(this.$route.params.id)
      })
      return sm
    },
    basicMembership() {
      return this.memberships.filter((item) => {
        return item.basic
      })
    },
    memberships() {
      return this.$store.state.club.memberships
    },
    club() {
      return this.$store.state.club
    },
    isAdmin() {
      return this.$store.state.auth.user.is_admin
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        this.offset++
        this.getPlayers()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.getPlayers()
  },
  methods: {
    sendInvoices() {
      this.sendingInvoiceLoading = true
      new Invoice({ name: this.selectedMembership[0].name })
        .for(new Membership({ id: this.$route.params.id }))
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
    editMembership(item) {
      this.newMembership = this.memberships[item]
      this.activeStep = 1
    },
    deleteMemebership() {
      const club = new Club({ id: this.$store.state.club.id })
      const m = new Membership({ id: this.$route.params.id }).for(club)
      m.delete().then(() => {
        this.$buefy.toast.open({
          message: this.$t('Uspješno ste obrisali tip članstva'),
          type: 'is-success',
        })
        this.$store.dispatch('club/init_club', { force: true })
        this.$router.push(this.localePath('/admin/membership'))
      })
    },
    getMembership() {
      this.memberships = this.$store.state.club.memberships
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
    getPlayers() {
      if (this.last_page < this.offset) return
      Player.page(this.offset)
        .where('club', this.$store.state.club.id)
        .where('is_doubles', false)
        .where('membership', this.$route.params.id)
        .where('display_name', this.search_term)
        .get()
        .then((res) => {
          if (this.offset === 1) {
            this.club_players = res.data
          } else {
            this.club_players = [...this.club_players, ...res.data]
          }
          this.checkedRows = []
          this.total = res.meta.total
          this.last_page = res.meta.last_page
        })
    },
    submit(item) {
      const club = new Club(this.$store.state.club)
      this.memberships[item].basic = true
      const membership = new Membership(this.memberships[item]).for(club)
      membership
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste izmjenili osnovno članstvo'),
            type: 'is-success',
          })
          this.$store.dispatch('club/init_club', { force: true })
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
