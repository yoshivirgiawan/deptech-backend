import * as CryptoJS from 'crypto-js';

export class HashHelper {
  static encryptMd5(data: string): string {
    return CryptoJS.MD5(data).toString();
  }
}
