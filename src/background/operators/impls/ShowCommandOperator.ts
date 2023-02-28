import { inject, injectable } from "inversify";
import Operator from "../Operator";
import ConsoleClient from "../../clients/ConsoleClient";
import RequestContext from "../../infrastructures/RequestContext";

@injectable()
export default class ShowCommandOperator implements Operator {
  constructor(
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient
  ) {}

  name() {
    return "command.show";
  }

  schema() {}

  async run({ sender }: RequestContext): Promise<void> {
    return this.consoleClient.showCommand(sender.tabId, "");
  }
}
