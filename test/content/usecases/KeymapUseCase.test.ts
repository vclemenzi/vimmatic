import "@abraham/reflection";
import KeymapUseCase from "../../../src/content/usecases/KeymapUseCase";
import AddonEnabledRepository from "../../../src/content/repositories/AddonEnabledRepository";
import { KeymapRepositoryImpl } from "../../../src/content/repositories/KeymapRepository";
import { fromKeymap } from "../../../src/shared/Key";
import { deserialize } from "../../../src/settings";
import AddressRepository from "../../../src/content/repositories/AddressRepository";
import MockSettingRepository from "../mock/MockSettingRepository";

class MockAddonEnabledRepository implements AddonEnabledRepository {
  constructor(private readonly enabled: boolean) {}

  get(): boolean {
    return this.enabled;
  }

  set(_on: boolean): void {
    throw new Error("TODO");
  }
}

class MockAddressRepository implements AddressRepository {
  constructor(private url: URL) {}

  getCurrentURL(): URL {
    return this.url;
  }
}

describe("KeymapUseCase", () => {
  describe("with no-digis keymaps", () => {
    const settings = deserialize({
      keymaps: {
        k: { type: "scroll.vertically", count: -1 },
        j: { type: "scroll.vertically", count: 1 },
        gg: { type: "scroll.top" },
      },
    });

    let sut: KeymapUseCase;

    beforeEach(() => {
      sut = new KeymapUseCase(
        new KeymapRepositoryImpl(),
        new MockSettingRepository(settings),
        new MockAddonEnabledRepository(true),
        new MockAddressRepository(new URL("https://example.com"))
      );
    });

    it("returns matched operation", () => {
      expect(sut.nextOps(fromKeymap("k"))).toEqual({
        repeat: 1,
        op: { type: "scroll.vertically", count: -1 },
      });
      expect(sut.nextOps(fromKeymap("j"))).toEqual({
        repeat: 1,
        op: { type: "scroll.vertically", count: 1 },
      });
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toEqual({
        repeat: 1,
        op: { type: "scroll.top" },
      });
      expect(sut.nextOps(fromKeymap("z"))).toBeNull;
    });

    it("repeats n-times by numeric prefix and multiple key operations", () => {
      expect(sut.nextOps(fromKeymap("1"))).toBeNull;
      expect(sut.nextOps(fromKeymap("0"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toEqual({
        repeat: 10,
        op: { type: "scroll.top" },
      });
    });
  });

  describe("when keymaps containing numeric mappings", () => {
    const settings = deserialize({
      keymaps: {
        20: { type: "scroll.top" },
        g5: { type: "scroll.bottom" },
      },
    });

    let sut: KeymapUseCase;

    beforeEach(() => {
      sut = new KeymapUseCase(
        new KeymapRepositoryImpl(),
        new MockSettingRepository(settings),
        new MockAddonEnabledRepository(true),
        new MockAddressRepository(new URL("https://example.com"))
      );
    });

    it("returns the matched operation ends with digit", () => {
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("5"))).toEqual({
        repeat: 1,
        op: { type: "scroll.bottom" },
      });
    });

    it("returns an operation matched the operation with digit keymaps", () => {
      expect(sut.nextOps(fromKeymap("2"))).toBeNull;
      expect(sut.nextOps(fromKeymap("0"))).toEqual({
        repeat: 1,
        op: { type: "scroll.top" },
      });
    });

    it("returns operations repeated by numeric prefix", () => {
      expect(sut.nextOps(fromKeymap("2"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("5"))).toEqual({
        repeat: 2,
        op: { type: "scroll.bottom" },
      });
    });

    it("does not matches with digit operation with numeric prefix", () => {
      expect(sut.nextOps(fromKeymap("3"))).toBeNull;
      expect(sut.nextOps(fromKeymap("2"))).toBeNull;
      expect(sut.nextOps(fromKeymap("0"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("5"))).toEqual({
        repeat: 320,
        op: { type: "scroll.bottom" },
      });
    });
  });

  describe("when the keys are mismatched with the operations", () => {
    const settings = deserialize({
      keymaps: {
        gg: { type: "scroll.top" },
        G: { type: "scroll.bottom" },
      },
    });

    let sut: KeymapUseCase;

    beforeEach(() => {
      sut = new KeymapUseCase(
        new KeymapRepositoryImpl(),
        new MockSettingRepository(settings),
        new MockAddonEnabledRepository(true),
        new MockAddressRepository(new URL("https://example.com"))
      );
    });

    it("clears input keys with no-matched operations", () => {
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("x"))).toBeNull; // clear
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toEqual({
        repeat: 1,
        op: { type: "scroll.top" },
      });
    });

    it("clears input keys and the prefix with no-matched operations", () => {
      expect(sut.nextOps(fromKeymap("1"))).toBeNull;
      expect(sut.nextOps(fromKeymap("0"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("x"))).toBeNull; // clear
      expect(sut.nextOps(fromKeymap("1"))).toBeNull;
      expect(sut.nextOps(fromKeymap("0"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toEqual({
        repeat: 10,
        op: { type: "scroll.top" },
      });
    });
  });

  describe("when the site matches to the blacklist", () => {
    const settings = deserialize({
      keymaps: {
        k: { type: "scroll.vertically", count: -1 },
        a: { type: "addon.enable" },
        b: { type: "addon.toggle.enabled" },
      },
    });

    let sut: KeymapUseCase;

    beforeEach(() => {
      sut = new KeymapUseCase(
        new KeymapRepositoryImpl(),
        new MockSettingRepository(settings),
        new MockAddonEnabledRepository(false),
        new MockAddressRepository(new URL("https://example.com"))
      );
    });

    it("returns only ADDON_ENABLE and ADDON_TOGGLE_ENABLED operation", () => {
      expect(sut.nextOps(fromKeymap("k"))).toBeNull;
      expect(sut.nextOps(fromKeymap("a"))).toEqual({
        repeat: 1,
        op: { type: "addon.enable" },
      });
      expect(sut.nextOps(fromKeymap("b"))).toEqual({
        repeat: 1,
        op: { type: "addon.toggle.enabled" },
      });
    });
  });

  describe("when the site matches to the partial blacklist", () => {
    const settings = deserialize({
      keymaps: {
        k: { type: "scroll.vertically", count: -1 },
        j: { type: "scroll.vertically", count: 1 },
        gg: { type: "scroll.top" },
        G: { type: "scroll.bottom" },
      },
      blacklist: [
        { url: "example.com", keys: ["g"] },
        { url: "example.org", keys: ["<S-G>"] },
      ],
    });

    it("blocks keys in the partial blacklist", () => {
      let sut = new KeymapUseCase(
        new KeymapRepositoryImpl(),
        new MockSettingRepository(settings),
        new MockAddonEnabledRepository(true),
        new MockAddressRepository(new URL("https://example.com"))
      );

      expect(sut.nextOps(fromKeymap("k"))).toEqual({
        repeat: 1,
        op: { type: "scroll.vertically", count: -1 },
      });
      expect(sut.nextOps(fromKeymap("j"))).toEqual({
        repeat: 1,
        op: { type: "scroll.vertically", count: 1 },
      });
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("G"))).toEqual({
        repeat: 1,
        op: { type: "scroll.bottom" },
      });

      sut = new KeymapUseCase(
        new KeymapRepositoryImpl(),
        new MockSettingRepository(settings),
        new MockAddonEnabledRepository(true),
        new MockAddressRepository(new URL("https://example.org"))
      );

      expect(sut.nextOps(fromKeymap("g"))).toBeNull;
      expect(sut.nextOps(fromKeymap("g"))).toEqual({
        repeat: 1,
        op: { type: "scroll.top" },
      });
      expect(sut.nextOps(fromKeymap("G"))).toBeNull;
    });
  });
});
