import Game from '@/models/Game'
import Model from './Model'

export default class TournamentRound extends Model {
  resource() {
    return 'tournament_round'
  }

  games() {
    return this.hasMany(Game)
  }
}
