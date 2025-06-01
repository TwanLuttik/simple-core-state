import { Simple } from './simple';
import { DataToKeysArray, StorageConfig, StorageObject } from './types';
import { BuildStorageObjectFromCustom, parseWindowLocalStorageToMap } from './utils';

export class StorageController<T extends object> {
	public simpleInstance: Simple<any>;
	public persistence_keys: DataToKeysArray<T> | [] = [];
	public enabled: boolean = false;
	public config: StorageConfig & { customEnabled: boolean } = { customEnabled: false };
	public _prefixKey = '_simple_';

	constructor(instance: Simple<any>, con?: StorageConfig) {
		this.simpleInstance = instance;

		// Set the custom prefix
		if (con?.prefix) this._prefixKey = con.prefix;

		// If the get and set methods are supplied we are expecting we are not using LocalStorage anymore
		if (con?.custom) {
			Object.assign(this.config, {
				customEnabled: true,
				custom: con.custom,
			});
		}
	}

	/**
	 * @description Update the core from the storage assigned by a list of keys
	 */
	public async initializeStorageWithCore() {
		try {
			const _storageObject = (
				this.config.customEnabled
					? await BuildStorageObjectFromCustom(this.simpleInstance._data, this)
					: parseWindowLocalStorageToMap(this.simpleInstance._data)
			) as StorageObject<T>;

			const persistendItemsKeys = Object.entries(this.simpleInstance._data).filter((x) => !!this.persistence_keys.includes(x[1]._name as never));

			// go trough the core
			for (let item of persistendItemsKeys) {
				const coreKeyName = item[0] as never;
				const storageKeyValue = _storageObject[coreKeyName];

				// Check if we a re persisting the key name
				if (this.persistence_keys.includes(coreKeyName)) {
					// Tell the state that this is a persited value
					this.simpleInstance._data[coreKeyName]._peristed = true;

					// we need to update the key from the core with the storage object
					// Check if the storage object key is null
					if (storageKeyValue === undefined || storageKeyValue === null) {
						this.set(coreKeyName, item[1]._value);
					} else {
						this.simpleInstance._data[coreKeyName].set(storageKeyValue);
					}
				}
			}
		} catch (error) {
			console.error('failed to initalize storage with core');
		}
	}

	public async set(key: string, value: any) {
		if (this.config?.customEnabled) {
			await this.config.custom.set(this._prefixKey + key, JSON.stringify(value));
		} else {
			// Check if we're in a browser environment
			if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
				return; // Skip localStorage operations when not in browser
			}

			if (value === undefined) value = null;
			localStorage.setItem(this._prefixKey + key, JSON.stringify(value));
		}
	}

	public async get(key: string): Promise<any> {
		if (this.config?.customEnabled) {
			return JSON.parse(await this.config.custom.get(this._prefixKey + key));
		} else {
			// Check if we're in a browser environment
			if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
				return null; // Return null when localStorage is not available
			}

			const item = localStorage.getItem(this._prefixKey + key);
			return item ? JSON.parse(item) : null;
		}
	}
}
