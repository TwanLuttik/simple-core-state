import { State } from './state';

export interface InitilizeOptions {
	storage?: StorageConfig;
}

export type StorageConfig = {
	custom?: {
		get: (key: string) => Promise<any>;
		set: (key: string, value: any) => Promise<void>;
	};
};

export type DataType<T> = { [K in keyof T]: State<T[K]> };

export type CoreTypeFlatValue<T> = { [K in keyof T]: T[K] };

export type DataToKeysArray<T> = (keyof DataType<T>)[];

export type StorageObject<T> = { [K in keyof T]: K };
