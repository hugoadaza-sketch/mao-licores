import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">

        {/* =========================================
            FONDO
        ========================================= */}

        <img
          src="/imagenes/frente-mao.jpg"
          alt="Mao Licores"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* OSCURECIMIENTO PRINCIPAL */}

        <div className="absolute inset-0 bg-black/60" />

        {/* VIÑETA */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.25)_45%,rgba(0,0,0,0.85)_100%)]" />

        {/* DEGRADADO INFERIOR */}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

        {/* =========================================
            BORDE DECORATIVO
        ========================================= */}

        <div className="pointer-events-none absolute inset-5 rounded-[2rem] border border-white/10 sm:inset-8" />

        {/* =========================================
            CONTENIDO PRINCIPAL
        ========================================= */}

        <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6 text-center">

          {/* PEQUEÑA ETIQUETA */}

          <div className="mb-8 flex items-center gap-3">

            <span className="h-px w-8 bg-white/30" />

            <p className="text-[9px] font-medium tracking-[0.45em] text-white/50">
              LICORERÍA • BAR • EXPERIENCIAS
            </p>

            <span className="h-px w-8 bg-white/30" />

          </div>

          {/* LOGO */}

          <img
            src="/logo/logo-mao.png"
            alt="Mao Licores"
            className="mb-8 w-28 drop-shadow-2xl sm:w-36"
          />

          {/* NOMBRE */}

          <h1 className="text-4xl font-semibold tracking-[0.22em] text-white drop-shadow-2xl sm:text-6xl md:text-7xl">
            MAO LICORES
          </h1>

          {/* LÍNEA */}

          <div className="mt-6 h-px w-16 bg-white/30" />

          {/* SLOGAN */}

          <p className="mt-6 text-xs font-light tracking-[0.22em] text-white/65 sm:text-sm">
            EST. 1995 • EL PUNTO EXACTO DE TU NOCHE
          </p>

          {/* DESCRIPCIÓN */}

          <p className="mt-5 max-w-md text-sm leading-6 text-white/45">
            Licores, cervezas y todo lo que necesitas para disfrutar
            una buena noche.
          </p>

          {/* =========================================
              BOTÓN CARTA
          ========================================= */}

          <Link
            href="/menu"
            className="group mt-10 inline-flex items-center gap-4 rounded-full border border-white/30 bg-white/[0.04] px-8 py-4 backdrop-blur-md transition-all duration-500 hover:border-white hover:bg-white hover:text-black sm:px-10"
          >

            <span className="text-xs font-medium tracking-[0.28em]">
              VER CARTA
            </span>

            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>

          </Link>

          {/* =========================================
              INFO INFERIOR
          ========================================= */}

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">

            <div className="flex flex-col items-center">

              <span className="text-[8px] tracking-[0.5em] text-white/25">
                DESCUBRE
              </span>

              <div className="mt-3 h-8 w-px bg-gradient-to-b from-white/30 to-transparent" />

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}