<template>
  <div class="activity p-b-500">
    <div class="flex p-l-15 p-r-15 justify-between m-b-20 m-t-10">
      <div class="activity__header">
        <div class="fw600 is-size-3">{{ $t('poruke') }}</div>
      </div>
      <div class="buttons">
        <b-button
          tag="nuxt-link"
          :to="localePath('/messages/new')"
          class=""
          type="is-danger"
          pack="fal"
          icon-right="comment-plus"
          rounded
        >
          {{ $t('novaPoruka') }}
        </b-button>
      </div>
    </div>
    <div class="activity__box">
      <div class="tablelist">
        <b-table :data="threads" :mobile-cards="false" :bordered="false">
          <b-table-column
            v-slot="props"
            :td-attrs="
              (row) => ({
                class:
                  row.players.length < 3
                    ? 'active list__image-col p-t-10 p-b-10'
                    : 'active list__image-col p-t-15 p-b-15',
              })
            "
          >
            <nuxt-link :to="localePath('/messages/' + props.row.id)">
              <template v-if="props.row.players.length < 3">
                <div class="list__img">
                  <TennisImage :size="[42, 42]" :src="player(props.row).image" class="user_image" alt="" />
                </div>
                <div class="list__content">
                  <div class="align__centar__y m-b-5">
                    <h3 class="fw600 is-size-55 has-text-black80">
                      {{ player(props.row).display_name }}
                    </h3>
                    <h4 class="has-text-grey-light fw600 m-l-auto is-size-65">
                      {{
                        $t('key', {
                          expr:
                            props.row.lastMessage === null
                              ? $moment(props.row.updated_at).calendar()
                              : $moment(props.row.lastMessage.created_at).calendar(),
                        })
                      }}
                    </h4>
                  </div>
                  <h4 v-if="props.row.lastMessage !== null" class="is-size-65 has-text-lightblue">
                    {{ props.row.lastMessage.message }}
                  </h4>
                </div>
              </template>
              <template v-else>
                <div class="user_image m-r-10 align__centar__all fw400 has-text-grey-lighter is-size-3">
                  {{ props.row.players.length }}
                </div>
                <div class="list__content">
                  <h4 class="has-text-grey-light fw600 m-l-auto m-b-5 is-size-65">
                    {{
                      $t('key', {
                        expr:
                          props.row.lastMessage === null
                            ? $moment(props.row.updated_at).format('DD.MM. - LT')
                            : $moment(props.row.lastMessage.created_at).format('DD.MM. - LT'),
                      })
                    }}
                  </h4>

                  <h3 class="fw600 is-size-55 has-text-black80">
                    {{ props.row.title ? props.row.title : 'Nema naziva' }}
                  </h3>
                  <div v-if="props.row.lastMessage" class="flex__column">
                    <div class="flex m-b-5 m-t-10">
                      <TennisImage
                        :size="[32, 32]"
                        :src="props.row.lastMessage.player.image"
                        class="user_image-smaller"
                        alt=""
                      />
                      <div v-if="props.row.lastMessage !== null" class="has-text-lightblue is-size-65 m-l-5 fw800">
                        {{ props.row.lastMessage.player.display_name }}:
                      </div>
                    </div>
                    <div v-if="props.row.lastMessage !== null" class="has-text-black80 m-l-5 is-size-65 fw500">
                      {{ props.row.lastMessage.message }}
                    </div>
                  </div>
                </div>
              </template>
            </nuxt-link>
          </b-table-column>
        </b-table>
      </div>
    </div>
    <transition v-if="loading" name="fade">
      <div class="align__centar__x m-t-100 loading_z_spinner">
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
  </div>
</template>
<script>
import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import Thread from '@/models/Thread'

export default {
  name: 'Messages',
  components: {
    TennisImage,
  },
  async fetch() {
    await this.getThreads()
  },
  data() {
    return {
      threads: [],
      threads_page: 1,
      total_threads_pages: 1,
      bottom: false,
      loading: false,
    }
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        this.getThreads()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
  },
  methods: {
    player(thread) {
      if (thread.players[0].id === this.$auth.user.id) {
        return thread.players[1] ? thread.players[1] : thread.players[0]
      }
      return thread.players[0]
    },
    deleteMessages() {
      _.forEach(this.checked, (id) => {
        const thread = new Thread({ id })
        thread.delete()
      })
      this.checked = []
    },
    getThreads() {
      if (this.threads_page <= this.total_threads_pages) {
        this.loading = true
        Thread.page(this.threads_page)
          .get()
          .then((res) => {
            this.loading = false
            this.threads = [...this.threads, ...res.data]
            this.threads_page++
            this.total_threads_pages = res.meta.last_page
          })
      }
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
  },
  head() {
    return {
      title: 'Poruke',
    }
  },
}
</script>
