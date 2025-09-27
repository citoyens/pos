export interface UseCase {
  execute(...args: Array<unknown>): unknown;
}
