import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAaCAGajZa5XI9XgOwsEM9sw2sxM0Oawkc', // Replace with your Google Maps API key
    libraries: 'places', // This is required if you use the Autocomplete plugin
  },
})
