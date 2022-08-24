import { Simple } from './simple';
import { DataType, StorageConfig } from './types';
import { BuildStorageObjectFromCustom } from './utils';

type DataToKeysArray<T> = (keyof DataType<T>)[];
type StorageObject<T> = { [K in keyof T]: K };

export class StorageController<T extends object> {
	public SimpleInstance: Simple<any>;
	public persistance: DataToKeysArray<T> | [] = [];
	public enalbed: boolean = false;
	public config: StorageConfig & { customEnabled: boolean } = { customEnabled: false };

	constructor(instance: Simple<any>, con?: StorageConfig) {
		this.SimpleInstance = instance;

		// If the get and set methods are supplied we are expecting we are not using LocalStorage anymore
		if (con && !!Object.keys(con?.custom)?.length) {
			let b = {
				customEnabled: true,
				custom: con.custom,
			};

			Object.assign(this.config, b);
		}
	}

	// register which keys need to be persisted
	public perist(keys: DataToKeysArray<T>) {
		this.persistance = keys;

		// this will sync up the core with storage and reversed in order
		this.initializeStorageWithCore();
	}

	private async initializeStorageWithCore() {
		const _storageObject = (
			this.config.customEnabled ? await BuildStorageObjectFromCustom(this.SimpleInstance._data, this) : window.localStorage
		) as StorageObject<T>;

		// Update the core from storage object
		for (let item of this.persistance) {
			this.SimpleInstance._data[item].setValue(_storageObject[item]);
			this.SimpleInstance._data[item]._peristed = true;

			// if storage object is null re instiate the core value to storage
			if (_storageObject[item] === null) {
				this.set(item as string, this.SimpleInstance._data[item]._value);
			}
		}
	}

	public async set(key: string, value: any): Promise<void> {
		if (this.config?.customEnabled) {
			await this.config.custom.set('_simple_' + key, JSON.stringify(value));
		} else {
			if (window?.localStorage) {
				localStorage.setItem('_simple_' + key, JSON.stringify(value));
			} else {
				throw 'Default storage instance not found';
			}
		}
	}

	public async get(key: string): Promise<any> {
		if (this.config?.customEnabled) {
			return JSON.parse(await this.config.custom.get('_simple_' + key));
		} else {
			if (window?.localStorage) {
				return JSON.parse(localStorage.getItem('_simple_' + key));
			} else {
				throw 'Default storage instance not found';
			}
		}
	}
}
