import Link from "next/link";
import { TopNav } from "../components/TopNav";
import { createClient } from "../../lib/supabase/server";

export default async function AppHome() {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();

  // Segurança extra: se por algum motivo não houver usuário, o middleware normalmente já barra,
  // mas isso evita quebra de build/SSR.
  const userId = auth.user?.id;

  const { data: profile } = userId
    ? await supabase
        .from("profiles")
        .select("username, display_name")
        .eq("id", userId)
        .maybeSingle()
    : { data: null as any };

  return (
    <div className="grid" style={{ gap: 18 }}>
      <TopNav userEmail={auth.user?.email} />

      <div className="card" style={{ padding: 22 }}>
        <div className="h1" style={{ fontSize: 28 }}>
          Bem-vindo{profile?.display_name ? `, ${profile.display_name}` : ""}.
        </div>

        <p className="p">
          Aqui não existe “linha do tempo”. Você navega por <b>Grupos</b> e por <b>Perfis</b>.
        </p>

        <div className="row">
          <Link className="btn" href="/app/grupos">
            Explorar Grupos
          </Link>
          <Link className="btn secondary" href="/app/perfil">
            Meu Perfil
          </Link>
        </div>
      </div>

      <div className="grid grid2">
        <div className="card" style={{ padding: 18 }}>
          <b>Atalhos</b>
          <div className="hr" />
          <ul className="p" style={{ margin: 0, paddingLeft: 18 }}>
            <li>
              <Link href="/app/grupos" className="kbd">
                /app/grupos
              </Link>{" "}
              — lista e criação de grupos.
            </li>
            <li>
              <Link href="/app/perfil" className="kbd">
                /app/perfil
              </Link>{" "}
              — seu perfil e mural.
            </li>
          </ul>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <b>Convites (chaves)</b>
          <div className="hr" />
          <p className="p" style={{ margin: 0 }}>
            No starter, as chaves são criadas manualmente na tabela{" "}
            <span className="kbd">invites</span>. Depois a gente automatiza com “gerar chave”.
          </p>
        </div>
      </div>
    </div>
  );
}
