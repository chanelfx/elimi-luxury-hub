import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Eye,
  Calendar,
} from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { cldOptimized } from "@/lib/cloudinary";
import { BRAND, buildProductWhatsAppLink } from "@/lib/contact";
import { toggleLike, incrementView } from "@/lib/products.functions";
import { getDeviceId, getLikedSet, setLiked as persistLiked } from "@/lib/deviceId";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$slug")({
  component: ProductDetailPage,
});

interface ProductDetail {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  status: "draft" | "available" | "reserved" | "sold";
  price: number | null;
  currency: string;
  location: string | null;
  brand: string | null;
  condition: string | null;
  is_featured: boolean;
  images: { url: string; publicId: string }[];
  attributes: Record<string, string | number | boolean | null>;
  views_count: number;
  likes_count: number;
  created_at: string;
}

const statusStyles: Record<string, string> = {
  available: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  reserved: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  sold: "bg-red-500/15 text-red-300 border-red-500/20",
  draft: "bg-white/5 text-muted-foreground border-white/10",
};

function formatPrice(p: number | null, c: string) {
  if (p === null || p === undefined) return "Contact for price";
  return new Intl.NumberFormat("en-RW", { maximumFractionDigits: 0 }).format(p) + " " + c;
}

function ProductDetailPage() {
  const { t } = useLanguage();
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [liked, setLikedState] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const toggleLikeFn = useServerFn(toggleLike);
  const incrementViewFn = useServerFn(incrementView);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .neq("status", "draft")
        .maybeSingle();
      if (!data) {
        setLoading(false);
        return;
      }
      const p = data as unknown as ProductDetail;
      setProduct(p);
      setLikeCount(p.likes_count);
      setLikedState(getLikedSet().has(p.id));
      setLoading(false);
      incrementViewFn({ data: { id: p.id } }).catch(() => {});
    })();
  }, [slug, incrementViewFn]);

  if (loading) {
    return (
      <PublicShell>
        <div className="container-luxe py-32 text-center text-muted-foreground">Loading…</div>
      </PublicShell>
    );
  }

  if (!product) {
    return (
      <PublicShell>
        <div className="container-luxe py-32 text-center">
          <h1 className="text-3xl font-bold mb-3">Product not found</h1>
          <Link to="/products" className="text-[var(--color-gold)] text-sm">
            ← {t.product.back}
          </Link>
        </div>
      </PublicShell>
    );
  }

  const onLike = async () => {
    const next = !liked;
    setLikedState(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    persistLiked(product.id, next);
    const res = await toggleLikeFn({ data: { product_id: product.id, device_id: getDeviceId() } });
    if (res?.count !== undefined) setLikeCount(res.count);
  };

  const onShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.title, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  const waLink = buildProductWhatsAppLink({
    productTitle: product.title,
    productId: product.id,
    shareMessage: t.product.shareMessage,
  });

  return (
    <PublicShell>
      <section className="container-luxe py-8 md:py-12">
        <button
          onClick={() => navigate({ to: "/products" })}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> {t.product.back}
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div>
            <motion.div
              key={activeImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[4/3] rounded-2xl overflow-hidden glass relative"
            >
              {product.images?.[activeImg] ? (
                <img
                  src={cldOptimized(product.images[activeImg].url, 1200)}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                {product.is_featured && (
                  <span className="px-2.5 py-1 rounded-md text-xs uppercase tracking-wider bg-[var(--color-gold)] text-[var(--color-gold-foreground)] font-semibold">
                    Featured
                  </span>
                )}
                <span
                  className={`px-2.5 py-1 rounded-md text-xs uppercase tracking-wider border ${statusStyles[product.status]}`}
                >
                  {product.status}
                </span>
              </div>
            </motion.div>
            {product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={img.publicId}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                      i === activeImg ? "border-[var(--color-gold)]" : "border-transparent opacity-60"
                    }`}
                  >
                    <img src={cldOptimized(img.url, 200)} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)] mb-2">
              {product.category.replace("-", " ")}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.title}</h1>

            <div className="mt-4 text-3xl md:text-4xl font-bold text-gradient-gold">
              {formatPrice(product.price, product.currency)}
            </div>

            <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {product.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {product.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                {product.views_count} views
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5" />
                {likeCount} likes
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(product.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer noopener"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[oklch(0.65_0.12_70)] text-[var(--color-gold-foreground)] font-semibold shadow-gold hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" />
                {t.product.contactWhatsApp}
              </a>
              <a
                href={`tel:${BRAND.phones[0]}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-white/15 hover:border-[var(--color-gold)]/40 hover:bg-white/5"
              >
                <Phone className="h-4 w-4" />
                {t.product.contactCall}
              </a>
              <button
                onClick={onLike}
                className={`h-12 w-12 inline-flex items-center justify-center rounded-xl border transition ${
                  liked
                    ? "border-red-400/40 bg-red-500/10 text-red-400"
                    : "border-white/15 hover:border-[var(--color-gold)]/40"
                }`}
                aria-label="Like"
              >
                <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={onShare}
                className="h-12 w-12 inline-flex items-center justify-center rounded-xl border border-white/15 hover:border-[var(--color-gold)]/40"
                aria-label="Share"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {product.description && (
              <div className="mt-8">
                <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                  {t.product.description}
                </h2>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            {(product.brand || product.condition || Object.keys(product.attributes ?? {}).length > 0) && (
              <div className="mt-8 glass rounded-2xl p-5">
                <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
                  {t.product.details}
                </h2>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  {product.brand && (
                    <Detail label={t.product.brand} value={product.brand} />
                  )}
                  {product.condition && (
                    <Detail label={t.product.condition} value={product.condition} />
                  )}
                  {Object.entries(product.attributes ?? {}).map(([k, v]) =>
                    v == null || v === "" ? null : (
                      <Detail key={k} label={k.replace(/_/g, " ")} value={String(v)} />
                    )
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground uppercase tracking-wider">{label}</dt>
      <dd className="font-medium capitalize">{value}</dd>
    </div>
  );
}
