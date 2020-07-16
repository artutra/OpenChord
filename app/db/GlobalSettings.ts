import realm from "."
import { LanguageID } from "../languages/translations"

const DEFAULTS: GlobalSettings = {
  language: 'en_us',
  fontSize: 14,
  showTablature: true,
  enablePageTurner: false,
  termsAndConditions: false,
}
export class GlobalSettings {
  language!: LanguageID
  fontSize!: number
  showTablature!: boolean
  enablePageTurner!: boolean
  termsAndConditions!: boolean

  static schema: Realm.ObjectSchema = {
    name: 'GlobalSettings',
    properties: {
      language: { type: 'string', default: DEFAULTS.language },
      fontSize: { type: 'int', default: DEFAULTS.fontSize },
      showTablature: { type: 'bool', default: DEFAULTS.showTablature },
      enablePageTurner: { type: 'bool', default: DEFAULTS.enablePageTurner },
      termsAndConditions: { type: 'bool', default: DEFAULTS.termsAndConditions }
    }
  }

  static get(): GlobalSettings {
    let globalSettings = realm.objects<GlobalSettings>('GlobalSettings').find(() => true)
    if (globalSettings == null) {
      realm.write(() => {
        realm.create<GlobalSettings>('GlobalSettings', {})
      })
      return DEFAULTS
    } else {
      return globalSettings!
    }
  }

  static setLanguage(language: LanguageID) {
    let globalSettings = this.get()
    realm.write(() => {
      globalSettings.language = language
    })
  }

  static setFontSize(fontSize: number) {
    let globalSettings = this.get()
    realm.write(() => {
      globalSettings.fontSize = fontSize
    })
  }

  static setShowTablature(showTablature: boolean) {
    let globalSettings = this.get()
    realm.write(() => {
      globalSettings.showTablature = showTablature
    })
  }

  static setEnablePageTurner(enablePageTurner: boolean) {
    let globalSettings = this.get()
    realm.write(() => {
      globalSettings.enablePageTurner = enablePageTurner
    })
  }

  static setTermsAndConditions(termsAndConditions: boolean) {
    let globalSettings = this.get()
    realm.write(() => {
      globalSettings.termsAndConditions = termsAndConditions
    })
  }
}