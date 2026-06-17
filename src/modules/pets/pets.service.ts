import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pet, PetDocument } from './pet.schema';

import { getErrorMessage } from '../../common/utils/error.util';
import { UpdatePetInput } from './dto/update-pet.input';
import { CreatePetInput } from './dto/create-pet.input';

@Injectable()
export class PetsService {
  private readonly logger = new Logger(PetsService.name);

  constructor(@InjectModel(Pet.name) private petModel: Model<PetDocument>) {}

  async create(userId: string, createPetInput: CreatePetInput): Promise<Pet> {
    try {
      const pet = new this.petModel({
        ...createPetInput,
        userId: new Types.ObjectId(userId),
      });
      return await pet.save();
    } catch (error) {
      this.logger.error(`create: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async findByUser(userId: string): Promise<Pet[]> {
    try {
      return await this.petModel.find({ userId: new Types.ObjectId(userId) });
    } catch (error) {
      this.logger.error(`findByUser: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async findById(id: string): Promise<Pet> {
    try {
      const pet = await this.petModel.findById(id);
      if (!pet) throw new NotFoundException('Pet not found');
      return pet;
    } catch (error) {
      this.logger.error(`findById: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async update(id: string, updatePetInput: UpdatePetInput): Promise<Pet> {
    try {
      const pet = await this.petModel.findByIdAndUpdate(id, updatePetInput, {
        new: true,
      });
      if (!pet) throw new NotFoundException('Pet not found');
      return pet;
    } catch (error) {
      this.logger.error(`update: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.petModel.findByIdAndDelete(id);
      if (!result) throw new NotFoundException('Pet not found');
      return true;
    } catch (error) {
      this.logger.error(`delete: ${getErrorMessage(error)}`);
      throw error;
    }
  }
}
