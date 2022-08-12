import { State } from './state';
import React from 'react';

export function useSimple(dep: State) {
	return dep._value;
}
