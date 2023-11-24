import Model from '../Model'

export default class Invoice extends Model {
  resource() {
    return 'export/traffic'
  }

  file() {
    let base = this._fromResource || `${this.baseURL()}/${this.resource()}/xlsx`
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
