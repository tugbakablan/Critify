import { Injectable } from '@nestjs/common';
import { PostEntity } from '../../../domain/features/posts/post.entity';
import { StorageService } from '../../../infrastructure/storage/storage.service';
import { PostResponse } from './post.response';

@Injectable()
export class PostResponseFactory {
  constructor(private readonly storage: StorageService) {}

  async create(post: PostEntity): Promise<PostResponse> {
    const imageUrl = post.media ? await this.storage.getPresignedUrl(post.media.objectKey) : null;
    return PostResponse.create(post, imageUrl);
  }

  createMany(posts: PostEntity[]): Promise<PostResponse[]> {
    return Promise.all(posts.map((post) => this.create(post)));
  }
}
