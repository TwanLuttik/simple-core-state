import { useState } from 'react';
import { SimpleInstance } from './instance';
import { Simple } from './simple';

export class State {
	public _name: string;
	public _value: any;

	constructor(key: string) {
		this._name = key;
	}

	public setValue(newValue: any) {
		this._value = newValue;
		SimpleInstance().containerController.triggerReRender(this._name);
	}

	persist() {}
}
