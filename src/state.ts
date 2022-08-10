import { Simple } from "./simple";

export class State {
  public _value: any;

  constructor(defaultValue?: any) {
    this._value = defaultValue;
  }

  setValue(newValue: any) {
    console.log("set value for this state");
  }
}
