import { Simple } from './simple';
import { StorageConfig } from './types';

export class StorageController<T extends object> {
	public SimpleInstance: Simple<any>;
	public persistance: (keyof T)[] = [];
	public enalbed: boolean = false;
	public config: StorageConfig & { customEnabled: boolean };

	constructor(instance: Simple<any>, con?: StorageConfig) {
		this.SimpleInstance = instance;

		// If the get and set methods are supplied we are expecting we are not using LocalStorage anymore
		if (con && !!Object.keys(con?.custom)?.length) {
			this.config.customEnabled = true;
			this.config.custom = con.custom;
		}
	}

	// register which keys need to be persisted
	public perist(keys: (keyof T)[]) {
		this.persistance = keys;

		// this will sync up the core with storage and reversed in order
		this.initializeStorageWithCore();
	}

	private initializeStorageWithCore() {
		let coreToStorageUpdate: string[] = [];

		// Check first if there is a localstorage value present to update the core
		// for loop every key in the root
		for (let item of Object.values(this.SimpleInstance._data)) {
			// check if the persistence includes the key name
			if ((this.persistance as string[]).includes(item._name)) {
				item._peristed = true;

				// Check if the key value is present in the local storage and update the core data
				const localstoragevalue = this.get(item._name);
				const dataValue = this.SimpleInstance._data[item._value];

				// If the key is not present in the storage, add to the list for update
				if (localStorage['_simple_' + item._name] === undefined) {
					coreToStorageUpdate.push(item._name);
				}

				// Check if the local storage is the same as the default key value
				else if (localstoragevalue !== dataValue) {
					item.setValue(localstoragevalue);
				}
			}
		}

		// Update the localstorage data from the list we got to update from the core data
		for (let item of this.persistance) {
			if (coreToStorageUpdate.includes(item as string)) {
				const keyName = item as string;
				this.set(keyName, this.SimpleInstance._data[keyName]._value);
			}
		}
	}

	public async set(key: string, value: any) {
		if (this.config?.customEnabled) {
			await this.config.custom.set('_simple_' + key, JSON.stringify(value));
		} else {
			localStorage.setItem('_simple_' + key, JSON.stringify(value));
		}
	}

	public async get(key: string) {
		if (this.config?.customEnabled) {
			return JSON.parse(await this.config.custom.get('_simple_' + key));
		} else {
			return JSON.parse(localStorage.getItem('_simple_' + key));
		}
	}
}
