import { DataType } from './types';
import { StorageController } from './storage';
import { SimpleInstance } from './instance';

/**
 * @description Build an k/v object from the custom storage integration
 */
export const BuildStorageObjectFromCustom = async (data: DataType<any>, storage: StorageController<any>): Promise<{ [index: string]: any }> => {
	let newObj = {};

	for (let item of Object.entries(data)) {
		newObj[item[0]] = await storage.get(item[0]);
	}

	return newObj;
};

/**
 * @description Build an object with k/v from the window.localstorage and we need to parse if its not undefined
 */
export const parseWindowLocalStorageToMap = (data: DataType<any>) => {
	let newObj: { [index: string]: any } = {};

	if (typeof window === 'undefined' || typeof window?.localStorage !== 'object') {
		return newObj;
	}

	for (let item of Object.entries(data)) {
		if (window.localStorage[SimpleInstance().storage._prefixKey + item[0]] === undefined) {
			newObj[item[0]] = undefined;
		} else {
			newObj[item[0]] = JSON.parse(window.localStorage[SimpleInstance().storage._prefixKey + item[0]]);
		}
	}

	return newObj;
};

export const makeid = (length: number) => {
	let result = '';
	let characters = '0123456789';
	let charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};
