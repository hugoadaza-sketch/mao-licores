import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Product = {
  id: string;
  name: string;
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

  const categoryName =
    categoryNames[category] ?? "Nuestra Carta";

  const { data: categoryData, error: categoryError } =
    await supabase
      .from("categories")
      .select("id, name, active")
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
    const { data: productsData, error: productsError } =
      await supabase
        .from("products")
        .select("id, name, price, available, image_url")
        .eq("category_id", categoryData.id)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

    if (productsError) {
      console.error(
        "ERROR PRODUCTOS:",
        JSON.stringify(productsError, null, 2)
      );
    }

    categoryProducts = productsData ?? [];
  }

  return (
    <main className="min-h-screen bg-white text-black">

      {/* ================================ */}
      {/* ENCABEZADO */}
      {/* ================================ */}

      <header className="border-b border-black/10">

        <div className="mx-auto max-w-5xl px-5 py-6">

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.02] px-4 py-2 text-xs tracking-widest text-black/60 transition hover:border-black/20 hover:bg-black hover:text-white"
          >
            <span className="text-lg leading-none">
              ←
            </span>

            CARTA
          </Link>

          <div className="mt-10 text-center">

            <img
              src="/logo/logo-mao.png"
              alt="Mao Licores"
              className="mx-auto w-16"
            />

            <p className="mt-5 text-[10px] font-medium tracking-[0.4em] text-black/40">
              MAO LICORES
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              {categoryName}
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm text-black/50">
              Nuestra selección para tu noche.
            </p>

          </div>

        </div>

      </header>

      {/* ================================ */}
      {/* PRODUCTOS */}
      {/* ================================ */}

      <section className="mx-auto max-w-5xl px-5 py-10">

        {categoryProducts.length === 0 ? (

          <div className="rounded-3xl border border-black/10 bg-black/[0.02] px-5 py-20 text-center">

            <p className="text-sm text-black/40">
              No encontramos productos en esta categoría.
            </p>

            <Link
              href="/menu"
              className="mt-6 inline-flex rounded-full border border-black/15 px-5 py-3 text-xs tracking-widest text-black/60 transition hover:border-black/30 hover:bg-black hover:text-white"
            >
              VOLVER A LA CARTA
            </Link>

          </div>

        ) : (

          <div className="divide-y divide-black/10">

            {categoryProducts.map((product) => (

              <article
                key={product.id}
                className={`flex gap-5 py-7 ${
                  !product.available
                    ? "opacity-60"
                    : ""
                }`}
              >

                {/* FOTO */}

                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-black/[0.02] sm:h-36 sm:w-36">

                  {product.image_url ? (

                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-contain p-3 transition duration-500 hover:scale-105"
                    />

                  ) : (

                    <div className="flex h-full items-center justify-center">

                      <div className="text-center">

                        <img
                          src="/logo/logo-mao.png"
                          alt=""
                          className="mx-auto w-10 opacity-20"
                        />

                        <p className="mt-2 text-[9px] tracking-widest text-black/20">
                          SIN FOTO
                        </p>

                      </div>

                    </div>

                  )}

                </div>

                {/* INFORMACIÓN */}

                <div className="flex min-w-0 flex-1 flex-col justify-center">

                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">

                      <h2 className="text-lg font-medium leading-tight sm:text-xl">
                        {product.name}
                      </h2>

                      {/* ESTADO */}

                      <div className="mt-3">

                        {product.available ? (

                          <span className="inline-flex rounded-md bg-green-100 px-3 py-1.5 text-[9px] font-semibold tracking-[0.15em] text-green-700">
                            DISPONIBLE
                          </span>

                        ) : (

                          <span className="inline-flex rounded-md bg-red-100 px-3 py-1.5 text-[9px] font-semibold tracking-[0.15em] text-red-700">
                            AGOTADO
                          </span>

                        )}

                      </div>

                    </div>

                    {/* PRECIO */}

                    <div className="shrink-0 text-right">

                      <p className="text-base font-semibold sm:text-lg">
                        {formatPrice(product.price)}
                      </p>

                    </div>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

      {/* ================================ */}
      {/* PIE */}
      {/* ================================ */}

      <footer className="border-t border-black/10">

        <div className="mx-auto max-w-5xl px-5 py-8 text-center">

          <Link
            href="/menu"
            className="text-xs tracking-[0.25em] text-black/30 transition hover:text-black/60"
          >
            ← VOLVER A LA CARTA
          </Link>

          <p className="mt-5 text-[10px] tracking-[0.3em] text-black/20">
            MAO LICORES
          </p>

        </div>

      </footer>

    </main>
  );
}