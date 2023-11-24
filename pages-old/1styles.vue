<template>
  <div>
    <div class="modal-title">modal-title</div>
    <div class="modal-subtitle">modal-subtitle</div>
    <div class="label">{{ $t('label') }}</div>
    <div class="title">{{ $t('title') }}</div>
    <div class="title-num">title-num</div>
    <div class="x-tag">x-tag</div>
    <div class="ranks">{{ $t('ranks') }}</div>
  </div>
</template>

<script>
export default {
  name: 'Styles',
  data() {
    return {
      isCardModalActive: false,
      playersPower: 'Sve',
      search: '',
      hasMobileCards: false,
      isBordered: false,
      data: [
        {
          id: 1,
          name: 'Andrija Kartelo',
          user_image: '/_nuxt/assets/img/members.jpg',
          user_powerRange: '80 - 90%',
        },
        {
          id: 2,
          name: 'Marko Novak',
          user_image: '/_nuxt/assets/img/members.jpg',
          user_powerRange: '80 - 90%',
        },
        {
          id: 3,
          name: 'Danijel Galić',
          user_image: '/_nuxt/assets/img/members.jpg',
          user_powerRange: '80 - 90%',
        },
        {
          id: 4,
          name: 'Stjepan Drmić',
          user_image: '/_nuxt/assets/img/members.jpg',
          user_powerRange: '80 - 90%',
        },
        {
          id: 5,
          name: 'Markan Banušić',
          user_image: '/_nuxt/assets/img/members.jpg',
          user_powerRange: '80 - 90%',
        },
      ],
    }
  },
}
</script>
