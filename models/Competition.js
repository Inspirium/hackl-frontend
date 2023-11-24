import Model from './Model'
export default class Competition extends Model {
  resource() {
    return 'competition'
  }

  teams() {
    return this.request({
      url: `${this.baseURL()}/${this.resource()}/teams`,
      method: 'GET',
    })
  }
}
