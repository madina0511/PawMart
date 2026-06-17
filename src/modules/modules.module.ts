import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { PetsModule } from './pets/pets.module';
import { AiModule } from './ai/ai.module';
import { PaymentModule } from './payment/payment.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [AuthModule, UsersModule, ProductsModule, OrdersModule, PetsModule, AiModule, PaymentModule, CloudinaryModule, ReviewsModule],
})
export class ModulesModule {}
