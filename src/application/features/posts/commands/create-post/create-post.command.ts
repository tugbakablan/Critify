export class CreatePostCommand {
  constructor(
    public readonly authorId: string,
    public readonly body: string,
  ) {}
}
