import Link from "next/link";
import { TopNav } from "../../components/TopNav";
import { createClient } from "../../../lib/supabase/server";

export default async function PerfilPublico({ params }: { params: { username: string } }) {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id,username,display_name,bio")
    .eq("username", params.username)
    .single();

  const { data: mural } = await supabase
    .from("profile_posts")
    .select("id,body,created_at,author_id, profiles(username, display_name)")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(25);

  return (
    <div className="grid" style={{ gap: 18 }}>
      <TopNav userEmail={auth.user?.email} />

      <div className="card" style={{ padding: 22 }}>
        <div className="h1" style={{ fontSize: 28 }}>{profile.display_name ?? profile.username}</div>
        <span className="badge">@{profile.username}</span>
        <p className="p" style={{ marginTop: 12 }}>{profile.bio ?? "Sem bio ainda."}</p>
        <div className="row">
          <Link className="btn secondary" href="/app">Voltar</Link>
        </div>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <b>Mural (somente leitura pública)</b>
        <div className="hr" />
        <div className="grid" style={{ gap: 10 }}>
          {mural?.length ? mural.map((p) => (
            <div key={p.id} className="card" style={{ padding: 14 }}>
              <div className="small">
                <b>{p.profiles?.display_name ?? p.profiles?.username ?? "Usuário"}</b> • {new Date(p.created_at).toLocaleString("pt-BR")}
              </div>
              <div style={{ whiteSpace: "pre-wrap", marginTop: 8, lineHeight: 1.6 }}>{p.body}</div>
            </div>
          )) : <p className="p">Sem mensagens ainda.</p>}
        </div>
      </div>
    </div>
  );
}
