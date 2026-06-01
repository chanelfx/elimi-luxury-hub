import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductForm } from "@/components/ProductForm";

export const Route = createFileRoute("/_authenticated/dashboard/products/new")({
  component: NewProductPage,
});

function NewProductPage() {
  const navigate = useNavigate();
  return (
    <ProductForm
      mode="create"
      onDone={() => navigate({ to: "/dashboard/products" })}
      onCancel={() => navigate({ to: "/dashboard/products" })}
    />
  );
}
