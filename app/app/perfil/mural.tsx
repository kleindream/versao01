"use client";

import { useState } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useRouter } from "next/navigation";

export function MuralBox({ profileId }: { profileId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function send() {
    setMsg(null);
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return setMsg("Você precisa estar logado.");
    if (!body.trim()) return;

    const { error } = await supabase.from("profile_posts").insert({
      profile_id: profileId,
      author_id: auth.user.id,
      body: body.trim(),
    });

    if (error) return setMsg(error.message);
    setBody("");
    router.refresh();
  }

  return (
    <div>
      <textarea className="input" rows={4} value={body} onChange={(e)=>setBody(e.target.value)} placeholder="Deixe uma mensagem no seu mural (teste)..." />
      <div className="row" style={{ marginTop: 10 }}>
        <button className="btn" onClick={send}>Postar</button>
        {msg ? <span className="small" style={{ color: "var(--danger)" }}>{msg}</span> : null}
      </div>
    </div>
  );
}
