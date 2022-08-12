import { Simple } from './simple';

export const SimpleInstance = (): Simple<any> => {
	return globalThis.__Simple__;
};
