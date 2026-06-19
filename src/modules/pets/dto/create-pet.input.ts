import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { PetSpecies, PetStatus } from '../pet.schema';

@InputType()
export class CreatePetInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => PetSpecies)
  @IsEnum(PetSpecies)
  species: PetSpecies;

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

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @Field(() => [String], { defaultValue: [] })
  @IsOptional()
  images?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => PetStatus, { defaultValue: PetStatus.AVAILABLE })
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
