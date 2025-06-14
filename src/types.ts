import { EventRegistry } from './events';
import { State } from './state';

export interface InitializeOptions<T> {
	storage?: StorageConfig;
	persist?: Array<keyof T>;
}

export type StorageConfig = {
	prefix?: string;
	custom?: {
		get: (key: string) => Promise<any> | any;
		set: (key: string, value: any) => Promise<void> | void;
	};
};

export type DataType<T extends object> = { [K in keyof T]: State<T, K> };

export type CoreTypeFlatValue<T> = { [K in keyof T]: T[K] };

export type DataToKeysArray<T> = Array<keyof T>;

export type StorageObject<T> = { [K in keyof T]: K };

export type EventMap<T> = { [K in keyof T]: EventRegistry };

export type DataCallback = (...data: any) => void;

export type EventListRegistryType<T> = { [K in keyof T]: EventRegistry };

export type defaultStructIn<T> = Partial<{ [K in keyof T]: T[K] }>;
