import Model from './Model'
import WorkingHours from './WorkingHours'

export default class Court extends Model {
  resource() {
    return 'court'
  }

  params(payload) {
    payload = {
      ...payload,
      parsed2: true,
    }
    return super.params(payload)
  }

  hours() {
    return this.hasMany(WorkingHours)
  }
}
