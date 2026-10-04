export class UploadMediaCommand {
  constructor(
    public readonly ownerId: string,
    public readonly content: Buffer,
    public readonly mimeType: string,
  ) {}
}
