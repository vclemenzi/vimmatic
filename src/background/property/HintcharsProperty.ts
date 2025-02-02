import type Property from "./Property";
import type { PropertyType } from "./Property";

export default class HintcharsProperty implements Property {
  name() {
    return "hintchars";
  }

  description() {
    return "hint characters on follow mode";
  }

  type() {
    return "string" as const;
  }

  defaultValue() {
    return "abcdefghijklmnopqrstuvwxyz";
  }

  validate(value: PropertyType) {
    if (typeof value !== "string") {
      throw new Error("not a string");
    }
    if (value.length <= 1) {
      throw new Error("hint character must be at least 2 characters");
    }
  }
}
