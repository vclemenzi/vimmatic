import { injectable, inject } from "inversify";
import Operator from "../Operator";
import RepeatRepository from "../../repositories/RepeatRepository";
import OperatorRegistory from "../../operators/OperatorRegistory";
import { extractOperation } from "../../../shared/operations2";

@injectable()
export default class RepeatLastOperator implements Operator {
  constructor(
    @inject("OperatorRegistory")
    private readonly operatorRegistory: OperatorRegistory,
    @inject("RepeatRepository")
    private readonly repeatRepository: RepeatRepository
  ) {}

  name() {
    return "repeat";
  }

  schema() {}

  run(): Promise<void> {
    const lastOp = this.repeatRepository.getLastOperation();
    if (typeof lastOp === "undefined") {
      return Promise.resolve();
    }
    const { name, props } = extractOperation(lastOp);
    const op = this.operatorRegistory.getOperator(name);
    if (typeof op === "undefined") {
      throw new Error("unknown operation: " + name);
    }
    return op.run(props);
  }
}
