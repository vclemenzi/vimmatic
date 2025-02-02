import { injectable } from "inversify";
import Operator from "../Operator";

@injectable()
export default class SelectLastTabOperator implements Operator {
  name() {
    return "tabs.last";
  }

  schema() {}

  async run(): Promise<void> {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const tab = tabs[tabs.length - 1];
    if (typeof tab.id === "undefined") {
      throw new Error(`tab ${tab.index} has not id`);
    }
    await chrome.tabs.update(tab.id, { active: true });
  }
}
