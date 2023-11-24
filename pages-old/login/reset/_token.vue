<template>
  <div class="page__login">
    <div class="page__login--bckg"></div>
    <img class="logo__login__tenisplus" src="/logo__login.svg" alt="" />
    <!--<div>
      <img :src="heroLogo" class="logo__login__main" alt="" />
    </div>-->
    <div class="x-container">
      <ValidationObserver v-slot="{ invalid }">
        <form @submit.prevent="submit">
          <b-icon class="m-t-20" icon="unlock-alt" size="is-large" type="is-white" pack="fal"> </b-icon>
          <div class="title has-text-white">{{ $t('novaLozinka2') }}</div>
          <ValidationProvider v-slot="{ errors, valid }" name="Email" rules="required|email">
            <b-field
              class="login__input__container m-b-30"
              :type="{ 'is-danger': errors[0], 'is-success': valid }"
              :message="errors"
            >
              <b-input v-model="email" placeholder="E-mail" type="email" pack="fal" icon="envelope" rounded> </b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors, valid }" name="Lozinka" rules="confirmed:confirmation|min:8">
            <b-field
              :label="$t('novaLozinka')"
              class="login__input__container"
              :type="valid ? 'is-success' : 'is-danger'"
              :message="errors"
            >
              <b-input
                ref="password"
                v-model="password"
                type="text"
                :placeholder="$t('novaLozinka')"
                pack="fal"
                icon="lock-alt"
                password-reveal
                rounded
              >
              </b-input>
            </b-field>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors, valid }" name="Potvrda lozinke" vid="confirmation">
            <b-field
              :label="$t('potvrdaNoveLozinke')"
              class="login__input__container"
              :type="valid ? 'is-success' : 'is-danger'"
              :message="errors"
            >
              <b-input
                v-model="password_confirmation"
                type="text"
                :placeholder="$t('potvrdaNoveLozinke')"
                pack="fal"
                icon="lock-alt"
                password-reveal
                rounded
              >
              </b-input>
            </b-field>
          </ValidationProvider>
          <div class="buttons">
            <b-button
              :class="['m-l-5', 'm-t-20', 'fw600', invalid ? 'inactive' : '']"
              type="submit is-primary"
              pack="fal"
              rounded
              native-type="submit"
              :loading="loading"
              @click.prevent="submit"
            >
              {{ $t('poalji') }}
            </b-button>
          </div>
        </form>
      </ValidationObserver>
      <h2 class="fw600 has-text-white m-t-20">
        {{ $t('provjeriteNeeljenuPotuSpamUSluajuDaVamNijeStigaoEm') }}
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Token',
  layout: 'noTop',
  data() {
    return {
      email: '',
      password: '',
      password_confirmation: '',
      loading: false,
    }
  },
  methods: {
    submit() {
      this.$axios
        .post('/v2/login/new_reset', {
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation,
          token: this.$route.params.token,
        })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste zatražili novu lozinku'),
            type: 'is-success',
          })
          this.$router.push(this.localePath('/login'))
        })
    },
  },
}
</script>
