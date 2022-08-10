import { State } from "./state";

export interface InitilizeOptions {
  someConfig?: boolean;
  Storage?: StorageConfig;
}

export interface StorageConfig {
  type?: "AsyncStorage" | "MMKV";
  custom?: {
    get: () => void;
    set: () => void;
  };
}

export type CoreType<T> = {
  [key in keyof T]: State;
};
