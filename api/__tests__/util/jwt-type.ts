import { DateTime } from 'luxon'

export type JwtType = {
  type: 'bearer'
  token: string
  expires_at: DateTime
}
