import { Simple } from "./simple";
import { useSimpleState } from "./useSimple";

export { Simple as SimpleCore, useSimpleState };

// import { State } from "./state";
// import { CoreType, InitilizeOptions } from "./types";

// export const GlobalState = new Map<string, State>();

// export const initilizeCore = <T extends Object>(
//   inputValue: T,
//   config: InitilizeOptions
// ): CoreType<T> => {
//   console.log("initilizeCore");

//   const v = Object.entries(inputValue);

//   for (let item of v) {
//     let keyName = item[0];
//     let valueObject = item[1];

//     // Set key value in global state
//     GlobalState.set(keyName, new State(valueObject));
//   }

//   console.log("test");

//   // GlobalState.get("test")._value;
//   let b = {};
//   const a = GlobalState.keys();
//   for (let i = 1; i > GlobalState.size; i++) {
//     b[a[0]] = a[1];
//     a.next();
//   }

//   return b;
// };
