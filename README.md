# Kleindream Starter (0.1)

Starter pronto para uso, com:
- Login (Supabase Auth)
- Cadastro com **chave de acesso**
- Grupos + Tópicos + Posts
- Perfil + Mural
- **Sem linha do tempo** e sem anúncios (por design)
- Fotos: planejado para **JPG apenas** (upload fica como próximo passo)

> Tudo em português e sem qualquer referência a marcas de terceiros.

---

## 1) Pré-requisitos
- Node.js 18+
- Conta no Supabase (gratuito)
- (Opcional) Vercel para deploy

---

## 2) Criar projeto no Supabase
1. Crie um projeto.
2. Vá em **SQL Editor** e rode o arquivo: `supabase/schema.sql`
3. Vá em **Authentication → Providers** e mantenha e-mail/senha habilitado.

---

## 3) Criar chaves de acesso (invites)
No Supabase, abra **Table Editor → invites** e insira linhas como:

- code: `KLEIN-ABCD-1234`
- created_by: (pode deixar null no começo)

A função `redeem_invite` marca a chave como usada quando alguém cria a conta.

---

## 4) Rodar local
1. Copie `.env.example` para `.env.local`
2. Preencha:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> Você NÃO precisa do `SUPABASE_SERVICE_ROLE_KEY` para rodar este starter.

3. Instale e rode:
```bash
npm install
npm run dev
```
Acesse: http://localhost:3000

---

## 5) Deploy (Vercel)
1. Suba o projeto para um repositório Git
2. Importe no Vercel
3. Adicione as env vars do `.env.local`
4. Deploy

---

## Próximo passo recomendado (Fotos JPG 1.0)
- Criar bucket no Supabase Storage (ex: `photos`)
- Política: somente upload por usuário logado
- Validar JPG + limitar tamanho (ex: 1MB) no client
- Guardar URLs na tabela `photos` (a gente cria depois)

Se você quiser, eu monto o módulo de upload JPG (com limites + validação + UI) como "pacote 0.2".
