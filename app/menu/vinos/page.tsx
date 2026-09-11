import Link from "next/link";

const subcategories = [
  {
    name: "Vino Tinto",
    slug: "vino-tinto",
  },
  {
    name: "Vino Rosado",
    slug: "vino-rosado",
  },
  {
    name: "Vino Blanco",
    slug: "vino-blanco",
  },
  {
    name: "Champañas",
    slug: "champanas",
  },
];

export default function VinosPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto min-h-screen max-w-3xl px-5 py-8">

        <header className="mb-10">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-medium tracking-widest text-black/60 transition hover:bg-black hover:text-white"
          >
            <span>←</span>
            CARTA
          </Link>

          <div className="mt-8">
            <p className="text-xs font-medium tracking-[0.3em] text-black/40">
              MAO LICORES
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              Vinos
            </h1>

            <p className="mt-3 text-sm text-black/50">
              Selecciona una categoría
            </p>
          </div>
        </header>

        <section className="grid gap-4">
          {subcategories.map((subcategory) => (
            <Link
              key={subcategory.slug}
              href={`/menu/vinos/${subcategory.slug}`}
              className="group flex items-center justify-between rounded-2xl border border-black/10 bg-black/[0.02] px-5 py-6 transition hover:border-black/30 hover:bg-black hover:text-white"
            >
              <div>
                <h2 className="text-lg font-semibold">
                  {subcategory.name}
                </h2>

                <p className="mt-1 text-xs text-black/40 group-hover:text-white/50">
                  Ver productos
                </p>
              </div>

              <span className="text-xl text-black/30 transition group-hover:translate-x-1 group-hover:text-white">
                →
              </span>
            </Link>
          ))}
        </section>

      </div>
    </main>
  );
}