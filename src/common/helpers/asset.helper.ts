export class AssetHelper {
  static getAssetUrl(path: string) {
    return `${process.env.STORAGE_API_HOST}/storage/${path}`;
  }
}
