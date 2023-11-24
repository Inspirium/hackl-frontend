import Model from './Model'
export default class Court extends Model {
  resource() {
    return 'court/free'
  }

  params(payload) {
    payload = {
      ...payload,
      parsed2: true,
    }
    return super.params(payload)
  }
}
