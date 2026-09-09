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

  if (error) {
    console.error(
      "ERROR CATEGORIAS:",
      JSON.stringify(error, null, 2)
    );
  }

  const categoryList: Category[] = categories ?? [];

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white">

      {/* ENCABEZADO */}

      <header className="mx-auto max-w-5xl">

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-widest text-white/60 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <span className="text-lg leading-none">
            ←
          </span>

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

          <h1 className="mt-3 text-4xl font-semibold">
            Nuestra Carta
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm text-white/40">
            Explora nuestra selección de licores,
            cervezas y experiencias para tu noche.
          </p>

        </div>

      </header>

      {/* CATEGORÍAS */}

      <section className="mx-auto mt-12 max-w-5xl">

        {categoryList.length === 0 ? (

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-16 text-center">

            <p className="text-sm text-white/40">
              No hay categorías disponibles.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">

            {categoryList.map((category) => (

              <Link
                key={category.id}
                href={`/menu/${category.slug}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
              >

                <div className="relative aspect-[4/5] overflow-hidden bg-white/5">

                  {category.image_url ? (

                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                  ) : (

                    <div className="flex h-full items-center justify-center">

                      <span className="text-xs tracking-widest text-white/20">
                        MAO
                      </span>

                    </div>

                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-5">

                    <h2 className="text-lg font-semibold">
                      {category.name}
                    </h2>

                    <p className="mt-1 text-xs tracking-widest text-white/40 transition group-hover:text-white/60">
                      VER PRODUCTOS →
                    </p>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}