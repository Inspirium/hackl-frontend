import WalletTransaction from '@/models/WalletTransaction'
import Model from './Model'

export default class Wallet extends Model {
  resource() {
    return 'wallet'
  }

  transactions() {
    return this.hasMany(WalletTransaction)
  }
}
