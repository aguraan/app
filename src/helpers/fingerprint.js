import Fingerprint2 from 'fingerprintjs2'

const fingerprint = (resolve, reject) => {
    const options = {}
    Fingerprint2.getPromise(options)
        .then(components => {
            /* eslint-disable */
            // console.log({ components })
            const values = components.map(component => component.value )
            const murmur = Fingerprint2.x64hash128(values.join(''), 31)
            resolve(murmur)
        })
        .catch(error => {
            reject(error)
        })
}

export default () => new Promise((resolve, reject) => {

    if (window.requestIdleCallback) {
        requestIdleCallback(fingerprint.bind(null, resolve, reject))
    } else {
        setTimeout(fingerprint, 500, resolve, reject)
    }
})