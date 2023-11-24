<template>
  <div>
    <courtsGlobal v-if="$store.state.club.id === 26" />
    <courtsClub v-else />
  </div>
</template>
<script>
import courtsClub from '~/components/court/CourtsClub'
import courtsGlobal from '~/components/court/CourtsGlobal'

export default {
  name: 'CourtsAll',
  layout: 'noBackFull',
  components: {
    courtsClub,
    courtsGlobal,
  },
}
</script>
