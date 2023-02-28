import MockFindClient from "../mock/MockFindClient";
import MockFindRepository from "../mock/MockFindRepository";
import MockConsoleClient from "../mock/MockConsoleClient";
import MockReadyFrameRepository from "../mock/MockReadyFrameRepository";
import StartFindUseCase from "../../../src/background/usecases/StartFindUseCase";

describe("StartFindUseCase", () => {
  const tabId = 100;
  const frameIds = [0, 100, 101];
  const keyword = "hello";

  const findClient = new MockFindClient();
  const findRepository = new MockFindRepository();
  const consoleClient = new MockConsoleClient();
  const frameRepository = new MockReadyFrameRepository();
  const sut = new StartFindUseCase(
    findClient,
    findRepository,
    consoleClient,
    frameRepository
  );
  const ctx = {
    sender: {
      tabId,
      frameId: 0,
      tab: {
        id: tabId,
        url: "https://example.com/",
        active: true,
        highlighted: false,
        pinned: false,
        incognito: false,
        index: 0,
      },
    },
  };

  const getFrameIdsSpy = jest
    .spyOn(frameRepository, "getFrameIds")
    .mockReturnValue(frameIds);
  const clearSelectionSpy = jest
    .spyOn(findClient, "clearSelection")
    .mockResolvedValue();
  const findNextSpy = jest.spyOn(findClient, "findNext");
  const setLocalStateSpy = jest
    .spyOn(findRepository, "setLocalState")
    .mockReturnValue();

  beforeEach(async () => {
    getFrameIdsSpy.mockClear();
    clearSelectionSpy.mockClear();
    findNextSpy.mockClear();
    setLocalStateSpy.mockClear();
  });

  describe("startFind", () => {
    it("starts a find with a keyword", async () => {
      findNextSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      const showInfoSpy = jest
        .spyOn(consoleClient, "showInfo")
        .mockReturnValue(Promise.resolve());

      await sut.startFind(ctx, keyword);

      expect(clearSelectionSpy).toBeCalledTimes(3);
      expect(clearSelectionSpy.mock.calls[0][1]).toEqual(0);
      expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
      expect(clearSelectionSpy.mock.calls[2][1]).toEqual(101);
      expect(findNextSpy).toBeCalledTimes(2);
      expect(findNextSpy.mock.calls[0][1]).toEqual(0);
      expect(findNextSpy.mock.calls[1][1]).toEqual(100);
      expect(setLocalStateSpy).toBeCalledWith(tabId, { keyword, frameId: 100 });
      expect(showInfoSpy).toBeCalledWith(tabId, "Pattern found: " + keyword);
    });

    it("starts a find with last local state", async () => {
      findNextSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      const getLocalStateSpy = jest
        .spyOn(findRepository, "getLocalState")
        .mockReturnValue({ keyword, frameId: 0 });
      const showInfoSpy = jest
        .spyOn(consoleClient, "showInfo")
        .mockReturnValue(Promise.resolve());

      await sut.startFind(ctx, undefined);

      expect(clearSelectionSpy).toBeCalledTimes(3);
      expect(clearSelectionSpy.mock.calls[0][1]).toEqual(0);
      expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
      expect(clearSelectionSpy.mock.calls[2][1]).toEqual(101);
      expect(findNextSpy).toBeCalledTimes(2);
      expect(findNextSpy.mock.calls[0][1]).toEqual(0);
      expect(findNextSpy.mock.calls[1][1]).toEqual(100);
      expect(getLocalStateSpy).toBeCalledWith(tabId);
      expect(setLocalStateSpy).toBeCalledWith(tabId, { keyword, frameId: 100 });
      expect(showInfoSpy).toBeCalledWith(tabId, "Pattern found: " + keyword);
    });

    it("starts a find with last global state", async () => {
      findNextSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      const getLocalStateSpy = jest
        .spyOn(findRepository, "getLocalState")
        .mockReturnValue(undefined);
      jest.spyOn(findRepository, "getGlobalKeyword").mockReturnValue(keyword);
      const showInfoSpy = jest
        .spyOn(consoleClient, "showInfo")
        .mockReturnValue(Promise.resolve());

      await sut.startFind(ctx, undefined);

      expect(clearSelectionSpy).toBeCalledTimes(3);
      expect(clearSelectionSpy.mock.calls[0][1]).toEqual(0);
      expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
      expect(clearSelectionSpy.mock.calls[2][1]).toEqual(101);
      expect(findNextSpy).toBeCalledTimes(2);
      expect(findNextSpy.mock.calls[0][1]).toEqual(0);
      expect(findNextSpy.mock.calls[1][1]).toEqual(100);
      expect(getLocalStateSpy).toBeCalledWith(tabId);
      expect(setLocalStateSpy).toBeCalledWith(tabId, { keyword, frameId: 100 });
      expect(showInfoSpy).toBeCalledWith(tabId, "Pattern found: " + keyword);
    });

    it("shows an error when pattern not found", async () => {
      findNextSpy.mockResolvedValue(false);
      const showErrorSpy = jest
        .spyOn(consoleClient, "showError")
        .mockReturnValue(Promise.resolve());

      await sut.startFind(ctx, keyword);

      expect(clearSelectionSpy).toBeCalledTimes(3);
      expect(clearSelectionSpy.mock.calls[0][1]).toEqual(0);
      expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
      expect(clearSelectionSpy.mock.calls[2][1]).toEqual(101);
      expect(setLocalStateSpy).not.toBeCalled();
      expect(showErrorSpy).toBeCalledWith(
        tabId,
        "Pattern not found: " + keyword
      );
    });

    it("shows an error when no last keywords", async () => {
      jest.spyOn(findRepository, "getLocalState").mockReturnValue(undefined);
      jest.spyOn(findRepository, "getGlobalKeyword").mockReturnValue(undefined);

      const showErrorSpy = jest
        .spyOn(consoleClient, "showError")
        .mockReturnValue(Promise.resolve());

      await sut.startFind(ctx, undefined);

      expect(showErrorSpy).toBeCalledWith(tabId, "No previous search keywords");
    });
  });
});
