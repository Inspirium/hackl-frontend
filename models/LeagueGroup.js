import Player from '@/models/Player'
import Game from '@/models/Game'
import Model from './Model'

export default class LeagueGroup extends Model {
  resource() {
    return 'league_group'
  }

  players() {
    return this.hasMany(Player)
  }

  games() {
    return this.hasMany(Game)
  }
}
