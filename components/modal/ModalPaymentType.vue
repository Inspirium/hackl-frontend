<template>
  <div class="modal-confirmation">
    <transition name="fade">
      <div>
        <div class="modal-title has-text-light m-b-5">{{ title }}</div>
        <div class="modal-subtitle has-text-light m-b-20">
          {{ subtitle }}
        </div>
        <ValidationProvider v-slot="{ errors, valid }" name="Tip troška" rules="required">
          <b-field
            :label="$t('tipTroka')"
            class="login__input__container has-text-lightblue"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors"
          >
            <b-input v-model="newTypes.name" :placeholder="$t('upiiNazivTroka')" type="text" rounded> </b-input>
          </b-field>
        </ValidationProvider>
        <ValidationProvider v-slot="{ errors, valid }" name="Iznos" rules="required">
          <b-field
            :label="$t('iznos')"
            class="login__input__container has-text-lightblue"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors"
          >
            <b-input v-model="newTypes.price" :placeholder="$t('upiiIznosTroka')" type="text" rounded> </b-input>
          </b-field>
        </ValidationProvider>

        <div class="buttons m-t-20 m-l--5 m-t-30">
          <b-button
            class="m-l-10 fw600"
            type="is-danger"
            pack="fal"
            icon-right="times"
            rounded
            @click="$parent.close()"
          >
            {{ $t('otkai') }}
          </b-button>
          <b-button class="m-l-10 fw600" type="is-primary" pack="fal" icon-right="chevron-right" rounded @click="send">
            {{ $t('spremi') }}
          </b-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import _ from 'lodash'

import OtherExpense from '@/models/OtherExpense'
import Club from '@/models/Club'

export default {
  name: 'ModalPaymentType',
  props: {
    title: {
      type: String,
      required: true,
      default: 'Tip',
    },
    subtitle: {
      type: String,
      required: false,
      default: 'Podnaslov',
    },
  },
  data() {
    return {
      newTypes: {
        name: '',
        price: null,
      },
    }
  },
  methods: {
    send() {
      const club = new Club({ id: this.$store.state.club.id })
      const expense = new OtherExpense(this.newTypes).for(club)
      expense.save().then((res) => {
        this.$emit('update', res)
        this.$parent.close()
      })
    },
  },
}
</script>
