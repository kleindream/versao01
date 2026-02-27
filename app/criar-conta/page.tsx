"use client";

import { useState } from "react";
import Link from "next/link";
import { TopNav } from "../components/TopNav";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CriarConta() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [chave, setChave] = useState("");
  const [apelido, setApelido] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    // 1) cria usuário
    const { data, error } = await supabase.auth.signUp({ email, password: senha });
    if (error) return setMsg(error.message);
    const userId = data.user?.id;
    if (!userId) return setMsg("Falha ao criar usuário.");

    // 2) tenta resgatar chave no banco (RPC)
    const { error: rpcErr } = await supabase.rpc("redeem_invite", { p_code: chave, p_user_id: userId });
    if (rpcErr) {
      await supabase.auth.signOut();
      return setMsg("Chave inválida ou já usada.");
    }

    // 3) cria perfil básico
    const username = apelido.trim().toLowerCase().replace(/\s+/g, ".").replace(/[^a-z0-9._-]/g, "");
    const { error: profErr } = await supabase.from("profiles").upsert({ id: userId, username, display_name: apelido || username });
    if (profErr) return setMsg("Conta criada, mas falhou ao criar perfil. Você pode entrar e ajustar depois.");

    router.push("/app");
    router.refresh();
  }

  return (
    <div className="grid" style={{ gap: 18 }}>
      <TopNav />
      <div className="card" style={{ padding: 22, maxWidth: 560 }}>
        <div className="h1" style={{ fontSize: 28 }}>Criar conta (com chave)</div>
        <p className="p">O Kleindream cresce por <b>chaves de acesso</b>. Se você não tem uma, ainda não é hora — e tudo bem.</p>
        <form onSubmit={onSubmit}>
          <label className="label">Chave de acesso</label>
          <input className="input" value={chave} onChange={(e)=>setChave(e.target.value)} placeholder="ex: KLEIN-ABCD-1234" required />
          <label className="label">Apelido (nome exibido)</label>
          <input className="input" value={apelido} onChange={(e)=>setApelido(e.target.value)} placeholder="Digão" required />
          <label className="label">E-mail</label>
          <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
          <label className="label">Senha</label>
          <input className="input" value={senha} onChange={(e)=>setSenha(e.target.value)} type="password" required />

          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn" type="submit">Criar conta</button>
            <Link className="btn secondary" href="/entrar">Já tenho conta</Link>
          </div>

          {msg ? <p className="p" style={{ color: "var(--danger)" }}>{msg}</p> : null}
        </form>
        <p className="small" style={{ marginTop: 10 }}>
          Dica: no início, você cria as chaves manualmente no Supabase (tabela <span className="kbd">invites</span>).
        </p>
      </div>
    </div>
  );
}
