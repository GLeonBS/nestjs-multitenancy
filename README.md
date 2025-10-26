# NestJS Multi-Tenancy Event Management

Sistema SaaS multi-tenant para gerenciamento de eventos construído com NestJS, demonstrando autenticação JWT, controle de acesso baseado em papéis e isolamento de dados entre parceiros.

## Descrição

Este projeto implementa uma arquitetura multi-tenant onde diferentes parceiros (tenants) podem gerenciar seus próprios eventos e usuários de forma completamente isolada. O sistema utiliza isolamento a nível de linha (row-level) para garantir que cada parceiro acesse apenas seus próprios dados.

## Funcionalidades

- **Multi-tenancy com isolamento de dados**: Cada parceiro opera em um ambiente isolado
- **Autenticação JWT**: Sistema stateless e escalável de autenticação
- **Controle de Acesso Baseado em Papéis (RBAC)**: Papéis de PARTNER e USER
- **Gerenciamento de Eventos**: CRUDs para eventos associados a parceiros
- **Criptografia de Senhas**: Utiliza bcrypt para segurança
- **ORM Prisma**: Type-safe database client com MySQL

## Arquitetura

### Módulos Principais

- **Auth**: Autenticação, login e gerenciamento de usuários
- **Partners**: Gerenciamento de parceiros (tenants)
- **Events**: CRUD de eventos com isolamento por tenant
- **Tenant**: Serviço de resolução e isolamento de tenants por requisição
- **Prisma**: Gerenciamento de conexão com banco de dados

### Stack Tecnológica

- NestJS 11.0.1
- Prisma ORM 6.18.0
- MySQL
- JWT Authentication
- bcrypt
- TypeScript 5.7.3

## Instalação

```bash
npm install
```

## Configuração do Banco de Dados

1. Configure sua conexão MySQL no arquivo `.env`:

```env
DATABASE_URL="mysql://user:password@localhost:3306/nestjs_multitenancy"
```

2. Execute as migrations do Prisma:

```bash
npx prisma migrate dev
```

3. (Opcional) Gere o Prisma Client:

```bash
npx prisma generate
```

## Executar a Aplicação

```bash
# desenvolvimento
npm run start

# modo watch
npm run start:dev

# produção
npm run start:prod
```

## Testes

```bash
# testes unitários
npm run test

# testes e2e
npm run test:e2e

# cobertura de testes
npm run test:cov
```

## API Endpoints

### Autenticação

- `POST /auth/login` - Login de usuário
- `POST /users` - Registrar usuário comum
- `POST /partner/users` - Registrar usuário parceiro

### Parceiros

- `POST /partners` - Criar parceiro (tenant)
- `GET /partners` - Listar todos os parceiros
- `POST /partners/relate/:id` - Associar usuário a um parceiro

### Eventos

- `POST /events` - Criar evento (requer papel PARTNER)
- `GET /events` - Listar eventos do tenant
- `GET /events/:id` - Obter detalhes do evento
- `PATCH /events/:id` - Atualizar evento
- `DELETE /events/:id` - Deletar evento

## Como Funciona o Multi-Tenancy

1. **Resolução de Tenant**: O `TenantInterceptor` intercepta cada requisição autenticada e resolve o parceiro associado ao usuário
2. **Isolamento de Dados**: O `TenantService` (REQUEST-scoped) armazena o tenant atual durante o ciclo de vida da requisição
3. **Filtragem Automática**: Todas as queries de eventos são automaticamente filtradas pelo `partnerId` do tenant atual
4. **Segurança**: Usuários só podem acessar dados do seu próprio parceiro

## Estrutura do Projeto

```
src/
├── auth/           # Módulo de autenticação e autorização
├── events/         # Módulo de gerenciamento de eventos
├── partners/       # Módulo de gerenciamento de parceiros
├── prisma/         # Configuração do Prisma
├── tenant/         # Serviço de multi-tenancy
└── main.ts         # Ponto de entrada da aplicação
```

## Modelo de Dados

### Entidades Principais

**User**: Representa os usuários do sistema
- Armazena credenciais (email, senha hash)
- Contém papéis em formato JSON (ex: ["PARTNER"] ou ["USER"])

**Partner**: Representa um parceiro/tenant
- Cada parceiro é um tenant isolado
- Tem relacionamento com usuários e eventos

**PartnerUser**: Tabela de junção
- Associa usuários a parceiros
- Um usuário pode pertencer a apenas um parceiro (constraint unique)

**Event**: Representa eventos gerenciados por parceiros
- Cada evento pertence a um parceiro específico
- Isolamento automático via `partnerId`

## Segurança

- Senhas criptografadas com bcrypt
- Tokens JWT com expiração de 1 dia
- Guards para proteção de rotas
- Controle de acesso baseado em papéis
- Isolamento de dados a nível de tenant

## Melhorias Futuras

- [ ] Configuração via variáveis de ambiente
- [ ] Validação de DTOs com class-validator
- [ ] Documentação OpenAPI/Swagger
- [ ] Suporte a múltiplos parceiros por usuário
- [ ] Implementação completa de update/delete de eventos
- [ ] Tratamento de erros aprimorado
- [ ] Testes unitários e e2e

## Recursos

- [Documentação NestJS](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [JWT Authentication](https://docs.nestjs.com/security/authentication)

## License

This project is licensed under the MIT License.
See the [LICENSE](./LICENSE) file for details.
