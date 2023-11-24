<template>
  <div>
    <div class="modal-title has-text-light">{{ title }}</div>
    <div class="modal-subtitle has-text-light m-b-20">
      {{ subtitle }}
    </div>
    <div class="filter-list">
      <div
        v-for="(item, index) in matchOptions"
        :key="index"
        :class="['select-item', 'flex__column', { active: index === select }]"
        :style="index === 4 ? 'marginTop: 30px' : ''"
        @click="select = index"
      >
        <div>{{ item.name }}</div>
        <div class="liga__subtitle is-size-7 has-text-black50 m-t--5">{{ item.subtitle }}</div>
      </div>
    </div>
    <div class="buttons is-fixed m-t-20">
      <b-button icon-left="times" pack="fal" type="is-danger" rounded @click="$parent.close()">
        {{ $t('zatvori') }}
      </b-button>
      <b-button
        :loading="loading"
        pack="fal"
        icon-left="check"
        type="is-primary"
        rounded
        @click="updateResultSurrender()"
      >
        {{ $t('potvrdi') }}
      </b-button>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
// import Result from '~/models/Result'
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
      matchOptions: [
        { name: this.$t('Regularan meč'), subtitle: '' },
        {
          name: this.$t('Predaja:') + ' ' + this.options.players[0].display_name,
          subtitle: this.options.players[1].display_name + ' ' + this.$t('dobiva bodove'),
        },
        {
          name: this.$t('Predaja:') + ' ' + this.options.players[1].display_name,
          subtitle: this.options.players[0].display_name + ' ' + this.$t('dobiva bodove'),
        },
        { name: this.$t('Poništi meč'), subtitle: this.$t('Nitko ne dobiva bodove') },
        { name: this.$t('Upiši rezultat'), subtitle: this.$t('Ukoliko igrači nisu u mogućnosti') },
      ],
    }
  },
  mounted() {
    if (this.options.is_surrendered !== null) {
      this.select = this.options.is_surrendered
    }
  },
  methods: {
    send() {
      this.$emit('result', this.options.players)
      this.$parent.close()
    },
    updateResultSurrender() {
      if (this.select === 4) {
        this.send()
      } else {
        // 0 - regular; 1 - surrender first player; 2 - second player; 3 - match canceled
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
      }
    },
  },
}
</script>
