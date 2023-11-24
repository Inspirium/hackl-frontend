<template>
  <div class="">
    <b-tabs v-model="activeTabStrings" position="is-centered" class="hide_tab_navigation_impt">
      <b-tab-item>
        <div v-if="categories.length" class="tablelist">
          <div class="fw600 is-size-55 m-b-5">{{ $t('kategorijaProizvoda') }}</div>
          <div class="activity__reservation">
            <transition name="fade">
              <div class="activity__box action__buttons">
                <div
                  v-for="(item, index) in categories"
                  :key="index"
                  :class="preselectCategory(item)"
                  class="action__item__small fw600"
                  @click.prevent="sendCategory(item)"
                >
                  <div class="">
                    {{ item.name }}
                  </div>
                  <div
                    class="m-l-auto"
                    @click.stop="
                      isModalDisputeActive = true
                      selectedCategory = index
                    "
                  >
                    <b-icon
                      icon="times-circle"
                      :type="preselectCategory(item) === 'active' ? 'is-white' : 'is-danger'"
                      pack="fal"
                      class=""
                    >
                    </b-icon>
                  </div>
                </div>
              </div>
            </transition>
          </div>
          <div class="buttons m-t-20">
            <b-button
              class="softshadow"
              type="is-small noborder"
              pack="fas"
              icon-right="plus"
              rounded
              @click="activeTabStrings = 1"
            >
              {{ $t('unesiNovuKategoriju') }}
            </b-button>
          </div>
        </div>

        <div v-else class="flex flex__column align__centar__y m-t-30">
          <template v-if="true">
            <b-icon icon="exclamation-square" type="is-danger" size="is-large" pack="fal"></b-icon>
            <div class="fw600 is-size-4 has-text-centered has-text-danger m-b-10 m-t-10">
              {{ $t('nemateUneseneKategorije') }}
            </div>
            <div class="fw600 is-size-6 has-text-centered p-l-10 p-r-10">
              {{ $t('unesiteNovuKategorijuKlikomNaGumb') }}
            </div>
            <div class="buttons m-t-20">
              <b-button
                class="softshadow"
                type="is-small noborder"
                pack="fas"
                icon-right="plus"
                rounded
                @click="activeTabStrings = 1"
              >
                {{ $t('unesiPrvuKategoriju') }}
              </b-button>
            </div>
          </template>
        </div>
      </b-tab-item>
      <b-tab-item>
        <template>
          <div class="divider-line-1 m-t-15"></div>
          <div class="fw600 is-size-5 has-text-centered has-text-lightblue m-t-20 m-b--10">
            {{ $t('unesiNovuKategoriju') }}
          </div>

          <ValidationProvider name="Naziv kategorije" rules="required">
            <b-field label="Naziv*" class="login__input__container">
              <b-input v-model="newCategory.name" :placeholder="$t('upiiNazivKategorije')" type="text" rounded>
              </b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider name="Opis kategorije">
            <b-field :label="$t('opis')" class="login__input__container">
              <b-input v-model="newCategory.description" :placeholder="$t('upiiOpisKategorije')" type="text" rounded>
              </b-input>
            </b-field>
          </ValidationProvider>
          <template v-if="true">
            <div v-if="newCategory.image" class="align__centar__all flex__column m-t-20">
              <TennisImage :src="newCategory.image" class="m-b-15 softshadow radius__5" alt="" />
              <b-button class="is-smaller" type="is-danger" rounded @click="newCategory.image = null">
                {{ $t('ukloniSliku') }}
              </b-button>
            </div>
            <photoUpload
              v-else
              stencil="rectangle-stencil"
              :aspect-ratio="1.2"
              :fileinput="'fileinputa'"
              class="m-t-30 m-b-20"
              @update="newCategory.image = $event"
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
              @click="save()"
            >
              {{ $t('spremiNovuKategoriju') }}
            </b-button>
          </div>
          <div class="divider-line-1 m-t-15"></div>
        </template>
      </b-tab-item>
    </b-tabs>
    <div class="">
      <b-modal :active.sync="isModalDisputeActive" :width="640" class="modal__confirmation z200" scroll="clip">
        <modalConfirmation
          :title="$t('eliteObrisatiKategoriju')"
          :subtitle="$t('Potvrdom će svi proizvodi koji imaju ovu kategoriju biti neraspoređeni')"
          @update="deleteIt"
        ></modalConfirmation>
      </b-modal>
    </div>
  </div>
</template>

<script>
import TennisImage from '@/components/TennisImage.vue'
import ShopCategories from '~/models/ShopCategory'
import photoUpload from '~/components/photoUpload'
import modalConfirmation from '~/components/modal/ModalConfirmation'

export default {
  name: 'Categories',
  components: {
    photoUpload,
    TennisImage,
    modalConfirmation,
  },
  props: {
    iscategory: {
      type: Number,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      isModalDisputeActive: false,
      selectedCategory: null,
      categories: [],
      product: {
        name: '',
        description: '',
        price: null,
        tax_percent: 25,
        category: '',
        type: 'simple',
        special: '',
        status: 'active',
        image: null,
        image_id: null,
        club_id: null,
      },
      loading: false,
      loadingDelete: false,
      isLoaded: null,
      activeTabStrings: 0,
      newCategory: {
        name: '',
        description: '',
        image: '',
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
    this.getCategories()
  },
  methods: {
    preselectCategory(item) {
      if (this.iscategory && this.product.category === '') {
        let activeClass = ''
        if (item.id === this.iscategory) {
          activeClass = 'active'
        }
        return activeClass
      } else {
        return item === this.product.category ? 'active' : ''
      }
    },
    sendCategory(item) {
      this.product.category = item
      this.$emit('category', item)
    },
    getCategories() {
      ShopCategories.get().then((res) => {
        this.categories = res
      })
    },
    deleteIt() {
      this.loadingDelete = true
      const sc = new ShopCategories({ id: this.categories[this.selectedCategory].id })
      sc.delete()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste obrisali kategoriju'),
            type: 'is-success',
          })
          this.loadingDelete = false
          this.activeTabStrings = 0
          this.selectedCategory = null
          this.getCategories()
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
      if (this.newCategory.name === '') {
        this.$buefy.toast.open({
          message: this.$t('Morate upisati naslov kategorije'),
          type: 'is-primary',
        })
        return
      }
      this.loading = true
      const sc = new ShopCategories(this.newCategory)
      sc.save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili novu kategoriju'),
            type: 'is-success',
          })
          this.loading = false
          this.activeTabStrings = 0
          this.newCategory.name = ''
          this.newCategory.description = ''
          this.newCategory.image = ''
          this.getCategories()
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
