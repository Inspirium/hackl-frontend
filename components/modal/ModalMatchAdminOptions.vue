<template>
  <div>
    <div class="modal-title has-text-light">{{ title }}</div>
    <div class="modal-subtitle has-text-light m-b-20">
      {{ subtitle }}
    </div>
    <div class="filter-list">
      <div
        v-for="(item, index) in matchOptions"
        v-show="index === 2 ? !options.result.verified : true"
        :key="index"
        :class="['select-item', 'flex__column', { active: index === select }]"
        @click="select = index"
      >
        <div>{{ $t(item.name) }}</div>
      </div>
    </div>
    <div class="buttons is-fixed m-t-20">
      <b-button icon-left="times" pack="fal" type="is-danger" rounded @click="$parent.close()">
        {{ $t('zatvori') }}
      </b-button>
      <b-button :loading="loading" pack="fal" icon-left="check" type="is-primary" rounded @click="send()">
        {{ $t('potvrdi') }}
      </b-button>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import Result from '~/models/Result'
import Game from '~/models/Game'

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
    options: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      select: 0,
      loading: false,
      loadingVeryfing: false,
      matchOptions: [{ name: 'Obriši rezultat' }, { name: 'Ispravi rezultat' }],
    }
  },
  mounted() {
    if (this.options.is_surrendered !== null) {
      this.select = this.options.is_surrendered
    }
  },
  methods: {
    send() {
      if (this.select === 2) {
        this.verifyResult()
      }
      this.$emit('update', this.select)
      this.$parent.close()
    },
    verifyResult() {
      this.loadingVeryfing = true
      const r = new Result({ id: this.options.result.id })
      Result.custom(r, 'verify')
        .get()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste potvrdili rezultat'),
            type: 'is-success',
          })
          this.loadingVeryfing = false
          this.$parent.close()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loadingVeryfing = false
        })
    },
    updateResultSurrender() {
      this.loading = true
      const g = new Game({ id: this.options.id, is_surrendered: this.select })
      g.save()
        .then(() => {
          this.$parent.close()
          this.$buefy.toast.open({
            message: this.$t('Promjena je unesena'),
            type: 'is-success',
            duration: 3000,
          })
          this.$emit('update')
          this.loading = false
          this.$parent.close()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Promjena nije unesena'),
            type: 'is-danger',
            duration: 3000,
          })
          this.loading = false
        })
    },
  },
}
</script>
