import { State } from './state';
import { ContainerController } from './container';
import { InitilizeOptions } from './types';

type GlobalDataValueType = { [key: string]: any };
type SimpleClassParams = ConstructorParameters<typeof Simple>;
type SimpleClassFirstParam = SimpleClassParams['0'];

export class Simple<T extends object> {
	public containerController: ContainerController;
	// internal data store object

	public _data: { [K in keyof T]: State } | {} = {};

	// public _data: GlobalDataValueType<{ [key: string]: any }> | {} = {};
	private config: InitilizeOptions;

	constructor(defaultStructure: { [K in keyof T]: any }, c?: InitilizeOptions) {
		// initialize container controller that handles the re renders for useSimple hook
		this.containerController = new ContainerController(this);
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
		return this._data as { [K in keyof T]: State };
	}

	private bindToGlobal() {
		if (!globalThis['__Simple__']) {
			globalThis['__Simple__'] = this;
		}
	}
}
