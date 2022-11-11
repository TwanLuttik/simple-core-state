import { Simple } from './simple';
import { DataCallback } from './types';
import { makeid } from './utils';

/**
 * This is the main controller that controls all the events and etc of the underlaying structure
 */
export class EventController {
	private rootInstance: Simple<any>;
	eventsRegistryList = Object.create({});

	constructor(rootInstance: Simple<any>) {
		this.rootInstance = rootInstance;
	}

	public create(names: string[]) {
		for (const item of names) {
			const eventInstance = new EventRegistry(this, item);
			this.eventsRegistryList[item] = eventInstance;
		}
	}
}

/**
 * This controls a event by name that will holds all of its registered listeners and etc
 */
export class EventRegistry {
	instance: EventController;
	eventName: string;

	public listeners: { [key: string]: EventRegistryListener } = Object.create({});

	constructor(instance: EventController, registryName: string) {
		this.instance = instance;
		this.eventName = registryName;
	}

	// Create the istener and return q
	public createListener(cb: (data: any) => void): string {
		const id = makeid(5);
		this.listeners[id] = new EventRegistryListener(cb);
		return id;
	}

	public removeListener(id: string) {
		delete this.listeners[id];
	}

	public send(data: any) {
		for (const listItem of Object.entries(this.listeners)) {
			listItem[1].callback(data);
		}
	}
}

class EventRegistryListener {
	callback: DataCallback;

	constructor(cb: DataCallback) {
		this.callback = cb;
	}
}
