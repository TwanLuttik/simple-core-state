import { useState } from 'react';
import { SimpleInstance } from './instance';
import { Simple } from './simple';

export class State {
	public _name: string;
	public _value: any;
	public _peristed: boolean = false;

	constructor(key: string) {
		this._name = key;
	}

	public setValue(newValue: any) {
		this._value = newValue;

		// Check if we need to persist
		if (this._peristed) {
			SimpleInstance().storage.set(this._name, this._value);
		}

		SimpleInstance().containerController.triggerReRender(this._name);
	}
}
