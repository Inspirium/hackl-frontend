import { BasePlugin } from '@uppy/core'

const mapLimit = require('promise-map-limit')
const API_ROOT = 'https://api.vimeo.com'

export default class Vimeo extends BasePlugin {
  constructor(uppy, opts) {
    super(uppy, opts)

    this.name = 'Vimeo'
    this.id = 'Vimeo'
    this.type = 'uploader'

    this.authorization = null

    this.opts = Object.assign(
      {
        limit: 100,
      },
      this.opts
    )

    this.prepareUpload = this.prepareUpload.bind(this)
    this.afterUpload = this.afterUpload.bind(this)
  }

  async prepareUpload(fileIDs) {
    const { accessToken } = this.opts

    fileIDs.forEach((fileID) => {
      this.uppy.emit('preprocess-progress', fileID, {
        mode: 'indeterminate',
        message: 'Creating videos...',
      })
    })

    await mapLimit(fileIDs, this.opts.limit, async (fileID) => {
      const file = this.uppy.getFile(fileID)

      const response = await fetch(`${API_ROOT}/me/videos`, {
        method: 'post',
        headers: {
          authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
          accept: 'application/vnd.vimeo.*+json;version=3.4',
        },
        body: JSON.stringify({
          upload: {
            approach: 'tus',
            size: file.size,
          },

          name: file.meta.name.replace(/\.\w+$/, ''),
          description: file.meta.description,
          privacy: {
            view: 'anybody',
          },
        }),
      })

      const { upload, link, uri } = await response.json()
      this.uppy.setFileState(fileID, {
        uploadURL: link,
        vimeo: {
          link,
          id: uri.split('/').pop(),
        },
        tus: Object.assign({}, file.tus, {
          endpoint: 'https://files.tus.vimeo.com/files/', // HACK this is to appease tus-js-client
          // NOTE: This is uploadUrl instead of endpoint, different from what you might expect;
          // Vimeo pre-creates the Tus upload.
          uploadUrl: upload.upload_link,
        }),
        // HACK because the Tus plugin doesn't send upload_link yet
        remote: Object.assign({}, file.remote, {
          body: Object.assign({}, file.remote.body, {
            uploadUrl: upload.upload_link,
          }),
        }),
      })

      this.uppy.emit('preprocess-complete', fileID)
    })
  }

  afterUpload(fileIDs) {
    fileIDs.forEach((fileID) => {
      const file = this.uppy.getFile(fileID)
      const video = file.vimeo

      this.uppy.setFileState(fileID, {
        uploadURL: video.link,
      })
    })
  }

  install() {
    this.uppy.addPreProcessor(this.prepareUpload)
    this.uppy.addPostProcessor(this.afterUpload)
  }

  uninstall() {
    this.uppy.removePreProcessor(this.prepareUpload)
    this.uppy.removePostProcessor(this.afterUpload)
  }
}
