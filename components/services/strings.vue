<template>
  <div>
    <b-tabs v-model="activeTabStrings" position="is-centered" class="hide_tab_navigation_impt">
      <b-tab-item>
        <div v-if="strings.length" class="tablelist">
          <div class="fw600 is-size-55 m-t-20 m-b-5">{{ $t('popisDostupnihIca') }}</div>
          <transition name="fade">
            <div class="activity__box action__buttons">
              <div
                v-for="(item, index) in strings"
                :key="item.id"
                class="p-r-10 p-l-10 p-t-7 p-b-7 bb1-10 payment_accontation"
                :class="{ selected_payee: selected_string === index }"
                @click="isAdmin ? sendEmit(item, index) : (isModalConfirmationActive = false)"
              >
                <div class="fw600 align__centar__all">
                  <div v-if="item.main_image.link" class="list__img">
                    <TennisImage :size="[42, 42]" :src="item.main_image.link" class="user_image" alt="" />
                  </div>
                  <div v-else class="">
                    <b-icon
                      icon="reel"
                      pack="far"
                      size="is-medium m-r-15 m-l-5 top-5"
                      class="relative has-text-black30"
                    ></b-icon>
                  </div>
                  <div class="list__content">
                    <h4 class="fw600 is-size-5 has-text-black80 m-t--2">{{ item.name }}</h4>
                    <h3 class="fw600 m-t--2 has-text-black80 is-size-65">{{ item.description }}</h3>
                    <div class="has-text-lightblue fw600 is-size-65 m-l-auto nowrap">
                      {{ $t('key5', { currency: item.price }) | currency }}
                    </div>
                  </div>
                  <div
                    v-if="isAdmin"
                    class=""
                    @click="
                      isModalConfirmationActive = true
                      selected_string = index
                    "
                  >
                    <b-icon
                      icon="times-circle"
                      :type="selected_string === index ? 'is-white' : 'is-danger'"
                      pack="fal"
                      class="m-r-10"
                    >
                    </b-icon>
                  </div>
                </div>
              </div>
            </div>
          </transition>
          <div v-if="isAdmin" class="buttons m-t-20">
            <b-button
              class="softshadow"
              type="is-small noborder"
              pack="fas"
              icon-right="plus"
              rounded
              @click="activeTabStrings = 1"
            >
              {{ $t('unesiNovuIcu') }}
            </b-button>
          </div>
        </div>

        <div v-else class="flex flex__column align__centar__y m-t-30">
          <template v-if="isAdmin">
            <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal"></b-icon>
            <div class="fw600 is-size-5 has-text-centered has-text-danger m-b-10 m-t-5">
              {{ $t('Nema unsesnih žica') }}
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
                {{ $t('unesiNovuIcu') }}
              </b-button>
            </div>
          </template>
        </div>
      </b-tab-item>
      <b-tab-item>
        <template>
          <div class="fw600 is-size-5 has-text-centered has-text-lightblue m-t-20 m-b--10">
            {{ $t('unesiNovuIcu') }}
          </div>

          <ValidationProvider v-slot="{ errors, valid }" name="Naziv žice" rules="required">
            <b-field
              :label="$t('Naziv')"
              class="login__input__container"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-input v-model="newString.name" :placeholder="$t('upiiNazivIce')" type="text" rounded></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors, valid }" name="Opis žice">
            <b-field
              :label="$t('opis')"
              class="login__input__container"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-input v-model="newString.description" :placeholder="$t('upiiOpisIce')" type="text" rounded></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors, valid }" name="Cijena" rules="required">
            <b-field
              :label="$t('Cijena')"
              class="login__input__container"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-input v-model="newString.price" :placeholder="$t('upiiCijenuIce')" type="number" rounded></b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors, valid }" name="Porez" rules="required">
            <b-field
              :label="$t('porez')"
              class="login__input__container"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-input v-model="newString.tax_percent" :placeholder="$t('iznosPoreza')" type="number" rounded></b-input>
            </b-field>
          </ValidationProvider>
          <template v-if="true">
            <div v-if="newString.image" class="align__centar__all flex__column m-t-20">
              <TennisImage :src="newString.image" class="m-b-15 softshadow radius__5" alt="" />
              <b-button class="is-smaller" type="is-danger" rounded @click="newString.image = null">
                {{ $t('ukloniSliku') }}
              </b-button>
            </div>
            <photoUpload
              v-else
              stencil="rectangle-stencil"
              :aspect-ratio="1.2"
              :fileinput="'fileinputa'"
              class="m-t-30 m-b-20"
              @update="saveMedia($event)"
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
              icon-right="check"
              rounded
              @click="submit()"
            >
              {{ $t('spremiNoveIce') }}
            </b-button>
          </div>
        </template>
      </b-tab-item>
    </b-tabs>
    <div class="">
      <b-modal :active.sync="isModalConfirmationActive" :width="640" class="modal__confirmation z200" scroll="clip">
        <modalConfirmation
          :title="$t('eliteObrisatiIcu')"
          :subtitle="$t('Potvrdom će žica biti obrisana iz baze proizvoda')"
          @update="deleteProduct()"
        ></modalConfirmation>
      </b-modal>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import ShopProduct from '~/models/ShopProduct'
import photoUpload from '~/components/photoUpload'
import modalConfirmation from '~/components/modal/ModalConfirmation'
import Media from '~/models/Media'

export default {
  name: 'StringsEdit',
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
      offset: 1,
      strings: [],
      selected_string: null,
      isModalConfirmationActive: false,
      newString: {
        name: '',
        description: '',
        price: null,
        tax_percent: 25,
        category: { id: 3 },
        type: 'simple',
        special: '',
        status: 'active',
        image: null,
        image_id: null,
        club_id: null,
      },
    }
  },
  computed: {
    isAdmin() {
      return this.user.is_admin || this.isCashier
    },
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
    isCashier() {
      if (!this.user.club_member || !this.user.club_member[this.club.id.toString()]) return false
      return this.user.club_member[this.club.id.toString()].cashier === undefined
        ? false
        : this.user.club_member[this.club.id.toString()].cashier === true
    },
  },
  watch: {},
  mounted() {
    this.getProducts()
  },
  methods: {
    sendEmit(item, index) {
      this.selected_string = index
      this.$emit('string', item)
    },
    saveMedia(item) {
      this.newString.image = item
      this.loadingMedia = true
      const n = new Media({
        media: this.newString.image,
        title: this.newString.name ? this.newString.name : 'Fotografija proizvoda',
        description: this.newString.description ? this.newString.description : 'Fotografija proizvoda',
      })
      n.save()
        .then((res) => {
          this.newString.image_id = res.id
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
    getProducts() {
      this.loading = true
      const sp = ShopProduct.page(this.offset)
      sp.where('special', '')
        .where('club', this.$store.state.club.id)
        .where('category', 3)
        .get()
        .then((res) => {
          if (this.offset === 1) {
            this.strings = res.data
          } else {
            this.strings = [...this.strings, ...res.data]
          }
          this.total = res.meta.total
          this.loading = false
        })
    },
    deleteProduct() {
      this.loadingDelete = true
      const shopProduct = new ShopProduct({ id: this.strings[this.selected_string].id })
      shopProduct
        .delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali žicu'),
            type: 'is-success',
          })
          this.getProducts()
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
      const shopProduct = new ShopProduct(this.newString)
      shopProduct.club_id = this.club.id
      shopProduct.image = shopProduct.image_id
      shopProduct
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili proizvod'),
            type: 'is-success',
          })
          this.getProducts()
          this.activeTabStrings = 0
          this.loading = false
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
