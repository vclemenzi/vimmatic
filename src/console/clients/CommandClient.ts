import type BackgroundMessageSender from "./BackgroundMessageSender";
import Completions from "../Completions";

export default class CommandClient {
  constructor(private readonly sender: BackgroundMessageSender) {}

  async execCommand(text: string): Promise<void> {
    this.sender.send("console.command.enter", { text });
  }

  async getCompletions(query: string): Promise<Completions> {
    return this.sender.send("console.command.completions", { query });
  }
}
