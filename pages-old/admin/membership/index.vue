<template>
  <div v-if="isAdmin && Object.keys(clubNew).length">
    <PageHeader :title="$t('Članstvo')" :background="'is-primary'" />
    <div class="activity x-container">
      <div class="fw600 has-text-centered m-b-10 is-size-4 line-height-19">
        {{ $t('kreirajNoveVrsteLanstvaISpecificirajPogodnosti') }}
      </div>
      <div class="activity__reservation">
        <div v-if="clubNew.memberships.length > 1 && basicMembership.length" class="filters container">
          <div class="filter">
            <div class="label m-t-0">{{ $t('osnovnoLanstvo') }}</div>
            <div class="buttons">
              <b-button type="is-primary" pack="far" icon-right="chevron-down" @click="isModalMembershipActive = true">
                {{ basicMembership[0].name }}
              </b-button>
            </div>
          </div>
        </div>

        <div class="buttons m-t-20">
          <b-button
            class="fw600"
            type="is-danger"
            pack="fal"
            icon-right="plus-circle"
            rounded
            tag="nuxt-link"
            :to="localePath('/admin/membership/new')"
          >
            {{ $t('izradiNovo') }}
          </b-button>
        </div>
        <div class="fw600 has-text-centered has-text-black50 m-b-15 m-t--5">{{ $t('urediPostojeaLanstva') }}</div>

        <div class="activity__box action__buttons m-b-15">
          <nuxt-link
            v-for="item in clubNew.memberships"
            :key="item.id"
            class="action__item__small fw600"
            :to="localePath('/admin/membership/' + item.id)"
          >
            <div>
              <div class="is-size-55 has-text-black80 m-r-5 m-b--5">{{ item.name }}</div>
              <div v-if="item.subscription" class="is-size-7 has-text-primary m-t--2 inlineblock">
                {{ $t('Pretplata') }} —
              </div>
              <div
                v-if="item.subscription?.status"
                :class="item.subscription.status === 'active' ? 'has-text-success' : 'has-text-danger'"
                class="is-size-7 inlineblock m-t--2"
              >
                {{ item.subscription.status === 'active' ? $t('active') : $t('Nije aktivno') }}
              </div>
            </div>
            <span v-if="item.subscription?.price || item.price" class="x-tag primary-light m-l-auto m-r-5">
              {{ item.subscription?.price || item.price | currency }}
            </span>
            <span v-else class="x-tag primary-light m-l-auto m-r-5">
              {{ $t('besplatno') }}
            </span>
            <span>
              <b-icon
                v-if="clubNew.memberships.length > 1"
                icon="chevron-right"
                type="is-black80"
                pack="fal"
                class="m-l-5"
              >
              </b-icon>
            </span>
          </nuxt-link>
        </div>
      </div>
    </div>
    <b-modal :active.sync="isModalDeleteActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('eliTrajnoObrisatiOdabranoLanstvo')"
        :subtitle="$t('Nakon brisanja svi korisnici tog članstva biti će prebačeni na standardno članstvo')"
        @update="deleteMemebership()"
      ></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalMembershipActive" :width="640" scroll="clip">
      <modal-options
        :options="clubNew.memberships"
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
import Membership from '@/models/Membership'
import Club from '@/models/Club'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import ModalOptions from '~/components/modal/ModalOptionsMembershipBasic'
import PageHeader from '~/components/headers/blankBack'

export default {
  name: 'Membership',
  components: {
    PageHeader,
    ModalOptions,
    modalConfirmation,
  },
  data() {
    return {
      isModalMembershipActive: false,
      indicator: {
        steps: 8,
      },
      isModalDeleteActive: false,
      deleteMembershipId: null,
      clubNew: [],
    }
  },
  computed: {
    basicMembership() {
      return this.clubNew.memberships.filter((item) => {
        return item.basic
      })
    },
    // memberships() {
    //   return this.$store.state.club.memberships
    // },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
  },
  mounted() {
    this.getClubs()
  },
  methods: {
    getClubs() {
      Club.include('memberships')
        .find(this.$store.state.club.id)
        .then((res) => {
          this.clubNew = res
        })
    },
    editMembership(item) {
      this.newMembership = this.clubNew.memberships[item]
      this.activeStep = 1
    },
    deleteMemebership() {
      const club = new Club({ id: this.$store.state.club.id })
      const m = new Membership({ id: this.deleteMembershipId }).for(club)
      m.delete().then(() => {
        this.$buefy.toast.open({
          message: this.$t('Uspješno ste obrisali tip članstva'),
          type: 'is-success',
        })
        this.$store.dispatch('club/init_club', { force: true })
      })
    },
    submit(item) {
      const club = new Club(this.$store.state.club)
      this.clubNew.memberships[item].basic = true
      const membership = new Membership(this.clubNew.memberships[item]).for(club)
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
