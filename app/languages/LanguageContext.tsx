import React, { createContext, FC, useState } from 'react'
import { LanguageID, Translation, SentenceID, languages } from './translations'
import translations from './translations'

interface TranslationContext {
  language: LanguageID,
  translation: Translation,
  changeLanguage: (language: LanguageID) => void
  t: (sentence: SentenceID) => string
}
export { languages }
export { translations }
export { LanguageID }
export { SentenceID }

const LanguageContext = createContext<TranslationContext>({
  language: "en_us",
  translation: translations.en_us,
  changeLanguage: () => { },
  t: () => ''
})

export const LanguageProvider: FC = ({ children }) => {
  const [language, setLanguage] = useState<LanguageID>('en_us')
  const [translation, setTranslation] = useState<Translation>(translations.en_us)

  function changeLanguage(language: LanguageID) {
    setLanguage(language)
    setTranslation(translations[language])
  }

  function t(sentence: SentenceID) {
    return translation[sentence]
  }

  return (
    <LanguageContext.Provider value={{ language, translation, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
export default LanguageContext