# Simple Core State

_This Library is still work in progress_

<br>
<br>

## **Setting up the core**

```ts
const defaultCore = {
	account: null,
	profile: null,
	currentTheme: 'light',
	lastUpdate: 1,
};

export const stateManager = new SimpleCore(defaultCore, {
	someConfig: false,
	Storage: {
		type: 'MMKV',
	},
});

export const core = stateManager.core();

core.currentTheme.setValue('dark');
```

<br>
<br>

### **Using the hook**

```jsx
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
