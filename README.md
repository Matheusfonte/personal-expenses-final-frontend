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
O projeto usa MySQL/MariaDB e espera o banco `personal_expenses`.

#### 1.1 Via SQL (phpMyAdmin ou terminal)
Abra o SQL do phpMyAdmin ou um terminal MySQL e execute:

```sql
CREATE DATABASE personal_expenses;
CREATE USER 'matheus'@'localhost' IDENTIFIED BY 'senha123';
GRANT ALL PRIVILEGES ON personal_expenses.* TO 'matheus'@'localhost';
FLUSH PRIVILEGES;
```

#### 1.2 Via phpMyAdmin (interface)
1. Clique em `Novo` na coluna esquerda.
2. Digite `personal_expenses` e clique em `Criar`.
3. Vá em `Contas de usuário`.
4. Adicione um novo usuário:
   - Usuário: `matheus`
   - Host: `localhost`
   - Senha: `senha123`
5. Conceda privilégios ao banco `personal_expenses`.
6. Se preferir, use a aba `SQL` do banco `personal_expenses` e execute:

```sql
GRANT ALL PRIVILEGES ON personal_expenses.* TO 'matheus'@'localhost';
FLUSH PRIVILEGES;
```

> Importante: se você usar phpMyAdmin, execute o `GRANT` dentro do banco `personal_expenses` ou selecione esse banco antes de rodar o comando.

### 2. Backend
No backend, use o arquivo de exemplo para criar seu `.env` localmente.

```bash
cd backend
cp .env.example .env
```

Edite `backend/.env` se quiser alterar algum valor, mas mantenha o mesmo usuário e senha do MySQL.

Instale dependências e rode as migrations/seeders:

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
No frontend, crie o `.env` a partir do exemplo:

```bash
cd frontend
cp .env.example .env
```

Instale dependências e rode a aplicação:

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5174

### 4. Observações importantes
- Não comite o arquivo `.env` no repositório.
- Use `.env.example` como modelo para configurar o ambiente local.
- Se o frontend não se conectar, verifique `backend/.env` e o estado do MySQL.

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

