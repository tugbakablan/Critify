export class CreateCheckoutCommand {
  constructor(
    public readonly userId: string,
    public readonly planCode: string,
  ) {}
}
