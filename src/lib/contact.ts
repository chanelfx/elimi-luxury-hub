// Centralised brand contact information for Elimi Trust Ltd
export const BRAND = {
  name: "Elimi Trust Ltd",
  email: "elimitrustltd1996@gmail.com",
  phones: ["07407992", "0786520082"],
  whatsapp: ["07407992", "0786520082"],
  // Rwanda country code +250 — strip leading 0
  whatsappIntl: ["250740799200", "250786520082"],
  social: {
    instagram: "elimitrusteltd",
    instagramUrl: "https://instagram.com/elimitrusteltd",
    tiktok: "elimi trust",
    tiktokUrl: "https://www.tiktok.com/@elimitrust",
    facebook: "elimi trust",
    facebookUrl: "https://www.facebook.com/elimitrust",
  },
} as const;

export function buildWhatsAppLink(message: string, phoneIndex = 0): string {
  const phone = BRAND.whatsappIntl[phoneIndex] ?? BRAND.whatsappIntl[0];
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppLink(opts: {
  productTitle: string;
  productId: string;
  shareMessage: string;
  origin?: string;
}): string {
  const origin = opts.origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  const link = `${origin}/products/${opts.productId}`;
  const message = `${opts.shareMessage} ${opts.productTitle}\n${link}\nID: ${opts.productId}`;
  return buildWhatsAppLink(message);
}
