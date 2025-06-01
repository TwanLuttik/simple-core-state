import { useState, useEffect } from 'react';
import { State } from './state';
import { SimpleInstance } from './instance';

type SimpleValue<T extends object, K extends keyof T> = State<T, K>;

export function useSimple<T extends object, K extends keyof T>(state: SimpleValue<T, K>) {
	const [_, set_] = useState({});

	useEffect(function () {
		const subContainerInstance = SimpleInstance().containerController.subscribe(state, () => {
			set_({});
		});

		return () => SimpleInstance().containerController.removeSubscription(subContainerInstance);
	}, []);

	return state._value as SimpleValue<T, K>['_value'];
}
