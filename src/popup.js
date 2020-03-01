import { isJSON } from '@/helpers'
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill'

const serializeProps = props => Object.entries(props).map( prop => `${ prop[0] }=${ prop[1]}`).join(',')
/* eslint-disable */
const popup = {
	window: null,
	previousUrl: null,
	es: null,
	timer: null,

	_windowProps: {
		resizable: 'no',
		toolbar: 'no',
		menubar: 'no'
	},

	get windowProps() {
		const providers = {
			google: { width: 452, height: 633 },
			facebook: { width: 580, height: 400 },
			instagram: { width: 700, height: 500 },
			undefined: {}
		}

		for (let provider in providers) {
			providers[provider] = serializeProps({
				...providers[provider],
				...this._windowProps
			})
		}

		return providers
	},

	defaults: {
		baseUrl: window.location.origin,
		esUrl: '/stream'
	},

	url(path) {
		return new URL(path, this.defaults.baseUrl).href
	},

	get esUrl() {
		return new URL(this.defaults.esUrl, this.defaults.baseUrl).href
	},

	createEventSource(cb) {
		const EventSource = NativeEventSource || EventSourcePolyfill
		this.es = new EventSource(this.esUrl)
		this.es.onopen = event => {
			cb(null, event)
		}
		this.es.onerror = cb
	},

	open(path, provider) {
		const url = this.url(path)

		return new Promise((resolve, reject) => {

			this.createEventSource(err => {
				if (err) {
					this.es.close()
					return reject({ message: 'Event Source Error'})
				}
				if (this.window === null || this.window.closed) {
					this.window = window.open(url, provider, this.windowProps[provider])
				} else if (this.previousUrl !== url) {
					this.window = window.open(url, provider, this.windowProps[provider])
					this.window.focus()
				} else {
					this.window.focus()
				}
				this.previousUrl = url

				this.timer = window.setInterval(() => {
					if (this.window && this.window.closed) {
						window.clearInterval(this.timer)
						this.window = null
						this.es = null
						this.timer = null
						reject({ message: 'Popup Closed'})
					} else {

					}
				}, 500)
			})


			this.es.addEventListener('authResolve', ({ data }) => {
				if (isJSON(data)) {
					resolve({ data: JSON.parse(data) })
				} else {
					resolve({ data })
				}
			})
			this.es.addEventListener('authReject', ({ data }) => {
				if (isJSON(data)) {
					reject(JSON.parse(data))
				} else {
					reject(data)
				}
			})
		})
	},
	close () {
		if (this.window && !this.window.closed) {
			this.window.close()
			this.es.close()
			this.es = null
		}
	}
}

export default popup
