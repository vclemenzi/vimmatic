import LocalMark from "../../../src/background/domains/LocalMark";
import GlobalMark from "../../../src/background/domains/GlobalMark";
import MarkRepository from "../../../src/background/repositories/MarkRepository";

export default class MockMarkRepository implements MarkRepository {
  getGlobalMark(_key: string): GlobalMark | undefined {
    throw new Error("not implemented");
  }

  setGlobalMark(_key: string, _mark: GlobalMark): void {
    throw new Error("not implemented");
  }

  getLocalMark(_tabId: number, _key: string): LocalMark | undefined {
    throw new Error("not implemented");
  }

  setLocalMark(_tabId: number, _key: string, _mark: LocalMark): void {
    throw new Error("not implemented");
  }
}
