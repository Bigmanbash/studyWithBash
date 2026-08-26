// Barrel export — import R2 storage utilities from @/lib/r2
export { r2 } from "./client";
export { uploadFile, getSignedUrl, getSignedUrls, deleteFile, deleteFiles } from "./storage";
export type { StoragePath } from "./storage";
export { toStoragePath } from "./storage";
