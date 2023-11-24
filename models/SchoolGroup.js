import Player from '@/models/Player'
import Trainer from '@/models/Trainer'
import Model from './Model'

export default class SchoolGroup extends Model {
  resource() {
    return 'school_group'
  }

  players() {
    return this.hasMany(Player)
  }

  trainer() {
    return this.hasMany(Trainer)
  }
}
