import { State } from './state';
import { ContainerController } from './container';
import { CoreTypeFlatValue, DataToKeysArray, DataType, defaultStructIn, InitializeOptions } from './types';
import { StorageController } from './storage';
import { EventController, EventRegistry } from './events';

export class Simple<T extends object> {
	public containerController: ContainerController<T>;
	public storage: StorageController<T>;
	public defaultStructure: Partial<CoreTypeFlatValue<T>>;
	public events: EventController<T>;

	// internal data store object
	public _data: DataType<T> = Object.create({});

	constructor(incomingStruct: defaultStructIn<T>, c?: InitializeOptions<T>) {
		this.bindToGlobal();

		// initialize container controller that handles the re renders for useSimple hook
		this.containerController = new ContainerController(this);
		this.storage = new StorageController(this, c?.storage);
		this.events = new EventController(this);

		// If persist keys are provided in options, set them
		if (c?.persist) {
			this.storage.persistence_keys = c.persist;
		}

		// save the default structure as a flat map
		this.defaultStructure = Object.assign(incomingStruct, {});

		// build the base structure
		for (let item of Object.entries(incomingStruct)) {
			const key = item[0] as keyof T;
			const val = item[1] as T[keyof T];

			this._data[key] = new State(this, key, val);

			// Check if this key is persisted and has a stored value
			// Use 'as any' to bypass type checking since persistence_keys has a typing issue
			const persistedValue = (this.storage.persistence_keys as Array<keyof T>).includes(key) ? this.storage.get(key.toString()) : null;
			persistedValue.then((x) => {
				// Initialize with persisted value if it exists, otherwise use default value
				// Use _value directly to avoid triggering updates during initialization
				const xv = x !== null ? (x as T[keyof T]) : val;
				this._data[key]._value = xv;
			});

			// (most likely not needed) Trigger the re render for the components that are using this state
			// this.containerController.triggerReRender(key);
		}
	}

	// Easy and a clean way to access the core object without any other function that comes with the instance
	public core() {
		return {
			...(this._data as { [K in keyof T]: State<T, K> }),
			_events: this.events.eventsRegistryList as { [key: string]: EventRegistry },
		};
	}

	/**
	 * @description this will reset thw whole core to its default value('s)
	 * TODO: Figure out if we need to re-render every component by looping trough or there is a react batch call function?
	 */
	public reset() {
		for (const i of Object.entries(this._data)) {
			this._data[i[0]]._value = this._data[i[0]]._default;
			this._data[i[0]].persistCheck();
		}

		for (const i of Object.entries(this._data)) {
			this._data[i[0]]._value = this._data[i[0]]._default;
			this.containerController.triggerReRender(this._data[i[0]]._name);
		}
	}

	// Register the keys that will be persisted
	/**
	 * @deprecated use the storage controller instead
	 * @param keys
	 */
	public persist(keys: DataToKeysArray<T>) {
		this.storage.persistence_keys = keys;

		// this will sync up the core with storage and reversed in order
		// this.storage.initializeStorageWithCore();
	}

	// Bind the instance to the global window
	private bindToGlobal() {
		if (!globalThis['Simple_']) {
			globalThis['Simple_'] = this;
		}
	}
}
