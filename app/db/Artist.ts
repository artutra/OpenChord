import realm from "."

export class Artist {
  id?: string | null
  name: string
  updated_at: Date

  constructor(name: string, updated_at?: Date, id?: string) {
    this.name = name
    this.id = id
    this.updated_at = updated_at ? updated_at : new Date()
  }
  static schema: Realm.ObjectSchema = {
    name: 'Artist',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: { type: 'string', optional: false },
      updated_at: 'date'
    }
  }
  static getAll() { return realm.objects<Artist>('Artist') }

  static getById(id: string) {
    return realm.objectForPrimaryKey<Artist>('Artist', id)
  }
  static delete(id: string) {
    realm.delete(this.getById(id))
  }
}