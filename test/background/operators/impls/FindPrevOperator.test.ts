import FindPrevOperator from "../../../../src/background/operators/impls/FindPrevOperator";
import MockFindRepository from "../../mock/MockFindRepository";
import MockFindClient from "../../mock/MockFindClient";
import MockConsoleClient from "../../mock/MockConsoleClient";
import MockReadyFrameRepository from "../../mock/MockReadyFrameRepository";
import { OperatorContext } from "../../../../src/background/operators/Operator";

describe("FindPrevOperator", () => {
  const keyword = "hello";
  const frameIds = [0, 100, 101];

  const findRepository = new MockFindRepository();
  const findClient = new MockFindClient();
  const consoleClient = new MockConsoleClient();
  const frameRepository = new MockReadyFrameRepository();
  const sut = new FindPrevOperator(
    findRepository,
    findClient,
    consoleClient,
    frameRepository,
  );

  const ctx = { sender: { tabId: 10 } } as OperatorContext;
  const findPrevSpy = jest.spyOn(findClient, "findPrev");
  const clearSelectionSpy = jest.spyOn(findClient, "clearSelection");

  beforeEach(async () => {
    findPrevSpy.mockClear();
    clearSelectionSpy.mockClear().mockReturnValue(Promise.resolve());
    jest.spyOn(frameRepository, "getFrameIds").mockResolvedValue(frameIds);
  });

  describe("#run", () => {
    it("shows errors if no previous keywords", async () => {
      jest.spyOn(findRepository, "getLocalState").mockResolvedValue(undefined);
      const showErrorSpy = jest
        .spyOn(consoleClient, "showError")
        .mockResolvedValue(undefined);

      await sut.run(ctx);

      expect(showErrorSpy).toBeCalledWith(10, "No previous search keywords");
    });

    it("continues a search on the same frame", async () => {
      jest
        .spyOn(findRepository, "getLocalState")
        .mockResolvedValue({ keyword, frameId: 100 });
      findPrevSpy.mockResolvedValue(true);
      const setLocalStateSpy = jest.spyOn(findRepository, "setLocalState");

      await sut.run(ctx);

      expect(findPrevSpy).toBeCalledWith(10, 100, keyword);
      expect(setLocalStateSpy).toBeCalledWith(10, { keyword, frameId: 100 });
    });

    it("continues a search on next frame", async () => {
      jest
        .spyOn(findRepository, "getLocalState")
        .mockResolvedValue({ keyword, frameId: 100 });
      findPrevSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      const setLocalStateSpy = jest.spyOn(findRepository, "setLocalState");

      await sut.run(ctx);

      expect(findPrevSpy).toBeCalledTimes(2);
      expect(findPrevSpy.mock.calls[0][1]).toEqual(100);
      expect(findPrevSpy.mock.calls[1][1]).toEqual(0);
      expect(clearSelectionSpy).toBeCalledWith(10, 100);
      expect(setLocalStateSpy).toBeCalledWith(10, { keyword, frameId: 0 });
    });

    it("exercise a wrap-search", async () => {
      jest
        .spyOn(findRepository, "getLocalState")
        .mockResolvedValue({ keyword, frameId: 0 });

      findPrevSpy.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
      const setLocalStateSpy = jest.spyOn(findRepository, "setLocalState");

      await sut.run(ctx);

      expect(findPrevSpy).toBeCalledTimes(2);
      expect(findPrevSpy.mock.calls[0][1]).toEqual(0);
      expect(findPrevSpy.mock.calls[1][1]).toEqual(101);
      expect(clearSelectionSpy).toBeCalledWith(10, 0);
      expect(setLocalStateSpy).toBeCalledWith(10, { keyword, frameId: 101 });
    });

    it("starts a search with last keywords", async () => {
      jest.spyOn(findRepository, "getLocalState").mockResolvedValue(undefined);
      jest.spyOn(findRepository, "getGlobalKeyword").mockResolvedValue(keyword);
      jest.spyOn(consoleClient, "showInfo").mockResolvedValue(undefined);

      const setLocalStateSpy = jest.spyOn(findRepository, "setLocalState");

      await sut.run(ctx);

      expect(clearSelectionSpy).toBeCalledTimes(3);
      expect(clearSelectionSpy.mock.calls[0][1]).toEqual(101);
      expect(clearSelectionSpy.mock.calls[1][1]).toEqual(100);
      expect(clearSelectionSpy.mock.calls[2][1]).toEqual(0);
      expect(findPrevSpy).toBeCalledWith(10, 101, keyword);
      expect(setLocalStateSpy).toBeCalledWith(10, { keyword, frameId: 101 });
    });
  });
});
