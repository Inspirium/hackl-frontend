import Comment from '@/models/Comment'
import Model from './Model'

export default class Result extends Model {
  resource() {
    return 'result'
  }

  comments() {
    return this.hasMany(Comment)
  }
}
