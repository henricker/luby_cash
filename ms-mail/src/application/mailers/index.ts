import WelcomeUserMailer from "./users/welcome-user"
import ForgotPasswordMailer from "./users/forgot-password"
import EvaluationUserMailer from "./users/evaluation-user"
import IssuerTransferMailer from "./users/issuer-transfer"
import RecipientTransferMailer from "./users/recipient-transfer"

export default {
	'welcome-user': WelcomeUserMailer,
	'forgot-password': ForgotPasswordMailer,
	'evaluation-user': EvaluationUserMailer,
	'issuer-transfer': IssuerTransferMailer,
	'recipient-transfer': RecipientTransferMailer,
}