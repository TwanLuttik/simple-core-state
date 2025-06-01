import { Simple } from './simple';
import { State } from './state';

export class ContainerComponent {
	public callback: Function;
	public state_key_name: string;

	constructor(state: State<any, any>, callback: Function) {
		this.state_key_name = state._name as string;
		this.callback = callback;
	}
}

export class ContainerController<T extends object> {
	public SimpleInstance: Simple<T>;

	// list of subscription
	public keysList = new Set<ContainerComponent>();

	constructor(instance: Simple<T>) {
		this.SimpleInstance = instance;
	}

	// Create subscription
	public subscribe<K extends keyof T>(state: State<T, K>, callback: () => void) {
		const ContainerComponentInstance = new ContainerComponent(state, callback);

		this.keysList.add(ContainerComponentInstance);
		return ContainerComponentInstance;
	}

	// remove the subscription
	public removeSubscription(s: ContainerComponent) {
		this.keysList.delete(s);
	}

	// re render the component
	public triggerReRender(key?: keyof T) {
		this.keysList.forEach((v) => {
			if (key === undefined || v.state_key_name === key) {
				v.callback();
			}
		});
	}
}
