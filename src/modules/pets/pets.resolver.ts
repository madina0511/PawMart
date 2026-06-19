import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { PetsService } from './pets.service';
import { Pet, PetSpecies } from './pet.schema';
import { CreatePetInput } from './dto/create-pet.input';
import { UpdatePetInput } from './dto/update-pet.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Resolver(() => Pet)
export class PetsResolver {
  private readonly logger = new Logger(PetsResolver.name);
  constructor(private readonly petsService: PetsService) {}

  // ✅ Public queries
  @Query(() => [Pet])
  async pets(): Promise<Pet[]> {
    return this.petsService.findAll();
  }

  @Query(() => Pet)
  async pet(@Args('id', { type: () => ID }) id: string): Promise<Pet> {
    return this.petsService.findById(id);
  }

  // ✅ Admin only mutations
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Pet)
  async createPet(@Args('input') input: CreatePetInput): Promise<Pet> {
    this.logger.log('createPet called');
    return this.petsService.create(input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Pet)
  async updatePet(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdatePetInput,
  ): Promise<Pet> {
    return this.petsService.update(id, input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async deletePet(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.petsService.delete(id);
  }
}
