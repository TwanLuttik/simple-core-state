import { Simple } from './simple';

export class State<valueType = any> {
	private instance: Simple<any>;
	public _name: string;
	public _value: valueType = undefined;
	public _peristed: boolean = false;
	public _default: valueType;
	public _history: { date: Date; value: valueType }[] = [];

	constructor(instance: Simple<any>, key: string, value: any) {
		this.instance = instance;
		this._name = key;
		this._default = value;
	}

	/**
	 * @description Update the value
	 * @param newValue
	 */

	public set(newValue: valueType | ((oldState: valueType) => valueType)) {
		// Check for a callback set state
		if (typeof newValue === 'function') {
			this._history.push({ value: this._value, date: new Date() });
			// @ts-ignore TODO: FIX THIS TYPING
			this._value = newValue(this._value);
		} else {
			this._history.push({ value: this._value, date: new Date() });
			this._value = newValue;
		}

		// Check if we need to persist
		this.persistCheck();

		this.instance.containerController.triggerReRender(this._name);
	}

	/**
	 * @description Update a key in an object (only support for object)
	 * @param newValue
	 */
	public patch(newValue: Partial<{ [K in keyof valueType]: valueType[K] }>) {
		if (!Object.entries(newValue).length) throw 'no changes detected';

		// Check if the current value is an object
		if (typeof this._value !== 'object') {
			this._value = Object.assign({});
			// throw `Can't patch a non object key`;
		}

		// Check if the param is an object to patch the object with keys and values
		if (typeof newValue !== 'object') {
			throw 'No object has been supplied';
		}

		this._history.push({ value: this._value, date: new Date() });

		// loop trough the k/v to patch the keys in the object
		for (const k of Object.entries(newValue)) {
			if (this._value === null) {
				const x = { [k[0]]: k[1] } as any;
				this._value = x;
			} else {
				this._value[k[0]] = k[1];
			}
		}

		// Check if we need to persist
		this.persistCheck();

		this.instance.containerController.triggerReRender(this._name);
	}

	public updatePiece<T extends keyof valueType, X extends valueType>(key: T, value: Partial<X[T]>) {
		// check if its a object
		if (typeof this._value !== 'object') throw 'Object type required';

		this._history.push({ value: this._value, date: new Date() });

		// Update only the key of that part
		this._value = { ...this._value, [key]: value };

		// Update the subsribers of app_state
		this.persistCheck();

		this.instance.containerController.triggerReRender(this._name);
	}

	/**
	 * @description This will revert the state to its previous value if it has a history
	 */
	public revert() {
		// Check if there is an history avaiable
		if (!!this._history?.length) {
			// Take the last pushed item and set the value
			this._value = this._history[this._history.length - 1].value;

			// Remove the value from its array
			this._history = [...this._history.splice(0, this._history.length - 1)];

			// Check if we need to persist
			this.persistCheck();

			this.instance.containerController.triggerReRender(this._name);
			return true;
		}
		return false;
	}

	/**
	 * @description Reset the state to its original value defined by the core
	 */
	public reset() {
		// Get the default value from the default struct of the instance
		this._value = this._default;

		// Check if we need to persist
		this.persistCheck();

		this.instance.containerController.triggerReRender(this._name);
	}

	private persistCheck() {
		if (this._peristed) {
			this.instance.storage.set(this._name, this._value);
		}
	}
}
