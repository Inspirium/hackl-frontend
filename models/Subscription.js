import Model from './Model'
import User from './Player'
export default class Subscription extends Model {
  resource() {
    return 'subscription'
  }

  users() {
    return this.hasMany(User)
  }
}
