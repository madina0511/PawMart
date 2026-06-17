import { InputType, Field, Float } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PetSpecies } from '../pet.schema';

@InputType()
export class CreatePetInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsEnum(PetSpecies)
  species: PetSpecies;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  breed?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  age?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  weight?: number;

  @Field({ nullable: true })
  @IsOptional()
  healthNotes?: string;

  @Field({ nullable: true })
  @IsOptional()
  avatar?: string;
}
