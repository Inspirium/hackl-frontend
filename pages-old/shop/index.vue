<template>
  <div class="home p-b-150">
    <PageHeader :title="$t('Proizvodi')" :back="true" :background="'is-primary'" />
    <div v-if="user.is_admin" class="m-l-15 m-r-15 m-t-30">
      <div class="buttons m-t-10">
        <b-button
          class="softshadow"
          type="is-small noborder"
          pack="fas"
          icon-right="plus"
          rounded
          :to="localePath('/shop/new')"
          tag="nuxt-link"
        >
          {{ $t('noviProizvod') }}
        </b-button>
      </div>
    </div>
    <categories class="m-t-15" @update="selectedCategory = $event" />
    <div class="m-t-20 relative">
      <div v-if="products.length" class="grid-list">
        <div v-for="(item, index) in products" :key="index" class="grid-list-item relative">
          <div v-if="item.status === 'draft'" class="shop-not-active">{{ $t('Nije aktivno') }}</div>
          <div class="has-text-black50 flex flex__column">
            <nuxt-link :to="localePath('/shop/' + item.id)" class="">
              <div class="shop-listing-img-box m-b-7">
                <TennisImage
                  v-if="item.main_image"
                  :size="[500, 500]"
                  :src="item.main_image.link"
                  class="shop-listing-img softshadow"
                />
                <div v-else class="shop-img-placeholder radius__16"></div>
              </div>

              <div class="shop-meta-content">
                <div class="fw600 is-size-5 has-text-black80 line-height-14 m-t-10">{{ item.name }}</div>
                <!-- eslint-disable vue/no-v-html -->
                <div
                  v-if="item.description"
                  class="fw600 is-size-65 has-text-black50 m-t-4 content-tiny"
                  v-html="item.description.substring(0, 120)"
                ></div>
                <!-- eslint-enable vue/no-v-html -->
                <div class="fw600 is-size-6 has-text-primary m-t-10">
                  {{ $t('key5', { currency: item.price }) | currency }}
                </div>
              </div>
            </nuxt-link>
            <template v-if="user.is_admin">
              <div class="buttons justify-start m-t-10 m-b-0">
                <b-button
                  v-if="item.status === 'active'"
                  class="softshadow m-t-10 invert-small-button"
                  type="is-small noborder is-primary has-text-white"
                  pack="fal"
                  rounded
                  @click="
                    $router.push({ path: localePath('/admin/orders/new'), query: { productId: products[index].id } })
                  "
                >
                  {{ $t('izradiNarudbu') }}
                </b-button>
                <b-button
                  v-if="item.status === 'draft'"
                  class="softshadow m-t-10 invert-small-button"
                  type="is-small noborder is-danger has-text-white"
                  pack="fal"
                  icon-right="user-edit"
                  rounded
                  @click="$router.push(localePath('/shop/' + item.id + '/edit'))"
                >
                  {{ $t('Uredi proizvod') }}
                </b-button>
              </div>
            </template>
          </div>
        </div>
      </div>
      <transition v-if="!products.length && loading" name="fade">
        <div class="align__centar__x m-t-20 loading_z_spinner">
          <b-icon
            class="comment-send"
            custom-class="rotating"
            icon="spinner"
            size="is-large"
            type="is-primary"
            pack="far"
          />
        </div>
      </transition>
    </div>
    <section v-if="!products.length && !loading" class="p-l-15 p-r-15 m-t-30">
      <div class="content has-text-grey has-text-centered">
        <b-icon icon="exclamation-square" type="is-danger" size="is-medium" pack="fal" />
        <p class="has-text-centerd fw600">
          {{ $t('Nema podataka za navedene kriterije') }}
        </p>
      </div>
    </section>
  </div>
</template>

<script>
// import _ from 'lodash'
import TennisImage from '@/components/TennisImage.vue'
import PageHeader from '~/components/headers/blankBack'
import categories from '~/components/shop/filterCategories'
import ShopProduct from '~/models/ShopProduct'

export default {
  name: 'Shop',
  components: {
    PageHeader,
    TennisImage,
    categories,
  },
  data() {
    return {
      selectedCategory: 0,
      products: [],
      total: 0,
      last_page: 1,
      offset: 1,
      bottom: false,
      loading: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
    club() {
      return this.$store.state.club
    },
  },
  watch: {
    bottom(bottom) {
      if (bottom) {
        this.offset++
        this.bottom = false
        this.getProducts()
      }
    },
    selectedCategory: {
      handler() {
        this.products = []
        this.offset = 1
        this.getProducts()
      },
    },
  },
  mounted() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible()
    })
    this.getProducts()
  },
  methods: {
    getProducts() {
      if (this.last_page < this.offset) return
      this.loading = true
      const sp = ShopProduct.page(this.offset).where('club', this.$store.state.club.id)
      if (this.selectedCategory !== 0) {
        sp.where('category', this.selectedCategory)
      }
      if (!this.isAdmin) {
        sp.where('status', 'active')
      }
      sp.get().then((res) => {
        if (this.offset === 1) {
          this.products = res.data
        } else {
          this.products = [...this.products, ...res.data]
        }
        this.total = res.meta.total
        this.last_page = res.meta.last_page
        this.loading = false
      })
    },
    bottomVisible() {
      return window.innerHeight + window.pageYOffset + 200 >= document.body.offsetHeight
    },
  },
}
</script>
