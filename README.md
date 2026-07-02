# Controle de Despesas

Aplicação completa para controle de despesas pessoais, com backend em Node.js e frontend em React.

## Visão geral

Este projeto possui duas partes separadas:

- Backend: API REST com Express, Sequelize, JWT e MySQL
- Frontend: interface em React com Vite, React Router, Bootstrap e Context API

## Tecnologias

### Backend
- Node.js
- Express
- Sequelize
- MySQL
- JWT
- bcrypt
- dotenv
- cors

### Frontend
- React
- Vite
- React Router DOM
- Axios
- React Bootstrap
- Context API

## Estrutura do projeto

```text
backend/
  src/
    controllers/
    models/
    routes/
    middlewares/
    config/
    database/
    migrations/
    seeders/
    docs/
    app.js

frontend/
  src/
    components/
    pages/
    routes/
    services/
    contexts/
    styles/
```

## Configuração do ambiente

### 1. Banco de dados
Crie o banco no MySQL:

```sql
CREATE DATABASE personal_expenses;
```

### 2. Backend
Crie um arquivo `.env` dentro da pasta `backend`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=personal_expenses
JWT_SECRET=sua_chave_jwt
JWT_EXPIRE=1d
```

Instale as dependências e rode as migrations/seeders:

```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

API: http://localhost:3000

Documentação Swagger: http://localhost:3000/docs/swagger.json

Collection Postman: backend/postman_collection.json

### 3. Frontend
Crie o arquivo `.env` dentro da pasta `frontend`:

```env
VITE_API_URL=http://localhost:3000
```

Instale as dependências e rode a aplicação:

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5174

## Funcionalidades

### Backend
- Cadastro e login de usuários
- CRUD de categorias
- CRUD de despesas
- Filtros por categoria, status, data e valor
- Dashboard com estatísticas
- Autenticação via JWT

### Frontend
- Tela de login
- Persistência de sessão
- Dashboard com resumo financeiro
- CRUD de categorias
- CRUD de despesas
- Filtros avançados
- Dark mode
- Paginação
- Interface responsiva

## Endpoints principais

### Autenticação
| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/users` | Cadastro de usuário |
| POST | `/auth/login` | Login |

### Categorias
| Método | Rota |
| --- | --- |
| GET | `/categories` |
| GET | `/categories/:id` |
| POST | `/categories` |
| PUT | `/categories/:id` |
| DELETE | `/categories/:id` |

### Despesas
| Método | Rota |
| --- | --- |
| GET | `/expenses` |
| GET | `/expenses/:id` |
| POST | `/expenses` |
| PUT | `/expenses/:id` |
| DELETE | `/expenses/:id` |

### Dashboard
| Método | Rota | Resposta |
| --- | --- | --- |
| GET | `/dashboard/total-expenses` | `{ "total": 3500.5 }` |
| GET | `/dashboard/expenses-count` | `{ "quantidade": 45 }` |
| GET | `/dashboard/expenses-by-category` | Lista com `{ "categoria": "Alimentacao", "total": 1200 }` |

## Usuário de seed

Após rodar `npm run db:seed` no backend, utilize:

```json
{
  "email": "matheus@example.com",
  "senha": "senha123"
}
```

