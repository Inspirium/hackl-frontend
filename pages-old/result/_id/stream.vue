<template>
  <div class="results overflowhidden">
    <div class="z-1 relative">
      <div class="activity__results">
        <div class="activity__box">
          <div class="results__list">
            <div>
              <resultBoxLivePreviewStream
                v-if="result.live === 1"
                :stream="true"
                class="relative z-1 m-b--20"
                :result="result"
              />
              <template v-else>
                <resultBox
                  v-if="result.id"
                  :stream="true"
                  class="relative z-1"
                  :result="result"
                  @delete="confirm($event)"
                  @dispute="dispute($event)"
                  @confirm="verifyResult($event)"
                >
                </resultBox>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="streamback"></div>
  </div>
</template>

<script>
import Result from '@/models/Result'
import Player from '@/models/Player'
import resultBox from '~/components/ResultBox'
// import resultBoxLivePreview from '~/components/ResultBoxLivePreview'
import resultBoxLivePreviewStream from '~/components/ResultBoxLivePlayingStream'

export default {
  layout: 'noTop',
  name: 'LiveStream',
  components: {
    resultBox,
    resultBoxLivePreviewStream,
  },
  async fetch() {
    if (process.client) {
      this.$nextTick(() => {
        this.$root.$loading.start()
      })
    }
    await this.$nextTick(() => {
      this.getResults()
    })
  },
  data() {
    return {
      isModalDisputeActive: false,
      isModalActive: false,
      message: this.$t(''),
      result: {},
      sending: false,
      comments: [],
      result_id: null,
      umpire: {},
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  mounted() {
    this.getPlayer()
    const htmlElement = document.getElementsByTagName('html')[0]
    htmlElement.style.overflowY = 'hidden'
  },
  beforeDestroy() {
    this.$echo.leave('result.' + this.result.id)
    const htmlElement = document.getElementsByTagName('html')[0]
    htmlElement.style.overflowY = 'auto'
  },
  methods: {
    async getPlayer() {
      this.umpire = await Player.$find(Object.keys(this.result).length ? this.result.live_data.umpire : 2)
    },
    getResults() {
      Result.find(this.$route.params.id).then((res) => {
        this.result = new Result(res)
        this.$root.$loading.finish()
        if (this.result.live === 1) {
          this.$echo.channel('live.' + this.result.game_id).listen('LiveResultUpdated', (e) => {
            this.result = e.game.result
          })
        }
      })
    },
  },
}
</script>
<style scoped></style>
