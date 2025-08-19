import { Simple } from './simple';

export class State<T extends object, K extends keyof T> {
	private instance: Simple<T>;
	public _name: K;
	public _value: T[K];
	public _peristed: boolean = false;
	public _default: T[K];
	public _history: { date: number; value: T[K] }[] = [];

	constructor(instance: Simple<T>, key: K, value: T[K]) {
		this.instance = instance;
		this._name = key;
		this._default = value;
		this._value = value;
	}

	/**
	 * @description Update the value
	 * @param newValue
	 */
	public set(newValue: T[K] | ((oldState: T[K]) => T[K])) {
		// Check for a callback set state
		if (typeof newValue === 'function') {
			this._history.push({ value: this._value, date: new Date().getTime() });
			this._value = (newValue as (oldState: T[K]) => T[K])(this._value);
		} else {
			this._history.push({ value: this._value, date: new Date().getTime() });
			this._value = newValue;
		}

		// Check if we need to persist this value
		this.persistCheck();

		// Trigger the re render for the components that are using this state
		this.instance.containerController.triggerReRender(this._name);
	}

	/**
	 * @description Update a key in an object (only support for object)
	 * @param newValue
	 */
	public patchObject(newValue: Partial<T[K]>) {
		if (!Object.entries(newValue).length) throw 'no changes detected';

		// Check if the current value is an object
		if (typeof this._value !== 'object') {
			// initialize as an empty object of the correct shape
			this._value = {} as unknown as T[K];
			// throw `Can't patch a non object key`;
		}

		// Check if the param is an object to patch the object with keys and values
		if (typeof newValue !== 'object') {
			throw 'No object has been supplied';
		}

		this._history.push({ value: this._value, date: new Date().getTime() });

		// loop through the k/v to patch the keys in the object with proper typing
		for (const key in newValue) {
			if (Object.prototype.hasOwnProperty.call(newValue, key)) {
				const k = key as keyof T[K];
				const v = newValue[k] as T[K][typeof k];
				if (this._value === null || typeof this._value !== 'object') {
					this._value = { [k]: v } as unknown as T[K];
				} else {
					(this._value as Record<keyof T[K], unknown>)[k] = v as unknown as T[K][typeof k];
				}
			}
		}

		// Check if we need to persist
		this.persistCheck();

		// Trigger the re render for the components that are using this state
		this.instance.containerController.triggerReRender(this._name);
	}

	public updatePiece<P extends keyof T[K]>(key: P, value: Partial<T[K][P]>) {
		// check if its a object
		if (typeof this._value !== 'object') throw 'Object type required';

		this._history.push({ value: this._value, date: new Date().getTime() });

		// Update only the key of that part
		this._value = { ...this._value, [key]: value };

		// Update the subsribers of app_state
		this.persistCheck();

		// Trigger the re render for the components that are using this state
		this.instance.containerController.triggerReRender(this._name);
	}

	/**
	 * @description This will revert the state to its previous value if it has a history
	 */
	public revert() {
		if (this._history.length > 0) {
			const lastItem = this._history[this._history.length - 1];
			this._value = lastItem.value;
			this._history.pop();

			// Trigger the re render for the components that are using this state
			this.instance.containerController.triggerReRender(this._name);
		}
	}

	/**
	 * @description Reset the state to its original value defined by the core
	 */
	public reset() {
		this._value = this._default;
		this._history = [];

		this.persistCheck();

		// Trigger the re render for the components that are using this state
		this.instance.containerController.triggerReRender(this._name);
	}

	private persistCheck() {
		if ((this.instance.storage.persistence_keys as any).includes(this._name)) {
			this.instance.storage.set(this._name as string, this._value);
		}
	}
}
