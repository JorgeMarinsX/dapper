# Dapper - Sistema de Gestão para Barbearias

Aplicação web moderna para gestão de barbearias, construída com Nuxt 4 e Vue 3. Oferece um painel completo para gerenciamento de agendamentos, clientes, barbeiros e serviços.

## Stack Tecnológica

| Tecnologia | Descrição |
|---|---|
| **Runtime** | Bun |
| **Framework** | Nuxt 4 (Vue 3) |
| **Linguagem** | TypeScript |
| **UI** | Nuxt UI v4 (inclui Tailwind CSS v4) |
| **Containerização** | Docker + Docker Compose |

## Estrutura do Projeto

```
dapper/
├── app/                      # Código-fonte da aplicação (srcDir do Nuxt 4)
│   ├── assets/css/           # CSS global (ponto de entrada do Tailwind: main.css)
│   ├── components/           # Componentes Vue (auto-importados)
│   ├── composables/          # Composables Vue (auto-importados)
│   ├── layouts/              # Componentes de layout
│   ├── middleware/           # Middleware de rotas
│   ├── pages/                # Roteamento baseado em arquivos
│   ├── plugins/              # Plugins do Nuxt
│   ├── utils/                # Funções utilitárias (auto-importadas)
│   └── app.vue               # Componente raiz
├── server/                   # Código server-side (rotas de API, middleware)
├── public/                   # Arquivos estáticos servidos na raiz
├── Dockerfile                # Build Docker multi-stage
├── docker-compose.yml        # Configuração do Docker Compose
├── nuxt.config.ts            # Configuração do Nuxt
├── package.json              # Dependências e scripts
└── tsconfig.json             # Configuração do TypeScript
```

## Primeiros Passos

### Pré-requisitos

- Docker e Docker Compose instalados na máquina

### Servidor de Desenvolvimento

```bash
docker compose up
```

Isso irá:
1. Construir a imagem Docker usando o target `dev`
2. Instalar as dependências dentro do container
3. Iniciar o servidor de desenvolvimento do Nuxt com HMR em `http://localhost:3000`

Para reconstruir após alterar dependências:

```bash
docker compose up --build
```

Para rodar em modo desanexado:

```bash
docker compose up -d
```

Para parar:

```bash
docker compose down
```

### Executando Comandos no Container

```bash
docker compose exec app bun <comando>
```

Exemplos:

```bash
# Adicionar uma dependência
docker compose exec app bun add <pacote>

# Adicionar uma dependência de desenvolvimento
docker compose exec app bun add -d <pacote>

# Gerar site estático
docker compose exec app bun run generate
```

## Arquitetura Docker

### Estágios do Dockerfile

| Estágio | Finalidade |
|---|---|
| `base` | Base comum com runtime Bun |
| `deps` | Instalação de dependências de produção |
| `dev` | Ambiente de desenvolvimento completo com código-fonte e HMR |
| `build` | Build da aplicação Nuxt para produção |
| `production` | Imagem mínima apenas com o build final |

### docker-compose.yml

- **Portas:** `3000` (aplicação) e `24678` (websocket do HMR)
- **Volumes:** O código-fonte é montado via bind mount para live reload; `node_modules` utiliza um volume nomeado para evitar conflitos entre host e container
- **Política de restart:** `unless-stopped`

### Build para Produção

```bash
docker build --target production -t dapper:latest .
docker run -p 3000:3000 dapper:latest
```

## Funcionalidades

### Painel (Dashboard)

- **Indicadores (KPIs):** Agendamentos do dia, receita diária, clientes ativos e tempo médio de espera
- **Tabela de Agendamentos:** Horário, cliente, barbeiro, serviço e status (concluído, em andamento, aguardando)
- **Disponibilidade dos Barbeiros:** Status em tempo real (disponível, ocupado, folga) com cliente atual
- **Clientes Recentes:** Últimos clientes atendidos com data da visita e serviço realizado

### Navegação

| Rota | Página |
|---|---|
| `/` | Painel |
| `/agendamentos` | Gestão de agendamentos |
| `/clientes` | Gestão de clientes |
| `/servicos` | Catálogo de serviços |
| `/configuracoes` | Configurações |

## Tema e Cores

A aplicação utiliza uma paleta de cores personalizada chamada `dapper` (laranja) como cor primária, com `zinc` como cor neutra.

| Função | Nome no Tailwind | Hex base | Observações |
|---|---|---|---|
| Primária | `dapper` | `#FF6B35` | Laranja — shade 400 é a base |
| Neutra | `zinc` | — | Escala de cinza nativa do Tailwind |
| Fundo | — | `#000000` | Fundo preto via dark mode |

A paleta personalizada é definida em `app/assets/css/main.css` e configurada em `app/app.config.ts` via sistema de temas do Nuxt UI:

```ts
ui: {
  colors: {
    primary: 'dapper',
    neutral: 'zinc',
  }
}
```

Use `text-primary`, `bg-primary`, `border-primary` etc. nos templates — todos resolvem para a paleta laranja dapper.

## Notas de Desenvolvimento

- O HMR utiliza polling (`usePolling: true`) porque eventos de file-system não propagam de forma confiável para containers Docker em hosts Windows/macOS
- O servidor de desenvolvimento faz bind em `0.0.0.0` para ser acessível de fora do container
- O `node_modules` vive em um volume Docker — **não** dependa de uma pasta `node_modules` local no host
