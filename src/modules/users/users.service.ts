import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { getErrorMessage } from '../../common/utils/error.util';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    this.logger.log(`Finding user by email: ${email}`);
    try {
      return this.userModel.findOne({ email });
    } catch (error) {
      this.logger.error(
        `Failed to find user by email: ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async findById(id: string): Promise<UserDocument | null> {
    this.logger.log(`Finding user by id: ${id}`);
    try {
      return this.userModel.findById(id);
    } catch (error) {
      this.logger.error(`Failed to find user by id: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async create(data: Partial<User>): Promise<UserDocument> {
    this.logger.log(`Creating user: ${data.email}`);
    try {
      const user = await this.userModel.create(data);
      this.logger.log(`User created: ${user._id}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to create user: ${getErrorMessage(error)}`);
      throw error;
    }
  }
}
