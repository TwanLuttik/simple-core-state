import { State } from './state';

export interface InitilizeOptions {
	Storage?: StorageConfig;
}

export type StorageConfig = {
	custom?: {
		get: (key: string) => Promise<any>;
		set: (key: string, value: any) => Promise<void>;
	};
};
