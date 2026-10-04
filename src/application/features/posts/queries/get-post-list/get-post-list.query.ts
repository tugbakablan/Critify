export class GetPostListQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
