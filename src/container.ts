import { Simple } from './simple';
import { State } from './state';

export class ContainerComponent {
	public callback: Function;
	public state_key_name: string;

	constructor(state: State, callback: Function) {
		this.state_key_name = state._name;
		this.callback = callback;
	}
}

export class ContainerController {
	public SimpleInstance: Simple<any>;

	// list of subscription
	public keysList = new Set<ContainerComponent>();

	constructor(instance: Simple<any>) {
		this.SimpleInstance = instance;
		console.log('SubController', instance);
	}

	//
	public subscribe(state: State, callback: () => void) {
		console.log(`adding [${state._name}] subscription to container controller`);

		const ContainerComponentInstance = new ContainerComponent(state, callback);

		this.keysList.add(ContainerComponentInstance);
		return ContainerComponentInstance;
	}

	public removeSubscription(s: ContainerComponent) {
		this.keysList.delete(s);
	}

	//
	public triggerReRender(key?: string) {
		console.log('triggering reRender');

		this.keysList.forEach((v) => {
			if (v.state_key_name === key) {
				v.callback();
			}
		});
		// if (this.keysList.has(key)) {
		// }
	}
}
