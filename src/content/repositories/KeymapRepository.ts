import { injectable } from "inversify";
import Key from "../../shared/Key";
import KeySequence from "../domains/KeySequence";

export default interface KeymapRepository {
  enqueueKey(key: Key): KeySequence;

  clear(): void;
}

let current: KeySequence = new KeySequence([]);

@injectable()
export class KeymapRepositoryImpl implements KeymapRepository {
  enqueueKey(key: Key): KeySequence {
    current.push(key);
    return current;
  }

  clear(): void {
    current = new KeySequence([]);
  }
}
