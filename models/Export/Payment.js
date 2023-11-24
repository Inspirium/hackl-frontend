import Model from '../Model'

export default class Payment extends Model {
  resource() {
    return 'export/payments'
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
