export class SavePostCommand {
  constructor(
    public readonly userId: string,
    public readonly postId: string,
  ) {}
}
