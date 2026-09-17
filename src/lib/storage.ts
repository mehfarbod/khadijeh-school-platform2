/**
 * Storage abstraction — files are NEVER stored in PostgreSQL.
 *
 * The default driver writes to the local filesystem (fine for a single VPS).
 * Swapping in an S3-compatible object store (e.g. ArvanCloud, MinIO) later only
 * requires implementing this interface and changing STORAGE_DRIVER.
 */

export interface StorageDriver {
  save(key: string, data: Buffer, contentType: string): Promise<{ url: string }>;
  delete(url: string): Promise<void>;
}

class LocalDiskStorage implements StorageDriver {
  constructor(private readonly baseDir: string, private readonly publicPrefix: string) {}

  async save(key: string, data: Buffer, contentType: string): Promise<{ url: string }> {
    void contentType;
    const { mkdir, writeFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const safeKey = key.replace(/\.\./g, "").replace(/^\/+/, "");
    const abs = path.join(this.baseDir, safeKey);
    await mkdir(path.dirname(abs), { recursive: true });
    await writeFile(abs, data);
    return { url: `${this.publicPrefix}/${safeKey}` };
  }

  async delete(url: string): Promise<void> {
    const { rm } = await import("node:fs/promises");
    const path = await import("node:path");
    const rel = url.replace(this.publicPrefix, "").replace(/^\/+/, "");
    await rm(path.join(this.baseDir, rel), { force: true });
  }
}

export function getStorage(): StorageDriver {
  const driver = process.env.STORAGE_DRIVER ?? "local";
  if (driver !== "local") {
    throw new Error(`STORAGE_DRIVER "${driver}" is not configured. Implement a StorageDriver for it.`);
  }
  const baseDir = process.env.STORAGE_LOCAL_DIR ?? "./public/uploads";
  const publicPrefix = process.env.STORAGE_PUBLIC_PREFIX ?? "/uploads";
  return new LocalDiskStorage(baseDir, publicPrefix);
}
