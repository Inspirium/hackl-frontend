<template>
  <div v-if="Object.keys(liga).length" class="">
    <div class="label">{{ liga.admins.length === 1 ? 'Administrator lige' : 'Administratori lige' }}</div>

    <div class="activity__reservation">
      <transition name="fade">
        <div class="activity__box action__buttons">
          <div v-for="player in liga.admins" :key="player.id" class="action__item__small fw600">
            <TennisImage :size="[32, 32]" :src="player.image" class="user_image-small m-r-10 border__white" alt="" />
            <div>{{ player.display_name }}</div>
            <div v-if="isLigaAdmin.length || isAdmin" class="buttons m-l-auto">
              <b-button
                class="m-l-auto"
                type="is-danger"
                rounded
                size="is-smaller"
                :loading="loading"
                @click.stop="
                  isModalDeleteActive = true
                  selectedPlayer = player
                "
                >{{ $t('ukloni') }}</b-button
              >
            </div>
          </div>
        </div>
      </transition>
    </div>

    <div v-if="isLigaAdmin.length || isAdmin" class="buttons m-t-20">
      <b-button
        class="softshadow"
        type="is-small noborder"
        pack="fas"
        icon-right="plus"
        rounded
        @click.prevent="isModalMembersActive = true"
      >
        {{ $t('dodajAdministratora') }}
      </b-button>
    </div>
    <b-modal :active.sync="isModalMembersActive" :width="640" scroll="clip" class="modal__members">
      <modalMembers
        :title="$t('dodajteAdmina')"
        :is-player="true"
        :show-tennis-school="false"
        @player="addAdmin($event)"
      ></modalMembers>
    </b-modal>
    <b-modal :active.sync="isModalDeleteActive" :width="640" class="modal__confirmation" scroll="clip">
      <modalConfirmation :title="$t('jesteLiSigurni')" @update="deleteAdmin"></modalConfirmation>
    </b-modal>

    <slot></slot>
  </div>
</template>

<script>
import _ from 'lodash'
import League from '@/models/League'
import Player from '@/models/Player'
import TennisImage from '@/components/TennisImage.vue'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import modalMembers from '~/components/modal/ModalMembersAll'

export default {
  name: 'AdminEdit',
  components: {
    modalConfirmation,
    modalMembers,
    TennisImage,
  },
  props: {
    options: {
      type: Object,
      required: false,
      default() {},
    },
  },
  async fetch() {
    await this.getLeague()
  },
  data() {
    return {
      isModalDeleteActive: false,
      isModalMembersActive: false,
      selectedPlayer: {},
      selectedAdmin: {},
      admins: [],
      loading: false,
      liga: {},
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin && this.user.admin.includes(this.liga.club_id)
    },
    isLigaAdmin() {
      return _.filter(this.liga.admins, (item) => {
        return item.id === this.$store.state.auth.user.id
      })
    },
  },
  watch: {},
  methods: {
    deleteAdmin() {
      this.loading = true
      const l = new League({ id: this.liga.id })
      const p = new Player({ id: this.selectedPlayer.id }).for(l)
      p.config({
        data: {
          admin: true,
        },
        method: 'DELETE',
      })
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno si uklonio administratora'),
            type: 'is-success',
          })
          this.getLeague()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loading = false
        })
    },
    addAdmin(item) {
      this.selectedAdmin = item
      this.bla()
    },
    bla() {
      if (_.indexOf(this.admins, this.selectedAdmin) > -1) {
        this.admins.splice(_.indexOf(this.admins, this.selectedAdmin), 1)
      } else {
        this.admins.push(this.selectedAdmin)
        this.submit()
      }
    },
    getLeague() {
      League.include(['admins'])
        .find(this.$route.params.id)
        .then((res) => {
          this.liga = res
          this.admins = res.admins
          this.loading = false
        })
    },
    submit() {
      this.loading = true
      const l = new League({ id: this.liga.id })
      l.players()
        .attach({ admins: this.admins })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste osvježili administratore lige'),
            type: 'is-success',
          })
          this.loading = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške'),
            type: 'is-danger',
            duration: 2500,
          })
          this.loading = false
        })
    },
    deleteDocument(index) {
      this.$emit('delete', index)
    },
  },
}
</script>
