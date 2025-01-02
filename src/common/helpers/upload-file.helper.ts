import axios from 'axios';
import * as FormData from 'form-data';
import { join } from 'path';
import * as fs from 'fs';

export class UploadHelper {
  static async uploadToStorage(
    file: Express.Multer.File,
    path: string,
  ): Promise<any> {
    const laravelApiUrl = process.env.STORAGE_API_HOST;
    const formData = new FormData();

    // Tambahkan file ke FormData
    formData.append(
      'file',
      fs.createReadStream(join(__dirname, '../../uploads', file.filename)),
      file.originalname,
    );

    // Tambahkan path ke FormData
    formData.append('path', path);

    try {
      const response = await axios.post(laravelApiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        'Error uploading to Laravel:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  static async uploadBase64ToStorage(
    base64File: string,
    path: string,
  ): Promise<any> {
    const laravelApiUrl =
      process.env.STORAGE_API_HOST + '/api/upload-file-base64';
    const formData = new FormData();

    formData.append('file', base64File);
    formData.append('path', path);

    try {
      const response = await axios.post(laravelApiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        'Error uploading to Laravel:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}
