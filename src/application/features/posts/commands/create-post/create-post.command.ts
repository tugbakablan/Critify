export class CreatePostCommand {
  constructor(
    public readonly authorId: string,
    public readonly body: string | undefined,
    public readonly mediaId: string | undefined,
  ) {}
}
