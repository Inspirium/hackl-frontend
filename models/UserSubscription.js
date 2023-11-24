import Model from './Model'

export default class UserMembership extends Model {
  resource() {
    return 'user_subscription'
  }
}
