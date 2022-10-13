import { EventContainer } from './events';
import { State } from './state';

export interface InitilizeOptions {
	storage?: StorageConfig;
}

export type StorageConfig = {
	prefix?: string;
	custom?: {
		get: (key: string) => Promise<any> | any;
		set: (key: string, value: any) => Promise<void> | void;
	};
};

export type DataType<T> = { [K in keyof T]: State<T[K]> };

export type CoreTypeFlatValue<T> = { [K in keyof T]: T[K] };

export type DataToKeysArray<T> = (keyof DataType<T>)[];

export type StorageObject<T> = { [K in keyof T]: K };

export type EventMap<T> = { [K in keyof T]: EventContainer };
