import Vue from 'vue'

export default ({ store }) => {
  Vue.filter('currency', function (value) {
    const locale = store.state.club.country.locale ?? 'de-DE'
    const currency = store.state.club.country.currency ?? 'EUR'
    return Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)
  })
}
