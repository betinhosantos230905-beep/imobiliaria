# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Como rodar este ZIP no seu computador

1. Descompacte a pasta e entre nela pelo terminal.
2. Instale as dependências: `bun install` (ou `npm install`).
3. Rode o site: `bun run dev` (ou `npm run dev`).
4. Abra o endereço que aparecer no terminal (ex.: http://localhost:8080).

### O que o arquivo `.env` faz
Ele aponta o site para o banco de dados do projeto (imóveis, fotos e mensagens).
As chaves dele são públicas de leitura — mas só funcionam enquanto esse projeto existir.

### Se você abrir o código em um projeto novo no Lovable
O banco de dados novo nasce vazio. Recrie as tabelas `properties`, `leads`,
`profiles` e `user_roles` (o SQL está em `drizzle/migrations/`) e ligue as
permissões de leitura/escrita, ou cole no `.env` os dados de acesso do projeto
que já tem esses dados.

### Área administrativa
Entre em `/login`, crie sua conta e cadastre os anúncios e fotos.
Somente contas com perfil de administrador acessam o painel `/admin`.

### Testes
`bun run test` (ou `npm run test`).
