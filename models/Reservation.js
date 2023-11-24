import ReservationPayment from '@/models/ReservationPayment'
import Model from './Model'
import Player from './Player'

export default class Reservation extends Model {
  resource() {
    return 'reservation'
  }

  players() {
    return this.hasMany(Player)
  }

  payments() {
    return this.hasMany(ReservationPayment)
  }
}
