import { inject, injectable } from "inversify";
import { z } from "zod";
import Operator from "../Operator";
import ConsoleClient from "../../clients/ConsoleClient";
import RequestContext from "../../infrastructures/RequestContext";

@injectable()
export default class ShowAddBookmarkOperator implements Operator {
  constructor(
    @inject("ConsoleClient")
    private readonly consoleClient: ConsoleClient
  ) {}

  name() {
    return "command.show.addbookmark";
  }

  schema() {
    return z.object({
      alter: z.boolean().default(false),
    });
  }

  async run(
    { sender }: RequestContext,
    { alter }: z.infer<ReturnType<ShowAddBookmarkOperator["schema"]>>
  ): Promise<void> {
    if (!sender?.tab?.id) {
      return;
    }
    let command = "addbookmark ";
    if (alter) {
      command += sender.tab?.title || "";
    }
    return this.consoleClient.showCommand(sender.tab.id, command);
  }
}
