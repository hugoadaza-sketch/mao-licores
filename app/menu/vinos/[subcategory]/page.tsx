import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

const subcategoryNames: Record<string, string> = {
  "vino-tinto": "Vino Tinto",
  "vino-rosado": "Vino Rosado",
  "vino-blanco": "Vino Blanco",
  champanas: "Champañas",
};

type Props = {
  params: Promise<{
    subcategory: string;
  }>;
};

type Product = {
  id: string;
  name: string;
  price: number;
  available: boolean;
  image_url: string | null;
};

export default async function VinoSubcategoryPage({
  params,
}: Props) {
  const { subcategory } = await params;

  const title = subcategoryNames[subcategory];

  if (!title) {
    notFound();
  }


  const { data: categoryData, error: categoryError } =
    await supabase
      .from("categories")
      .select("id")
      .eq("slug", "vinos")
      .single();

  if (categoryError || !categoryData) {
    return (
      <main className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-3xl px-5 py-10">
          <p className="text-sm text-red-600">
            No se pudo cargar la categoría Vinos.
          </p>
        </div>
      </main>
    );
  }

  const { data: products, error: productsError } =
    await supabase
      .from("products")
      .select("id, name, price, available, image_url")
      .eq("category_id", categoryData.id)
      .eq("subcategory", subcategory)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

  if (productsError) {
    return (
      <main className="min-h-screen bg-white text-black">
        <div className="mx-auto max-w-3xl px-5 py-10">
          <p className="text-sm text-red-600">
            No se pudieron cargar los productos.
          </p>
        </div>
      </main>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto min-h-screen max-w-3xl px-5 py-8">

        <header className="mb-10">
          <Link
            href="/menu/vinos"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-medium tracking-widest text-black/60 transition hover:bg-black hover:text-white"
          >
            <span>←</span>
            VINOS
          </Link>

          <div className="mt-8">
            <p className="text-xs font-medium tracking-[0.3em] text-black/40">
              MAO LICORES
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              {title}
            </h1>
          </div>
        </header>

        <section className="space-y-4">
          {products && products.length > 0 ? (
            products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-black/10 bg-white"
              >
                {product.image_url && (
                  <div className="flex h-64 items-center justify-center bg-black/[0.02] p-6">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {product.name}
                      </h2>

                      <span
                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-[10px] font-semibold tracking-widest ${
                          product.available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.available
                          ? "DISPONIBLE"
                          : "AGOTADO"}
                      </span>
                    </div>

                    <p className="whitespace-nowrap text-lg font-semibold">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-black/10 p-8 text-center">
              <p className="text-sm text-black/40">
                No hay productos en esta categoría todavía.
              </p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}