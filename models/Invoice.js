import Model from './Model'
export default class Invoice extends Model {
  resource() {
    return 'invoice'
  }

  deleteMany() {
    let base = this._fromResource || ''.concat(this.baseURL(), '/').concat(this.resource())
    base = this._customResource ? ''.concat(this.baseURL(), '/').concat(this._customResource) : base
    base += '/delete-many'
    const url = ''.concat(base).concat(this._builder.query())
    return this.request(
      this._reqConfig({
        url,
        method: 'DELETE',
      })
    ).then(function (response) {
      return response
    })
  }

  sendInvoices() {
    const _this6 = this

    let base = this._fromResource || ''.concat(this.baseURL(), '/').concat(this.resource())
    base = this._customResource ? ''.concat(this.baseURL(), '/').concat(this._customResource) : base
    base += '/send'
    const url = ''.concat(base).concat(this._builder.query())
    return this.request(
      this._reqConfig({
        url,
        method: 'POST',
      })
    ).then(function (response) {
      const collection = _this6._applyInstanceCollection(response.data)

      if (response.data.data !== undefined) {
        response.data.data = collection
      } else {
        response.data = collection
      }

      return response.data
    })
  }
}
