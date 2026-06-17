import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { PetsService } from './pets.service';
import { Pet } from './pet.schema';
import { CreatePetInput } from './dto/create-pet.input';
import { UpdatePetInput } from './dto/update-pet.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => Pet)
@UseGuards(JwtAuthGuard)
export class PetsResolver {
  private readonly logger = new Logger(PetsResolver.name);
  constructor(private readonly petsService: PetsService) {}

  @Mutation(() => Pet)
  async createPet(
    @CurrentUser() user: any,
    @Args('createPetInput') createPetInput: CreatePetInput,
  ): Promise<Pet> {
    this.logger.log('createPet called');
    return this.petsService.create(user._id.toString(), createPetInput);
  }

  @Query(() => [Pet])
  async myPets(@CurrentUser() user: any): Promise<Pet[]> {
    return this.petsService.findByUser(user._id.toString());
  }

  @Query(() => Pet)
  async pet(@Args('id', { type: () => ID }) id: string): Promise<Pet> {
    return this.petsService.findById(id);
  }

  @Mutation(() => Pet)
  async updatePet(
    @Args('id', { type: () => ID }) id: string,
    @Args('updatePetInput') updatePetInput: UpdatePetInput,
  ): Promise<Pet> {
    return this.petsService.update(id, updatePetInput);
  }

  @Mutation(() => Boolean)
  async deletePet(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.petsService.delete(id);
  }
}
