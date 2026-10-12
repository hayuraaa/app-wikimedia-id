// Kecilkan foto di browser sebelum diunggah ke dashboard.
// Foto ponsel 5–8 MB menjadi ratusan KB, sehingga tidak tertolak batas upload server
// dan unggahan lebih cepat. Server tetap mengonversi hasilnya ke WebP.

/** Batas aman ukuran file setelah dikecilkan (di bawah batas upload server production) */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/** Batas ukuran file asli yang masih mau diproses browser */
export const MAX_SOURCE_BYTES = 30 * 1024 * 1024;

const ACCEPTED = /^image\/(jpeg|png|gif|webp)$/;

type Options = { maxSize: number; quality?: number };

export class ImageTooLargeError extends Error {}

export function formatBytes(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Perkecil gambar sehingga sisi terpanjangnya ≤ maxSize piksel dan simpan sebagai JPEG.
 * - Orientasi EXIF foto ponsel dihormati
 * - Latar transparan (PNG) diberi warna putih
 * - GIF tidak diubah agar animasi tidak hilang
 * - Bila hasilnya tidak lebih kecil, file asli yang dipakai
 */
export async function compressImage(file: File, { maxSize, quality = 0.85 }: Options): Promise<File> {
  if (!ACCEPTED.test(file.type)) throw new Error("Format gambar harus JPG, PNG, GIF, atau WebP.");
  if (file.size > MAX_SOURCE_BYTES) throw new ImageTooLargeError(`Ukuran gambar ${formatBytes(file.size)} terlalu besar (maks ${formatBytes(MAX_SOURCE_BYTES)}).`);

  if (file.type === "image/gif") return assertUploadable(file);

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // Browser tidak bisa membaca gambar ini; biarkan server yang memutuskan
    return assertUploadable(file);
  }

  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  // Gambar kecil yang sudah ringan tidak perlu diproses ulang
  if (scale === 1 && file.size <= 1024 * 1024) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return assertUploadable(file);
  }
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  if (!blob || blob.size >= file.size) return assertUploadable(file);

  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return assertUploadable(new File([blob], name, { type: "image/jpeg", lastModified: Date.now() }));
}

function assertUploadable(file: File): File {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ImageTooLargeError(`Ukuran gambar ${formatBytes(file.size)} terlalu besar (maks ${formatBytes(MAX_UPLOAD_BYTES)}). Gunakan gambar yang lebih kecil.`);
  }
  return file;
}
