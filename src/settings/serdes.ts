import type {
  SerializedSettings,
  SerializedKeymaps,
  SerializedBlacklist,
  SerializedProperties,
  SerializedSearchEngine,
} from "./schema";
import { validateSerializedSettings } from "./schema";
import Settings from "../shared/Settings";
import Keymaps from "../shared/Keymaps";
import Search from "../shared/Search";
import Properties from "../shared/Properties";
import Blacklist from "../shared/Blacklist";
import { BlacklistItem } from "../shared/Blacklist";
import * as operations from "../shared/operations";

const serializeKeymaps = (keymaps: Keymaps): SerializedKeymaps => {
  const obj: SerializedKeymaps = {};
  keymaps.entries().forEach(([key, op]) => {
    obj[key] = { ...op, type: op.type };
  });
  return obj;
};

const deserializeKeymaps = (json: SerializedKeymaps): Keymaps => {
  const entries: { [key: string]: operations.Operation } = {};
  for (const [key, op] of Object.entries(json)) {
    entries[key] = operations.valueOf(op);
  }
  return new Keymaps(entries);
};

const serializeSearch = (search: Search): SerializedSearchEngine => {
  const obj: SerializedSearchEngine = {
    default: search.defaultEngine,
    engines: search.engines,
  };
  return obj;
};

const deserializeSearch = (json: SerializedSearchEngine): Search => {
  for (const [name, url] of Object.entries(json.engines)) {
    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      throw new TypeError("Search engine's name must be [a-zA-Z0-9]+");
    }
    const matches = url.match(/{}/g);
    if (matches === null) {
      throw new TypeError(`No {}-placeholders in URL of "${name}"`);
    } else if (matches.length > 1) {
      throw new TypeError(`Multiple {}-placeholders in URL of "${name}"`);
    }
  }
  if (!Object.keys(json.engines).includes(json.default)) {
    throw new TypeError(`Default engine "${json.default}" not found`);
  }

  return new Search(json.default, json.engines);
};

const serializeProperties = (properties: Properties): SerializedProperties => {
  const obj: SerializedProperties = properties;
  return obj;
};

const deserializeProperties = (json: SerializedProperties): Properties => {
  return json;
};

const serializeBlacklist = (blacklist: Blacklist): SerializedBlacklist => {
  const obj: SerializedBlacklist = [];
  blacklist.items.forEach((item) => {
    if (item.partial) {
      obj.push({ url: item.pattern, keys: item.keys });
    } else {
      obj.push(item.pattern);
    }
  });
  return obj;
};

const deserializeBlacklist = (json: SerializedBlacklist): Blacklist => {
  const items = json.map((item) =>
    typeof item === "string"
      ? new BlacklistItem(item, false, [])
      : new BlacklistItem(item.url, true, item.keys)
  );
  return new Blacklist(items);
};

export const serializeSettings = (settings: Settings): SerializedSettings => {
  return {
    keymaps: settings.keymaps && serializeKeymaps(settings.keymaps),
    search: settings.search && serializeSearch(settings.search),
    properties: settings.properties && serializeProperties(settings.properties),
    blacklist: settings.blacklist && serializeBlacklist(settings.blacklist),
  };
};

export const deserializeSettings = (json: unknown): Settings => {
  validateSerializedSettings(json);
  const serialized = json as SerializedSettings;
  return {
    keymaps: serialized.keymaps && deserializeKeymaps(serialized.keymaps),
    search: serialized.search && deserializeSearch(serialized.search),
    properties:
      serialized.properties && deserializeProperties(serialized.properties),
    blacklist:
      serialized.blacklist && deserializeBlacklist(serialized.blacklist),
  };
};
