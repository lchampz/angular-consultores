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

## Tecnologias

- Angular 17
- Angular Material
- Firebase Authentication
- RxJS
- TypeScript
