"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../lib/supabase/client";
import Link from "next/link";
import { TopNav } from "../../../components/TopNav";

export default function NovoGrupo() {
  const supabase = createClient();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return setMsg("Você precisa estar logado.");

    const { data, error } = await supabase.from("groups").insert({
      name: name.trim(),
      description: description.trim(),
      owner_id: auth.user.id,
    }).select("id").single();

    if (error) return setMsg(error.message);
    router.push(`/app/grupos/${data.id}`);
    router.refresh();
  }

  return (
    <div className="grid" style={{ gap: 18 }}>
      <TopNav />
      <div className="card" style={{ padding: 22, maxWidth: 650 }}>
        <div className="h1" style={{ fontSize: 28 }}>Criar Grupo</div>
        <form onSubmit={onSubmit}>
          <label className="label">Nome</label>
          <input className="input" value={name} onChange={(e)=>setName(e.target.value)} required />
          <label className="label">Descrição</label>
          <input className="input" value={description} onChange={(e)=>setDescription(e.target.value)} />
          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn" type="submit">Criar</button>
            <Link className="btn secondary" href="/app/grupos">Voltar</Link>
          </div>
          {msg ? <p className="p" style={{ color: "var(--danger)" }}>{msg}</p> : null}
        </form>
      </div>
    </div>
  );
}
