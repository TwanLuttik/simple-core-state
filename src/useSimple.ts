import { State } from './state';
import { SimpleInstance } from './instance';
import React from 'react';

export function useSimple(state: State) {
	const [_, set_] = React.useState({});

	React.useEffect(function () {
		const subContainerInstance = SimpleInstance().containerController.subscribe(state, () => {
			set_({});
		});

		return () => SimpleInstance().containerController.removeSubscription(subContainerInstance);
	}, []);

	return state._value;
}
