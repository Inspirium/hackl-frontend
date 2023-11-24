import Comment from '@/models/Comment'
import Model from './Model'

export default class Classified extends Model {
  resource() {
    return 'classified'
  }

  comments() {
    return this.hasMany(Comment)
  }
}
