<template>
  <div class="">
    <b-tabs v-model="activeTabStrings" position="is-centered" class="hide_tab_navigation_impt">
      <b-tab-item>
        <div v-if="equipment.length" class="tablelist">
          <div class="fw600 is-size-55 m-t-20">{{ $t('reketi') }}</div>
          <transition name="fade">
            <div class="activity__box action__buttons">
              <div
                v-for="(item, index) in equipment"
                :key="item.id"
                class="p-r-10 p-l-10 p-t-7 p-b-7 bb1-10 payment_accontation"
                :class="{ selected_payee: selected_racquet === index }"
                @click="sendEmit(item, index)"
              >
                <div class="fw600 align__centar__all">
                  <div v-if="item.image" class="list__img">
                    <TennisImage :size="[42, 42]" :src="item.image" class="user_image" alt="" />
                  </div>
                  <div v-else class="">
                    <b-icon
                      icon="racquet"
                      pack="far"
                      size="is-medium m-r-15 m-l-5 top-5"
                      class="relative has-text-black30"
                    ></b-icon>
                  </div>
                  <div class="list__content">
                    <h4 class="fw600 is-size-5 has-text-black80 m-t--2">{{ item.name }}</h4>
                    <h3 v-if="item.description" class="fw600 m-t--2 has-text-black80 is-size-65">
                      {{ $t('opis2') }} <span class="has-text-lightblue">{{ item.description }}</span>
                    </h3>
                    <div v-if="item.data.tension" class="has-text-black80 fw600 is-size-65 m-l-auto nowrap">
                      {{ $t('kilaa') }}
                      <span class="has-text-lightblue">{{ $t('kg', { tension: item.data.tension }) }}</span>
                    </div>
                    <div v-if="item.data.string" class="has-text-black80 fw600 is-size-65 m-l-auto nowrap">
                      {{ $t('preferiranaIca') }} <span class="has-text-lightblue">{{ item.data.string }}</span>
                    </div>
                  </div>
                  <div
                    class=""
                    @click="
                      isModalConfirmationActive = true
                      selected_racquet = index
                    "
                  >
                    <b-icon
                      icon="times-circle"
                      :type="selected_racquet === index ? 'is-white' : 'is-danger'"
                      pack="fal"
                      class="m-r-10"
                    >
                    </b-icon>
                  </div>
                </div>
              </div>
            </div>
          </transition>
          <div class="buttons m-t-20">
            <b-button
              class="softshadow"
              type="is-small noborder"
              pack="fas"
              icon-right="plus"
              rounded
              @click="activeTabStrings = 1"
            >
              {{ $t('unesiNoviReket') }}
            </b-button>
          </div>
        </div>

        <div v-else class="flex flex__column align__centar__y m-t-30">
          <template v-if="true">
            <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
            <div class="fw600 is-size-5 has-text-centered has-text-danger m-t-5">{{ $t('igraNemaUneseneRekete') }}</div>
            <div class="fw600 is-size-65 has-text-centered has-text-black50 m-b-10 m-t-5">
              {{ $t('narudbuMoeteIzraditiIBezReketa') }}
            </div>
            <div class="buttons m-t-10">
              <b-button
                class="softshadow"
                type="is-small noborder"
                pack="fas"
                icon-right="plus"
                rounded
                @click="activeTabStrings = 1"
              >
                {{ $t('dodajNoviReket') }}
              </b-button>
            </div>
          </template>
        </div>
      </b-tab-item>
      <b-tab-item>
        <template>
          <div class="divider-line-1 m-t-15"></div>
          <div class="fw600 is-size-5 has-text-centered has-text-lightblue m-t-20 m-b--10">
            {{ $t('unesiNoviReket') }}
          </div>

          <ValidationProvider name="Naziv reketa" rules="required">
            <b-field label="Naziv*" class="login__input__container">
              <b-input v-model="new_racquet.name" :placeholder="$t('upiiNazivReketa')" type="text" rounded> </b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider name="Opis reketa">
            <b-field :label="$t('opis')" class="login__input__container">
              <b-input v-model="new_racquet.description" :placeholder="$t('upiiOpisReketa')" type="text" rounded>
              </b-input>
            </b-field>
          </ValidationProvider>

          <ValidationProvider name="spanung">
            <b-field :label="$t('kilaaPanunga')" class="login__input__container">
              <b-input v-model="new_racquet.data.tension" :placeholder="$t('unesiKilauPanunga')" type="number" rounded>
              </b-input>
            </b-field>
          </ValidationProvider>

          <ValidationProvider name="Žica">
            <b-field :label="$t('preferiranaVrstaIce')" class="login__input__container">
              <b-input v-model="new_racquet.data.string" :placeholder="$t('nazivIce')" type="text" rounded></b-input>
            </b-field>
          </ValidationProvider>
          <template v-if="true">
            <div v-if="new_racquet.image" class="align__centar__all flex__column m-t-20">
              <TennisImage :src="new_racquet.image" class="m-b-15 softshadow radius__5 mw40" alt="" />
              <b-button class="is-smaller" type="is-danger" rounded @click="new_racquet.image = null">
                {{ $t('ukloniSliku') }}
              </b-button>
            </div>
            <photoUpload
              v-else
              stencil="rectangle-stencil"
              :aspect-ratio="1.2"
              :fileinput="'fileinputa'"
              class="m-t-30 m-b-20"
              @update="new_racquet.image = $event"
            ></photoUpload>
          </template>
          <div class="buttons m-t-20 m-b-5">
            <b-button
              class="softshadow"
              type="is-small noborder"
              pack="fal"
              icon-left="chevron-left"
              rounded
              @click="activeTabStrings = 0"
            >
              {{ $t('nazad') }}
            </b-button>

            <b-button
              class="softshadow m-t-10 m-b-20 invert-small-button"
              type="is-small noborder is-primary has-text-white"
              pack="fal"
              rounded
              :loading="loading"
              @click="save()"
            >
              {{ $t('spremiNoviReket') }}
            </b-button>
          </div>
          <div class="divider-line-1 m-t-15"></div>
        </template>
      </b-tab-item>
    </b-tabs>
    <div class="">
      <b-modal :active.sync="isModalConfirmationActive" :width="640" class="modal__confirmation z200" scroll="clip">
        <modalConfirmation
          :title="$t('eliteObrisatiReket')"
          :subtitle="$t('Potvrdom će biti obrisan igračev reket')"
          @update="deleteIt"
        ></modalConfirmation>
      </b-modal>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import Equipment from '~/models/Equipment'
