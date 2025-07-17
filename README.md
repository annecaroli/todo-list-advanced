# TODO List Avançado

Projeto criado para o processo seletivo da OPME

## Funcionalidades
* CRUD de Tarefas ✔
* O usuário consiga criar uma conta e fazer login ✔
* O usuário consiga marcar tarefas como concluídas ou não concluídas ✔
* Filtragem de Tarefas ✔
* Paginação de Tarefas ✔
* Criação e gerenciamento de categorias para organizar as tarefas ❌
* Compartilhamento de tarefas com outros usuários ❌
* Dockerizar a aplicação utilizando Docker e Docker Compose ✔
* Testes unitários com pytest ❌

## Tecnologias Utilizadas
**Backend**
* Python 3.9+
* Django 4.x
* Django REST Framework
* Django REST Framework Simple JWT
* Django CORS Headers
* Django Filter
* PostgreSQL

**Frontend**
* React 18+ 
* TypeScript
* Vite
* React Router DOM
* Axios
* Nginx
* HTML5, CSS3

**Containers**
* Docker
* Docker Compose

**Banco de Dados**
* PostgreSQL


## Endpoints da API
Aqui estão os principais endpoints da API Django que o frontend consome:

* **`GET /api/tasks/`**: Listar e filtrar tarefas do usuário logado.
* **`POST /api/tasks/`**: Criar uma nova tarefa.
* **`GET /api/tasks/{id}/`**: Obter detalhes de uma tarefa específica.
* **`PUT /api/tasks/{id}/`**: Atualizar uma tarefa (completa).
* **`PATCH /api/tasks/{id}/`**: Atualizar parcialmente uma tarefa (ex: mudar status `completed`).
* **`DELETE /api/tasks/{id}/`**: Excluir uma tarefa.
* **`POST /api/register/`**: Registrar um novo usuário.
* **`POST /api/token/`**: Obter token de acesso e refresh JWT (para login).
* **`POST /api/token/refresh/`**: Renovar o token de acesso JWT.

## Pré-requisitos

Antes de iniciar a aplicação, certifique-se de ter o seguinte software instalado em sua máquina:

* Python 3.9+
* pip
* Node.js 20+
* npm
* PostgreSQL
* Docker Desktop

## Como Baixar e Rodar a Aplicação

1.  Clonar o Repositório
    ```bash
    git clone https://github.com/annecaroli/todo-list-advanced
    ```
2.  **Construir as Imagens Docker**
    ```bash
    docker-compose build --no-cache
    ```
3.  **Iniciar a Aplicação**
    ```bash
    docker-compose up -d
    ```
4. **Aplicar Migrações do Banco de Dados**
    ```bash
    docker-compose exec backend python manage.py makemigrations
    docker-compose exec backend python manage.py migrate
    ```
5. **Acessar a Aplicação**
Com todos os serviços rodando e as migrações aplicadas, sua aplicação estará acessível no seguinte endereço: http://localhost:3000/