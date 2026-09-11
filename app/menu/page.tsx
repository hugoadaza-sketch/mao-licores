import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Category = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  active: boolean;
};

export default async function MenuPage() {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug, image_url, active")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  /* =========================================
     ERROR DE SUPABASE
     ========================================= */

  if (error) {
    console.error(
      "ERROR CATEGORIAS:",
      JSON.stringify(error, null, 2)
    );

    return (
      <main className="min-h-screen bg-white px-5 py-20 text-black">
        <div className="mx-auto max-w-xl">

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

            <p className="text-xs font-semibold tracking-[0.25em] text-red-600">
              MAO LICORES
            </p>

            <h1 className="mt-3 text-xl font-semibold text-red-700">
              Error conectando con Supabase
            </h1>

            <p className="mt-3 text-sm text-black/50">
              La aplicación está publicada, pero no pudo obtener
              las categorías.
            </p>

            <pre className="mt-5 max-h-80 overflow-auto rounded-xl bg-black p-4 text-xs leading-5 text-red-300">
              {JSON.stringify(error, null, 2)}
            </pre>

          </div>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black px-5 py-3 text-xs tracking-widest text-white transition hover:bg-black/80"
          >
            <span className="text-base">
              ←
            </span>

            VOLVER
          </Link>

        </div>
      </main>
    );
  }

  const categoryList: Category[] = categories ?? [];

  /* =========================================
     CARTA
     ========================================= */

  return (
    <main className="min-h-screen bg-white text-black">

      {/* =========================================
          ENCABEZADO
          ========================================= */}

      <header className="border-b border-black/10">

        <div className="mx-auto max-w-6xl px-5 py-6">

          <div className="flex items-center justify-between gap-4">

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.02] px-4 py-2 text-xs tracking-widest text-black/60 transition hover:border-black/20 hover:bg-black hover:text-white"
            >
              <span className="text-base leading-none">
                ←
              </span>

              VOLVER
            </Link>

            <Link
              href="/"
              className="flex items-center"
            >
              <img
                src="/logo/logo-mao.png"
                alt="Mao Licores"
                className="w-10"
              />
            </Link>

          </div>

        </div>

      </header>

      {/* =========================================
          TÍTULO
          ========================================= */}

      <section className="mx-auto max-w-6xl px-5 pt-12">

        <div className="text-center">

          <p className="text-[10px] font-medium tracking-[0.4em] text-black/40">
            MAO LICORES
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Nuestra Carta
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-black/50">
            Descubre nuestra selección y encuentra todo lo que
            necesitas para disfrutar tu noche.
          </p>

        </div>

      </section>

      {/* =========================================
          CATEGORÍAS
          ========================================= */}

      <section className="mx-auto max-w-6xl px-5 pb-20 pt-12">

        {categoryList.length === 0 ? (

          <div className="rounded-3xl border border-black/10 bg-black/[0.02] px-5 py-20 text-center">

            <p className="text-sm text-black/40">
              No hay categorías disponibles.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {categoryList.map((category) => (

              <Link
                key={category.id}
                href={
                  category.slug === "vinos"
                    ? "/menu/vinos"
                    : `/menu/${category.slug}`
                }
                className="group"
              >

                <article className="relative overflow-hidden rounded-3xl border border-black/10 bg-black/[0.02] transition-all duration-500 hover:-translate-y-1 hover:border-black/20 hover:shadow-lg">

                  {/* FOTO */}

                  <div className="relative aspect-[4/5] overflow-hidden bg-black/[0.02]">

                    {category.image_url ? (

                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center">

                        <div className="text-center">

                          <img
                            src="/logo/logo-mao.png"
                            alt=""
                            className="mx-auto w-16 opacity-20"
                          />

                          <p className="mt-4 text-[10px] tracking-[0.3em] text-black/20">
                            MAO LICORES
                          </p>

                        </div>

                      </div>

                    )}

                    {/* DEGRADADO */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* TEXTO */}

                    <div className="absolute inset-x-0 bottom-0 p-6">

                      <div className="flex items-end justify-between gap-4">

                        <div>

                          <h2 className="text-2xl font-semibold tracking-tight text-white">
                            {category.name}
                          </h2>

                          <p className="mt-2 text-xs tracking-[0.2em] text-white/60 transition group-hover:text-white">
                            VER PRODUCTOS
                          </p>

                        </div>

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/30 text-lg text-white/70 backdrop-blur-sm transition group-hover:border-white group-hover:bg-white group-hover:text-black">
                          →
                        </div>

                      </div>

                    </div>

                  </div>

                </article>

              </Link>

            ))}

          </div>

        )}

      </section>

      {/* =========================================
          PIE
          ========================================= */}

      <footer className="border-t border-black/10">

        <div className="mx-auto max-w-6xl px-5 py-8 text-center">

          <p className="text-[10px] tracking-[0.3em] text-black/30">
            MAO LICORES
          </p>

          <p className="mt-2 text-xs text-black/30">
            Est. 1995 • El punto exacto de tu noche
          </p>

        </div>

      </footer>

    </main>
  );
}