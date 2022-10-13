import React, { ClassAttributes } from 'react';
import { EventContainer, Events } from './events';
import { SimpleInstance } from './instance';
import { Simple } from './simple';

export const useSimpleEvent = (eventInstance: EventContainer, callback: (data: any) => void) => {
	const [_, set_] = React.useState({});

	// Check for string param
	if (typeof eventInstance === 'string') {
		const instanceByName = SimpleInstance().events.eventContainers[eventInstance] as EventContainer;

		// Check for null if instance is not found
		if (instanceByName == null) {
			throw 'Something went wrong and the event container has not been found by name';
		}

		// re assign the param value to the instance
		eventInstance = instanceByName;
	}

	React.useEffect(() => {
		const subContainerInstance = (eventInstance as EventContainer).on((e) => {
			callback(e);
			set_({});
		});

		return () => (eventInstance as EventContainer).removeListener(subContainerInstance);
	}, []);
};
