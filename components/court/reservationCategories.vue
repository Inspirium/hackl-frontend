<template>
  <div>
    <b-tabs v-model="activeTabStrings" position="is-centered" class="hide_tab_navigation_impt p-b-150">
      <b-tab-item>
        <div class="relative">
          <div v-if="category.length" class="tablelist">
            <div class="fw600 is-size-55 m-t-20 m-b-5 has-text-white">{{ $t('popisRezervacijskihKategorija') }}</div>
            <transition name="fade">
              <div class="activity__box action__buttons">
                <div
                  v-for="(item, index) in category"
                  :key="item.id"
                  class="p-r-10 p-l-10 p-t-7 p-b-7 bb1-10 payment_accontation"
                  :class="{ selected_payee: selected_category === index }"
                  @click="sendEmit(item, index)"
                >
                  <div class="fw600 align__centar__all">
                    <div v-if="item.image" class="list__img">
                      <TennisImage :size="[42, 42]" :src="item.image.link" class="user_image" alt="" />
                    </div>
                    <div class="list__content">
                      <h4 class="fw600 is-size-5 has-text-black80 m-t--2">{{ item.name }}</h4>
                      <h3 class="fw600 m-t--2 has-text-black80 is-size-65">{{ item.description }}</h3>
                      <div class="has-text-black80 fw600 is-size-65 m-l-auto nowrap">
                        {{ $t('boja') }} <span :style="`backgroundColor: ${item.color}`" class="color-indicator"></span>
                      </div>
                      <div class="fw600 has-text-black80 is-size-65 m-l-auto nowrap">
                        {{ $t('oznaka') }}
                        <span :class="item.is_paid ? 'has-text-success' : 'has-text-danger'">{{
                          item.is_paid ? 'Plaćeno' : 'Nije plaćeno'
                        }}</span>
                      </div>
                    </div>
                    <div class="" @click="action(index)">
                      <b-icon
                        :icon="selected_category === index ? 'user-edit' : 'times-circle'"
                        :type="selected_category === index ? 'is-white' : 'is-danger'"
                        :size="selected_category === index ? 'is-medium' : ''"
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
                @click="
                  activeTabStrings = 1
                  isEditing = false
                  Object.assign(newCategory, newCategoryPlaceholder)
                "
              >
                {{ $t('unesiKategoriju') }}
              </b-button>
            </div>
          </div>
          <div v-if="!category.length && !loading" class="flex flex__column align__centar__y m-t-30">
            <template v-if="true">
              <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
              <div class="fw600 is-size-5 has-text-centered has-text-white m-b-10 m-t-5">
                {{ $t('nemateUnesenihKategorija') }}
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
                  {{ $t('unesiKategoriju') }}
                </b-button>
              </div>
            </template>
          </div>
          <transition v-if="!category.length && loading" name="fade">
            <div class="align__centar__x m-t-30 loading_z_spinner">
              <b-icon
                class="comment-send"
                custom-class="rotating"
                icon="spinner"
                size="is-large"
                type="is-primary"
                pack="far"
              ></b-icon>
            </div>
          </transition>
        </div>
      </b-tab-item>
      <b-tab-item>
        <div class="reservation-categories-box">
          <div class="fw600 is-size-5 has-text-centered has-text-lightblue m-t-20 m-b--10">
            {{ isEditing ? $t('Uredi kategoriju') : $t('Unesi novu kategoriju') }}
          </div>

          <ValidationProvider v-slot="{ errors, valid }" name="Naziv kategorije" rules="required">
            <b-field
              :label="$t('nazivKategorije')"
              class="login__input__container"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-input
                v-model="newCategory.name"
                :placeholder="$t('upiiNazivKategorije')"
                type="text"
                rounded
              ></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider name="Opis kategorije">
            <b-field :label="$t('opisKategorije')" class="login__input__container has-text-white">
              <b-input
                v-model="newCategory.description"
                :placeholder="$t('upiiOpisKategorije')"
                type="text"
                rounded
              ></b-input>
            </b-field>
          </ValidationProvider>
          <div class="">
            <div class="label">{{ $t('terminiPlaeni') }}</div>
            <ValidationProvider name="Freeze" rules="required" class="radio__box">
              <div class="block">
                <b-radio v-model="newCategory.is_paid" :native-value="1"> {{ $t('da') }} </b-radio>
                <b-radio v-model="newCategory.is_paid" :native-value="0"> {{ $t('ne') }} </b-radio>
              </div>
            </ValidationProvider>
          </div>

          <b-field :label="$t('odaberiBoju')" class="has-text-white">
            <b-colorpicker v-model="newCategory.color" value="hex" />
          </b-field>
          <template v-if="!isEditing">
            <div v-if="newCategory.image" class="align__centar__all flex__column m-t-20">
              <TennisImage
                v-if="newCategory.image"
                :src="newCategory.image"
                width="180px"
                class="m-b-15 softshadow radius__full"
                alt=""
              />
              <b-button class="is-smaller" type="is-danger" rounded @click="newCategory.image = null">
                {{ $t('ukloniSliku') }}
              </b-button>
            </div>
            <photoUpload
              v-else
              :aspect-ratio="1.2"
              :fileinput="'fileinputa'"
              class="m-t-30 m-b-20 p-l-50 p-r-50"
              @update="saveMedia($event)"
            ></photoUpload>
          </template>
          <div class="buttons m-t-30 m-b-5">
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
              v-if="isEditing"
              class="softshadow m-t-10 m-b-20 invert-small-button"
              type="is-small noborder is-danger has-text-white"
              pack="fal"
              icon-right="times"
              rounded
              @click="isModalConfirmationActive = true"
            >
              {{ $t('obrii') }}
            </b-button>
            <b-button
              class="softshadow m-t-10 m-b-20 invert-small-button"
              type="is-small noborder is-primary has-text-white"
              pack="fal"
              icon-right="check"
              rounded
              @click="submit()"
            >
              {{ $t('spremiKategoriju') }}
            </b-button>
          </div>
        </div>
      </b-tab-item>
    </b-tabs>
    <div class="">
      <b-modal :active.sync="isModalConfirmationActive" :width="640" class="modal__confirmation z200" scroll="clip">
        <modalConfirmation
          :title="$t('eliteObrisatiKategoriju')"
          :subtitle="$t('Potvrdom će kategorija biti obrisana')"
          @update="deleteProduct()"
        ></modalConfirmation>
      </b-modal>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import ReservationCategory from '~/models/ReservationCategory'
