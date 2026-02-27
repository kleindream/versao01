"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../../../lib/supabase/client";
import { TopNav } from "../../../../components/TopNav";

export default function NovoTopico({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return setMsg("Você precisa estar logado.");

    const { data: thread, error: threadErr } = await supabase
      .from("threads")
      .insert({ group_id: params.id, title: title.trim(), author_id: auth.user.id })
      .select("id")
      .single();

    if (threadErr) return setMsg(threadErr.message);

    const { error: postErr } = await supabase
      .from("posts")
      .insert({ thread_id: thread.id, author_id: auth.user.id, body: body.trim() });

    if (postErr) return setMsg(postErr.message);

    router.push(`/app/topicos/${thread.id}`);
    router.refresh();
  }

  return (
    <div className="grid" style={{ gap: 18 }}>
      <TopNav />
      <div className="card" style={{ padding: 22, maxWidth: 750 }}>
        <div className="h1" style={{ fontSize: 28 }}>Novo tópico</div>
        <form onSubmit={onSubmit}>
          <label className="label">Título</label>
          <input className="input" value={title} onChange={(e)=>setTitle(e.target.value)} required />
          <label className="label">Mensagem</label>
          <textarea className="input" value={body} onChange={(e)=>setBody(e.target.value)} rows={6} required />
          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn" type="submit">Publicar</button>
            <Link className="btn secondary" href={`/app/grupos/${params.id}`}>Cancelar</Link>
          </div>
          {msg ? <p className="p" style={{ color: "var(--danger)" }}>{msg}</p> : null}
        </form>
      </div>
    </div>
  );
}
