import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { PetsModule } from './pets/pets.module';
import { AiModule } from './ai/ai.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [AuthModule, UsersModule, ProductsModule, OrdersModule, PetsModule, AiModule, PaymentModule],
})
export class ModulesModule {}
