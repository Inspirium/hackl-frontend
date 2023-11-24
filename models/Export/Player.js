import Model from '../Model'

export default class Player extends Model {
  resource() {
    return 'export/players'
  }

  file() {
    let base = this._fromResource || `${this.baseURL()}/${this.resource()}`
    base = this._customResource ? `${this.baseURL()}/${this._customResource}` : base

    const url = `${base}${this._builder.query()}`

    return this.request(
      this._reqConfig({
        url,
        method: 'GET',
        responseType: 'blob',
        headers: {
          accept: 'application/octet-stream',
        },
      })
    ).then((response) => {
      return response.data
    })
  }
}
