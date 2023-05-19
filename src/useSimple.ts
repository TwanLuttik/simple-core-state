import { useState, useEffect } from 'react';
import { State } from './state';
import { SimpleInstance } from './instance';

type SimpleValue<T> = State<T>;

export function useSimple<T>(state: SimpleValue<T>) {
	const [_, set_] = useState({});

	useEffect(function () {
		const subContainerInstance = SimpleInstance().containerController.subscribe(state, () => {
			set_({});
		});

		return () => SimpleInstance().containerController.removeSubscription(subContainerInstance);
	}, []);

	return state._value as SimpleValue<T>['_value'];
}
