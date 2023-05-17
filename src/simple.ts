import { State } from './state';
import { ContainerController } from './container';
import { CoreTypeFlatValue, DataToKeysArray, DataType, InitilizeOptions, defaultStructIn } from './types';
import { StorageController } from './storage';
import { EventController, EventRegistry } from './events';


export class Simple<T extends object> {
	public containerController: ContainerController;
	public storage: StorageController<T>;
	public defaultStructure: Partial<CoreTypeFlatValue<T>>;
	public events: EventController<T>;

	// internal data store object
	public _data: DataType<T> = Object.create({});

	constructor(incomingStruct: defaultStructIn<T>, c?: InitilizeOptions) {
		this.bindToGlobal();

		// initialize container controller that handles the re renders for useSimple hook
		this.containerController = new ContainerController(this);
		this.storage = new StorageController(this, c?.storage);
		this.events = new EventController(this);

		// save the default structure as a flat map
		this.defaultStructure = Object.assign(incomingStruct, {});

		// build the base structure
		for (let item of Object.entries(incomingStruct)) {
			const key = item[0];
			const val = item[1];

			this._data[key] = new State(this, key, val);
			this._data[key].set(val);
		}
	}

	// Easy and a clean way to access the core object without any other function that comes with the instance
	public core() {
		return {
			...(this._data as { [K in keyof T]: State<T[K]> }),
			_events: this.events.eventsRegistryList as { [key: string]: EventRegistry },
		};
	}

	public reset() {
		for (const i of Object.entries(this._data)) {
			this._data[i[0]].reset();
		}
	}

	// Register the keys that will be persisted
	public persist(keys: DataToKeysArray<T>) {
		this.storage.persistence_keys = keys;

		// this will sync up the core with storage and reversed in order
		this.storage.initializeStorageWithCore();
	}

	// Bind the instance to the global window
	private bindToGlobal() {
		if (!globalThis['Simple_']) {
			globalThis['Simple_'] = this;
		}
	}
}
