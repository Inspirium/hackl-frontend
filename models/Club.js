import Model from './Model'
import Membership from './Membership'
import OtherExpense from './OtherExpense'
import Payment from './Payment'

export default class Club extends Model {
  resource() {
    return 'club'
  }

  memberships() {
    return this.hasMany(Membership)
  }

  otherExpenses() {
    return this.hasMany(OtherExpense)
  }

  payments() {
    return this.hasMany(Payment)
  }
}
