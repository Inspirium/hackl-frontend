import Model from './Model'
import Message from './Message'

export default class Thread extends Model {
  resource() {
    return 'thread'
  }

  messages() {
    return this.hasMany(Message)
  }
}
