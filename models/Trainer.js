import Model from './Model'

export default class Trainer extends Model {
  resource() {
    return 'trainer'
  }

  link() {
    return `/trainer/${this.id}`
  }
}
