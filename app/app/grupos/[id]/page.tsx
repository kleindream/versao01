import Link from "next/link";
import { TopNav } from "../../../components/TopNav";
import { createClient } from "../../../../lib/supabase/server";

export default async function Grupo({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();

  const { data: group } = await supabase
    .from("groups")
    .select("id,name,description,owner_id,created_at")
    .eq("id", params.id)
    .single();

  const { data: threads } = await supabase
    .from("threads")
    .select("id,title,created_at,author_id")
    .eq("group_id", params.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="grid" style={{ gap: 18 }}>
      <TopNav userEmail={auth.user?.email} />

      <div className="card" style={{ padding: 22 }}>
        <div className="h1" style={{ fontSize: 28 }}>{group.name}</div>
        <p className="p">{group.description ?? "Sem descrição"}</p>
        <div className="row">
          <Link className="btn" href={`/app/grupos/${group.id}/novo-topico`}>Novo tópico</Link>
          <Link className="btn secondary" href="/app/grupos">Voltar</Link>
        </div>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <b>Discussões</b>
        <div className="hr" />
        <div className="grid" style={{ gap: 10 }}>
          {threads?.length ? threads.map((t) => (
            <Link key={t.id} href={`/app/topicos/${t.id}`} className="card" style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <b>{t.title}</b>
                <span className="small">{new Date(t.created_at).toLocaleString("pt-BR")}</span>
              </div>
              <div className="small">Abrir tópico</div>
            </Link>
          )) : <p className="p">Ainda não há tópicos.</p>}
        </div>
      </div>
    </div>
  );
}