import photoUpload from '~/components/photoUpload'
import modalConfirmation from '~/components/modal/ModalConfirmation'

export default {
  name: 'Racquet',
  components: {
    photoUpload,
    TennisImage,
    modalConfirmation,
  },
  props: {
    player: {
      type: Object,
      required: true,
    },
    immidiate: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      isModalConfirmationActive: false,
      selected_racquet: null,
      equipment: [],
      loading: false,
      loadingDelete: false,
      isLoaded: null,
      activeTabStrings: 0,
      new_racquet: {
        name: '',
        player: {},
        description: '',
        image: '',
        data: { string: '', tension: '' },
      },
    }
  },
  computed: {
    isAdmin() {
      return this.user.is_admin
    },
    user() {
      return this.$store.state.auth.user
    },
  },
  watch: {},
  mounted() {
    this.getEquipment()
  },
  methods: {
    sendEmit(item, index) {
      this.selected_racquet = index
      this.$emit('racquet', item)
    },
    getEquipment() {
      Equipment.where('player', this.player.id)
        .get()
        .then((res) => {
          this.equipment = res.data
        })
    },
    deleteIt() {
      this.loadingDelete = true
      const e = new Equipment({ id: this.equipment[this.selected_racquet].id })
      e.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali reket'),
            type: 'is-success',
          })
          this.loadingDelete = false
          this.activeTabStrings = 0
          this.selectedCategory = null
          this.getEquipment()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadingDelete = false
        })
    },
    save() {
      if (this.new_racquet.name === '') {
        this.$buefy.toast.open({
          message: this.$t('Morate upisati naziv reketa'),
          type: 'is-primary',
        })
        return
      }
      this.loading = true
      const e = new Equipment(this.new_racquet)
      e.player = this.player
      e.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste dodali novi reket'),
            type: 'is-success',
          })
          this.loading = false
          this.activeTabStrings = 0
          this.new_racquet.name = ''
          this.new_racquet.description = ''
          this.new_racquet.image = ''
          this.new_racquet.data = {}
          this.new_racquet.user = {}
          this.getEquipment()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
        })
    },
  },
}
</script>
<style scoped>
.cropper {
  width: 100vw;
}
</style>
