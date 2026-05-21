import { createFileRoute } from "@tanstack/react-router";
import { Package } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/products")({
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <div className="max-w-5xl">
      <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold)] mb-2">
        Products
      </div>
      <h1 className="text-3xl font-bold mb-2">Product Management</h1>
      <p className="text-muted-foreground mb-8">
        Create, edit and manage marketplace listings.
      </p>
      <div className="glass rounded-2xl p-12 text-center">
        <Package className="h-10 w-10 text-[var(--color-gold)] mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">Coming in Phase 3</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Full CRUD with category-specific fields, Cloudinary image uploads, status workflow,
          featured flag, and search.
        </p>
      </div>
    </div>
  );
}
