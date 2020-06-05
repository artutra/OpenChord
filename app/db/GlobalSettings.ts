import realm from "."
import { LanguageID } from "../languages/translations"

export class GlobalSettings {
  language!: LanguageID

  static schema: Realm.ObjectSchema = {
    name: 'GlobalSettings',
    properties: {
      language: 'string',
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
}