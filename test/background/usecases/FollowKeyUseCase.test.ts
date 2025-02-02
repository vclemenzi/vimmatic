import FollowKeyUseCaes from "../../../src/background/usecases/FollowKeyUseCase";
import MockFollowClient from "../mock/MockFollowClient";
import MockFollowRepository from "../mock/MockFollowRepository";

describe("FollowKeyUseCaes", () => {
  it("filters pressed key 1", async () => {
    const followClient = new MockFollowClient();
    const followRepository = new MockFollowRepository();
    const sut = new FollowKeyUseCaes(followClient, followRepository);

    const mockPushKey = jest
      .spyOn(followRepository, "pushKey")
      .mockResolvedValue();
    const mockFilterHints = jest
      .spyOn(followClient, "filterHints")
      .mockResolvedValue();

    jest.spyOn(followRepository, "getKeys").mockResolvedValue("a");
    jest
      .spyOn(followRepository, "getMatchedHints")
      .mockResolvedValue(["a", "aa", "ab"]);
    const cont = await sut.pressKey(10, "a");

    expect(cont).toBeTruthy();
    expect(mockPushKey).toBeCalledWith("a");
    expect(mockFilterHints).toBeCalledWith(10, "a");
  });

  it("filters pressed key 2", async () => {
    const followClient = new MockFollowClient();
    const followRepository = new MockFollowRepository();
    const sut = new FollowKeyUseCaes(followClient, followRepository);

    const mockPushKey = jest
      .spyOn(followRepository, "pushKey")
      .mockResolvedValue();
    const mockFilterHints = jest
      .spyOn(followClient, "filterHints")
      .mockResolvedValue();

    jest.spyOn(followRepository, "getKeys").mockResolvedValue("ab");
    jest
      .spyOn(followRepository, "getMatchedHints")
      .mockResolvedValue(["ab", "aba", "abb"]);
    const cont = await sut.pressKey(10, "b");

    expect(cont).toBeTruthy();
    expect(mockPushKey).toBeCalledWith("b");
    expect(mockFilterHints).toBeCalledWith(10, "ab");
  });

  it("activate if exactly matched", async () => {
    const followClient = new MockFollowClient();
    const followRepository = new MockFollowRepository();
    const sut = new FollowKeyUseCaes(followClient, followRepository);

    const mockPushKey = jest
      .spyOn(followRepository, "pushKey")
      .mockResolvedValue();
    jest
      .spyOn(followRepository, "getOption")
      .mockResolvedValue({ newTab: true, background: false });
    const mockActivateIfExists = jest
      .spyOn(followClient, "activateIfExists")
      .mockResolvedValue();

    jest.spyOn(followRepository, "getKeys").mockResolvedValue("ab");
    jest.spyOn(followRepository, "getMatchedHints").mockResolvedValue(["ab"]);
    const cont = await sut.pressKey(10, "b");

    expect(cont).toBeFalsy();
    expect(mockPushKey).toBeCalledWith("b");
    expect(mockActivateIfExists).toBeCalledWith(10, "ab", true, false);
  });

  it("activate when enter pressed", async () => {
    const followClient = new MockFollowClient();
    const followRepository = new MockFollowRepository();
    const sut = new FollowKeyUseCaes(followClient, followRepository);

    jest
      .spyOn(followRepository, "getOption")
      .mockResolvedValue({ newTab: true, background: false });
    const mockActivateIfExists = jest
      .spyOn(followClient, "activateIfExists")
      .mockResolvedValue();

    jest.spyOn(followRepository, "getKeys").mockResolvedValue("ab");
    jest
      .spyOn(followRepository, "getMatchedHints")
      .mockResolvedValue(["ab", "aba", "abb"]);
    const cont = await sut.pressKey(10, "Enter");

    expect(cont).toBeFalsy();
    expect(mockActivateIfExists).toBeCalledWith(10, "ab", true, false);
  });

  it("delete a chatacter when backspace pressed", async () => {
    const followClient = new MockFollowClient();
    const followRepository = new MockFollowRepository();
    const sut = new FollowKeyUseCaes(followClient, followRepository);

    const mockPopKey = jest
      .spyOn(followRepository, "popKey")
      .mockResolvedValue();
    const mockFilterHints = jest
      .spyOn(followClient, "filterHints")
      .mockResolvedValue();

    jest.spyOn(followRepository, "getKeys").mockResolvedValue("ab");
    jest
      .spyOn(followRepository, "getMatchedHints")
      .mockResolvedValue(["ab", "aba", "abb"]);
    const cont = await sut.pressKey(10, "Backspace");

    expect(cont).toBeTruthy();
    expect(mockPopKey).toBeCalled();
    expect(mockFilterHints).toBeCalledWith(10, "ab");
  });
});
