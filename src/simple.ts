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

	constructor(incomingStruct: defaultStructIn<T>, init_config?: InitilizeOptions) {
		this.bindToGlobal();

		// Initialize storage
		this.storage = new StorageController(this, init_config.storage);

		// initialize container controller that handles the re renders for useSimple hook
		this.containerController = new ContainerController(this);
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

	/**
	 * @description this will reset thw whole core to its default value('s)
	 * TODO: Figure out if we need to re-render every component by looping trough or there is a react batch call function?
	 */
	public reset() {
		for (const i of Object.entries(this._data)) {
			console.log('default value of data', this._data[i[0]]._default);

			this._data[i[0]]._value = this._data[i[0]]._default;
			this._data[i[0]].persistCheck();
		}

		// @ts-ignore
		console.log(Object.entries(this._data)[0][1]._name);
		// @ts-ignore
		this.containerController.triggerReRender(Object.entries(this._data)[0][1]._name);

		// for (const i of Object.entries(this._data)) {
		// 	this._data[i[0]]._value = this._data[i[0]]._default;
		// 	this.containerController.triggerReRender(this._data[i[0]]._name);
		// }
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
