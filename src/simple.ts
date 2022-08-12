import { State } from './state';
import { InitilizeOptions } from './types';

type GlobalDataValueType<T extends object> = { [K in keyof T]: State };

export class Simple<T extends object> {
	// internal data store object

	_data: GlobalDataValueType<T> | {} = {};
	private config: InitilizeOptions;

	constructor(defaultStructure?: { [K in keyof T]: any }, c?: InitilizeOptions) {
		this.bindToGlobal();

		// set the config if we have any config options
		if (!!Object.entries(c)?.length) {
			this.config = c;
		}

		// build the base structure
		for (let item of Object.entries(defaultStructure)) {
			const key = item[0];

			this._data[key] = new State(key);
			this._data[key].setValue(item[1]);
		}

		console.log(`Data object has been build ->`, this._data);
	}

	// These are only core testings
	test() {
		console.log('testings');
	}
	clear() {
		for (let item of Object.entries(this._data)) {
			this._data[item[0]] = new State(item[0]);
		}
	}
	// -- end

	core() {
		return this._data as GlobalDataValueType<T>;
	}

	private bindToGlobal() {
		if (!globalThis['__Simple__']) {
			globalThis['__Simple__'] = this;
		}
	}
}
