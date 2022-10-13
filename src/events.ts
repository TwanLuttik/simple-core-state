import { Simple } from './simple';
import { EventMap } from './types';

export class Events<T extends Simple<T>> {
	private instance: Simple<any>;

	// List of the event listeners registered across the application
	public eventContainers: EventMap<T> = Object.create({});

	constructor(simpleInstance: Simple<any>) {
		this.instance = simpleInstance;
	}

	public register(names: string[]) {
		for (let name of names) {
			const eventContainerInstance = new EventContainer(this, name, () => {});
			this.eventContainers[name as typeof name] = eventContainerInstance;
		}
		return names;
	}

	public renderContainer(name: string, payload?: any) {
		Object.entries(this.eventContainers).forEach((e) => {
			if (e[1].eventName === name) {
				e[1].eventListeners.forEach((el) => {
					el(payload);
				});
			}
		});
	}

	public mappedEvents() {
		return this.eventContainers as typeof this.eventContainers;
	}
}

/**
 * @description Container that handles the re render for any state changes
 */
export class EventContainer {
	public eventInstance: Events<any>;
	public callback: Function;
	public eventName: string;

	public eventListeners = new Set<Function>();

	constructor(instance: Events<any>, eventName: string, callback: () => void) {
		this.eventInstance = instance;
		this.eventName = eventName;
		this.callback = callback;
	}

	public on(callback: (v: any) => void) {
		this.eventListeners.add(callback);
		this.callback = callback;
		return this;
	}

	public removeListener(containerInstance: EventContainer) {
		this.eventListeners.delete(containerInstance.callback);
	}

	public emit(payload: any) {
		// Render the container from its parent instance
		this.eventInstance.renderContainer(this.eventName, payload);
	}
}
