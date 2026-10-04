export class AddCommentCommand {
  constructor(
    public readonly postId: string,
    public readonly authorId: string,
    public readonly body: string,
  ) {}
}
