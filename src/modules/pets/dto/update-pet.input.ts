import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { PetSpecies, PetStatus } from '../pet.schema';

@InputType()
export class UpdatePetInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => PetSpecies, { nullable: true })
  @IsOptional()
  @IsEnum(PetSpecies)
  species?: PetSpecies;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  breed?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  age?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  price?: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  images?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => PetStatus, { nullable: true })
  @IsOptional()
  @IsEnum(PetStatus)
  status?: PetStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  color?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  vaccinated?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  neutered?: boolean;
}
