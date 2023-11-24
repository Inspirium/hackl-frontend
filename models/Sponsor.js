import Model from './Model'

export default class Sponsor extends Model {
  resource() {
    return 'sponsor'
  }

  hasFiles() {
    return ['image']
  }
}
