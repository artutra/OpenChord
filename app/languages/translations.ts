export const languages = ['en_us', 'pt_br'] as const;
export const sentences = ['language_name', 'settings'] as const;
export type SentenceID = typeof sentences[number];
export type LanguageID = typeof languages[number];
export type Translation = Record<SentenceID, string>
export type Languages = Record<LanguageID, Translation>

const translations: Languages = {
  en_us: {
    language_name: "English",
    settings: 'Settings'
  },
  pt_br: {
    language_name: "Português (Brasil)",
    settings: "Configurações"
  }
}
export default translations