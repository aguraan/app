<template>
<div>
	<v-navigation-drawer
		permanent
		app
		bottom
		:mini-variant.sync="mini"
    >

		<template v-slot:prepend>
			<v-list>
				
				<v-list-group no-action>
					<template v-slot:activator>
						<v-list-item-avatar color="primary">
							<v-img
								v-if="user.picture"
								:src="user.picture"
								:alt="user.name"
							></v-img>
							<span v-else class="white--text">
								{{ abbreviation(user.name || user.username) }}
							</span>
						</v-list-item-avatar>

						<v-list-item-content>
							<v-list-item-title class="subtitle-1">{{ user.name || user.username || user.email }}</v-list-item-title>
						</v-list-item-content>
					</template>

					<v-list dense>

						<v-dialog v-model="myPageDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
							<template v-slot:activator="{ on }">
								<v-list-item link v-on="on">
									<v-list-item-icon>
										<v-icon small>mdi-account-details</v-icon>
									</v-list-item-icon>

									<v-list-item-content>
										<v-list-item-title>Моя Страница</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</template>
							<v-card>
								<v-toolbar>
									<v-btn icon @click="myPageDialog = false">
										<v-icon>mdi-close</v-icon>
									</v-btn>
									<v-toolbar-title>Моя Страница</v-toolbar-title>
								</v-toolbar>

								<admin-profile/>

							</v-card>
						</v-dialog>

						<v-dialog v-model="themeDialog" scrollable max-width="700px">
							<template v-slot:activator="{ on }">
								<v-list-item link v-on="on">
									<v-list-item-icon>
										<v-icon small>mdi-image-area</v-icon>
									</v-list-item-icon>

									<v-list-item-content>
										<v-list-item-title>Темы</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</template>
							<v-card>
								<v-toolbar>
									<v-toolbar-title class="subtitle-1">Темы</v-toolbar-title>
									<v-spacer></v-spacer>
									<v-btn icon small @click="cancelTheme">
										<v-icon>mdi-close</v-icon>
									</v-btn>
								</v-toolbar>

								<theme-dialog
									@select="selectTheme"
									:active="previewTheme"
								/>

								<v-card-actions>
									<v-switch
										v-model="dark"
										primary
										label="Темная"
										hide-details
										class="mt-0"
									/>
									<v-spacer></v-spacer>
									<v-btn text @click="cancelTheme">Отменить</v-btn>
									<v-btn text @click="saveTheme">Сохранить</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>

						<v-list-item @click="logout">
							<v-list-item-icon>
								<v-icon small>mdi-logout</v-icon>
							</v-list-item-icon>

							<v-list-item-content>
								<v-list-item-title>Выйти</v-list-item-title>
							</v-list-item-content>
						</v-list-item>

					</v-list>
				</v-list-group>
			</v-list>
		</template>

		<v-divider></v-divider>

		<v-list>

			<v-list-item
				v-for="(route, index) in navigation"
				:to="{ name: route.name }"
				:key="index"
				link
			>
				<v-list-item-icon>
					<v-icon>{{ route.icon }}</v-icon>
				</v-list-item-icon>

				<v-list-item-content>
					<v-list-item-title>{{ route.title }}</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</v-list>

	</v-navigation-drawer>

	<v-app-bar
		app
		flat
		color="transparent"
	>
		<v-progress-linear
			v-if="loading"
			color="cyan"
			absolute
			top
			indeterminate
		></v-progress-linear>

		<v-btn icon @click="mini = !mini">
			<v-icon v-show="!mini">mdi-menu-left</v-icon>
			<v-icon v-show="mini">mdi-dots-vertical</v-icon>
		</v-btn>

		<v-toolbar-title>{{ activeRoute.title }}</v-toolbar-title>

		<v-spacer></v-spacer>

		<v-toolbar-items>
			<v-tooltip bottom slot="append">
				<template v-slot:activator="{ on }">
					<div>
						<v-sheet class="pa-5 caption blue-grey lighten-5 blue-grey--text text--darken-4" tile>
							<span v-on="on">{{ time }}</span>
						</v-sheet>
					</div>
				</template>
				<span>{{ time }}</span>
			</v-tooltip>
		</v-toolbar-items>

		<v-toolbar-items>
			<v-tooltip bottom slot="append">
				<template v-slot:activator="{ on }">
					<div>
						<v-sheet class="pa-5 blue-grey caption lighten-5 blue-grey--text text--darken-4" tile>
							<v-btn
								icon
								x-small
								absolute
								style="transform: translateX(-3em);"
								@click="updateExchangeRates"
								:loading="operations['get:/p24api/pubinfo']"
							>
								<v-icon small>mdi-autorenew</v-icon>
							</v-btn>
							<span v-on="on">
								{{ usd.ccy }} | Покупка: {{ usd.buy }} | Продажа: {{ usd.sale }}
							</span>
						</v-sheet>
					</div>
				</template>
				<span>
					{{ usd.ccy }} | Покупка: {{ usd.buy }} | Продажа: {{ usd.sale }}
				</span>
			</v-tooltip>
		</v-toolbar-items>

	</v-app-bar>

	<v-content>
		<router-view></router-view>
	</v-content>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { 
	LOGOUT,
	GET_GOOGLE_DATA,
	EXCHANGE_RATES_REQUEST,
	SELECT_THEME,
	SET_DARK_MODE,
	UPDATE_USER
} from '@/mutation.types'
import AdminProfile from './Profile'
import ThemeDialog from '@/views/common/ThemeDialog'
export default {
	name: 'MainAdmin',
	components: {
		AdminProfile,
		ThemeDialog
	},
	data: () => ({
		mini: true,
		myPageDialog: false,
		themeDialog: false,
		time: '00:00',
		previewTheme: 0,
		previewDarkMode: false
	}),
	computed: {
		...mapGetters([
			'mapRouteData', 
			'routeDataByName', 
			'routeData', 
			'user', 
			'googleData', 
			'exchangeRates', 
			'loading',
			'operations',
			'selectedTheme',
			'darkMode'
		]),
		navigation() {
			return this.mapRouteData(['admin', 'admin_dashboard', 'admin_settings'])
		},
		adminProfile() {
			return this.routeDataByName('admin_profile')
		},
		profileMenu() {
			return this.mapRouteData(['admin_profile'])
		},
		activeRoute() {
			return this.routeDataByName(this.$route.name)
		},
		usd() {
			if (this.exchangeRates) {
				const usd = this.exchangeRates.find(item => item.ccy === 'USD')
				return {
					ccy: usd.ccy,
					buy: parseFloat(usd.buy).toFixed(3),
					sale: parseFloat(usd.sale).toFixed(3)
				}
			} else {
				return {
					ccy: '---',
					buy: '00.000',
					sale: '00.000'
				}
			}
		},
		dark: {
            get() {
                return this.previewDarkMode
            },
            set(val) {
				this.previewDarkMode = val
				this.$store.commit(SET_DARK_MODE, val)
            }
        },
	},
	created() {
		this.initializeTime()
		this.preloadData()

		this.previewTheme = this.selectedTheme
		this.previewDarkMode = this.darkMode
	},
	methods: {
		async logout() {
			try {
				await this.$store.dispatch(LOGOUT)
			} catch (error) {
				//
			}
		},
		abbreviation(text) {
			return text.split(' ').map(word => word[0].toUpperCase()).reduce((acc, char) => (acc + char), '')
		},
		initializeTime() {
			const date = new Date()
			this.time = date.toLocaleTimeString().slice(0,5)
			
			const sync = 60000 - ( date.getSeconds() * 1000 + date.getMilliseconds() )

			let timeout = setTimeout(() => {
				this.time = new Date().toLocaleTimeString().slice(0,5)
				clearTimeout(timeout)
				timeout = setInterval(() => {
					this.time = new Date().toLocaleTimeString().slice(0,5)
				}, 1000 * 60)
			}, sync)
		},
		async preloadData() {
			try {
				let googelData
				if (this.user.google_id) {
					googelData = this.$store.dispatch(GET_GOOGLE_DATA, this.user.google_id)
				}
				const exchangeRates = this.$store.dispatch(EXCHANGE_RATES_REQUEST)

				await googelData
				await exchangeRates
			} catch (error) {
				//
			}
		},
		cancelTheme() {
			const theme = this.$storage.get('theme')
			const darkMode = this.$storage.get('dark')

			this.previewTheme = theme
			this.$store.commit(SELECT_THEME, theme)

			this.previewDarkMode = darkMode
			this.$store.commit(SET_DARK_MODE, darkMode)

			this.themeDialog = false
		},
		async saveTheme() {
			try {
				await this.$store.dispatch(UPDATE_USER, {
					id: this.user.id,
					userUpdate: {
						settings: {
							theme: this.previewTheme,
							dark: this.previewDarkMode
						}
					}
				})
				this.$storage.set('theme', this.previewTheme)
				this.$storage.set('dark', this.previewDarkMode)
				this.themeDialog = false
			} catch (error) {
				//
			}
		},
		selectTheme(n) {
			this.previewTheme = n
			this.$store.commit(SELECT_THEME, n)
		},
		async updateExchangeRates() {
			try {
				await this.$store.dispatch(EXCHANGE_RATES_REQUEST)
			} catch (error) {
				//
			}
		}
	}
}
</script>