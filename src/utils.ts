import { DataType } from './types';
import { StorageController } from './storage';

export const BuildStorageObjectFromCustom = async (data: DataType<any>, storage: StorageController<any>): Promise<{ [index: string]: any }> => {
	let newObj = {};

	for (let item of Object.entries(data)) {
		newObj[item[0]] = await storage.get(item[0]);
	}

	return newObj;
};
