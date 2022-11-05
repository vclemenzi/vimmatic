import { injectable, inject } from "inversify";
import MemoryStorage from "../infrastructures/MemoryStorage";
import { defaultSettings, serialize, deserialize } from "../../settings";
import Settings from "../../shared/Settings";

type OnChangeListener = (value: Settings) => unknown;

export default interface SettingsRepository {
  load(): Promise<Settings>;

  save(value: Settings): Promise<void>;

  onChanged(f: OnChangeListener): void;
}

class SettingsCache {
  private readonly cache = new MemoryStorage();

  load(): Settings | null {
    const cache = this.cache.get("settings") as unknown;
    if (!cache) {
      return null;
    }
    return deserialize(cache);
  }

  save(value: Settings): void {
    this.cache.set("settings", serialize(value));
  }

  invalidate() {
    this.cache.set("settings", null);
  }
}

@injectable()
export class PersistentSettingsRepository implements SettingsRepository {
  async load(): Promise<Settings> {
    const { settings } = await browser.storage.sync.get("settings");
    if (!settings) {
      return defaultSettings;
    }
    try {
      return deserialize(settings);
    } catch (e) {
      console.warn("settings may be storage is broken:", e);
      console.warn("loaded settings is:");
      console.warn(settings);
      return defaultSettings;
    }
  }

  save(_value: Settings): Promise<void> {
    throw new Error("unsupported operation");
  }

  onChanged(f: OnChangeListener): void {
    browser.storage.onChanged.addListener((changes, area) => {
      if (area !== "sync") {
        return;
      }

      let settings: Settings;
      try {
        settings = deserialize(changes.settings.newValue);
      } catch (e) {
        console.warn("settings may be storage is broken:", e);
        console.warn("loaded settings is:");
        console.warn(changes.settings.newValue);
        return;
      }

      f(settings);
    });
  }
}

@injectable()
export class TransientSettingsRepotiory implements SettingsRepository {
  private readonly cache = new SettingsCache();

  private readonly onChangeListeners: Array<OnChangeListener> = [];

  constructor(
    @inject(PersistentSettingsRepository)
    private readonly origin: SettingsRepository
  ) {
    this.origin.onChanged(() => {
      this.invalidate();
    });
  }

  async load(): Promise<Settings> {
    const cache = this.cache.load();
    if (cache) {
      return cache;
    }

    const origin = await this.origin.load();
    this.save(origin);
    return origin;
  }

  save(value: Settings): Promise<void> {
    this.cache.save(value);
    this.onChangeListeners.forEach((listener) => {
      listener(value);
    });
    return Promise.resolve();
  }

  onChanged(f: OnChangeListener): void {
    this.onChangeListeners.push(f);
  }

  private async invalidate(): Promise<void> {
    this.cache.invalidate();
  }
}
