import { injectable, inject } from "inversify";
import Operator from "../Operator";
import { OperatorContext } from "../Operator";
import ClipboardRepository from "../../repositories/ClipboardRepository";
import ConsoleClient from "../../clients/ConsoleClient";

@injectable()
export default class YankOperator implements Operator {
  constructor(
    @inject("ClipboardRepository")
    private readonly clipboard: ClipboardRepository,
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient,
  ) {}

  name() {
    return "urls.yank";
  }

  schema() {}

  async run({ sender }: OperatorContext): Promise<void> {
    if (typeof sender.tab.url === "undefined") {
      return;
    }
    await this.clipboard.write(sender.tab.url);
    await this.consoleClient.showInfo(sender.tabId, "Yanked " + sender.tab.url);
  }
}
