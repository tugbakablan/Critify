import {
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UploadMediaCommand } from '../../application/features/media/commands/upload-media/upload-media.command';
import { UploadMediaResponse } from '../../application/features/media/commands/upload-media/upload-media.response';
import { AuthenticatedUserModel } from '../../domain/common/models/authenticated-user.model';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

@ApiTags('Media')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token yok, geçersiz ya da süresi dolmuş' })
@UseGuards(JwtAuthGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE } }))
  @ApiOperation({ summary: 'Fotoğraf yükle (jpeg, png, webp · en fazla 5 MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiCreatedResponse({ type: UploadMediaResponse })
  @ApiBadRequestResponse({ description: 'Dosya yok, türü ya da boyutu uygun değil' })
  upload(
    @AuthUser() user: AuthenticatedUserModel,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ })
        .addMaxSizeValidator({ maxSize: MAX_FILE_SIZE })
        .build({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    file: Express.Multer.File,
  ): Promise<UploadMediaResponse> {
    return this.commandBus.execute<UploadMediaCommand, UploadMediaResponse>(
      new UploadMediaCommand(user.id, file.buffer, file.mimetype),
    );
  }
}
