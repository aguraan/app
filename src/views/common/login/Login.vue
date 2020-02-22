<template>
	<v-content>
	<v-snackbar
			v-model="snackbar"
			:color="snackbarColor"
			:timeout="timeout"
			top
	>
		{{ snackbarText }}
		<v-btn
				dark
				text
				@click="closeSnackbar"
		>
				Закрыть
		</v-btn>
	</v-snackbar>
		<v-container
				fill-height
				fluid
		>
			<v-row no-gutters>
				<v-col>
					<v-row justify="center" no-gutters>
						<v-card class="elevation-12" width="400">
							<v-card-title
								class="login-header"
							>
								<h1 @click="toMain" class="logo font-weight-bold headline red--text text--darken-4" title="SCHEME">
									SCHEME
								</h1>

							</v-card-title>
							<v-window
								v-model="window"
								vertical
								reverse
							>
								<v-window-item key="0" :value="windows.main" @keyup.enter.native="btnAction[tab]()">
									<v-tabs
										v-model="tab"
										background-color="login-tabs-header"
										:color="tabColor[tab]"
										centered
										grow
									>

										<v-tab
											href="#login"
											class="text-capitalize"
										>
											{{ tabText.login }}
										</v-tab>

										<v-tab
											href="#signup"
											class="text-capitalize"
										>
											{{ tabText.signup }}
										</v-tab>

										<v-tab-item
											value="login"
										>
											<v-card-text>

												<v-form
													ref="loginForm"
													v-model="validLogin"
													lazy-validation
												>
													<v-text-field
														v-model="email"
														:rules="emailRules"
														label="Ваш адрес эл. почты"
														prepend-icon="mdi-email"
														type="email"
														required
													></v-text-field>

													<v-text-field
														v-model="loginPassword"
														:rules="passRules"
														:append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
														label="Пароль"
														prepend-icon="mdi-lock"
														:type="show1 ? 'text' : 'password'"
														@click:append="show1 = !show1"
														required
													></v-text-field>

													<v-row align="center" justify="space-between" no-gutters>
														<v-switch 
															v-model="permanent" 
															label="Запомнить меня" 
															hide-details 
															class="mt-0"
														></v-switch>
												
														<v-btn
															text
															small
															color="primary"
															@click="window = windows.forgotPassword"
														>
															<span class="text-capitalize mr-1">Забыли</span>
															<span class="text-lowercase">пароль?</span>
														</v-btn>
														
													</v-row>

												</v-form>

											</v-card-text>
										</v-tab-item>

										<v-tab-item
											value="signup"
										>
											<v-card-text>

												<v-form
													ref="signupForm"
													v-model="validSignup"
													lazy-validation
												>
													<v-text-field
														v-model="givenName"
														:rules="givenNameRules"
														label="Ваше имя"
														prepend-icon="mdi-account"
														type="text"
														required
													></v-text-field>

													<v-text-field
														v-model="familyName"
														:rules="familyNameRules"
														label="Ваша фамилия"
														prepend-icon="mdi-account"
														type="text"
														required
													></v-text-field>

													<v-text-field
														v-model="email"
														:rules="emailRules"
														label="Ваш адрес эл. почты"
														prepend-icon="mdi-email"
														type="email"
														required
													></v-text-field>

													<v-text-field
														v-model="signupPassword"
														:rules="passSignRules"
														:append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
														label="Пароль"
														prepend-icon="mdi-lock"
														:type="show2 ? 'text' : 'password'"
														@click:append="show2 = !show2"
														required
													></v-text-field>

													<v-text-field
														v-model="passwordRepeat"
														:rules="passRepeatRules(signupPassword)"
														:append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
														label="Повторите пароль"
														prepend-icon="mdi-lock"
														:type="show3 ? 'text' : 'password'"
														@click:append="show3 = !show3"
														required
													></v-text-field>

													<v-checkbox
														v-model="privatePolicy"
														:rules="privatePolicyRules"
													>
														<template v-slot:label>
															<div>
																Я прочитал и согласен с условиями
																<v-dialog
																	v-model="dialog"
																	width="500"
																>
																	<template v-slot:activator="{ on }">
																	<span
																		id="privacy-policy"
																		v-on="on"
																		class="text-underline"
																	>
																		пользовательского соглашения.
																	</span>
																	</template>

																	<v-card>
																		<v-card-title
																			class="headline login-header"
																			primary-title
																		>
																			Политика конфиденциальности
																		</v-card-title>

																		<v-card-text v-html="privatePolicyHtml"></v-card-text>

																		<v-divider></v-divider>

																		<v-card-actions>
																			<v-spacer></v-spacer>
																			<v-btn
																				color="primary"
																				text
																				@click="dialog = false"
																			>
																				ОК
																			</v-btn>
																		</v-card-actions>
																	</v-card>
																</v-dialog>	
															</div>
														</template>

													</v-checkbox>

												</v-form>

											</v-card-text>
										</v-tab-item>
									</v-tabs>

									<v-container>
										<v-row >
											<v-col>

												<v-btn
													color="#4285F4"
													dark
													small
													tile
													depressed
													block
													@click="googleLogin"
												>
													<v-icon left>mdi-google</v-icon>
													<span class="text-capitalize mr-1">{{ tabText[tab] }}</span>
													<span class="text-lowercase mr-1">с помощью</span>
													<span class="text-capitalize">google</span>
													<v-icon right>mdi-chevron-right</v-icon>
												</v-btn>

											</v-col>
											<v-col>

												<v-btn
													color="#4267B2"
													dark
													small
													tile
													depressed
													block
													@click="facebookLogin"
												>
													<v-icon left>mdi-facebook</v-icon>
													<span class="text-capitalize mr-1">{{ tabText[tab] }}</span>
													<span class="text-lowercase mr-1">с помощью</span>
													<span class="text-capitalize">facebook</span>
													<v-icon right>mdi-chevron-right</v-icon>
												</v-btn>

											</v-col>

										</v-row>
									</v-container>

									<v-btn
										tile
										x-large
										depressed
										block
										:color="tabColor[tab]"
										:loading="loading"
										@click="btnAction[tab]()"
									>
										{{ tabText[tab] }}
										<v-icon right>{{ btnIcon[tab] }}</v-icon>
									</v-btn>
								</v-window-item>

								<account-confirmation
									:loading="operations['get:/auth/send-confirmation-email']"
									:value="windows.accountConfirmation"
									:action="sendConfirmationEmail"
									:email="email"
									:back="toMain"
								/>

								<account-not-confirmed
									:loading="operations['get:/auth/send-confirmation-email']"
									:value="windows.accountNotConfirmed"
									:action="validateConfirmation"
									:email.sync="email"
									:email-rules="emailRules"
									:form-validation.sync="validConfirmation"
									:back="toMain"
									ref="confirmationForm"
								/>

								<forgot-password
									:loading="operations['get:/auth/password-reset-email']"
									:value="windows.forgotPassword"
									:action="validateEmailReset"
									:email.sync="email"
									:email-rules="emailRules"
									:form-validation.sync="validEmailReset"
									:back="toMain"
									ref="resetEmailForm"
								/>

								<password-reset
									:loading="operations['get:/auth/password-reset-email']"
									:action="sendPasswordResetEmail"
									:value="windows.passwordReset"
									:email="email"
									:back="toMain"
								/>

								<password-create
									:loading="operations['post:/auth/change-password']"
									:value="windows.passwordCreate"
									:action="validateChangePassword"
									:form-validation.sync="validPasswordReset"
									:password.sync="newPassword"
									:password-rules="passSignRules"
									:repeat-password.sync="newPasswordRepeat"
									:repeat-password-rules="passRepeatRules(newPassword)"
									:back="toMain"
									ref="resetPasswordForm"
								/>

								<password-success :back="toMain"/>

							</v-window>	
						</v-card>
					</v-row>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</template>

