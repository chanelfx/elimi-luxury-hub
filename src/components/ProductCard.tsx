import { Link } from "@tanstack/react-router";
import { Heart, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { cldOptimized } from "@/lib/cloudinary";

export interface ProductSummary {
  id: string;
  slug: string;
  title: string;
  price: number | null;
  currency: string;
  location: string | null;
  category: string;
  status: "draft" | "available" | "reserved" | "sold";
  is_featured: boolean;
  images: { url: string; publicId: string }[];
  likes_count: number;
}

function formatPrice(p: number | null, c: string) {
  if (p === null || p === undefined) return "Contact for price";
  return new Intl.NumberFormat("en-RW", { maximumFractionDigits: 0 }).format(p) + " " + c;
}

const statusStyles: Record<string, string> = {
  available: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  reserved: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  sold: "bg-red-500/15 text-red-300 border-red-500/20",
  draft: "bg-white/5 text-muted-foreground border-white/10",
};

export function ProductCard({ p, index = 0 }: { p: ProductSummary; index?: number }) {
  const img = p.images?.[0];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.4 }}
    >
      <Link
        to="/products/$slug"
        params={{ slug: p.slug }}
        className="group block glass rounded-2xl overflow-hidden hover-lift hover:border-[var(--color-gold)]/30"
      >
        <div className="relative aspect-[4/3] bg-white/5 overflow-hidden">
          {img ? (
            <img
              src={cldOptimized(img.url, 700)}
              alt={p.title}
              loading="lazy"
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {p.is_featured && (
              <span className="px-2 py-1 rounded-md text-[10px] uppercase tracking-wider bg-[var(--color-gold)] text-[var(--color-gold-foreground)] font-semibold">
                Featured
              </span>
            )}
            <span
              className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-wider border ${statusStyles[p.status]}`}
            >
              {p.status}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 backdrop-blur text-[11px]">
            <Heart className="h-3 w-3" />
            {p.likes_count}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm md:text-base line-clamp-1 group-hover:text-[var(--color-gold)] transition-colors">
            {p.title}
          </h3>
          {p.location && (
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">{p.location}</span>
            </div>
          )}
          <div className="mt-3 text-base font-bold text-gradient-gold">
            {formatPrice(p.price, p.currency)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
