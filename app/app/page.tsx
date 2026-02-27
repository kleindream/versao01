import Link from "next/link";
import { TopNav } from "../../components/TopNav";
import { createClient } from "../../../lib/supabase/server";
import { MuralBox } from "./mural";

function pickProfile(profiles: any) {
  // Supabase às vezes tipa/retorna join como array; outras como objeto.
  if (!profiles) return null;
  return Array.isArray(profiles) ? profiles[0] : profiles;
}

export default async function MeuPerfil() {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();

  const userId = auth.user?.id;
  if (!userId) {
    // O middleware normalmente já barra, mas isso evita quebrar SSR/build.
    return (
      <div className="grid" style={{ gap: 18 }}>
        <TopNav />
        <div className="card" style={{ padding: 22 }}>
          <div className="h1" style={{ fontSize: 28 }}>Você não está logado.</div>
          <p className="p">Volte para entrar.</p>
          <Link className="btn" href="/entrar">Entrar</Link>
        </div>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id,username,display_name,bio")
    .eq("id", userId)
    .single();

  const { data: mural } = await supabase
    .from("profile_posts")
    .select("id,body,created_at,author_id, profiles(username, display_name)")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="grid" style={{ gap: 18 }}>
      <TopNav userEmail={auth.user?.email} />

      <div className="card" style={{ padding: 22 }}>
        <div className="h1" style={{ fontSize: 28 }}>
          {profile.display_name ?? profile.username}
        </div>

        <div className="row">
          <span className="badge">@{profile.username}</span>
          <Link className="btn secondary" href={`/p/${profile.username}`}>Ver público</Link>
        </div>

        <p className="p" style={{ marginTop: 12 }}>
          {profile.bio ?? "Sem bio ainda."}
        </p>

        <p className="small">
          Fotos (1.0): JPG apenas — limite recomendado: 12. (Upload fica para o próximo passo.)
        </p>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <b>Mural</b>
        <div className="hr" />

        <MuralBox profileId={profile.id} />

        <div className="hr" />
        <div className="grid" style={{ gap: 10 }}>
          {mural?.length ? (
            mural.map((p: any) => {
              const prof = pickProfile(p.profiles);
              const nome = prof?.display_name ?? prof?.username ?? "Usuário";
              return (
                <div key={p.id} className="card" style={{ padding: 14 }}>
                  <div className="small">
                    <b>{nome}</b> • {new Date(p.created_at).toLocaleString("pt-BR")}
                  </div>
                  <div style={{ whiteSpace: "pre-wrap", marginTop: 8, lineHeight: 1.6 }}>
                    {p.body}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="p">Ainda não há mensagens no mural.</p>
          )}
        </div>
      </div>
    </div>
  );
}
