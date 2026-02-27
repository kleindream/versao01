"use client";

import { useState } from "react";
import Link from "next/link";
import { TopNav } from "../components/TopNav";
import { createClient } from "../../lib/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";

export default function Entrar() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const params = useSearchParams();
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) return setMsg(error.message);
    const r = params.get("r") ?? "/app";
    router.push(r);
    router.refresh();
  }

  return (
    <div className="grid" style={{ gap: 18 }}>
      <TopNav />
      <div className="card" style={{ padding: 22, maxWidth: 520 }}>
        <div className="h1" style={{ fontSize: 28 }}>Entrar</div>
        <form onSubmit={onSubmit}>
          <label className="label">E-mail</label>
          <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
          <label className="label">Senha</label>
          <input className="input" value={senha} onChange={(e)=>setSenha(e.target.value)} type="password" required />
          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn" type="submit">Entrar</button>
            <Link className="btn secondary" href="/criar-conta">Criar conta</Link>
          </div>
          {msg ? <p className="p" style={{ color: "var(--danger)" }}>{msg}</p> : null}
        </form>
      </div>
    </div>
  );
}
