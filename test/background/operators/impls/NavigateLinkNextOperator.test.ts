import NavigateLinkNextOperator from "../../../../src/background/operators/impls/NavigateLinkNextOperator";
import MockNavigateClient from "../../mock/MockNavigateClient";
import RequestContext from "../../../../src/background/infrastructures/RequestContext";

describe("NavigateLinkNextOperator", () => {
  describe("#run", () => {
    it("send a message to navigate next page", async () => {
      const navigateClient = new MockNavigateClient();
      const linkNextSpy = jest
        .spyOn(navigateClient, "linkNext")
        .mockReturnValueOnce(Promise.resolve());

      const sut = new NavigateLinkNextOperator(navigateClient);
      const ctx = { sender: { tabId: 100 } } as RequestContext;
      await sut.run(ctx);

      expect(linkNextSpy).toBeCalledWith(100);
    });
  });
});
