import { Simple } from './simple';

export const SimpleInstance = (): Simple<any> => {
	return globalThis.Simple_;
};
