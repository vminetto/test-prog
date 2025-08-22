# 📋 Projeto Recrutamento & Seleção

Este repositório contém a implementação de um sistema de **Recrutamento e Seleção**, com **backend** em Go (framework Gin) e **frontend** em TypeScript (React + Vite). O objetivo é gerir candidatos, vagas e etapas de processo seletivo de forma simples e organizada.

1. Tela de cadastro (EMAIL e SENHA)
2. Tela de login (EMAIL e SENHA)
3. Tela quando logado (Minhas vagas / Minhas candidaturas)
4. Registro de vagas
5. Cadastro em vaga
6. Busca de vagas

Atualizar a tela não posso perder o login, quando logado não posso entrar na tela de login e registro.

## NÃO UTILIZE NEXT.JS


---

## 📚 Tecnologias

### Backend
- [Go](https://golang.org/)  
- [Gin Web Framework](https://github.com/gin-gonic/gin)  
- [GORM](https://gorm.io/)  
- PostgreSQL  

### Frontend
- [TypeScript](https://www.typescriptlang.org/)  
- [React](https://reactjs.org/)  
- [Vite](https://vitejs.dev/)  
- [Axios](https://github.com/axios/axios)  

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

#### README -- Frontend ####


# Recrutamento & Seleção

Frontend do sistema de **Recrutamento & Seleção**, construído em **React + TypeScript + Vite**, com **Material UI** e arquitetura **feature-first**.  
A aplicação permite gerenciar **vagas**, **candidaturas** e o **pipeline de processos seletivos**, tanto na visão de **recrutador** quanto na de **candidato**.

---

## Stack

- React 18 + TypeScript  
- Vite (dev server e build)  
- Material UI (MUI)  
- react-hook-form + zod (formulários e validação)  
- axios (HTTP client)  
- axios-mock-adapter (API mock local)  
- Nginx (runtime de produção da SPA)

---

## Estrutura de pastas

```bash
src
├── app/
├── assets/
├── components/
├── features
│   ├── auth/
│   ├── jobs/
│   ├── applications/
│   ├── process
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── constants/
│   ├── profile/
│   └── myjobs/
├── hooks/
├── layout/
├── lib/
├── pages
│   ├── dashboard/
│   └── auth/
├── routes/
├── theme.ts
└── main.tsx
└── root.tsx

mocks
├── applications.mock.ts
├── auth.mock.ts
├── index.ts
├── jobs.mock.ts
├── profile.mock.ts
├── storage.ts
└── types.ts
```

> Cada feature concentra **componentes, hooks, tipos e API** de forma isolada.

---

## ⚙️ Variáveis de ambiente

Arquivo `.env`:

```env
# habilita mocks (true/false)
VITE_ENABLE_MOCK=true

# base da API real (quando mock = false)
VITE_API_URL=http://localhost:8080
```

> No desenvolvimento, o Vite pode redirecionar `/api` para o backend via proxy no `vite.config.ts`.

---

## Scripts

```bash
npm ci                 # instala dependências (use este comando se acabou de clonar o repo)
npm install            # use apenas se precisar adicionar/remover pacotes
npm run dev            # ambiente de desenvolvimento
npm run build          # build de produção (gera dist/)
npm run preview        # preview local do build
npm run lint           # roda o linter para verificar problemas de estilo/código
npm run test           # executa a suíte de testes
```

---

## Docker

O projeto usa build multi-stage:

1. **Build** com `node:20-alpine`
2. **Runtime** com `nginx:alpine`

### Build e execução

**Produção com API real**
```bash
docker build \
  --build-arg VITE_ENABLE_MOCK=false \
  --build-arg VITE_API_URL=https://api.seuservidor.com \
  -t recrutamento-frontend:prod .

docker run -p 8080:80 recrutamento-frontend:prod
```

**Ambiente com mocks**
```bash
docker build \
  --build-arg VITE_ENABLE_MOCK=true \
  -t recrutamento-frontend:mock .

docker run -p 8080:80 recrutamento-frontend:mock
```

---

## Configuração do Nginx

O servidor Nginx já está configurado para rodar a aplicação como **SPA** (fallback para `index.html`) e com **gzip** ativo:

```nginx
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  gzip on;
  gzip_types text/plain application/javascript text/css application/json image/svg+xml;
  gzip_min_length 1024;
}
```

---

## Endpoints principais

### Jobs
- `GET /api/jobs?owner=me|others|all&q=`
- `GET /api/jobs/:id`
- `POST /api/jobs`
- `DELETE /api/jobs/:id`
- `GET /api/jobs/:id/candidates`
- `POST /api/jobs/:id/apply`

### Applications
- `GET /api/applications/me`
- `DELETE /api/applications/:id`
- `PATCH /api/applications/:id/stage`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Profile
- `GET /api/profile/me`
- `PUT /api/profile/me`
- `PUT /api/profile/me/avatar`

---

## Mocks

- Controlados via `VITE_ENABLE_MOCK=true`
- Implementados com `axios-mock-adapter`
- Estado salvo em `localStorage`:
  - `mock_users`, `auth_token`, `auth_user`
  - `mock_profiles`, `mock_jobs`, `mock_apps`

---

## Convenções

- Arquitetura feature-first  
- Imports absolutos via `@/`  
- Pipeline de processos com dois modos:
  - **Sou recrutador** → pipeline das vagas criadas
  - **Sou candidato** → etapas das vagas aplicadas  
- Validação de formulários com `zodResolver` + `react-hook-form`  
- Feedback de UI via **alerts e snackbars padronizados**

---

## Troubleshooting

### `Unexpected token '<' ... is not valid JSON`
- API está retornando HTML (ex: `index.html` do Nginx).  
- Verificar:
  - proxy `/api` no `vite.config.ts`  
  - configuração `/api` no `nginx.conf`  
  - valor correto de `VITE_API_URL`  

### Pipeline vazio
- Modo recrutador → selecionar uma vaga criada por você  
- Modo candidato → selecionar uma vaga em que você aplicou  

---

## Observações finais

- **Mocks** servem para desenvolvimento sem backend.  
- Em produção usar `VITE_ENABLE_MOCK=false` e apontar `VITE_API_URL` para o backend real.  
- O **Dockerfile** aceita `--build-arg` para alternar entre **mock** e **API real**.
