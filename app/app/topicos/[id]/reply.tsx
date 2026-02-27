"use client";

import { useState } from "react";
import { createClient } from "../../../../lib/supabase/client";
import { useRouter } from "next/navigation";

export function ReplyBox({ threadId }: { threadId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function send() {
    setMsg(null);
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return setMsg("Você precisa estar logado.");
    if (!body.trim()) return;

    const { error } = await supabase.from("posts").insert({
      thread_id: threadId,
      author_id: auth.user.id,
      body: body.trim(),
    });

    if (error) return setMsg(error.message);
    setBody("");
    router.refresh();
  }

  return (
    <div className="card" style={{ padding: 18 }}>
      <b>Responder</b>
      <div className="hr" />
      <textarea className="input" rows={5} value={body} onChange={(e)=>setBody(e.target.value)} placeholder="Escreva sua resposta..." />
      <div className="row" style={{ marginTop: 10 }}>
        <button className="btn" onClick={send}>Enviar</button>
        {msg ? <span className="small" style={{ color: "var(--danger)" }}>{msg}</span> : null}
      </div>
    </div>
  );
}
