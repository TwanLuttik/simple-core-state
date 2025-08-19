import { DataType } from './types';
import { StorageController } from './storage';
import { SimpleInstance } from './instance';

/**
 * @description Build an k/v object from the custom storage integration
 */
export const BuildStorageObjectFromCustom = async (data: DataType<any>, storage: StorageController<any>): Promise<{ [index: string]: any }> => {
	let newObj: Record<string, any> = {};

	for (const [key] of Object.entries(data)) {
		newObj[key] = await storage.get(key);
	}

	return newObj;
};

/**
 * @description Build an object with k/v from the window.localstorage and we need to parse if its not undefined
 */
export const parseWindowLocalStorageToMap = (data: DataType<any>) => {
	let newObj: { [index: string]: any } = {};

	// Check for browser environment more thoroughly
	// This covers both Next.js server-side rendering and other non-browser environments
	if (typeof window === 'undefined' || typeof window.localStorage === 'undefined' || !window.localStorage) {
		return newObj;
	}

	try {
		// Use a try-catch block to handle potential localStorage access errors
		// (like when cookies are disabled or in private browsing mode)
		for (let item of Object.entries(data)) {
			const key = SimpleInstance().storage._prefixKey + item[0];
			const storedValue = window.localStorage.getItem(key);

			if (storedValue === null) {
				newObj[item[0]] = undefined;
			} else {
				try {
					newObj[item[0]] = JSON.parse(storedValue);
				} catch (parseError) {
					// If JSON parsing fails, use the raw value
					newObj[item[0]] = storedValue;
					console.warn(`Failed to parse stored value for key ${key}:`, parseError);
				}
			}
		}
	} catch (storageError) {
		console.warn('LocalStorage access error:', storageError);
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
