import { CanGetMenu } from "core/account/interfaces/menu/canGetMenu";
import { UseCase } from "core/common/interfaces/useCase";

export class GetMenu implements UseCase {
  constructor(private readonly repository: CanGetMenu) {}

  public execute() {
    return this.repository.getMenu();
  }
}
