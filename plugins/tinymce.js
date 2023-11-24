import 'tinymce/tinymce'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'
import 'tinymce/skins/ui/oxide/skin.css'

import 'tinymce/plugins/image'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/link'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/table'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/media'

import 'tinymce/models/dom/model'
import 'tinymce-i18n/langs/hr'
import 'tinymce-i18n/langs/sl_SI'
import 'tinymce-i18n/langs/en_GB'
import 'tinymce-i18n/langs/de'
import 'tinymce-i18n/langs/it'
import 'tinymce-i18n/langs/es'
import 'tinymce-i18n/langs/fr_FR'
import Editor from '@tinymce/tinymce-vue'
import Vue from 'vue'
import Media from '@/models/Media'
export default function ({ app, store, i18n }, inject) {
  function mapLocale(locale) {
    const locales = {
      hr: 'hr',
      en: 'en_GB',
      de: 'de',
      it: 'it',
      es: 'es',
      fr: 'fr_FR',
      sl: 'sl_SI',
    }
    return locales[locale]
  }
  Vue.component('tinymce-editor', {
    extends: Editor,
    props: {
      init: {
        type: Object,
        default() {
          return {
            color_map: [
              '000000',
              'Black',
              '444444',
              'Gray',
              'ff3860',
              'Red',
              'FFD166',
              'Yellow',
              '73c03d',
              'Green',
              '209cee',
              'Blue',
              '073B4C',
              'Dark Blue',
            ],
            plugins: ['image', 'lists', 'advlist', 'link', 'autolink', 'autosave', 'table', 'autoresize', 'media'],
            autoresize_bottom_margin: 20,
            autoresize_max_height: 500,
            autoresize_min_height: 300,
            menubar: false,
            height: 300,
            toolbar: [
              'undo redo | styles | forecolor | bold italic alignleft aligncenter alignright | bullist numlist | outdent indent | link image media',
              'table tabledelete | tableprops tablerowprops tablecellprops tableinsertrowbefore tableinsertrowafter tabledeleterow tableinsertcolbefore tableinsertcolafter tabledeletecol',
            ],
            content_css: false,
            skin: false,
            branding: false,
            promotion: false,
            statusbar: false,
            content_style: 'body { font-family: Quicksand, sans-serif; font-weight: 400; line-height: 1.5rem;}',
            language: mapLocale(i18n.locale),
            file_picker_types: 'file image media',
            image_title: true,
            automatic_uploads: true,
            link_default_protocol: 'https',
            link_default_target: '_blank',
            autosave_interval: '30s',
            images_upload_handler(blobInfo, progress) {
              return new Promise((resolve, reject) => {
                const n = new Media({
                  media: 'data:' + blobInfo.blob().type + ';base64,' + blobInfo.base64(),
                  title: blobInfo.filename(),
                  description: blobInfo.filename(),
                })
                n.save()
                  .then((res) => {
                    resolve(res.link)
                  })
                  .catch((err) => {
                    reject(err)
                  })
              })
            },
          }
        },
      },
    },
  })
}
