import Vue from 'vue'

class Storage {

    constructor(preset = {}) {
        this._prefix = preset.prefix || 'app_'
        this.types = ['local', 'session']
        this.defaultType = 'local'
        this.local = window.localStorage
        this.session = window.sessionStorage
        if (typeof this._prefix !== 'string') throw new Error('Storage Error. "prefix" must be a string.')
    }

    prefix(key) {
        return this._prefix + key
    }

    setDefaultStorageType(type) {
        if (this.types.includes(type)) {
            this.defaultType = type
        }
    }
    
    set(key, value, storageType) {
        const serialized = JSON.stringify(value)
        let type = this.defaultType

        if (this.types.includes(storageType)) {
            type = storageType 
        }
        
        return this[type].setItem(this.prefix(key), serialized)
    }

    get(key, storageType) {
        let type = this.defaultType

        if (this.types.includes(storageType)) {
            type = storageType
        }

        const value = this[type].getItem(this.prefix(key))
        if (value != null) {
            try {
                const parsed = JSON.parse(value)
                return parsed
            } catch (error) {
                this[type].removeItem(this.prefix(key))
            }
        }
        return null
    }

    remove(key, storageType) {
        let type = this.defaultType

        if (this.types.includes(storageType)) {
            type = storageType
        }
        return this[type].removeItem(this.prefix(key))
    }

    key(index, storageType) {
        let type = this.defaultType

        if (this.types.includes(storageType)) {
            type = storageType
        }
        return this[type].key(index)
    }

    clear(storageType) {
        let type = this.defaultType
        if (this.types.includes(storageType)) {
            type = storageType
        }
        return this[type].clear()
    }
}

function install(Vue) {
    if (install.installed) return;
    install.installed = true

    if (Vue.$_storage_installed) return;
    Vue.$_storage_installed = true;
    Vue.mixin({
        beforeCreate() {
            const options = this.$options

            if (options.storage) {
                this.$storage = Vue.observable(options.storage)
            } else {
                this.$storage = options.parent && options.parent.$storage || this
            }
        }

    })
}

Storage.install = install;
Storage.installed = false;

Vue.use(Storage)

export default new Storage()