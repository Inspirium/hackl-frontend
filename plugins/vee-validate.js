import Vue from 'vue'
import { extend, configure, ValidationProvider, ValidationObserver } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import validationMessagesEn from 'vee-validate/dist/locale/en'
import validationMessagesHr from 'vee-validate/dist/locale/hr'
import validationMessagesSl from 'vee-validate/dist/locale/sl'
import validationMessagesDe from 'vee-validate/dist/locale/de'
import validationMessagesFr from 'vee-validate/dist/locale/fr'
import validationMessagesEs from 'vee-validate/dist/locale/es'
import validationMessagesSr from 'vee-validate/dist/locale/sr_Latin'
import validationMessagesIt from 'vee-validate/dist/locale/it.json'

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

export default function ({ app }) {
  app.i18n.mergeLocaleMessage('en', { validation: validationMessagesEn.messages })
  app.i18n.mergeLocaleMessage('hr', { validation: validationMessagesHr.messages })
  app.i18n.mergeLocaleMessage('sl', { validation: validationMessagesSl.messages })
  app.i18n.mergeLocaleMessage('sr', { validation: validationMessagesSr.messages })
  app.i18n.mergeLocaleMessage('de', { validation: validationMessagesDe.messages })
  app.i18n.mergeLocaleMessage('it', { validation: validationMessagesIt.messages })
  app.i18n.mergeLocaleMessage('es', { validation: validationMessagesEs.messages })
  app.i18n.mergeLocaleMessage('fr', { validation: validationMessagesFr.messages })
  configure({
    defaultMessage: (field, values) => {
      // override the field name.
      values._field_ = app.i18n.t(`fields.${field}`)

      return app.i18n.t(`validation.${values._rule_}`, values)
    },
  })

  Object.keys(rules).forEach((rule) => {
    // eslint-disable-next-line import/namespace
    extend(rule, rules[rule])
  })
}
