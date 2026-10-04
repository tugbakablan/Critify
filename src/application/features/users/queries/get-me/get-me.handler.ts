import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../../../domain/features/users/user.entity';
import { GetMeQuery } from './get-me.query';
import { GetMeResponse } from './get-me.response';

@QueryHandler(GetMeQuery)
export class GetMeHandler implements IQueryHandler<GetMeQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}

  async execute(query: GetMeQuery): Promise<GetMeResponse> {
    const user = await this.users.findOneBy({ id: query.userId });
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı.');
    }
    return GetMeResponse.create(user);
  }
}
