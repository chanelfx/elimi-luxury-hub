// Cloudinary unsigned upload helper for Elimi Trust Ltd
export const CLOUDINARY_CLOUD_NAME = "dcncethrs";
export const CLOUDINARY_UPLOAD_PRESET = "elimitrusteltd";

export interface CloudinaryAsset {
  url: string;
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  resourceType: "image" | "video" | "raw";
  bytes: number;
}

export async function uploadToCloudinary(
  file: File,
  opts?: { onProgress?: (pct: number) => void; folder?: string },
): Promise<CloudinaryAsset> {
  const isVideo = file.type.startsWith("video/");
  const resource = isVideo ? "video" : "image";
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resource}/upload`;

  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    if (opts?.folder) form.append("folder", opts.folder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    if (opts?.onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          opts.onProgress!(Math.round((e.loaded / e.total) * 100));
        }
      });
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText);
          resolve({
            url: json.url,
            secureUrl: json.secure_url,
            publicId: json.public_id,
            width: json.width,
            height: json.height,
            format: json.format,
            resourceType: json.resource_type,
            bytes: json.bytes,
          });
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error(`Cloudinary upload failed: ${xhr.status} ${xhr.responseText}`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error uploading to Cloudinary"));
    xhr.send(form);
  });
}

/** Return an optimized Cloudinary URL for a given secure_url with width/quality transforms. */
export function cldOptimized(secureUrl: string, width = 800): string {
  if (!secureUrl.includes("/upload/")) return secureUrl;
  return secureUrl.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width},c_limit/`,
  );
}
