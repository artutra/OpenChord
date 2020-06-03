export const languages = ['en_us', 'pt_br'] as const;
export const sentences = [
  'language_name',
  'settings',
  'playlists',
  'online_search',
  'artists',
  'songs',
  'preview',
  'add_songs',
  'edit_song'
] as const;
export type SentenceID = typeof sentences[number];
export type LanguageID = typeof languages[number];
export type Translation = Record<SentenceID, string>
export type Languages = Record<LanguageID, Translation>

const translations: Languages = {
  en_us: {
    language_name: "English",
    settings: 'Settings',
    playlists: 'Playlists',
    artists: 'Artists',
    online_search: 'Online Search',
    songs: 'Songs',
    preview: 'Preview',
    add_songs: 'Add songs',
    edit_song: 'Edit Song'
  },
  pt_br: {
    language_name: "Português (Brasil)",
    settings: "Configurações",
    playlists: 'Listas',
    artists: 'Artistas',
    online_search: 'Busca Online',
    songs: 'Músicas',
    preview: 'Preview',
    add_songs: 'Adicionar Músicas',
    edit_song: 'Editar Música'
  }
}
export default translations