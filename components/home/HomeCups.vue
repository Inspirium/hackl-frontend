<template>
  <div v-if="cups.length" class="home__cups">
    <div class="activity x-container">
      <div class="activity__results">
        <div class="activity__header m-b-10">
          <nuxt-link :to="localePath('/cup')" class="fw600">{{ $t('turniri') }}</nuxt-link>
        </div>
        <div class="activity__box m-t-10">
          <div class="tablelist">
            <b-table :data="cups" :mobile-cards="hasMobileCards" :bordered="isBordered">
              <b-table-column v-slot="props" cell-class="active list__image-col" field="first_name">
                <nuxt-link :to="localePath('/member')">
                  <div class="list__content">
                    <h3 class="m-t-5 m-b-10">{{ props.row.name }}</h3>
                    <h4>
                      {{ $t('administrator2') }} <span>{{ props.row.admin }}</span>
                    </h4>
                    <h4>
                      {{ $t('brojIgraa') }} <span> {{ props.row.size }}</span>
                    </h4>
                    <h4>
                      {{ $t('rokZaPrijave2') }}
                      <span> {{ props.row.aplication_deadline }}</span>
                    </h4>
                    <h4>
                      {{ $t('vrijemeTrajanja') }}
                      <span> {{ props.row.cup_deadline }}</span>
                    </h4>
                  </div>
                  <b-tag type="is-info">{{ props.row.status }}</b-tag>
                </nuxt-link>
              </b-table-column>
              <template slot="empty">
                <section class="section">
                  <div class="content has-text-grey has-text-centered">
                    <b-icon icon="exclamation-square" size="is-large" pack="fal"> </b-icon>
                    <p class="modal-title">{{ $t('naalostNemaAktivnihTurnira') }}</p>
                  </div>
                </section>
              </template>
            </b-table>
            <nuxt-link :to="localePath('/members')" class="title-num">
              <div class="readmore readmore__activity">
                <div class="title-num">
                  {{ $t('pregledajCijeluRangLjestvicu') }}
                  <b-icon class="m-l-10" icon="arrow-right" size="is-small" pack="fal"></b-icon>
                </div>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'

export default {
  name: 'HomeCups',
  components: {},
  data() {
    return {
      activeTab: 0,
      isCardModalActive: false,
      hasMobileCards: false,
      isBordered: false,
      auth: {
        id: 7,
        name: 'Ivan Ivanković Auth',
        user_image: require('../../assets/img/user.jpg'),
        elo: 1603,
        age: 23,
        rank: 4,
      },
      cups: [
        {
          id: 1,
          name: 'Godišnji kup Zaprešić 2020.',
          admin: 'Marko Novak',
          link: '/cop/1',
          size: 8,
          applicants: [],
          status: 'prijave',
          aplication_deadline: '2020-07-27',
          cup_deadline: '2020-08-27',
        },
        {
          id: 2,
          name: 'Kup za igrače od 50-60 godina',
          admin: 'Marko Novak',
          link: '/cop/1',
          size: 8,
          applicants: [],
          status: 'prijave',
          aplication_deadline: '2020-07-27',
          cup_deadline: '2020-08-27',
        },
      ],
      total_reservation: 1221,
      total_user_reservation: 1221,
    }
  },
}
</script>
