import type Command from "./Command";
import type { CommandContext } from "./Command";
import type { Completions } from "./Command";
import type BufferCommandHelper from "./BufferCommandHelper";

class BDeletesCommand implements Command {
  constructor(private readonly bufferCommandHelper: BufferCommandHelper) {}

  names(): string[] {
    return ["bdeletes"];
  }

  fullname(): string {
    return "bdeletes";
  }

  description(): string {
    return "Close all tabs matched by keywords";
  }

  async getCompletions(force: boolean, query: string): Promise<Completions> {
    return this.bufferCommandHelper.getCompletions(force, query);
  }

  async exec(
    _ctx: CommandContext,
    force: boolean,
    args: string,
  ): Promise<void> {
    const keywords = args.trim();
    const tabs = await this.bufferCommandHelper.queryTabs(force, keywords);
    if (tabs.length === 0) {
      throw new Error("No matching buffer for " + keywords);
    }
    const ids = tabs.map((tab) => tab.id as number);
    await chrome.tabs.remove(ids);
  }
}

export default BDeletesCommand;
