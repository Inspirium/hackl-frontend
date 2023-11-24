import UserMembership from '@/models/UserMembership'
import Model from './Model'

export default class Player extends Model {
  resource() {
    return 'player'
  }

  hasFiles() {
    return ['image']
  }

  link() {
    return `/player/${this.id}`
  }

  memberships() {
    return this.hasMany(UserMembership)
  }
}
