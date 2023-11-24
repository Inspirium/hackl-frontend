<template>
  <div v-if="Object.keys(player).length" class="">
    <div v-if="player.parents?.length" class="activity__header m-b-5 m-t-10">
      <div class="fw600 is-size-5 m-l-5">{{ $t('Roditelji') }}</div>
      <!--      <div class="label">{{ $t('Roditelji') }}</div>-->
    </div>
    <div v-else class="activity__header--center m-b-1">
      <div class="label">{{ $t('Poveži dijete s roditeljom') }}</div>
    </div>

    <div class="activity__reservation">
      <transition name="fade">
        <div v-if="player.parents" class="activity__box action__buttons">
          <div v-for="(parent, index) in player.parents" :key="parent.id" class="action__item__small fw600">
            <TennisImage :size="[42, 42]" :src="parent.image" class="user_image-small m-r-10 border__white" alt="" />
            <div>{{ parent.display_name }}</div>
            <div
              class="m-l-auto"
              @click="
                isModalDeleteActive = true
                selectedparent = index
              "
            >
              <b-icon icon="times-circle" type="is-danger" pack="fal" class="m-l-auto"> </b-icon>
            </div>
          </div>
        </div>
        <!--        <div v-else class="fw600 is-size-5 has-text-black50 has-text-centered flex align__centar__all m-t-5 m-b-5">-->
        <!--          <b-icon icon="exclamation-square" class="m-r-5" type="is-danger" size="is-smaller" pack="fal"></b-icon>-->
        <!--          {{ $t('Nema dodijeljenog djeteta') }}-->
        <!--        </div>-->
      </transition>
    </div>

    <div class="buttons m-t-20">
      <b-button
        class="softshadow"
        type="is-small noborder"
        pack="fas"
        icon-right="plus"
        rounded
        :loading="loading"
        @click.prevent="isModalMembersActive = true"
      >
        {{ $t('Dodaj roditelja') }}
      </b-button>
    </div>
    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip" class="modal__members">
      <modalMembers
        :is-doubles="false"
        :show-tennis-school="false"
        :is-player="true"
        :show-me="true"
        :title="$t('Dodaj roditelja')"
        @player="addParent($event)"
      ></modalMembers>
    </b-modal>
    <b-modal :active.sync="isModalDeleteActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation
        :title="$t('jesteLiSigurni')"
        :subtitle="$t('Potvrdom će se ukinuti poveznica između roditelja i djeteta')"
        @update="deleteParent"
      ></modalConfirmation>
    </b-modal>

    <slot></slot>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import Player from '@/models/Player'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import modalMembers from '~/components/modal/ModalMembersAll'

export default {
  name: 'ParentEdit',
  components: {
    modalConfirmation,
    modalMembers,
    TennisImage,
  },
  props: {
    player: {
      type: Object,
      required: true,
      default() {},
    },
  },
  data() {
    return {
      isModalDeleteActive: false,
      isModalMembersActive: false,
      selectedparent: null,
      loading: false,
    }
  },
  computed: {
    isAdmin() {
      return this.$store.state.auth.user.is_admin
    },
  },
  watch: {},
  methods: {
    addParent(item) {
      this.loading = true
      const p = new Player(this.player)
      p.parents = [...this.player.parents, item]
      p.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno povezano s roditeljem'),
            type: 'is-success',
          })
          this.loading = false
          this.$emit('update')
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    deleteParent() {
      this.loading = true
      this.player.parents.splice(this.selectedparent, 1)
      const p = new Player(this.player)
      p.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno uklonjena poveznica s roditeljem'),
            type: 'is-success',
          })
          this.loading = false
          this.$emit('update')
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
  },
}
</script>
