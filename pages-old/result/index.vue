<template>
  <div class="results">
    <hero :page="'result'" :options="heroImage">
      <h1 class="has-text-white">{{ $t('rezultati2') }}</h1>
    </hero>
    <div class="activity x-container">
      <div v-if="club.type === 'classic'" class="buttons">
        <div class="button__big" @click="isCardModalActive = true">{{ $t('unesiRezultat') }}</div>
      </div>
      <b-tabs v-model="activeTab" position="is-centered">
        <b-tab-item :label="$t('sviRezultati')">
          <div class="modal-subtitle has-text-centered fw400 m-b-20">
            {{ $t('ukupnoMeeva') }}
            <span class="has-text-primary">{{ all_results_total }}</span>
          </div>
          <div class="activity__results">
            <div class="activity__box">
              <div class="results__list relative">
                <transition name="fade">
                  <div v-if="loading" class="align__centar__x loading_z_spinner">
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
                <div v-for="result in all_results" :key="'all' + result.id">
                  <template v-if="result.live === 1">
                    <div @click="link(result)">
                      <resultBoxLivePreview class="relative z-1" :result="result" />
                    </div>
                  </template>
                  <template v-else>
                    <resultBox
                      v-if="result.live !== 0"
                      class="relative z-1"
                      :class="{ blur_button: loadingVeryfing }"
                      :show-options="true"
                      :result="result"
                      @openItAdmin="
                        selectedResultAdmin = $event
                        isMatchOptionsModal = true
                      "
                      @delete="
                        isModalDeleteActive = true
                        result_id = $event
                      "
                      @dispute="
                        isModalDisputeActive = true
                        result_id = $event
                      "
                      @confirm="verifyResult"
                    >
                    </resultBox>
                  </template>
                  <transition name="slide-fade" mode="out-in">
                    <div
                      v-if="result.live === 1"
                      class="fw600 m-b-15 is-size-55 tie-break__live__label w100 m-b-10 m-t--10 is-red rounded-md has-text-white"
                      @click="$router.push(localePath('/result/' + result.id))"
                    >
                      <div class="has-text-centered">{{ $t('liveRezultat') }}</div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </b-tab-item>
        <b-tab-item v-if="$auth.loggedIn" :label="$t('mojiRezultati')">
          <div class="modal-subtitle has-text-centered fw400 m-b-20">
            {{ $t('ukupnoMeeva') }}
            <span class="has-text-primary">{{ my_results_total }}</span>
          </div>
          <div class="activity__results">
            <div class="activity__box">
              <div class="results__list">
                <div v-for="result in my_results" :key="'my' + result.id">
                  <resultBox
                    :class="{ blur_button: loadingVeryfing }"
                    :result="result"
                    @dispute="dispute($event)"
                    @confirm="verifyResult($event)"
                  >
                  </resultBox>
                </div>
              </div>
            </div>
          </div>
        </b-tab-item>
      </b-tabs>
    </div>
    <b-modal :active.sync="isMatchOptionsModal" :width="640" scroll="clip">
      <modalOptions
        :options="selectedResultAdmin"
        :title="$t('rezultat')"
        :subtitle="$t('Ako je došlo do greške pri upisu rezultata imate sljedeće opcije:')"
        @update="updateResult($event)"
      ></modalOptions>
    </b-modal>

    <b-modal :active.sync="isCardModalActive" :width="640" class="hidescrollbar" scroll="clip">
      <modalResult :title="$t('upiiRezultat')" :subtitle="$t('Filtriraj popis prema snazi igrača')"></modalResult>
    </b-modal>
    <b-modal :active.sync="isModalResultUpdate" :width="640" class="hidescrollbar" scroll="clip">
      <modalResult
        :result-update="selectedResultAdmin"
        :options="{ prepopulated: true, updateResult: true, bothPlayers: selectedResultAdmin.players }"
        :title="$t('upiiRezultat')"
        :subtitle="$t('Filtriraj popis prema snazi igrača')"
      ></modalResult>
    </b-modal>
    <b-modal :active.sync="isModalDeleteActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('eliteObrisatiRezultat')"
        :subtitle="$t('Vaš suigrač biti će obaviješten o brisanju rezultata')"
        @update="deleteResult"
      ></modalConfirmation>
    </b-modal>
    <b-modal :active.sync="isModalDisputeActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('eliteOsporitiRezultat')"
        :subtitle="$t('Vašom potvrdom rezultat neće biti spremljen i vaši bodovi ostaju nepromijenjeni')"
        @update="disputeResult"
      ></modalConfirmation>
    </b-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import Result from '@/models/Result'
