import { injectable, inject } from "inversify";
import LinkUseCase from "../usecases/LinkUseCase";
import RequestContext from "../messaging/RequestContext";

@injectable()
export default class LinkController {
  constructor(
    @inject(LinkUseCase)
    private readonly linkUseCase: LinkUseCase,
  ) {}

  openURL(
    ctx: RequestContext,
    {
      url,
      newTab,
      background,
    }: {
      url: string;
      newTab: boolean;
      background: boolean;
    },
  ): Promise<void> {
    const openerId = ctx.sender.tab?.id;
    if (typeof openerId === "undefined") {
      return Promise.resolve();
    }
    if (newTab) {
      return this.linkUseCase.openNewTab(url, openerId, background);
    }
    return this.linkUseCase.openToTab(url, openerId);
  }
}
