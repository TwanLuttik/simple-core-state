import { State } from "./state";
import { InitilizeOptions } from "./types";

type CoreDataType = { [key: string]: State };

export class Simple {
  // public _structure: { [key: string]: any };
  public _data: CoreDataType = {};
  public _config: InitilizeOptions;

  setConfig(config: InitilizeOptions) {
    console.log("setting config", config);
    this._config = config;
  }

  /**
   * @param structure
   * @description initialize the base structure by keys and values if you want to set a default value, otherwise just null works out
   */
  initialize(structure: { [key: string]: any }) {
    for (let item of Object.entries(structure)) {
      this._data[item[0]] = new State(item[1]);
    }
  }
}
