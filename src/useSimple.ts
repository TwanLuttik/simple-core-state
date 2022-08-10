import { State } from "./state";
import React from "react";

export const useSimpleState = (dep: State) => {
  return dep._value;
};
