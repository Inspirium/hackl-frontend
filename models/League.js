import Model from './Model'
import Player from './Player'
import LeagueGroup from './LeagueGroup'
export default class League extends Model {
  resource() {
    return 'league'
  }

  players() {
    return this.hasMany(Player)
  }

  groups() {
    return this.hasMany(LeagueGroup)
  }
}
