import { InputType, Field, Float } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PetSpecies } from '../pet.schema';

@InputType()
export class UpdatePetInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(PetSpecies)
  species?: PetSpecies;

  @Field({ nullable: true })
  @IsOptional()
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
