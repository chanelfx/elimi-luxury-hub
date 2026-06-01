import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductForm, type ProductFormValues } from "@/components/ProductForm";

export const Route = createFileRoute("/_authenticated/dashboard/products/edit/$id")({
  component: EditProductPage,
});

function EditProductPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<ProductFormValues | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
      if (!data) {
        navigate({ to: "/dashboard/products" });
        return;
      }
      const d = data as unknown as ProductFormValues & { id: string };
      setInitial(d);
    })();
  }, [id, navigate]);

  if (!initial) {
    return <div className="text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <ProductForm
      mode="edit"
      initial={{ ...initial, id }}
      onDone={() => navigate({ to: "/dashboard/products" })}
      onCancel={() => navigate({ to: "/dashboard/products" })}
    />
  );
}
