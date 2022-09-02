# Simple Core State 0.0.7
_This Library is still work in progress_

<br>

## **Inspiration**
The inspiration came from using using [pulseJS](https://github.com/pulse-framework/pulse), but since that its not maintained anymore and i wanted to create a simple core state library that is easy to use and expand, i have created **Simple Core State** which the name already says __simple__.



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
}

const defaultCore = {
  account: null,
  currentTheme: 'light',
  lastUpdate: 1,
};

// Initialize the core
export const stateManager = new SimpleCore<ICoreType>(defaultCore, {
  // For now if you are on react-native or if you wanna use you're own storage Library, than you can implement by passing the custom storage object with a get and set function
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
core.currentTheme.set('dark');

// Reset the value to its original state as its default core
core.currentTheme.reset();

// Update a key from an object
core.account.patch({ id: '37a7ce20-7250-4a40-b683-3cb0a848c2b9' });
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
      <p>{theme}</p>
    </div>
  );
};
```
