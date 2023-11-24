<template>
  <div v-if="results.length" class="home__rankings">
    <div class="activity x-container results">
      <div class="activity__results">
        <div class="activity__header m-b-10">
          <nuxt-link :to="localePath('/result')" class="fw600"
            >{{ $t('posljednjiRezultati') }}
            <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
          </nuxt-link>
        </div>
        <div class="activity__box">
          <div class="results__list">
            <div v-for="result in results" :key="result.id">
              <resultBox :result="result" @delete="confirm($event)" @dispute="dispute($event)"> </resultBox>
            </div>
          </div>
          <div class="readmore readmore__activity">
            <div class="title-num">
              {{ $t('pregledajSveRezultate') }}
              <b-icon class="m-l-10" icon="arrow-right" size="is-small" pack="fal"></b-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal :active.sync="isModalActive" :width="640" scroll="clip" class="modal__confirmation">
      <modalConfirmation
        :title="$t('potvrdomEteObrisatiRezultat')"
        :subtitle="$t('jesteLiSigurni')"
        @update="deleteResult"
      ></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalDisputeActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('eliteOsporitiRezultat')"
        :subtitle="$t('Osporavanjem rezultat neće biti spremljen i vaši bodovi ostaju nepromijenjeni')"
        @update="disputeResult"
      ></modalConfirmation>
    </b-modal>
  </div>
</template>

<script>
// import _ from 'lodash'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import resultBox from '~/components/ResultBox'
import Result from '~/models/Result'

export default {
  name: 'HomeResults',
  components: {
    resultBox,
    modalConfirmation,
  },
  async fetch() {
    if (this.$auth.loggedIn && this.$store.state.club.id) {
      await this.getResults()
    }
  },
  data() {
    return {
      selectedReservation: false,
      isModalDisputeActive: false,
      isModalActive: false,
      hasMobileCards: false,
      isBordered: false,
      results: [],
      result_id: null,
      loadingVeryfing: false,
    }
  },
  methods: {
    confirm(item) {
      this.result_id = item
      this.isModalActive = true
    },
    async getResults() {
      let r = Result.include(['game']).limit(3)
      if (this.$store.state.club.id !== 26) {
        r = r.where('club', this.$store.state.club.id)
      }
      this.results = await r.$get()
    },
    deleteResult() {
      if (this.result_id) {
        const r = new Result({ id: this.result_id })
        r.delete()
          .then(() => {
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste obrisali rezultat'),
              type: 'is-success',
            })
            this.getResults()
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške, pokušajte ponovno'),
              type: 'is-danger',
            })
          })
      }
    },
    dispute(item) {
      this.result_id = item
      this.isModalDisputeActive = true
    },
    disputeResult() {
      if (this.result_id) {
        this.loadingVeryfing = true
        const r = new Result({ id: this.result_id })
        Result.custom(r, 'dispute')
          .get()
          .then(() => {
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste osporili rezultat'),
              type: 'is-success',
            })
            this.getResults()
            this.loadingVeryfing = false
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške, pokušajte ponovno'),
              type: 'is-danger',
            })
            this.loadingVeryfing = false
          })
      }
    },
    verifyResult(id) {
      const r = new Result({ id })
      this.loadingVeryfing = true
      Result.custom(r, 'verify')
        .get()
        .then(() => {
          this.getResults()
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste potvrdili rezultat'),
            type: 'is-success',
          })
          this.loadingVeryfing = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loadingVeryfing = false
        })
    },
  },
}
</script>
