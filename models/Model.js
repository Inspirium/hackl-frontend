import { Model as BaseModel } from 'vue-api-query'

export default class Model extends BaseModel {
  // define a base url for a REST API
  baseURL() {
    return 'v2'
  }

  hasFiles() {
    return []
  }

  // implement a default request method
  request(config) {
    return this.$http.request(config)
  }

  saveForm() {
    return this.hasId() ? this._updateForm() : this._createForm()
  }

  _createForm() {
    const data = new FormData()
    this._buildFormData(data, this)
    return this.request({
      method: 'POST',
      url: this.endpoint(),
      data,
    }).then((response) => {
      const self = Object.assign(this, response.data)
      return self
    })
  }

  _updateForm() {
    const data = new FormData()
    data.append('_method', 'PUT')
    this._buildFormData(data, this)
    return this.request({
      method: 'POST',
      url: this.endpoint(),
      data,
    }).then((response) => {
      const self = Object.assign(this, response.data)
      return self
    })
  }

  _buildFormData(formData, data, parentKey) {
    if (this.hasFiles().includes(parentKey) && !(data instanceof File || Array.isArray(data))) {
      formData.append(parentKey, '')
    } else if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
      Object.keys(data).forEach((key) => {
        this._buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key)
      })
    } else {
      const value = data == null ? '' : data
      formData.append(parentKey, value)
    }
  }
}
