import Player from '@/models/Player'
import TournamentRound from '@/models/TournamentRound'
import Model from './Model'

export default class Tournament extends Model {
  resource() {
    return 'tournament'
  }

  players() {
    return this.hasMany(Player)
  }

  rounds() {
    return this.hasMany(TournamentRound)
  }
}
