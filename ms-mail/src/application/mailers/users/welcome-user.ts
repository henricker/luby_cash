import { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import BaseMailer from "../../../infra/mailer/base-mailer";
import IPayloadMailer from "../interfaces/IPayloadMailer";
import HandlebarsCompilerService from "../../../infra/handlebars/handlebars";

export default class WelcomeUserMailer extends BaseMailer {
  constructor(authConfig: SMTPTransport.Options, private payload: IPayloadMailer) {    
    super(authConfig)
  }

  async prepare(transporter: Transporter): Promise<void> {

    if(!this.payload)
      throw new Error('invalid payload')

    if(!this.payload.contact || !this.payload.contact.name || !this.payload.contact.email)
      throw new Error('invalid contact')
    
    const hbs = new HandlebarsCompilerService(this.payload.template)
    const html = await hbs.compile({
      name: this.payload.contact.name
    })

    await transporter.sendMail({
      from: 'LubyCash 💸 <lubycash@suport.com>',
      to: this.payload.contact.email,
      subject: 'Welcome to LubyCash!',
      html
    })
  }
}