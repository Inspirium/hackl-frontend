// For Nuxt 2
import Vue from 'vue'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faPlus,
  faFileExcel,
  faChevronDown as fasChevronDown,
  faTrophy,
  faHandPointDown,
  faUserLock,
  faCog,
} from '@fortawesome/pro-solid-svg-icons'
import {
  faSearch,
  faTimes,
  faSpinner,
  faRandom,
  faChevronDown,
  faChevronRight,
  faRepeat,
  faUndoAlt,
  faReel,
  faRacquet,
  faCheck,
  faUserGraduate,
  faArrowRight,
  faLineHeight,
  faPhone,
  faArrowCircleRight,
  faArrowAltCircleLeft,
  faLongArrowRight,
  faPaperPlane,
  faUserPlus,
} from '@fortawesome/pro-regular-svg-icons'
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { fal } from '@fortawesome/pro-light-svg-icons'

// This is important, we are going to let Nuxt.js worry about the CSS
config.autoAddCss = false

// You can add your icons directly in this plugin. See other examples for how you
// can add other styles or just individual icons.
library.add(fal)

library.add(faFacebook, faInstagram, faTwitter)
library.add(
  faSearch,
  faTimes,
  faSpinner,
  faRandom,
  faChevronDown,
  faChevronRight,
  faRepeat,
  faUndoAlt,
  faReel,
  faRacquet,
  faCheck,
  faUserGraduate,
  faArrowRight,
  faLineHeight,
  faPhone,
  faArrowCircleRight,
  faArrowAltCircleLeft,
  faLongArrowRight,
  faPaperPlane,
  faUserPlus
)

library.add(faPlus, faFileExcel, fasChevronDown, faTrophy, faHandPointDown, faUserLock, faCog)

// Register the component globally
Vue.component('font-awesome-icon', FontAwesomeIcon)
