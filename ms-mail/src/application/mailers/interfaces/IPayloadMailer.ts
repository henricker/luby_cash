import mailers from "../index";
import IContact from "../../models/contact";

export default interface IPayloadMailer {
  contact: IContact,
  template: keyof typeof mailers
}