export const isJSON = val => {
	try {
		JSON.parse(val)
	} catch (error) {
		return false
	}
	return true
}
export const extractPayload = token => {
	if (typeof token !== 'string') throw new Error('Extract Payload Error. Token must be a string.')
	const splited = token.split('.')
	if (splited.length !== 3) throw new Error('Extract Payload Error. Invalid Token.')
	const payload = atob(splited[1])
	try {
		const parsed = JSON.parse(payload)
		return parsed
	} catch (error) {
		throw new Error(error)
	}
}
