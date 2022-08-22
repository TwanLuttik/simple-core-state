import { SimpleInstance } from './instance';

export class State<valueType = any> {
	public _name: string;
	public _value: valueType = null;
	public _peristed: boolean = false;

	constructor(key: string) {
		this._name = key;
	}

	/**
	 * @description Update the value
	 * @param newValue
	 */
	public setValue(newValue: valueType) {
		this._value = newValue;

		// Check if we need to persist
		if (this._peristed) {
			SimpleInstance().storage.set(this._name, this._value);
		}

		SimpleInstance().containerController.triggerReRender(this._name);
	}

	/**
	 * @description Update a key in an object (only support for object)
	 * @param newValue
	 */
	public patchObject(newValue: Partial<{ [K in keyof valueType] }>) {
		// Check if the current value is an object
		if (typeof this._value !== 'object') {
			throw `Can't patch a non object key`;
		}

		// Check if the param is an object to patch the object with keys and values
		if (typeof newValue !== 'object') {
			throw 'No object has been supplied';
		}

		// loop trough the k/v to patch the keys in the object
		for (let k of Object.entries(newValue)) {
			if (this._value === null) {
				// TODO: Fix this typing
				// @ts-ignore
				this._value = { [k[0]]: k[1] };
			} else {
				this._value[k[0]] = k[1];
			}
		}

		// Check if we need to persist
		if (this._peristed) {
			SimpleInstance().storage.set(this._name, this._value);
		}

		SimpleInstance().containerController.triggerReRender(this._name);
	}
}
