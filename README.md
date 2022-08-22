# Simple Core State

**This library is only for React / React Native**

_This Library is still work in progress_

<br>
<br>

## **Setting up the core**

```ts
// We can supply the the lib with an interface so we can control how the data can be handled
interface ICoreType {
	account: { email: string; id: string } | null;
	currentTheme: 'light' | 'dark';
	lastUpdate: number | null;
}

const defaultCore = {
	account: null,
	currentTheme: 'light',
	lastUpdate: 1,
};

// Initialize the core
export const stateManager = new SimpleCore<ICoreType>(defaultCore, {
	// we can pass in a custom storage library such (You don't need to JSON.stringify or parse is, we already do that for you)
	Storage: {
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
stateManager.storage.perist(['currentTheme', 'lastUpdate']);

// Export the core for easy access to hooks and updates and etc
export const core = stateManager.core();

// Set a value
core.currentTheme.setValue('dark');

// Update a key from an object
core.account.patch({ id: '37a7ce20-7250-4a40-b683-3cb0a848c2b9' });
```

<br>
<br>

### **Using the hook**

```jsx
import * as React from 'react';
import { core } from './somefile';

export const App = () => {
	const theme = useSimple(core.currentTheme);

	return (
		<div>
			<p>{theme}</p>
		</div>
	);
};
```
