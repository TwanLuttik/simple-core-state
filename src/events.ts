import { Simple } from './simple';
import { DataCallback, EventListRegistryType } from './types';
import { makeid } from './utils';

/**
 * This is the main controller that controls all the events and etc of the underlaying structure
 */
export class EventController<T> {
	eventsRegistryList: EventListRegistryType<T> = Object.create({});

	constructor(rootInstance: Simple<any>) {}

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
	instance: EventController<any>;
	eventName: string;

	public listeners: { [key: string]: EventRegistryListener } = Object.create({});

	constructor(instance: EventController<any>, registryName: string) {
		this.instance = instance;
		this.eventName = registryName;
	}

	// Create the istener and return
	public createListener(cb: (data: any) => void): string {
		const id = makeid(5);
		this.listeners[id] = new EventRegistryListener(cb);
		return id;
	}

	public removeListener(id: string) {
		delete this.listeners[id];
	}

	// Accept mutliple arguments for sending data
	public send(...args: any[]) {
		for (const listItem of Object.entries(this.listeners)) {
			// If there is only 1 argument we are not sending it as a array
			listItem[1].callback(args.length === 1 ? args[0] : args);
		}
	}
}

class EventRegistryListener {
	callback: DataCallback;

	constructor(cb: DataCallback) {
		this.callback = cb;
	}
}
