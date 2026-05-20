import type { TranslationKey } from "@/i18n/translations";

export type CategorySlug =
  | "real-estate"
  | "land"
  | "vehicles"
  | "cars"
  | "motorcycles"
  | "trucks"
  | "computers"
  | "laptops"
  | "smartphones"
  | "tablets"
  | "electronics"
  | "tvs"
  | "cameras"
  | "furniture"
  | "fashion"
  | "accessories"
  | "rentals"
  | "services"
  | "home-equipment"
  | "office-equipment"
  | "others";

export interface CategoryDef {
  slug: CategorySlug;
  icon: string; // lucide icon name
  tKey: keyof TranslationKey["categories"];
  group: "property" | "vehicles" | "tech" | "lifestyle" | "other";
}

export const CATEGORIES: CategoryDef[] = [
  { slug: "real-estate", icon: "Building2", tKey: "realEstate", group: "property" },
  { slug: "land", icon: "MapPin", tKey: "land", group: "property" },
  { slug: "vehicles", icon: "Car", tKey: "vehicles", group: "vehicles" },
  { slug: "cars", icon: "Car", tKey: "cars", group: "vehicles" },
  { slug: "motorcycles", icon: "Bike", tKey: "motorcycles", group: "vehicles" },
  { slug: "trucks", icon: "Truck", tKey: "trucks", group: "vehicles" },
  { slug: "computers", icon: "Monitor", tKey: "computers", group: "tech" },
  { slug: "laptops", icon: "Laptop", tKey: "laptops", group: "tech" },
  { slug: "smartphones", icon: "Smartphone", tKey: "smartphones", group: "tech" },
  { slug: "tablets", icon: "Tablet", tKey: "tablets", group: "tech" },
  { slug: "electronics", icon: "Cpu", tKey: "electronics", group: "tech" },
  { slug: "tvs", icon: "Tv", tKey: "tvs", group: "tech" },
  { slug: "cameras", icon: "Camera", tKey: "cameras", group: "tech" },
  { slug: "furniture", icon: "Sofa", tKey: "furniture", group: "lifestyle" },
  { slug: "fashion", icon: "Shirt", tKey: "fashion", group: "lifestyle" },
  { slug: "accessories", icon: "Watch", tKey: "accessories", group: "lifestyle" },
  { slug: "rentals", icon: "KeyRound", tKey: "rentals", group: "lifestyle" },
  { slug: "services", icon: "Wrench", tKey: "services", group: "lifestyle" },
  { slug: "home-equipment", icon: "Home", tKey: "homeEquipment", group: "lifestyle" },
  { slug: "office-equipment", icon: "Briefcase", tKey: "officeEquipment", group: "other" },
  { slug: "others", icon: "Package", tKey: "tKey" as never, group: "other" },
];

// Fixed: ensure "others" maps to the correct key
CATEGORIES[CATEGORIES.length - 1].tKey = "others";
