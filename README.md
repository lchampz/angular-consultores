# SPA de Gerenciamento de Consultores

Aplicação Angular para gerenciamento de consultores com CRUD completo, autenticação Firebase e Angular Material.

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta Firebase configurada

## Instalação

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

Copie o arquivo de exemplo e preencha com suas credenciais do Firebase:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e substitua os valores com suas credenciais do Firebase:

```env
FIREBASE_API_KEY=sua-api-key
FIREBASE_AUTH_DOMAIN=seu-auth-domain
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_STORAGE_BUCKET=seu-storage-bucket
FIREBASE_MESSAGING_SENDER_ID=seu-messaging-sender-id
FIREBASE_APP_ID=seu-app-id
FIREBASE_MEASUREMENT_ID=seu-measurement-id
```

**Importante:** O arquivo `.env` não deve ser commitado no repositório (já está no `.gitignore`).

3. Gere os arquivos de ambiente:

Os arquivos `environment.ts` e `environment.prod.ts` são gerados automaticamente a partir do `.env` quando você executa `npm start` ou `npm run build`. Para gerá-los manualmente:

```bash
npm run generate-env
```

## Executando a aplicação

```bash
npm start
```

A aplicação estará disponível em `http://localhost:4200`

## Estrutura do Projeto

```
src/
├── app/
│   ├── core/           # Serviços singleton e guards
│   ├── shared/         # Componentes e modelos compartilhados
│   ├── auth/           # Módulo de autenticação
│   ├── consultores/    # Módulo de CRUD de consultores
│   ├── layouts/        # Componentes de layout
│   └── app.module.ts   # Módulo principal
├── assets/             # Arquivos estáticos
└── styles.scss         # Estilos globais
```

## Funcionalidades

- ✅ Autenticação com Firebase
- ✅ CRUD completo de consultores
- ✅ Listagem com paginação e ordenação
- ✅ Formulários reativos com validações
- ✅ Layout responsivo com Angular Material
- ✅ Proteção de rotas com AuthGuard

## Deploy na Vercel

### Pré-requisitos

1. Instale a Vercel CLI:

```bash
npm install -g vercel
```

2. Faça login na Vercel:

```bash
vercel login
```

### Configuração Inicial (Primeira vez)

1. Configure as variáveis de ambiente na Vercel a partir do seu `.env`:

```bash
npm run vercel:env:add
```

Este script irá ler seu arquivo `.env` e configurar todas as variáveis na Vercel.

**Ou configure manualmente no Dashboard:**

- Acesse: https://vercel.com/seu-projeto/settings/environment-variables
- Adicione as seguintes variáveis:
  - `FIREBASE_API_KEY`
  - `FIREBASE_AUTH_DOMAIN`
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_STORAGE_BUCKET`
  - `FIREBASE_MESSAGING_SENDER_ID`
  - `FIREBASE_APP_ID`
  - `FIREBASE_MEASUREMENT_ID` (opcional)

### Deploy

#### Deploy de Produção (Automático)

O script de deploy gera os arquivos de ambiente automaticamente e faz o deploy:

```bash
npm run deploy
```

Este comando:

1. ✅ Gera os arquivos de ambiente a partir das variáveis configuradas na Vercel
2. ✅ Faz o build de produção
3. ✅ Faz o deploy na Vercel

#### Deploy Preview

Para fazer deploy de preview (sem produção):

```bash
npm run deploy:preview
```

### Verificar Variáveis Configuradas

```bash
npm run vercel:env:ls
```

### Arquivos de Configuração

- `vercel.json` - Configuração do projeto na Vercel
- `scripts/deploy-vercel.js` - Script de deploy automatizado
- `scripts/setup-vercel-env.js` - Script para configurar variáveis de ambiente

## Tecnologias

- Angular 17
- Angular Material
- Firebase Authentication
- Firebase Firestore
- Vercel (Deploy)
- RxJS
- TypeScript
