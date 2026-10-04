import { Body, Controller, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConfirmMockPaymentCommand } from '../../application/features/payments/commands/confirm-mock-payment/confirm-mock-payment.command';
import { CreateCheckoutCommand } from '../../application/features/payments/commands/create-checkout/create-checkout.command';
import { CreateCheckoutResponse } from '../../application/features/payments/commands/create-checkout/create-checkout.response';
import { PaymentResponse } from '../../application/features/payments/payment.response';
import { AuthenticatedUserModel } from '../../domain/common/models/authenticated-user.model';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCheckoutRequestDto } from '../contracts/features/payments/create-checkout-request.dto';
import { MockConfirmRequestDto } from '../contracts/features/payments/mock-confirm-request.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Token yok, geçersiz ya da süresi dolmuş' })
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Paket için ödeme başlat (PENDING)' })
  @ApiCreatedResponse({ type: CreateCheckoutResponse })
  @ApiNotFoundResponse({ description: 'Paket bulunamadı' })
  checkout(
    @AuthUser() user: AuthenticatedUserModel,
    @Body() body: CreateCheckoutRequestDto,
  ): Promise<CreateCheckoutResponse> {
    return this.commandBus.execute<CreateCheckoutCommand, CreateCheckoutResponse>(
      new CreateCheckoutCommand(user.id, body.planCode),
    );
  }

  @Post(':id/mock-confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sahte ödeme sağlayıcısı: kartla ödemeyi taklit eder, imzalı webhook gönderir' })
  @ApiOkResponse({ type: PaymentResponse })
  @ApiForbiddenResponse({ description: 'Ödeme başkasına ait' })
  @ApiNotFoundResponse({ description: 'Ödeme bulunamadı' })
  @ApiConflictResponse({ description: 'Ödeme zaten sonuçlanmış' })
  mockConfirm(
    @AuthUser() user: AuthenticatedUserModel,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: MockConfirmRequestDto,
  ): Promise<PaymentResponse> {
    return this.commandBus.execute<ConfirmMockPaymentCommand, PaymentResponse>(
      new ConfirmMockPaymentCommand(id, user.id, body.outcome === 'success'),
    );
  }
}
