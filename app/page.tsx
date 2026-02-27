import Link from "next/link";
import { TopNav } from "./components/TopNav";
import { createClient } from "../lib/supabase/server";

export default async function Page() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div className="grid" style={{ gap: 18 }}>
      <TopNav userEmail={data.user?.email} />

      <div className="card" style={{ padding: 22 }}>
        <div className="h1">Kleindream</div>
        <p className="p">
          Uma rede social centrada em <b>perfil</b> e <b>grupos</b> — sem linha do tempo e sem anúncios invasivos.
          Crescimento por <b>chave de acesso</b>.
        </p>
        <div className="row">
          {data.user ? (
            <Link className="btn" href="/app">Ir para o Painel</Link>
          ) : (
            <>
              <Link className="btn" href="/criar-conta">Criar conta</Link>
              <Link className="btn secondary" href="/entrar">Entrar</Link>
            </>
          )}
          <span className="small">Fotos 1.0: apenas <span className="kbd">JPG</span> • limite sugerido: 12 por perfil.</span>
        </div>
      </div>

      <div className="grid grid2">
        <div className="card" style={{ padding: 18 }}>
          <b>Princípios</b>
          <div className="hr" />
          <ul className="p" style={{ margin: 0, paddingLeft: 18 }}>
            <li>Sem timeline. Você participa por grupos e perfis.</li>
            <li>Sem anúncios no início.</li>
            <li>Sem vender dados.</li>
            <li>Moderação por regras simples + denúncias.</li>
          </ul>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <b>O que já vem pronto neste starter</b>
          <div className="hr" />
          <ul className="p" style={{ margin: 0, paddingLeft: 18 }}>
            <li>Login + sessão (Supabase Auth).</li>
            <li>Cadastro com chave de acesso (invite).</li>
            <li>Painel / Grupos / Discussões / Posts.</li>
            <li>Perfil básico e Mural (posts no perfil).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
