import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { getErrorMessage } from '../../common/utils/error.util';

export interface UploadResult {
  url: string;
  publicId: string;
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    base64Image: string,
    folder: string,
  ): Promise<UploadResult> {
    try {
      this.logger.log(`Uploading image to folder: ${folder}`);
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: `pawmart/${folder}`,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      });
      this.logger.log(`Image uploaded: ${result.public_id}`);
      return { url: result.secure_url, publicId: result.public_id };
    } catch (error) {
      this.logger.error(`uploadImage: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      this.logger.log(`Deleting image: ${publicId}`);
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      this.logger.error(`deleteImage: ${getErrorMessage(error)}`);
      throw error;
    }
  }
  async uploadFile(
    base64File: string,
    folder: string,
    resourceType: 'image' | 'video' | 'auto' = 'auto',
  ): Promise<UploadResult> {
    try {
      this.logger.log(`Uploading ${resourceType} to folder: ${folder}`);
      const result = await cloudinary.uploader.upload(base64File, {
        folder: `pawmart/${folder}`,
        resource_type: resourceType,
        transformation:
          resourceType === 'image'
            ? [{ quality: 'auto', fetch_format: 'auto' }]
            : [],
      });
      return { url: result.secure_url, publicId: result.public_id };
    } catch (error) {
      this.logger.error(`uploadFile: ${getErrorMessage(error)}`);
      throw error;
    }
  }
}
