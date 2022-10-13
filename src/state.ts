import { Simple } from './simple';

export class State<valueType = any> {
	private instance: Simple<any>;
	public _name: string;
	public _value: valueType = undefined;
	public _peristed: boolean = false;
	public _default: valueType;

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
			// @ts-ignore TODO: FIX THIS TYPING
			this._value = newValue(this._value);
		} else {
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
	public patchObject(newValue: Partial<{ [K in keyof valueType]: valueType[K] }>) {
		// Check if the current value is an object
		if (typeof this._value !== 'object') {
			throw `Can't patch a non object key`;
		}

		// Check if the param is an object to patch the object with keys and values
		if (typeof newValue !== 'object') {
			throw 'No object has been supplied';
		}

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
