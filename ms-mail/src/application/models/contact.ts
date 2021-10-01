export default interface IContact {
  name: string
  email: string
  status?: boolean
  remember_me_token?: string
  currentBalance?: number
  recipientName?: string
  issuerName?: string
  transferValue: number
}