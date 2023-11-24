<template>
  <div v-if="orders.length" class="home">
    <div class="relative p-x-16 m-t-20">
      <div class="activity__header m-b-10">
        <nuxt-link :to="localePath('/player/' + user.id + '/workorders')" class="fw600"
          >{{ $t('Radni nalozi') }}
          <b-icon class="m-l-5 linkarrow" icon="long-arrow-right" size="is-small" pack="fal"></b-icon>
        </nuxt-link>
      </div>
      <template>
        <div class="is-white radius__12 softshadow">
          <div class="bb1-10"></div>
          <div v-for="(item, index) in orders" :key="index + 'or'" class="p-r-10 p-l-10 p-t-5 p-b-5 bb1-10">
            <nuxt-link
              :to="
                item.assignee_id === user.id || item.assigner_id === user.id
                  ? localePath(`/admin/workorders/${item.id}`)
                  : localePath(`/player/${user.id}/orders/${item.orderable_id}`)
              "
              class="fw600 align__centar__all"
            >
              <div v-if="item.assigner.image" class="list__img">
                <TennisImage :size="[80, 80]" :src="item.assignee.image" class="user_image" alt="" />
              </div>
              <div class="list__content">
                <div class="align__centar__y">
                  <h4 class="has-text-grey-light fw600 is-size-7">
                    {{ item.created_at | moment('DD.MM.YYYY.') }}
                  </h4>
                </div>
                <h4 class="fw600 is-size-5 m-t--2">{{ item.assignee.display_name }}</h4>
                <h3 class="fw600 has-text-black80 is-size-65">
                  {{ $t('Zadužio') }}:
                  <span class="has-text-lightblue">{{ item.assigner.display_name }}</span>
                </h3>
              </div>
              <div class="flex flex__column justify-start">
                <h3 v-if="item.orderable" class="fw600 has-text-black80 is-size-6 has-text-right m-b-3">
                  {{ $t('key5', { currency: item.orderable.total }) | currency }}
                </h3>
                <div v-if="item.status" class="x-tag m-l-auto nowrap" :class="returnBckg(item)">
                  {{ $t(item.status) }}
                </div>
              </div>
            </nuxt-link>
          </div>
        </div>
        <template v-if="!loading && !orders.length">
          <section class="section has-text-centered m-t-20">
            <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
            <div class="fw600 is-size-4 has-text-centered has-text-black80 m-b-10 m-t-0">
              {{ $t('nemaPodataka') }}
            </div>
          </section>
        </template>
      </template>
      <transition v-if="loading" name="fade">
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
  </div>
</template>
<script>
import TennisImage from '@/components/TennisImage.vue'
// import _ from 'lodash'
import WorkOrder from '~/models/WorkOrder'

export default {
  name: 'HomeWorkorders',
  components: {
    TennisImage,
  },
  async fetch() {
    await this.getOrders()
  },
  data() {
    return {
      orders: [],
      total: null,
      loading: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
  methods: {
    getOrders() {
      this.loading = true
      const wo = WorkOrder.include('assignee', 'assigner')
      wo.where('club', this.$store.state.club.id)
        .where('assignee', this.user.id)
        .where('status', 'pending')
        .orderBy('-created_at')
        .limit(3)
        .get()
        .then((res) => {
          this.orders = res.data
          this.total = res.meta.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    returnBckg(item) {
      if (item.status === 'pending') {
        return 'is-primary has-text-white'
      } else if (item.status === 'completed') {
        return 'green has-text-white'
      } else if (item.status === 'cancelled') {
        return 'is-red has-text-white'
      } else {
        return ''
      }
    },
  },
}
</script>

<style scoped>
.activity__reservation h4 {
  color: $black60;
}
</style>
