// inject global axios instance as http client to Model

import { Model } from 'vue-api-query'

export default function (ctx, injext) {
  Model.$http = ctx.$axios
}
