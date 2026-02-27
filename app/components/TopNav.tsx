"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopNav({ userEmail }: { userEmail?: string | null }) {
  const p = usePathname();
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Kleindream";
  return (
    <div className="card nav" style={{ position: "sticky", top: 18, zIndex: 20, backdropFilter: "blur(10px)" }}>
      <div className="brand">
        <span style={{ width: 10, height: 10, borderRadius: 999, background: "var(--accent)", display: "inline-block" }} />
        <Link href="/">{appName}</Link>
        <span className="badge">sem timeline • sem anúncios</span>
      </div>
      <div className="row">
        {p?.startsWith("/app") ? (
          <>
            <Link className="btn secondary" href="/app">Painel</Link>
            <Link className="btn secondary" href="/app/grupos">Grupos</Link>
            <Link className="btn secondary" href="/app/perfil">Meu perfil</Link>
            <Link className="btn danger" href="/auth/sair">Sair</Link>
          </>
        ) : (
          <>
            <Link className="btn secondary" href="/entrar">Entrar</Link>
            <Link className="btn" href="/criar-conta">Criar conta</Link>
          </>
        )}
        {userEmail ? <span className="small">{userEmail}</span> : null}
      </div>
    </div>
  );
}
