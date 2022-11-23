import OpenHomeOperator from "../../../../src/background/operators/impls/OpenHomeOperator";
import MockBrowserSettingRepository from "../../mock/MockBrowserSettingRepository";

describe("OpenHomeOperator", () => {
  describe("#run", () => {
    const mockTabsCreate = jest
      .spyOn(browser.tabs, "create")
      .mockResolvedValue({} as browser.tabs.Tab);
    const mockTabsUpdate = jest
      .spyOn(browser.tabs, "update")
      .mockResolvedValue({} as browser.tabs.Tab);

    it("opens a home page of the browser into the current tab", async () => {
      const browserSettingRepository = new MockBrowserSettingRepository([
        "https://example.net/",
      ]);
      const sut = new OpenHomeOperator(browserSettingRepository);

      await sut.run({ newTab: false });

      expect(mockTabsUpdate).toBeCalledWith({
        url: "https://example.net/",
      });
    });

    it("opens a home page of the browser into a new tab", async () => {
      const browserSettingRepository = new MockBrowserSettingRepository([
        "https://example.net/",
      ]);
      const sut = new OpenHomeOperator(browserSettingRepository);

      await sut.run({ newTab: true });

      expect(mockTabsCreate).toBeCalledWith({ url: "https://example.net/" });
    });

    it("opens home pages of the browser", async () => {
      const browserSettingRepository = new MockBrowserSettingRepository([
        "https://example.net/",
        "https://example.org/",
      ]);
      const sut = new OpenHomeOperator(browserSettingRepository);

      await sut.run({ newTab: false });

      expect(mockTabsCreate).toBeCalledWith({ url: "https://example.net/" });
      expect(mockTabsCreate).toBeCalledWith({ url: "https://example.org/" });
    });
  });
});
