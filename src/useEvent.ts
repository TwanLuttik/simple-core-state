import { useEffect, useState } from 'react';
import { EventRegistry } from './events';

export const useSimpleEvent = (eventInstance: EventRegistry, callback: (data: any) => void) => {
	const [_, set_] = useState({});

	useEffect(() => {
		// Listen to event and use the instance to remove the listener on destory
		const el = eventInstance.createListener((e) => {
			callback(e);
			set_({});
		});

		return () => eventInstance.removeListener(el);
	}, []);
};
