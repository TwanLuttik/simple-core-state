# Simple Core State

_This Library is still work in progress_

<br>

## **Inspiration**

The inspiration came from using using [pulseJS](https://github.com/pulse-framework/pulse), but since that its not maintained anymore and i wanted to create a simple core state library that is easy to use and expand, i have created **Simple Core State** which the name already says **simple**.

<br>

## **Installation**

```
yarn add simple-core-state
```

<br>
<br>

## **Setting up the core**

```ts
import { SimpleCore } from 'simple-core-state';

// We can supply the the lib with an interface so we can control how the data can be handled
interface ICoreType {
	account: { email: string; id: string } | null;
	currentTheme: 'light' | 'dark';
	lastUpdate: number | null;
	app: {
		running: boolean;
		run_time: number;
	};
}

const defaultCore = {
	account: null,
	currentTheme: 'light',
	lastUpdate: 1,
	app: {
		running: false,
		run_time: 453543543,
	},
};

// Initialize the core
export const instance = new SimpleCore<ICoreType>(defaultCore, {
	// Storage configurations
	storage: {
		// You can se a custom prefix for the storage, the default is ['_simple' + _keyname]
		prefix: 'customPrefix',

		// Support other storage library's for such cases as for React Native
		custom: {
			async get(key) {
				return await AnotherStorageLib.get(key);
			},
			async set(key, value) {
				return await AnotherStorageLib.set(key, value);
			},
		},
	},
});

// Persist values by an array with keys
instance.perist(['currentTheme', 'lastUpdate']);

// Export the core for easy access to hooks and updates and etc
export const core = instance.core();

// Receive the event
core._events.custom_event.on((data) => {});

// Set a value
core.currentTheme.set('dark');

// Reset the value to its original state as its default core
core.currentTheme.reset();

// Update a key from an object
core.account.patch({ id: '37a7ce20-7250-4a40-b683-3cb0a848c2b9' });

// Update a key of the object from its value itself
core.app.updatePiece('running', true);
```

<br>
<br>

## **Using the hook**

```jsx
import * as React from 'react';
import { useSimple } from 'simple-core-state';
import { core } from './somefile';

export const App = () => {
	const theme = useSimple(core.currentTheme);

	return (
		<div>
			// Display the value
			<p>{theme}</p>
			// Update the value
			<button onClick={() => core.currentTheme.set('light')}>Update</button>
		</div>
	);
};
```

<br/>
<br/>

# Events _(🚧 under development)_

<br/>

1. Create your event name

```ts
const instance = new Simple(...);

instance.events.create(['someName', 'multiple_events']);
```

<br/>

2.  Create the listener

```tsx
import React from 'react';
import { myCore } from './core.ts';
import { useSimpleEvent } from 'simple-core-state';

export const App = () => {
	useSimpleEvent(core._events.test, (e) => {
		// You're logic here
	});

	return <div></div>;
};
```

<br />

3. Sending Data

```ts
// Supports sending multiple arguments
core._events.test.send('some value');
```
