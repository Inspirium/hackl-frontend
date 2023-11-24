<template>
  <div v-if="isAdmin">
    <hero
      :second="{
        name: $t('Tereni'),
        link: '/courts',
      }"
    >
      <h1 class="has-text-white">{{ $t('upravljanjeTerenima') }}</h1>
    </hero>
    <div class="x-container activity">
      <div class="buttons">
        <b-button
          class="m-t-15 m-b-20"
          type="is-primary"
          pack="fal"
          icon-right="plus-circle"
          rounded
          tag="nuxt-link"
          :to="localePath('/admin/courts/new')"
        >
          {{ $t('dodajNoviTeren') }}
        </b-button>
      </div>
      <draggable v-model="courts" handle=".drag__item" group="people" @end="reorder">
        <div
          v-for="(court, index) in courts"
          :key="court.id"
          :class="['court activity__box--padding', 'm-b-15', court.is_active ? '' : 'inactive--court']"
        >
          <div class="inactive--court__text fw800 has-text-centered is-uppercase">{{ $t('terenNijeAktivan') }}</div>
          <nuxt-link :to="localePath('/admin/courts/' + court.id + '/edit/')">
            <court-slot :court="court"></court-slot>
          </nuxt-link>
          <div class="buttons relative m-t-15 m-b-0 flex-start">
            <b-button
              class="softshadow m-t-10"
              type="is-small noborder has-text-white"
              pack="fal"
              rounded
              @click="$router.push(localePath('/admin/courts/' + court.id + '/edit/'))"
            >
              {{ $t('urediTeren') }}
            </b-button>
            <b-button
              class="softshadow m-t-10 m-r-auto"
              type="is-small noborder has-text-white"
              pack="fal"
              rounded
              @click="duplicate(court.id, index)"
            >
              {{ $t('dupliciraj') }}
            </b-button>

            <!--            <nuxt-link :to="localePath('/admin/courts/' + court.id + '/edit/')">-->
            <!--              <b-button class="m-t-15" type="is-small noborder" rounded> Uredi teren </b-button>-->
            <!--            </nuxt-link>-->
            <!--            <nuxt-link :to="localePath('/admin/courts/' + court.id + '/edit/')">-->
            <!--              <b-button class="m-t-15" type="is-small noborder" rounded> Dupliciraj </b-button>-->
            <!--            </nuxt-link>-->
            <b-icon
              class="m-r-10 m-l-5 absolute drag__item"
              style="right: 0"
              pack="far"
              type="is-black50"
              icon="line-height"
            >
            </b-icon>
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import draggable from 'vuedraggable'
import WorkingHours from '@/models/WorkingHours'
import Court from '~/models/Court'
import hero from '~/components/Hero'
import courtSlot from '~/components/court/CourtSlot'

export default {
  name: 'AdminCourts',
  components: {
    hero,
    courtSlot,
    draggable,
  },
  async fetch() {
    await this.getCourts()
  },
  data() {
    return {
      selected_date: this.$moment(),
      inactive: true,
      options: ['Igračima vanjskih terena', 'Igračima unutrarnjih terena', 'Svim igračima', 'Nemoj slati obavijesti'],
      courts: [],
      selected_court: 0,
    }
  },
  computed: {
    club() {
      return this.$store.state.club
    },
    user() {
      return this.$store.state.auth.user
    },
    isAdmin() {
      return this.user.is_admin
    },
  },
  methods: {
    duplicate(courtId, index) {
      Court.find(courtId).then((res) => {
        res.name = res.name + ' - kopija'
        res.id = null
        const court = new Court(res)
        court.save().then((res) => {
          this.$buefy.toast.open({
            message: this.$t('Uspješno ste spremili novi teren. Unesite radno vrijeme i cijene'),
            type: 'is-success',
          })
          for (let i = 1; i < this.courts[index].working_hours.length; i++) {
            delete this.courts[index].working_hours[i].id
            this.courts[index].working_hours[i].membership = { id: this.courts[index].working_hours[i].membership_id }
          }
          const hours = new WorkingHours({ working_hours: this.courts[index].working_hours }).for(new Court(res))
          hours
            .save()
            .then(() => {
              this.$buefy.toast.open({
                message: this.$t('Uspješno ste unijeli cijene'),
                type: 'is-success',
              })
              this.getCourts()
              window.scrollTo(0, 0)
            })
            .catch(() => {
              this.$buefy.toast.open({
                message: this.$t('Došlo je do greške, pokušajte ponovno'),
                type: 'is-danger',
              })
            })
        })
      })
    },
    getCourts() {
      Court.params({ date: this.selected_date.format('YYYY-MM-DD') })
        .get()
        .then((res) => {
          this.courts = res.data
        })
    },
    // TODO New v2 API
    reorder() {
      const order = _.map(this.courts, (court) => {
        return court.id
      })
      this.$axios.put('v2/club/court/order', { order }).then(() => {
        this.$buefy.toast
          .open({
            message: this.$t('Redoslijed je spremljen'),
            type: 'is-success',
          })
          .catch(() => {
            this.$buefy.toast.open({
              message: this.$t('Došlo je do greške, pokušajte ponovno'),
              type: 'is-danger',
            })
          })
      })
    },
  },
}
</script>
