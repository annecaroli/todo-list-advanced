# Todo List Avançado com Django e React

Este é um aplicativo completo de lista de tarefas (Todo List) construído com um backend robusto em Django REST Framework e um frontend interativo em React. Ele oferece gerenciamento de tarefas para usuários autenticados, com recursos como registro, login JWT, criação, leitura, atualização, exclusão, filtragem por status e paginação de tarefas.

## Funcionalidades Principais

* **Autenticação JWT:** Registro de novos usuários e login utilizando JSON Web Tokens para segurança.
* **Gerenciamento de Tarefas:** Usuários podem criar, visualizar (apenas suas próprias tarefas), editar e excluir tarefas.
* **Filtragem de Tarefas:** Filtre tarefas por status (concluídas, pendentes ou todas).
* **Paginação:** Navegação entre múltiplas páginas de tarefas para melhor performance com grandes volumes de dados.
* **Interface Intuitiva:** Frontend responsivo e fácil de usar.

## Tecnologias Utilizadas

**Backend (Django REST Framework):**
* Python 3.9+
* Django 4.x
* Django REST Framework
* Django REST Framework Simple JWT (para autenticação)
* Django CORS Headers
* Django Filter
* PostgreSQL (como banco de dados)

**Frontend (React):**
* React 18+ (com TypeScript)
* Vite (para build rápido)
* React Router DOM (para roteamento)
* Axios (para requisições HTTP)
* HTML5, CSS3

## Pré-requisitos

Antes de iniciar a aplicação, certifique-se de ter o seguinte software instalado em sua máquina:

* **Python 3.9+**
* **pip** (gerenciador de pacotes Python)
* **Node.js 20+**
* **npm** (gerenciador de pacotes Node.js, vem com Node.js)
* **PostgreSQL:** Um servidor PostgreSQL localmente instalado e em execução.

## Configuração e Como Rodar a Aplicação

Siga os passos abaixo para configurar e rodar o projeto localmente.

### 1. Configuração do Backend (Django)

1.  **Navegue até a pasta do backend:**
    ```bash
    cd todo-list-advanced/todo_backend
    ```

2.  **Crie e ative um ambiente virtual:**
    ```bash
    python -m venv myenv_backend
    # No Windows:
    .\myenv_backend\Scripts\activate
    # No Linux/macOS:
    source myenv_backend/bin/activate
    ```

3.  **Instale as dependências Python:**
    ```bash
    pip install -r requirements.txt
    ```
    (Certifique-se de que o `requirements.txt` está atualizado. Se não, rode `pip freeze > requirements.txt` nesta pasta para gerá-lo.)

4.  **Configuração do Banco de Dados PostgreSQL:**
    * **Crie um banco de dados PostgreSQL vazio** para o seu projeto (ex: `todo_db`).
    * **Crie um usuário PostgreSQL** (ex: `user` com senha `password`) ou use um existente que tenha permissões para acessar o `todo_db`.
    * **Abra `todo-list-advanced/todo_backend/todo_backend/settings.py`** e **ajuste a seção `DATABASES`** para apontar para sua instância local do PostgreSQL. Remova o uso de `os.environ.get` para `HOST`, `USER`, `PASSWORD` e `NAME` se você for configurar diretamente aqui.

    Exemplo de `settings.py` para PostgreSQL local:
    ```python
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'todo_db',      # Nome do seu banco de dados PostgreSQL
            'USER': 'user',          # Seu usuário PostgreSQL
            'PASSWORD': 'password',  # Sua senha PostgreSQL
            'HOST': 'localhost',     # Ou o IP/hostname do seu servidor PostgreSQL
            'PORT': '5432',          # Porta padrão do PostgreSQL
        }
    }
    ```
    * **Importante:** Se você usou um `.env` antes para o Docker, certifique-se de que as variáveis `SECRET_KEY` e `DEBUG` estão configuradas diretamente no `settings.py` ou que seu ambiente virtual as carrega (caso você use `python-dotenv`).

5.  **Execute as migrações do banco de dados:**
    ```bash
    python manage.py migrate
    ```

6.  **Crie um superusuário (para acessar o painel de administração e testar):**
    ```bash
    python manage.py createsuperuser
    ```
    Siga os prompts para criar um nome de usuário, e-mail e senha.

7.  **Inicie o servidor de desenvolvimento Django:**
    ```bash
    python manage.py runserver
    ```
    O backend estará rodando em `http://127.0.0.1:8000/`.

### 2. Configuração do Frontend (React)

1.  **Navegue até a pasta do frontend:**
    ```bash
    cd ../todo_frontend
    ```

2.  **Instale as dependências Node.js:**
    ```bash
    npm install
    ```

3.  **AJUSTE CRÍTICO: Configurar URLs da API:**
    * Abra os seguintes arquivos e **reverta** as URLs do `axios` para apontar diretamente para o seu backend Django local (`http://127.0.0.1:8000`):
        * `todo-list-advanced/todo_frontend/src/pages/LoginPage.tsx`
        * `todo-list-advanced/todo_frontend/src/pages/RegisterPage.tsx`
        * `todo-list-advanced/todo_frontend/src/pages/TasksPage.tsx`

    * **Mude todas as ocorrências de `/api/...` de volta para `http://127.0.0.1:8000/api/...`.**

    Exemplo em `LoginPage.tsx`:
    ```typescript
    // Mude de: await axios.post('/api/token/', { ... });
    // Para:
    await axios.post('[http://127.0.0.1:8000/api/token/](http://127.0.0.1:8000/api/token/)', {
      username,
      password,
    });
    ```
    Faça isso para todas as chamadas `axios` nos três arquivos mencionados.

4.  **Inicie o servidor de desenvolvimento React:**
    ```bash
    npm run dev
    ```
    O frontend estará rodando em `http://localhost:5173/`.

## Como Usar a Aplicação

1.  Acesse o frontend em `http://localhost:5173/` no seu navegador.
2.  Você será redirecionado para a página de registro ou login.
3.  **Registre-se** como um novo usuário usando o formulário de registro.
4.  Após o registro, faça login com suas novas credenciais.
5.  Você será redirecionado para a página de tarefas, onde poderá criar, editar, marcar como concluídas e excluir suas tarefas.

## Endpoints da API (Backend)

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

---

Este `README.md` fornece todas as informações necessárias para que alguém possa baixar seu projeto e rodá-lo localmente sem depender do Docker. Lembre-se de salvar este conteúdo como `README.md` na pasta `todo-list-advanced/`.