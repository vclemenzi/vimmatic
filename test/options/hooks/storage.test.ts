import { renderHook, act } from "@testing-library/react-hooks";
import {
  useLoadSettings,
  useSaveSettings,
} from "../../../src/options/hooks/storage";

describe("useLoadSettings", () => {
  const spyGet = jest.spyOn(chrome.storage.sync, "get");

  beforeEach(() => {
    spyGet.mockClear();
  });

  it("returns initial values", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useLoadSettings());

    await waitForNextUpdate();

    expect(result.current.loading).toBeTruthy;
    expect(result.current.data).toBeUndefined;
    expect(result.current.error).toBeUndefined;
  });

  it("loads saved value", async () => {
    spyGet.mockResolvedValue({ settings_json: "{}" });

    const { result, waitForNextUpdate, waitFor } = renderHook(() =>
      useLoadSettings(),
    );

    await waitForNextUpdate();
    await waitFor(() => !result.current.loading);

    expect(result.current.loading).toBeFalsy;
    expect(result.current.data).toEqual("{}");
    expect(result.current.error).toBeUndefined;
  });

  it("loads default value when no saved settings", async () => {
    spyGet.mockResolvedValue({ settings_json: undefined });

    const { result, waitForNextUpdate, waitFor } = renderHook(() =>
      useLoadSettings(),
    );

    await waitForNextUpdate();
    await waitFor(() => !result.current.loading);

    const settings = JSON.parse(result.current.data);

    expect(result.current.loading).toBeFalsy;
    expect(result.current.error).toBeUndefined;
    expect(settings).toHaveProperty("keymaps");
    expect(settings).toHaveProperty("blacklist");
    expect(settings).toHaveProperty("search");
    expect(settings).toHaveProperty("properties");
  });

  it("returns error when an error occurs", async () => {
    spyGet.mockRejectedValue(new Error("storage error"));

    const { result, waitForNextUpdate, waitFor } = renderHook(() =>
      useLoadSettings(),
    );

    await waitForNextUpdate();
    await waitFor(() => !result.current.loading);

    expect(result.current.loading).toBeFalsy;
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.data).toBeUndefined;
  });
});

describe("useSaveSettings", () => {
  const spySet = jest.spyOn(chrome.storage.sync, "set");
  const spySendMessage = jest.spyOn(chrome.runtime, "sendMessage");

  beforeEach(() => {
    spySet.mockClear();
    spySendMessage.mockClear();
  });

  it("returns initial values", async () => {
    const { result } = renderHook(() => useSaveSettings());

    expect(result.current.loading).toBeFalsy;
    expect(result.current.error).toBeUndefined;
    expect(result.current.save).toBeInstanceOf(Function);
  });

  it("saves settings", async () => {
    spySet.mockResolvedValue({});
    spySendMessage.mockResolvedValue({});

    const { result, waitFor } = renderHook(() => useSaveSettings());

    act(() => {
      result.current.save(`{ "properties": { "smoothscroll": true } }`);
    });

    expect(result.current.loading).toBeTruthy;

    await waitFor(() => !result.current.loading);

    expect(result.current.loading).toBeFalsy;
    expect(result.current.error).toBeUndefined();

    expect(spySet).toHaveBeenCalledWith({
      settings: {
        keymaps: undefined,
        search: undefined,
        properties: { smoothscroll: true },
        blacklist: undefined,
      },
      settings_json: `{ "properties": { "smoothscroll": true } }`,
    });
  });

  it("returns validation error", async () => {
    spySet.mockResolvedValue({});
    spySendMessage.mockResolvedValue({});

    const { result, waitFor } = renderHook(() => useSaveSettings());

    act(() => {
      result.current.save(`invalid json`);
    });

    expect(result.current.loading).toBeTruthy;

    await waitFor(() => !result.current.loading);

    expect(result.current.loading).toBeFalsy;
    expect(result.current.error).toBeInstanceOf(SyntaxError);
  });
});
