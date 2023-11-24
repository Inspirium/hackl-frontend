<template>
  <div class="members">
    <h1 @click="isModalReservation = true">{{ $t('test') }}</h1>
    <b-modal :active.sync="isModalReservation" :width="640" scroll="clip">
      <modal-reservation
        :title="$t('rezervacija')"
        :subtitle="$t('Rezerviraj slobodne termine')"
        @update="updateAge"
      ></modal-reservation>
    </b-modal>
  </div>
</template>

<script>
import modalReservation from '~/components/modal/ModalCourtReservation'

export default {
  name: 'Members',
  components: {
    modalReservation,
  },
  data() {
    return {
      isModalReservation: false,
      data: [
        {
          id: 1,
          name: 'Andrija Kartelo',
          user_image: require('../../assets/img/user.jpg'),
          powerRange: 83.43,
          elo: 1583,
          age: 23,
        },
        {
          id: 2,
          name: 'Marko Novak',
          user_image: require('../../assets/img/members.jpg'),
          powerRange: 45.05,
          elo: 1583,
          age: 34,
        },
        {
          id: 3,
          name: 'Danijel Galić',
          user_image: require('../../assets/img/user.jpg'),
          powerRange: 33.87,
          elo: 1583,
          age: 35,
        },
        {
          id: 6,
          name: 'Danijel Galić',
          user_image: require('../../assets/img/members.jpg'),
          powerRange: 32.77,
          elo: 1583,
          age: 65,
        },
        {
          id: 4,
          name: 'Stjepan Drmić',
          user_image: require('../../assets/img/user.jpg'),
          powerRange: 56.54,
          elo: 1583,
          age: 44,
        },
        {
          id: 5,
          name: 'Markan Banušić',
          user_image: require('../../assets/img/members.jpg'),
          powerRange: 78.76,
          elo: 1583,
          age: 47,
        },
      ],
    }
  },
  methods: {},
}
</script>
