import { State } from './state';
import React from 'react';
import { SimpleInstance } from './instance';

globalThis.React1 = React;

export function useSimple(state: State) {
	// This is a trigger state used to force the component to re-render
	const [_, set_] = React.useState({});

	React.useEffect(function () {
		console.log('registering useSimple() hook sub');

		const subContainerInstance = SimpleInstance().containerController.subscribe(state, () => {
			console.log('useSimple Update');

			set_({});
		});
		// // Create a callback base subscription, Callback invokes re-render Trigger
		// const subscriptionContainer = pulseInstance?.subController.subscribeWithSubsArray(() => {
		//   set_({});
		// }, depsArray);

		return () => SimpleInstance().containerController.removeSubscription(subContainerInstance);
		// // Unsubscribe on Unmount
		// return () => pulseInstance?.subController.unsubscribe(subscriptionContainer);
	}, []);

	return [state._value];
}
