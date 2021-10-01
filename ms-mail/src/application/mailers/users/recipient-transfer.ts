import { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import BaseMailer from "../../../infra/mailer/base-mailer";
import IPayloadMailer from "../interfaces/IPayloadMailer";
import HandlebarsCompilerService from "../../../infra/handlebars/handlebars";

export default class RecipientTransferMailer extends BaseMailer {
  constructor(authConfig: SMTPTransport.Options, private payload: IPayloadMailer) {    
    super(authConfig)
  }

  async prepare(transporter: Transporter): Promise<void> {

    if(!this.payload)
      throw new Error('invalid payload')

    if(!this.payload?.contact?.name || !this.payload?.contact?.email || !this.payload?.contact?.currentBalance ||!this.payload?.contact?.transferValue || !this.payload?.contact?.issuerName)
      throw new Error('invalid contact')
    
    const hbs = new HandlebarsCompilerService(this.payload.template)
    const html = await hbs.compile({
      name: this.payload.contact.name,
      currentBalance: this.payload.contact.currentBalance,
      transferValue: this.payload.contact.transferValue,
      issuerName: this.payload.contact.issuerName,
    })

    await transporter.sendMail({
      from: 'LubyCash 💸 <lubycash@suport.com>',
      to: this.payload.contact.email,
      subject: 'You received a transfer',
      html
    })
  }
}