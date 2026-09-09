"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Correo o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-5 text-white">
      <div className="w-full max-w-md">

        {/* LOGO */}

        <div className="mb-10 text-center">
          <img
            src="/logo/logo-mao.png"
            alt="Mao Licores"
            className="mx-auto w-20"
          />

          <p className="mt-5 text-xs tracking-[0.3em] text-white/40">
            MAO LICORES
          </p>

          <h1 className="mt-3 text-3xl font-semibold">
            Acceso administrativo
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Inicia sesión para administrar la carta.
          </p>
        </div>

        {/* FORMULARIO */}

        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >

          {/* EMAIL */}

          <div>
            <label className="mb-2 block text-sm text-white/70">
              Correo electrónico
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-white/30"
            />
          </div>

          {/* PASSWORD */}

          <div className="mt-5">
            <label className="mb-2 block text-sm text-white/70">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-white/30"
            />
          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* BOTÓN */}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "INICIANDO SESIÓN..." : "INICIAR SESIÓN"}
          </button>

        </form>

      </div>
    </main>
  );
}