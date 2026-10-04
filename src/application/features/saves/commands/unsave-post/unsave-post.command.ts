export class UnsavePostCommand {
  constructor(
    public readonly userId: string,
    public readonly postId: string,
  ) {}
}
