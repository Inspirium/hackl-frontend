import Model from './Model'

export default class News extends Model {
  resource() {
    return 'news'
  }

  hasFiles() {
    return ['image']
  }
}
