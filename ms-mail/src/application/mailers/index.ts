import WelcomeUserMailer from "./users/welcome-user"
import ForgotPasswordMailer from "./users/forgot-password"
import EvaluationUserMailer from "./users/evaluation-user"

export default {
	'welcome-user': WelcomeUserMailer,
	'forgot-password': ForgotPasswordMailer,
	'evaluation-user': EvaluationUserMailer,
}