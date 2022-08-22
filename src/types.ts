import { State } from './state';

export interface InitilizeOptions {
	someConfig?: boolean;
	Storage?: StorageConfig;
}

export type StorageConfig = {
	custom?: {
		get: (key: string) => Promise<any>;
		set: (key: string, value: any) => Promise<void>;
	};
};
