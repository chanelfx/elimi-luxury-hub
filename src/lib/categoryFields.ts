// Category-specific attribute schemas for product forms
import type { CategorySlug } from "./categories";

export type FieldType = "text" | "number" | "select" | "textarea";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

const COMMON: FieldDef[] = [];

const REAL_ESTATE: FieldDef[] = [
  { key: "property_type", label: "Property type", type: "select", options: ["House", "Apartment", "Villa", "Commercial", "Office", "Shop"] },
  { key: "bedrooms", label: "Bedrooms", type: "number" },
  { key: "bathrooms", label: "Bathrooms", type: "number" },
  { key: "size_sqm", label: "Size (sqm)", type: "number" },
  { key: "listing_type", label: "Listing", type: "select", options: ["For Sale", "For Rent"] },
];

const LAND: FieldDef[] = [
  { key: "size_sqm", label: "Size (sqm)", type: "number" },
  { key: "land_type", label: "Land type", type: "select", options: ["Residential", "Commercial", "Agricultural", "Industrial"] },
  { key: "title_deed", label: "Title deed", type: "select", options: ["Yes", "No", "In process"] },
];

const VEHICLE: FieldDef[] = [
  { key: "make", label: "Make", type: "text", placeholder: "Toyota, BMW…" },
  { key: "model", label: "Model", type: "text" },
  { key: "year", label: "Year", type: "number" },
  { key: "mileage_km", label: "Mileage (km)", type: "number" },
  { key: "transmission", label: "Transmission", type: "select", options: ["Manual", "Automatic"] },
  { key: "fuel", label: "Fuel", type: "select", options: ["Petrol", "Diesel", "Hybrid", "Electric"] },
  { key: "color", label: "Color", type: "text" },
];

const PHONE: FieldDef[] = [
  { key: "make", label: "Brand", type: "text", placeholder: "iPhone, Samsung…" },
  { key: "model", label: "Model", type: "text" },
  { key: "storage_gb", label: "Storage (GB)", type: "number" },
  { key: "ram_gb", label: "RAM (GB)", type: "number" },
  { key: "color", label: "Color", type: "text" },
];

const COMPUTER: FieldDef[] = [
  { key: "make", label: "Brand", type: "text", placeholder: "Dell, HP, Apple…" },
  { key: "model", label: "Model", type: "text" },
  { key: "cpu", label: "Processor", type: "text" },
  { key: "ram_gb", label: "RAM (GB)", type: "number" },
  { key: "storage_gb", label: "Storage (GB)", type: "number" },
  { key: "screen_inch", label: "Screen (inch)", type: "number" },
];

const ELECTRONICS: FieldDef[] = [
  { key: "make", label: "Brand", type: "text" },
  { key: "model", label: "Model", type: "text" },
  { key: "warranty_months", label: "Warranty (months)", type: "number" },
];

const FURNITURE: FieldDef[] = [
  { key: "material", label: "Material", type: "text" },
  { key: "dimensions", label: "Dimensions", type: "text", placeholder: "L x W x H" },
  { key: "color", label: "Color", type: "text" },
];

const FASHION: FieldDef[] = [
  { key: "brand", label: "Brand", type: "text" },
  { key: "size", label: "Size", type: "text" },
  { key: "color", label: "Color", type: "text" },
  { key: "gender", label: "Gender", type: "select", options: ["Men", "Women", "Unisex", "Kids"] },
];

export const CATEGORY_FIELDS: Record<CategorySlug, FieldDef[]> = {
  "real-estate": REAL_ESTATE,
  land: LAND,
  vehicles: VEHICLE,
  cars: VEHICLE,
  motorcycles: VEHICLE,
  trucks: VEHICLE,
  smartphones: PHONE,
  tablets: PHONE,
  computers: COMPUTER,
  laptops: COMPUTER,
  electronics: ELECTRONICS,
  tvs: ELECTRONICS,
  cameras: ELECTRONICS,
  furniture: FURNITURE,
  fashion: FASHION,
  accessories: FASHION,
  rentals: COMMON,
  services: COMMON,
  "home-equipment": ELECTRONICS,
  "office-equipment": ELECTRONICS,
  others: COMMON,
};

export const CONDITIONS = ["New", "Like New", "Good", "Fair", "Used"];
