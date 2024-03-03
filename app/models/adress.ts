import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Adress extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare customer_id: number

  @column()
  declare country: string

  @column()
  declare state: string

  @column()
  declare street: string

  @column()
  declare number: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
