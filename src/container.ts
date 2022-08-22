import { Simple } from './simple';
import { State } from './state';

export class ContainerComponent {
	public callback: Function;
	public state_key_name: string;

	constructor(state: State<any>, callback: Function) {
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
	}

	// Create subscription
	public subscribe(state: State<any>, callback: () => void) {
		const ContainerComponentInstance = new ContainerComponent(state, callback);

		this.keysList.add(ContainerComponentInstance);
		return ContainerComponentInstance;
	}

	// remove the subscription
	public removeSubscription(s: ContainerComponent) {
		this.keysList.delete(s);
	}

	// re render the component
	public triggerReRender(key?: string) {
		this.keysList.forEach((v) => {
			if (v.state_key_name === key) {
				v.callback();
			}
		});
	}
}
