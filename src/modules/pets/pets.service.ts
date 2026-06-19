import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pet, PetDocument } from './pet.schema';
import { getErrorMessage } from '../../common/utils/error.util';
import { CreatePetInput } from './dto/create-pet.input';
import { UpdatePetInput } from './dto/update-pet.input';

@Injectable()
export class PetsService {
  private readonly logger = new Logger(PetsService.name);

  constructor(@InjectModel(Pet.name) private petModel: Model<PetDocument>) {}

  async create(createPetInput: CreatePetInput): Promise<Pet> {
    try {
      const pet = new this.petModel(createPetInput);
      return await pet.save();
    } catch (error) {
      this.logger.error(`create: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async findAll(): Promise<Pet[]> {
    try {
      return await this.petModel.aggregate([
        { $match: {} },
        { $sort: { createdAt: -1 } },
      ]);
    } catch (error) {
      this.logger.error(`findAll: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async findById(id: string): Promise<Pet> {
    try {
      const result = await this.petModel.aggregate([
        { $match: { _id: new Types.ObjectId(id) } },
      ]);
      if (!result[0]) throw new NotFoundException('Pet not found');
      return result[0];
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
