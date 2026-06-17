import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PetsService } from './pets.service';
import { PetsResolver } from './pets.resolver';
import { Pet, PetSchema } from './pet.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }]),
    AuthModule,
  ],
  providers: [PetsService, PetsResolver],
  exports: [PetsService],
})
export class PetsModule {}
