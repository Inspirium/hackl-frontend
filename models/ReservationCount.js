import Model from './Model'

export default class ReservationCount extends Model {
  resource() {
    return 'reservation/stats'
  }
}
