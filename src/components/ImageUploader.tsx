import { useState } from "react";
import { Upload, Loader2, X, Image as ImageIcon } from "lucide-react";
import { uploadToCloudinary, cldOptimized } from "@/lib/cloudinary";
import { toast } from "sonner";

export interface UploadedImage {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

export function ImageUploader({
  images,
  onChange,
  max = 12,
}: {
  images: UploadedImage[];
  onChange: (imgs: UploadedImage[]) => void;
  max?: number;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handle = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = max - images.length;
    const list = Array.from(files).slice(0, remaining);
    if (list.length === 0) {
      toast.error(`Max ${max} images`);
      return;
    }
    setUploading(true);
    const out: UploadedImage[] = [...images];
    for (const f of list) {
      try {
        const asset = await uploadToCloudinary(f, {
          folder: "elimi-products",
          onProgress: setProgress,
        });
        out.push({
          url: asset.secureUrl,
          publicId: asset.publicId,
          width: asset.width,
          height: asset.height,
        });
      } catch (err) {
        toast.error(`Failed: ${f.name}`);
        console.error(err);
      }
    }
    setUploading(false);
    setProgress(0);
    onChange(out);
  };

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((img, i) => (
          <div key={img.publicId} className="relative group aspect-square rounded-xl overflow-hidden bg-white/5">
            <img src={cldOptimized(img.url, 300)} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(images.filter((_, idx) => idx !== i))}
              className="absolute top-1.5 right-1.5 h-7 w-7 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider bg-[var(--color-gold)] text-[var(--color-gold-foreground)] font-semibold">
                Cover
              </span>
            )}
          </div>
        ))}
        {images.length < max && (
          <label className="aspect-square rounded-xl border border-dashed border-white/15 hover:border-[var(--color-gold)]/40 flex flex-col items-center justify-center cursor-pointer text-xs text-muted-foreground hover:text-foreground transition">
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mb-1" />
                <span>{progress}%</span>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mb-1" />
                <span>Add image</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => handle(e.target.files)}
              disabled={uploading}
            />
          </label>
        )}
      </div>
      {images.length === 0 && !uploading && (
        <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5">
          <ImageIcon className="h-3 w-3" />
          First image becomes the cover. Up to {max} images.
        </p>
      )}
    </div>
  );
}
