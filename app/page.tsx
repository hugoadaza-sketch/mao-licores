                                    export default function Home() {
                                      return (
                                        <main className="min-h-screen bg-black text-white">

                                          <section className="relative min-h-screen overflow-hidden">

                                            {/* Foto del local */}
                                            <img
                                              src="/imagenes/frente-mao.png"
                                              alt="Mao Licores"
                                              className="absolute inset-0 h-full w-full object-cover"
                                            />

                                            {/* Oscurecer la fotografía */}
                                            <div className="absolute inset-0 bg-black/65" />

                                            {/* Degradado inferior */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20" />

                                            {/* Contenido */}
                                            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">

                                              {/* Logo */}
                                              <img
                                                src="/logo/logo-mao.png"
                                                alt="Logo Mao Licores"
                                                className="mb-8 w-32 sm:w-40"
                                              />

                                              {/* Nombre */}
                                              <h1 className="text-4xl font-semibold tracking-[0.18em] sm:text-6xl">
                                                MAO LICORES
                                              </h1>

                                              {/* Slogan */}
                                              <p className="mt-5 text-sm tracking-[0.15em] text-white/70 sm:text-base">
                                                Est. 1995 • El punto exacto de tu noche
                                              </p>

                                              {/* Botón */}
                                              <a
                                                href="/menu"
                                                className="mt-12 rounded-full border border-white/30
                                                          px-12 py-4 text-sm font-medium
                                                          tracking-[0.2em]
                                                          transition-all duration-300
                                                          hover:bg-white
                                                          hover:text-black
                                                          hover:border-white"
                                              >
                                                VER CARTA
                                              </a>

                                            </div>

                                            {/* Indicador inferior */}
                                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] text-white/40">
                                              DESCUBRE MAO
                                            </div>

                                          </section>

                                        </main>
                                      );
                                    }