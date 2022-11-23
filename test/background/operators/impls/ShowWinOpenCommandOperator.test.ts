import ShowWinOpenCommandOperator from "../../../../src/background/operators/impls/ShowWinOpenCommandOperator";
import MockConsoleClient from "../../mock/MockConsoleClient";

describe("ShowWinOpenCommandOperator", () => {
  const consoleClient = new MockConsoleClient();
  const showCommandSpy = jest
    .spyOn(consoleClient, "showCommand")
    .mockReturnValue(Promise.resolve());
  const ctx = {
    sender: {
      tab: { id: 100, url: "https://example.com/" } as browser.tabs.Tab,
    },
  };

  beforeEach(() => {
    showCommandSpy.mockReset();
  });

  describe("#run", () => {
    it("show command with winopen command", async () => {
      const sut = new ShowWinOpenCommandOperator(consoleClient);
      await sut.run(ctx, { alter: false });

      expect(showCommandSpy).toBeCalledWith(100, "winopen ");
    });

    it("show command with winopen command and an URL of the current tab", async () => {
      const sut = new ShowWinOpenCommandOperator(consoleClient);
      await sut.run(ctx, { alter: true });

      expect(showCommandSpy).toBeCalledWith(
        100,
        "winopen https://example.com/"
      );
    });
  });
});
