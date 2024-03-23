import { Simple } from './simple';
import { DataToKeysArray, DataType, StorageConfig, StorageObject } from './types';
import { BuildStorageObjectFromCustom, parseWindowLocalStorageToMap } from './utils';

export class StorageController<T extends object> {
	public simpleInstance: Simple<any>;
	public persistence_keys: DataToKeysArray<T> | [] = [];
	public enabled: boolean = false;
	public config: StorageConfig & { customEnabled: boolean } = { customEnabled: false };
	public _prefixKey = '_simple_';

	constructor(instance: Simple<any>, input_config?: StorageConfig) {
		this.simpleInstance = instance;

		// Set the custom prefix
		if (input_config?.prefix) this._prefixKey = input_config.prefix;

		// If the get and set methods are supplied we are expecting we are not using LocalStorage anymore
		if (input_config?.custom) {
			Object.assign(this.config, {
				customEnabled: true,
				custom: input_config.custom,
			});
		}
	}

	/**
	 * @description Update the core from the storage assigned by a list of keys
	 */
	public async initializeStorageWithCore() {
		console.log('dd', this.simpleInstance._data);

		const coreData = Object.entries(this.simpleInstance._data)
			.filter((x) => !!this.persistence_keys.includes(x[1]._name as never))
			.reduce((accum, [k, v]) => {
				accum[k] = v;
				return accum;
			}, {}) as DataType<any>;

		const storageData = (
			this.config.customEnabled ? await BuildStorageObjectFromCustom(coreData, this) : parseWindowLocalStorageToMap(coreData)
		) as StorageObject<T>;

		const persistendItemsKeys = Object.entries(coreData);

		// go trough the core
		for (let item of persistendItemsKeys) {
			const coreKeyName = item[0] as never;
			const storageKeyValue = storageData[coreKeyName];

			// Check if we a re persisting the key name
			if (this.persistence_keys.includes(coreKeyName)) {
				// Tell the state that this is a persited value
				this.simpleInstance._data[coreKeyName]._persist = true;

				// we need to update the key from the core with the storage object
				// Check if the storage object key is null
				if (storageKeyValue === undefined || storageKeyValue === null) {
					console.log('xx', item[1]._value);
					this.set(coreKeyName, item[1]._value);
				} else {
					// this.simpleInstance._data[coreKeyName]._value = storageKeyValue;
					this.simpleInstance._data[coreKeyName].set(storageKeyValue);
				}
			}
		}
	}

	public async set(key: string, value: any): Promise<void> {
		if (this.config?.customEnabled) {
			await this.config.custom.set(this._prefixKey + key, JSON.stringify(value));
		} else {
			if (window?.localStorage) {
				if (value === undefined) value = null;
				localStorage.setItem(this._prefixKey + key, JSON.stringify(value));
			} else {
				throw 'Default storage instance not found';
			}
		}
	}

	public async get(key: string): Promise<any> {
		if (this.config?.customEnabled) {
			return JSON.parse(await this.config.custom.get(this._prefixKey + key));
		} else {
			if (window?.localStorage) {
				return JSON.parse(localStorage.getItem(this._prefixKey + key));
			} else {
				throw 'Default storage instance not found';
			}
		}
	}
}