<script>
import {
	SNACKBAR_ON,
	SNACKBAR_OFF,
	SNACKBAR_ERROR,
	SET_ACCESS_TOKEN,
	SET_USER,
	SET_REFRESH_TOKEN,
	CONFIRMATION_CHECK,
	CHANGE_PASSWORD,
	PASSWORD_RESET_REQUEST,
	CONFIRMATION_REQUEST,
	LOGIN,
	CREATE_SESSION_REQUEST,
	REGISTER,
	FACEBOOK_AUTH,
	GOOGLE_AUTH,
	SET_REMEMBER_ME,
} from '@/mutation.types'
import axios from 'axios'
import { mapGetters } from 'vuex'
// import { extractPayload } from '@/helpers'
import fingerprint from '@/helpers/fingerprint'

import AccountConfirmation from './window.items/AccountConfirmation'
import AccountNotConfirmed from './window.items/AccountNotConfirmed'
import ForgotPassword from './window.items/ForgotPassword'
import PasswordReset from './window.items/PasswordReset'
import PasswordCreate from './window.items/PasswordCreate'
import PasswordSuccess from './window.items/PasswordSuccess'

export default {
	name: 'LoginPage',
	components: {
		AccountConfirmation,
		AccountNotConfirmed,
		ForgotPassword,
		PasswordReset,
		PasswordCreate,
		PasswordSuccess
	},
	data: () => ({
		show1: false,
		show2: false,
		show3: false,
		dialog: false,
		timeout: 6000,
		validLogin: true,
		validSignup: true,
		validConfirmation: true,
		validEmailReset: true,
		validPasswordReset: true,
		tab: null,
		tabColor: {
			login: 'primary',
			signup: 'success'
		},
		tabText: {
			login: 'Войти',
			signup: 'Зарегистрироваться'
		},
		btnIcon: {
			login: 'mdi-login',
			signup: 'mdi-pencil'
		},
		givenName: 'Иван',
		familyName: 'Агура',
		email: 'agura.iv@gmail.com',
		loginPassword: '',
		signupPassword: 'admin1111',
		passwordRepeat: 'admin1111',
		newPassword: '',
		newPasswordRepeat: '',
		privatePolicy: false,
		privatePolicyHtml: '',
		givenNameRules: [
			v => !!v || 'Необходимо ввести имя',
			v => v.length <= 32 || 'Не более 32 символов'
		],
		familyNameRules: [
			v => !!v || 'Необходимо ввести фамилию',
			v => v.length <= 32 || 'Не более 32 символов'
		],
		emailRules: [
			v => !!v || 'Необходимо ввести адрес эл. почты',
			v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Недопустимый адрес эл. почты'
		],
		passRules: [ v => !!v || 'Необходимо ввести пароль' ],
		privatePolicyRules: [ v => !!v || 'Неодходимо Ваше согласие'],
		window: 0,
		windows: {
			main: 0,
			accountConfirmation: 1,
			accountNotConfirmed: 2,
			forgotPassword: 3,
			passwordReset: 4,
			passwordCreate: 5,
			passwordSuccess: 6,
		},
		resetToken: '',
		confirmationToken: '',
		googleLink: ''
	}),
	computed: {
		...mapGetters(['loading', 'snackbarText', 'snackbarColor', 'operations', 'rememberMe']),
		snackbar: {
			get() {
				return this.$store.getters.snackbar
			},
			set(val) {
				val ? this.$store.commit(SNACKBAR_ON) : this.$store.commit(SNACKBAR_OFF)
			}
		},
		permanent: {
			get() {
				return this.rememberMe
			},
			set(val) {
				this.$storage.setDefaultStorageType(val ? 'local' : 'session')
				this.$store.commit(SET_REMEMBER_ME, val)
			}
		},
		passSignRules() {
			return [
				...this.passRules,
				v => !(/\s/.test(v)) || 'Пароль содержит пробельный символ',
				v => /^[a-zA-z0-9!@#$%^&\-_~*+=]+$/.test(v) || 'Пароль содержит недопустимые символы',
				v => /[a-z]/.test(v) || 'Пароль должен содержать минимум одну латинскую букву в нижнем регистре',
				// v => /[A-Z]/.test(v) || 'Пароль должен содержать минимум одну латинскую букву в верхнем регистре',
				v => /[0-9]/.test(v) || 'Пароль должен содержать минимум одну цифру',
				// v => /[!@#$%^&\-_~*+=]/.test(v) || 'Пароль должен содержать минимум один спец. символ: ! @ # $ % ^ & - _ ~ * + =',
				v => v.length >= 8 || 'Пароль должен быть не менее 8 символов',
				v => v.length <= 32 || 'Пароль должен быть не более 32 символов'
			]
		},
		passRepeatRules: () => password => {
			return [
				v => !!v || 'Введите пароль еще раз',
				v => v === password || 'Пароль не совпадает с введенным выше'
			]
		},
		btnAction() {
			return {
				login: this.validateLogin,
				signup: this.validateSignup
			}
		},
		queryActions() {
			return {
				confirmation: this.checkConfirmation,
				resetToken: this.checkResetToken,
				tab: this.switchTab
			}
		}
	},
	created() {
		Object.entries(this.$route.query).forEach(this.queryHandler)

		this.getPrivacyPolicy()
			.then(({ data }) => { this.privatePolicyHtml = data })
			.catch(err => { this.privatePolicyHtml = err.message }) // TODO
	},
	methods: {

		switchTab(value) {
			if (['login', 'signup'].some(item => item === value)) {
				this.tab = value
			}
		},

		toMain() {
			this.window = this.windows.main
		},

		queryHandler([param, value]) {
			if (param in this.queryActions) this.queryActions[param](value)
		},

		checkResetToken(token) {
			this.resetToken = token
			this.window = this.windows.passwordCreate
		},

		async createSession(fingerprintToken) {
			try {
				const murmur = await fingerprint()
				const result = await this.$store.dispatch(CREATE_SESSION_REQUEST, {
					token: fingerprintToken,
					fingerprint: murmur
				})

				this.$store.commit(SET_REFRESH_TOKEN, result.data.refreshToken)
				this.$store.commit(SET_ACCESS_TOKEN, result.data.accessToken)
				this.$store.commit(SET_USER, result.data.user)

				// const { role } = extractPayload(result.data.accessToken)
				const { role } = this.$store.getters.accessTokenPayload
				this.$router.push(`/${ role.toLowerCase() }`)
			} catch (error) {
				//
			}
		},

		async checkConfirmation(encryptedToken) {
			try {
				const response = await this.$store.dispatch(CONFIRMATION_CHECK, encryptedToken)

				await this.createSession(response.data.token)
				
			} catch (error) {
				this.window = this.windows.accountNotConfirmed
			}
		},

		async validateChangePassword() {
			if (this.$refs.resetPasswordForm.validate()) {
				try {
					await this.$store.dispatch(CHANGE_PASSWORD, {
						token: this.resetToken,
						newPassword: this.newPassword
					})
					this.window = this.windows.passwordSuccess	
				} catch (error) {
					//
				}	
			}
		},

		async sendPasswordResetEmail() {
			try {
				await this.$store.dispatch(PASSWORD_RESET_REQUEST, this.email)
			} catch (error) {
				//
			}
		},

		async validateEmailReset() {
			if (this.$refs.resetEmailForm.validate()) {
				try {
					await this.$store.dispatch(PASSWORD_RESET_REQUEST, this.email)
					this.window = this.windows.passwordReset
				} catch (error) {
					//				
				}
			}
		},

		async sendConfirmationEmail() {
			try {
				await this.$store.dispatch(CONFIRMATION_REQUEST, this.email)
			} catch (error) {
				//
			}
		},

		async validateConfirmation() {
			if (this.$refs.confirmationForm.validate()) {
				try {
					await this.$store.dispatch(CONFIRMATION_REQUEST, this.email)
					this.window = this.windows.accountConfirmation
				} catch (error) {
					//
				}
			}
		},

		async validateLogin() {
			if (this.$refs.loginForm.validate()) {

				try {
					const response = await this.$store.dispatch(LOGIN, {
						email: this.email,
						password: this.loginPassword
					})

					await this.createSession(response.data.token)
					this.loginPassword = ''

				} catch (error) {
					if (error.response.data) {
						if (error.response.data.name === 'emailVerifiedFails') {
							await this.$store.dispatch(CONFIRMATION_REQUEST, this.email)
							this.window = this.windows.accountConfirmation
						}
					}
				}
			}
		},

		async validateSignup() {
			if (this.$refs.signupForm.validate()) {

				try {
					const murmur = await fingerprint()

					await this.$store.dispatch(REGISTER, {
						givenName: this.givenName,
						familyName: this.familyName,
						email: this.email,
						password: this.signupPassword,
						fingerprint: murmur
					})

					this.signupPassword = ''
					await this.$store.dispatch(CONFIRMATION_REQUEST, this.email)

					this.window = this.windows.accountConfirmation
				} catch (error) {
					// log errors
				}
			}
		},

		async googleLogin() {
			try {
				const response = await this.$store.dispatch(GOOGLE_AUTH)
				await this.createSession(response.data.token)

			} catch (error) {
				this.$store.commit(SNACKBAR_ERROR, {
					text: error.message
				})
			}
		},

		async facebookLogin() {
			try {
				const response = await this.$store.dispatch(FACEBOOK_AUTH)
				await this.createSession(response.data.token)

			} catch (error) {
				this.$store.commit(SNACKBAR_ERROR, {
					text: error.message
				})
			}
		},

		getPrivacyPolicy(event) { 
			const promise = axios.get('https://scheme.com.ua/privacy_policy.html')
			return !event && promise
		},

		closeSnackbar() {
			this.$store.commit(SNACKBAR_OFF)
		}
	}
}
</script>
<style scoped>
.logo {
	cursor: pointer;
}
#privacy-policy {
  text-decoration: underline;
}
</style>
