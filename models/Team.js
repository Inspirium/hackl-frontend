import Model from './Model'

export default class Team extends Model {
  resource() {
    return 'team'
  }

  hasFiles() {
    return ['image']
  }

  link() {
    return `/doubles/${this.id}`
  }
}
