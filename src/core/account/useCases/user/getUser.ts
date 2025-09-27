import { CanGetUser } from "core/account/interfaces/user/canGetUser";
import { UseCase } from "core/common/interfaces/useCase";

export class GetUserUseCase implements UseCase {
  constructor(private readonly repository: CanGetUser) {}

  public execute() {
    return this.repository.getUser();
  }
}
