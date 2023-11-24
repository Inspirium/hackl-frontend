<template>
  <div class="p-b-150">
    <PageHeader :title="$t('noviProizvod')" :background="'is-primary'" />
    <div class="activity p-l-15 p-r-15">
      <ValidationProvider v-slot="{ errors, valid }" name="name" rules="required">
        <b-field
          :label="$t('Naziv')"
          class="login__input__container"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
        >
          <b-input v-model="product.name" :placeholder="$t('nazivProizvoda')" type="text" rounded></b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider name="desc">
        <b-field :label="$t('opis')" class="login__input__container">
          <tinymce-editor v-model="product.description" class="" />
        </b-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors, valid }" name="price" rules="required">
        <b-field
          :label="$t('Cijena')"
          class="login__input__container"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors"
        >
          <b-input
            v-model="product.price"
            :placeholder="$t('unesiCijenuProizvoda')"
            type="number"
            rounded
            rules="required"
          ></b-input>
        </b-field>
      </ValidationProvider>
      <ValidationProvider name="tax">
        <b-field :label="$t('porez')" class="login__input__container">
          <b-input v-model="product.tax_percent" :placeholder="$t('unesiPorez')" type="number" rounded></b-input>
        </b-field>
      </ValidationProvider>
      <div v-if="product.image" class="align__centar__all flex__column m-t-20">
        <img :src="product.image" class="m-b-15 softshadow radius__5 mh35vh" alt="" />
        <b-button class="is-smaller" type="is-danger" rounded @click="product.image = null">
          {{ $t('ukloniSliku') }}
        </b-button>
      </div>

      <photoUpload
        v-show="!product.image"
        stencil="rectangle-stencil"
        :aspect-ratio="1.2"
        class="m-t-30"
        @isEditing="isEditing = $event"
        @update="saveMedia($event)"
      ></photoUpload>
      <div class="divider-line-1 m-t-30"></div>
      <div class="label">{{ $t('proizvodIliUsluga') }}</div>
      <ValidationProvider name="special" class="radio__box">
        <div class="block">
          <b-radio v-model="product.special" :native-value="null"> {{ $t('proizvod') }} </b-radio>
          <b-radio v-model="product.special" :native-value="'service'"> {{ $t('usluga') }} </b-radio>
          <b-radio v-model="product.special" :native-value="'stringing'"> {{ $t('panung') }} </b-radio>
        </div>
      </ValidationProvider>
      <template v-if="!product.special">
        <categories class="m-t-20" @category="product.category = $event" />
        <div class="label">{{ $t('vrstaProizvoda') }}</div>
        <ValidationProvider name="special" class="radio__box">
          <div class="block">
            <b-radio v-model="product.type" :native-value="'simple'"> {{ $t('samostalan') }}</b-radio>
            <b-radio v-model="product.type" :native-value="'variable'"> {{ $t('promjenjiv') }}</b-radio>
            <b-radio v-model="product.type" :native-value="'bundle'"> {{ $t('paket') }}</b-radio>
          </div>
        </ValidationProvider>
      </template>
      <div class="label">{{ $t('statusProizvoda') }}</div>
      <ValidationProvider name="status " class="radio__box">
        <div class="block">
          <b-radio v-model="product.status" :native-value="'active'"> {{ $t('aktivan') }}</b-radio>
          <b-radio v-model="product.status" :native-value="'draft'"> {{ $t('uIzradi') }}</b-radio>
        </div>
      </ValidationProvider>
    </div>
    <div v-if="!isEditing" class="buttons is-fixed m-t-15">
      <b-button
        class="m-l-5 m-t-20 fw600"
        type="is-danger"
        pack="fal"
        icon-left="times"
        rounded
        tag="nuxt-link"
        :to="localePath('/admin/')"
      >
        {{ $t('odustani') }}
      </b-button>
      <b-button
        class="m-l-5 m-t-20 fw600"
        type="is-primary"
        pack="fal"
        icon-right="check"
        rounded
        native-type="submit"
        :loading="loading"
        @click.prevent="submit"
      >
        {{ $t('spremi') }}
      </b-button>
    </div>
  </div>
</template>

<script>
import categories from '~/components/shop/categories'
import Media from '~/models/Media'
import ShopProduct from '~/models/ShopProduct'
import photoUpload from '~/components/photoUpload'
import PageHeader from '~/components/headers/blankBack'

export default {
  name: 'NewProduct',
  components: {
    PageHeader,
    photoUpload,
    categories,
  },
  // async fetch() {
  //   const id = this.$route.params.id
  //   this.player = await Player.include('trainer').$find(id)
  // },
  data() {
    return {
      heroImage: '/stringing.jpg',
      loading: false,
      isEditing: false,
      loadingMedia: false,
      categories: ['Reketi', 'Torbe', 'Loptice', 'Oprema', 'Žice', 'Odjeća', 'Obuća'],
      product: {
        name: '',
        description: '',
        price: null,
        tax_percent: 25,
        category: '',
        type: 'simple',
        special: null,
        status: 'active',
        image: null,
        image_id: null,
        club_id: null,
      },
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    club() {
      return this.$store.state.club
    },
  },
  methods: {
    saveMedia1(item) {
      this.product.image = item
    },
    saveMedia(item) {
      this.product.image = item
      this.loadingMedia = true
      const n = new Media({
        media: this.product.image,
        title: this.product.name ? this.product.name : 'Fotografija proizvoda',
        description: this.product.description ? this.product.description : 'Fotografija proizvoda',
      })
      n.save()
        .then((res) => {
          this.product.image_id = res.id
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
    submit() {
      this.loading = true
      const shopProduct = new ShopProduct(this.product)
      shopProduct.club_id = this.club.id
      shopProduct.image = shopProduct.image_id
      shopProduct
        .save()
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili proizvod'),
            type: 'is-success',
          })
          if (shopProduct.special === 'service') {
            this.$router.push(this.localePath('/services'))
          } else if (shopProduct.special === 'stringing') {
            this.$router.push(this.localePath('/services/stringing'))
          } else {
            this.$router.push(this.localePath('/shop'))
          }
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
