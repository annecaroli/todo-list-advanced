#!/bin/sh
# todo-list-advanced/todo_backend/entrypoint.sh

# Espera até que o serviço de banco de dados (chamado 'db' no docker-compose) esteja acessível
echo "Waiting for postgres..."

# Loop que tenta conectar ao 'db' na porta 5432. 'nc -z' verifica a conexão.
# O 'sleep 0.1' evita consumo excessivo de CPU.
while ! nc -z db 5432; do
  sleep 0.1
done

echo "PostgreSQL started"

# Aplica as migrações do banco de dados Django
python manage.py migrate

# Executa o comando principal que foi passado para o entrypoint (neste caso, o runserver)
exec "$@"