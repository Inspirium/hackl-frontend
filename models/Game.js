import Player from '@/models/Player'
import Model from './Model'
export default class Game extends Model {
  resource() {
    return 'game'
  }

  players() {
    return this.hasMany(Player)
  }
}
