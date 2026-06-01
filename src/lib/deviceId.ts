// Persistent anonymous device identifier for like tracking
const KEY = "elimi_device_id";

export function getDeviceId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)) + "-" + Date.now();
    localStorage.setItem(KEY, id);
  }
  return id;
}

const LIKED_KEY = "elimi_liked_products";

export function getLikedSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

export function setLiked(productId: string, liked: boolean) {
  const s = getLikedSet();
  if (liked) s.add(productId);
  else s.delete(productId);
  localStorage.setItem(LIKED_KEY, JSON.stringify([...s]));
}
