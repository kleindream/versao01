import Link from "next/link";
import { TopNav } from "../../../components/TopNav";
import { createClient } from "../../../../lib/supabase/server";
import { ReplyBox } from "./reply";

export default async function Topico({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();

  const { data: thread } = await supabase
    .from("threads")
    .select("id,title,group_id,created_at")
    .eq("id", params.id)
    .single();

  const { data: posts } = await supabase
    .from("posts")
    .select("id,body,created_at,author_id, profiles(username, display_name)")
    .eq("thread_id", params.id)
    .order("created_at", { ascending: true });

  return (
    <div className="grid" style={{ gap: 18 }}>
      <TopNav userEmail={auth.user?.email} />

      <div className="card" style={{ padding: 22 }}>
        <div className="h1" style={{ fontSize: 26 }}>{thread.title}</div>
        <div className="row">
          <Link className="btn secondary" href={`/app/grupos/${thread.group_id}`}>Voltar ao Grupo</Link>
        </div>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <b>Mensagens</b>
        <div className="hr" />
        <div className="grid" style={{ gap: 10 }}>
          {posts?.length ? posts.map((p) => (
            <div key={p.id} className="card" style={{ padding: 14 }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div className="small">
                  <b>{p.profiles?.display_name ?? p.profiles?.username ?? "Usuário"}</b>
                  <span className="small"> • {new Date(p.created_at).toLocaleString("pt-BR")}</span>
                </div>
              </div>
              <div style={{ whiteSpace: "pre-wrap", marginTop: 8, lineHeight: 1.6 }}>{p.body}</div>
            </div>
          )) : <p className="p">Ainda não há mensagens.</p>}
        </div>
      </div>

      <ReplyBox threadId={params.id} />
    </div>
  );
}
