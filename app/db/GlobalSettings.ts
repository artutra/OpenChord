import realm from "."
import { LanguageID } from "../languages/translations"

export class GlobalSettings {
  language!: LanguageID
  fontSize!: number
  showTablature!: boolean

  static schema: Realm.ObjectSchema = {
    name: 'GlobalSettings',
    properties: {
      language: 'string',
      fontSize: { type: 'int', default: 14 },
      showTablature: { type: 'bool', default: true }
    }
  }

  static get(): GlobalSettings {
    let globalSettings = realm.objects<GlobalSettings>('GlobalSettings').find(() => true)
    if (globalSettings == null) {
      realm.write(() => {
        let globalSettings = realm.create<GlobalSettings>('GlobalSettings', {
          language: "en_us"
        })
        return globalSettings
      })
    }
    return globalSettings!
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
}