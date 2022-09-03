import { State } from './state';
import { ContainerController } from './container';
import { CoreTypeFlatValue, DataToKeysArray, DataType, InitilizeOptions } from './types';
import { StorageController } from './storage';

export class Simple<T extends object> {
	public containerController: ContainerController;
	public storage: StorageController<T>;
	public defaultStructure: CoreTypeFlatValue<T>;
	// internal data store object
	public _data: DataType<T> = Object.create({});

	constructor(defaultStructure: { [K in keyof T]: any }, c?: InitilizeOptions) {
		this.bindToGlobal();

		// initialize container controller that handles the re renders for useSimple hook
		this.containerController = new ContainerController(this);
		this.storage = new StorageController(this, c?.storage);

		// save the default structure as a flat map
		this.defaultStructure = defaultStructure;

		// build the base structure
		for (let item of Object.entries(defaultStructure)) {
			const key = item[0];

			this._data[key] = new State(key);
			this._data[key].set(item[1]);
		}
	}

	// Easy and a clean way to access the core object without any other function that comes with the instance
	public core() {
		return this._data as { [K in keyof T]: State<T[K]> };
	}

	// Register the keys that will be persisted
	public persist(keys: DataToKeysArray<T>) {
		this.storage.persistance = keys;

		// this will sync up the core with storage and reversed in order
		this.storage.initializeStorageWithCore();
	}

	// Bind the instance to the global window
	private bindToGlobal() {
		if (!globalThis['__Simple__']) {
			globalThis['__Simple__'] = this;
		}
	}
}