import photoUpload from '~/components/photoUpload'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import Media from '~/models/Media'

export default {
  name: 'ReservationCategories',
  components: {
    photoUpload,
    TennisImage,
    modalConfirmation,
  },
  props: {
    loadingIt: {
      type: Boolean,
      required: false,
      default: false,
    },
    immidiate: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      loadingDelete: false,
      isLoaded: null,
      loadingMedia: false,
      activeTabStrings: 0,
      total: 0,
      category: [],
      selected_category: null,
      isModalConfirmationActive: false,
      newCategory: {
        name: '',
        description: '',
        color: '#DCE0B5',
        is_paid: 0,
        image: null,
        image_id: null,
      },
      newCategoryPlaceholder: {
        name: '',
        description: '',
        color: '#DCE0B5',
        is_paid: 0,
        image: null,
        image_id: null,
      },
      isEditing: false,
    }
  },
  computed: {
    isAdmin() {
      return this.user.is_admin
    },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    color() {
      return this.newCategory.color.toString('hex')
    },
  },
  watch: {},
  mounted() {
    this.getReservation()
  },
  methods: {
    action(index) {
      // if selected then edit category
      if (index !== this.selected_category) {
        this.isModalConfirmationActive = true
        this.selected_category = index
      } else {
        this.selected_category = index
        this.isEditing = true
        this.newCategory = this.category[this.selected_category]
        this.activeTabStrings = 1
      }
    },
    sendEmit(item, index) {
      this.selected_category = index
      this.$emit('update', item)
    },
    saveMedia(item) {
      this.newCategory.image = item
      this.loadingMedia = true
      const n = new Media({
        media: this.newCategory.image,
        title: this.newCategory.name ? this.newCategory.name : 'Fotografija proizvoda',
        description: this.newCategory.description ? this.newCategory.description : 'Fotografija proizvoda',
      })
      n.save()
        .then((res) => {
          this.newCategory.image_id = res.id
          this.loadingMedia = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške, pokušajte ponovno'),
            type: 'is-danger',
          })
          this.loadingMedia = false
        })
    },
    getReservation() {
      this.loading = true
      ReservationCategory.get().then((res) => {
        this.category = res.data
        this.loading = false
      })
    },
    deleteProduct() {
      this.loadingDelete = true
      const reservationCategory = new ReservationCategory({ id: this.category[this.selected_category].id })
      reservationCategory
        .delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali kategoriju'),
            type: 'is-success',
          })
          this.getReservation()
          this.loadingDelete = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: this.$t('Došlo je do greške. Pokušajte ponovno.'),
            type: 'is-danger',
          })
          this.loadingDelete = false
        })
    },
    submit() {
      this.loading = true
      const reservationCategory = new ReservationCategory(this.newCategory)
      reservationCategory.club_id = this.club.id
      reservationCategory.image = reservationCategory.image_id
      reservationCategory.color = this.color
      reservationCategory
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili kategoriju'),
            type: 'is-success',
          })
          this.getReservation()
          this.activeTabStrings = 0
          this.loading = false
          Object.assign(this.newCategory, this.newCategoryPlaceholder)
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
<style scoped>
.cropper {
  width: 100vw;
}
</style>
