import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  presentation: string | null;
  price: number;
  available: boolean;
  image_url: string | null;
};

const categoryNames: Record<string, string> = {
  aguardientes: "Aguardientes",
  whiskies: "Whiskies",
  cervezas: "Cervezas",
  vinos: "Vinos",
  cocteles: "Cocteles",
  snacks: "Snacks",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const categoryName = categoryNames[category] ?? "Nuestra Carta";

  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select("id, name")
    .eq("slug", category)
    .limit(1)
    .maybeSingle();

  if (categoryError) {
    console.error(
      "ERROR CATEGORIA:",
      JSON.stringify(categoryError, null, 2)
    );
  }

  let categoryProducts: Product[] = [];

  if (categoryData) {
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select(
        "id, name, presentation, price, available, image_url"
      )
      .eq("category_id", categoryData.id)
      .order("sort_order", { ascending: true });

    if (productsError) {
      console.error(
        "ERROR PRODUCTOS:",
        JSON.stringify(productsError, null, 2)
      );
    }

    categoryProducts = productsData ?? [];
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white">

      {/* ENCABEZADO */}

      <header className="mx-auto max-w-2xl">

        <Link
          href="/menu"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-widest text-white/60 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <span className="text-lg leading-none">←</span>
          VOLVER
        </Link>

        <div className="mt-10 text-center">

          <img
            src="/logo/logo-mao.png"
            alt="Mao Licores"
            className="mx-auto mb-5 w-20"
          />

          <p className="text-xs tracking-[0.3em] text-white/40">
            MAO LICORES
          </p>

          <h1 className="mt-3 text-3xl font-semibold">
            {categoryName}
          </h1>

        </div>

      </header>

      {/* PRODUCTOS */}

      <section className="mx-auto mt-10 max-w-2xl">

        <div className="divide-y divide-white/10">

          {categoryProducts.map((product) => (

            <article
              key={product.id}
              className={`flex items-center gap-4 py-5 ${
                !product.available ? "opacity-60" : ""
              }`}
            >

              {/* FOTO */}

              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/5">

                {product.image_url ? (

                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-contain p-2"
                  />

                ) : (

                  <div className="flex h-full items-center justify-center text-xs text-white/20">
                    SIN FOTO
                  </div>

                )}

              </div>

              {/* INFORMACIÓN */}

              <div className="min-w-0 flex-1">

                <h2 className="font-medium leading-tight">
                  {product.name}
                </h2>

                <p className="mt-1 text-sm text-white/40">
                  {product.presentation ?? ""}
                </p>

                {/* ESTADO */}

                <div className="mt-2">

                  {product.available ? (

                    <span className="inline-block rounded-md bg-green-500/15 px-2.5 py-1 text-[9px] font-semibold tracking-wider text-green-400">
                      DISPONIBLE
                    </span>

                  ) : (

                    <span className="inline-block rounded-md bg-red-500/15 px-2.5 py-1 text-[9px] font-semibold tracking-wider text-red-400">
                      AGOTADO
                    </span>

                  )}

                </div>

              </div>

              {/* PRECIO */}

              <div className="shrink-0 text-right">

                <p className="font-semibold text-white">
                  {formatPrice(product.price)}
                </p>

              </div>

            </article>

          ))}

        </div>

        {/* SIN PRODUCTOS */}

        {categoryProducts.length === 0 && (

          <div className="py-20 text-center">

            <p className="text-sm text-white/40">
              No encontramos productos en esta categoría.
            </p>

          </div>

        )}

      </section>

    </main>
  );
}