import hero from '~/components/Hero'
import modalResult from '~/components/modal/ModalResult'
import modalOptions from '~/components/modal/ModalMatchAdminOptions'
import resultBox from '~/components/ResultBox'
import resultBoxLivePreview from '~/components/ResultBoxLivePreview'
import modalConfirmation from '~/components/modal/ModalConfirmation'

export default {
  name: 'Results',
  components: {
    hero,
    modalResult,
    modalOptions,
    resultBox,
    resultBoxLivePreview,
    modalConfirmation,
  },
  async fetch() {
    await this.getResults()
    if (this.$auth.loggedIn) {
      await this.getMyResults()
    }
  },
  data() {
    return {
      isMatchOptionsModal: false,
      selectedResultAdmin: {},
      isModalResultUpdate: false,
      result_id: 0,
      game_id: 0,
      selectedResult: null,
      heroImage: '/hero_results.jpg',
      test: '',
      activeTab: 0,
      isCardModalActive: false,
      isModalDeleteActive: false,
      isModalDisputeActive: false,
      all_results: [],
      all_results_page: 1,
      all_results_last_page: 1,
      all_results_total: 1,
      my_results: [],
      my_results_page: 1,
      my_results_last_page: 1,
      my_results_total: 0,
      selected_match: 'all',
      bottom: false,
      loading: false,
      loadingMy: false,
      loadingVeryfing: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    club() {
      return this.$store.state.club
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        switch (this.activeTab) {
          case 0:
            this.getResults()
            break
          case 1:
            this.getMyResults()
            break
        }
      }
    },
    selected_match() {
      this.all_results = []
      this.bottom = false
      this.all_results_page = 1
      this.getResults()
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
  },
  methods: {
    updateResult(event) {
      if (event === 1) {
        this.isModalResultUpdate = true
      } else if (event === 0) {
        const r = new Result({ id: this.selectedResultAdmin.id })
        r.delete()
          .then(() => {
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste obrisali rezultat'),
              type: 'is-success',
            })
            this.getResultsRefresh()
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške, pokušajte ponovno'),
              type: 'is-danger',
            })
          })
      }
    },
    link(match) {
      if (match.live_data.umpire === this.user.id) {
        this.$router.push(this.localePath('/live/' + match.game_id))
      } else {
        this.$router.push(this.localePath('/result/' + match.id))
      }
    },
    swipeHandler(direction) {
      if (direction === 'right') {
        this.activeTab = 0
      } else if (direction === 'left') {
        this.activeTab = 1
      }
    },
    getMyResults() {
      this.loadingMy = true
      if (this.my_results_page <= this.my_results_last_page) {
        Result.where('player', this.$auth.user.id)
          .page(this.my_results_page)
          .get()
          .then((res) => {
            this.my_results = res.data
            this.my_results_page++
            this.my_results_last_page = res.meta.last_page
            this.my_results_total = res.meta.total
            this.loadingMy = false
          })
      }
    },
    getResults() {
      if (this.all_results_last_page >= this.all_results_page) {
        this.loading = true
        const r = Result.include(['game']).page(this.all_results_page)
        if (this.$store.state.club.id !== 26) {
          r.where('club', this.$store.state.club.id)
        }
        r.get()
          .then((res) => {
            this.all_results = [...this.all_results, ...res.data]
            this.all_results_total = res.meta.total
            this.all_results_last_page = res.meta.last_page
            this.all_results_page++
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    getResultsRefresh() {
      Result.where('club', this.$store.state.club.id)
        .get()
        .then((res) => {
          this.all_results = res.data
        })
    },
    verifyResult(id) {
      this.loadingVeryfing = true
      const r = new Result({ id })
      Result.custom(r, 'verify')
        .get()
        .then(() => {
          _.each(this.all_results, (item) => {
            if (item.id === id) {
              item.verified = true
            }
          })
          this.getResultsRefresh()
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
    deleteResult() {
      if (this.result_id) {
        const r = new Result({ id: this.result_id })
        r.delete()
          .then(() => {
            this.all_results = _.filter(this.all_results, (item) => {
              return item.id !== this.result_id
            })
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste obrisali rezultat'),
              type: 'is-success',
            })
            this.result_id = 0
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
      this.loadingVeryfing = true
      if (this.result_id) {
        const r = new Result({ id: this.result_id })
        Result.custom(r, 'dispute')
          .get()
          .then(() => {
            this.$buefy.toast.open({
              message: this.$t('Uspješno ste osporili rezultat'),
              type: 'is-success',
            })
            this.getResultsRefresh()
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
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
  },

  head() {
    return {
      title: 'Rezultati',
    }
  },
}
</script>
