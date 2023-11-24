<template>
  <div>
    <div class="modal-title has-text-light m-b-10">{{ title }}</div>
    <div class="modal-subtitle has-text-light m-b-20">
      {{ subtitle }}
    </div>
    <div class="filter-list">
      <div
        :class="['select-item', { active: selectedId === null }]"
        @click="
          selectedId = null
          send()
        "
      >
        {{ $t('sviTereni') }}
      </div>
      <template v-if="loading">
        <transition name="fade">
          <div class="align__centar__x loading_z_spinner--bottom m-t-20">
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
      </template>

      <div
        v-for="(item, index) in courts"
        :key="index"
        :class="['select-item', { active: item.id === selectedId }]"
        @click="
          selectedId = item.id
          selectedCourt = item
          send()
        "
      >
        <div>{{ item.name }}</div>
      </div>
    </div>
    <div v-show="false" class="buttons is-fixed m-t-20">
      <b-button icon-left="times" pack="fal" type="is-danger" rounded @click="$parent.close()">
        {{ $t('zatvori') }}
      </b-button>
      <b-button
        pack="fal"
        icon-left="check"
        type="is-primary"
        rounded
        @click="
          send()
          $parent.close()
        "
      >
        {{ $t('potvrdi') }}
      </b-button>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import Court from '~/models/Court'

export default {
  name: 'ModalOptions',
  props: {
    title: {
      type: String,
      required: true,
      default: 'Tip',
    },
    subtitle: {
      type: String,
      required: false,
      default: 'Filtriraj po tipu',
    },
  },
  data() {
    return {
      loading: false,
      selectedId: 0,
      selectedCourt: {},
      courts: [],
    }
  },
  mounted() {
    this.getCourts()
  },
  methods: {
    getCourts() {
      this.loading = true
      Court.where('is_active', 1)
        .params({ date: this.$moment().format('YYYY-MM-DD') })
        .get()
        .then((res) => {
          this.courts = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    send() {
      this.$emit('update', { selectedId: this.selectedId, selectedCourt: this.selectedCourt })
      this.$parent.close()
    },
  },
}
</script>
