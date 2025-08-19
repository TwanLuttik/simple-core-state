import { Simple } from './simple';

export const SimpleInstance = (): Simple<any> => {
	const g = globalThis as any;
	return g.Simple_;
};
