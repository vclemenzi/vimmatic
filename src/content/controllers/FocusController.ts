import { injectable, inject } from "inversify";
import FocusPresenter from "../presenters/FocusPresenter";

@injectable()
export default class FocusController {
  constructor(
    @inject("FocusPresenter")
    private readonly focusPresenter: FocusPresenter,
  ) {}

  async focusFirstElement() {
    this.focusPresenter.focusFirstElement();
  }
}
