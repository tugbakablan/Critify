export class GetCommentListQuery {
  constructor(
    public readonly postId: string,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
