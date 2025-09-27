import { CanGetSession } from "core/account/interfaces/session/canGetSession";
import { UseCase } from "core/common/interfaces/useCase";

export class GetSessionUseCase implements UseCase {
  constructor(private readonly repository: CanGetSession) {}

  public execute() {
    return this.repository.getSession();
  }
}
