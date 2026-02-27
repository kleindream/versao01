import Link from "next/link";
import { TopNav } from "../../components/TopNav";
import { createClient } from "../../../lib/supabase/server";

export default async function Grupos() {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();

  const { data: groups } = await supabase
    .from("groups")
    .select("id, name, description, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="grid" style={{ gap: 18 }}>
      <TopNav userEmail={auth.user?.email} />
      <div className="card" style={{ padding: 22 }}>
        <div className="h1" style={{ fontSize: 28 }}>Grupos</div>
        <p className="p">Crie grupos e discuta por tópicos. Simples, organizado e humano.</p>
        <div className="row">
          <Link className="btn" href="/app/grupos/novo">Criar Grupo</Link>
        </div>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <b>Últimos grupos</b>
        <div className="hr" />
        <div className="grid" style={{ gap: 10 }}>
          {groups?.length ? groups.map((g) => (
            <Link key={g.id} href={`/app/grupos/${g.id}`} className="card" style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <b>{g.name}</b>
                <span className="small">{new Date(g.created_at).toLocaleDateString("pt-BR")}</span>
              </div>
              <div className="small">{g.description ?? "Sem descrição"}</div>
            </Link>
          )) : <p className="p">Ainda não há grupos. Crie o primeiro.</p>}
        </div>
      </div>
    </div>
  );
}
