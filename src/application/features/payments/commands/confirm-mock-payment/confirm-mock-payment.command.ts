export class ConfirmMockPaymentCommand {
  constructor(
    public readonly paymentId: string,
    public readonly userId: string,
    public readonly succeed: boolean,
  ) {}
}
