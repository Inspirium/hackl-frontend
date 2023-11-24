<template>
  <div class="has-text-centered">
    <div class="modal-title p-r-0 has-text-light">
      {{ $t('primajObavijesti') }} <br />
      {{ $store.state.club.name }}
    </div>
    <div class="modal-subtitle m-t-10 p-r-0 has-text-light m-b-20">
      {{ $t('potvrdnoOdgovoriteNaUpitSljedeegProzora') }}
    </div>
    <div class="buttons m-t-20">
      <b-button icon-left="times" pack="fal" type="is-danger" rounded @click="$parent.close()">
        {{ $t('zatvori') }}
      </b-button>
      <b-button pack="fal" icon-left="check" type="is-primary" rounded @click="$parent.close()">
        {{ $t('potvrdi') }}
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalNotification',
  data() {
    return {
      select: 0,
    }
  },
  methods: {
    send() {
      this.$parent.close()
    },
  },
}
</script>
