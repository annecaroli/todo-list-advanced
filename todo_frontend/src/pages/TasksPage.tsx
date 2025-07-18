import React, { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';
import type { Task, PaginatedResponse } from '../types';

interface TasksPageProps {
  accessToken: string;
}

const TasksPage: React.FC<TasksPageProps> = ({ accessToken }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const fetchTasks = async () => {
    setError('');

    try {
      let url = `/api/tasks/?page=${currentPage}`;

      if (filterStatus === 'completed') {
        url += '&completed=true';
      } else if (filterStatus === 'pending') {
        url += '&completed=false';
      }

      const response = await axios.get<PaginatedResponse<Task>>(url, getConfig());

      setTasks(response.data.results);
      setTotalItems(response.data.count);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (err: any) {
      console.error("Erro ao buscar tarefas:", err.response?.data || err.message);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError('Sessão expirada ou não autorizado. Por favor, faça login novamente.');
      } else {
        setError('Erro ao carregar tarefas. Verifique sua conexão ou tente mais tarde.');
      }
      setTasks([]);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchTasks();
    }
  }, [currentPage, filterStatus, accessToken]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user'> = {
      title,
      description,
      completed: false,
    };

    try {
      if (editingTask) {
        await axios.put<Task>(`/api/tasks/${editingTask.id}/`, {
          ...taskData,
          completed: editingTask.completed,
        }, getConfig());
        setEditingTask(null);
      } else {
        await axios.post<Task>('/api/tasks/', taskData, getConfig());
      }
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err: any) {
      console.error("Erro ao salvar tarefa:", err.response?.data || err.message);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError('Sessão expirada ou não autorizado. Por favor, faça login novamente.');
      } else {
        setError('Erro ao salvar tarefa. Verifique os dados e tente novamente.');
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/tasks/${id}/`, getConfig());
      if (tasks.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
      } else {
          fetchTasks();
      }
      setError('');
    } catch (err: any) {
      console.error("Erro ao excluir tarefa:", err.response?.data || err.message);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError('Sessão expirada ou não autorizado. Por favor, faça login novamente.');
      } else {
        setError('Erro ao excluir tarefa. Tente novamente.');
      }
    }
  };

  const toggleComplete = async (taskToToggle: Task) => {
    try {
      await axios.patch<Task>(`/api/tasks/${taskToToggle.id}/`, {
        completed: !taskToToggle.completed,
      }, getConfig());
      fetchTasks();
      setError('');
    } catch (err: any) {
      console.error("Erro ao atualizar status:", err.response?.data || err.message);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError('Sessão expirada ou não autorizado. Por favor, faça login novamente.');
      } else {
        setError('Erro ao atualizar status da tarefa.');
      }
    }
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  if (!accessToken) {
    return <p>Por favor, faça login para ver suas tarefas.</p>;
  }

  return (
    <div>
      <h1>Minhas Tarefas</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título da Tarefa"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição da Tarefa (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button type="submit">
          {editingTask ? 'Atualizar Tarefa' : 'Adicionar Tarefa'}
        </button>
        {editingTask && (
          <button type="button" onClick={cancelEdit} style={{ marginLeft: '10px' }}>
            Cancelar Edição
          </button>
        )}
      </form>

      <div className="filters">
        <label htmlFor="filterStatus">Filtrar por Status:</label>
        <select
          id="filterStatus"
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value as 'all' | 'completed' | 'pending');
            setCurrentPage(1);
          }}
        >
          <option value="all">Todas</option>
          <option value="completed">Concluídas</option>
          <option value="pending">Pendentes</option>
        </select>
      </div>

      <h2>Lista de Tarefas ({totalItems} itens no total)</h2>
      {tasks.length === 0 && !error ? (
        <p>Nenhuma tarefa encontrada com o filtro atual.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <div className="task-content">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task)}
                />
                <div>
                  <h3>{task.title}</h3>
                  {task.description && <p>{task.description}</p>}
                  <small>Criado em: {new Date(task.created_at).toLocaleString()}</small>
                </div>
              </div>
              <div className="task-actions">
                <button onClick={() => startEdit(task)} className="edit">Editar</button>
                <button onClick={() => handleDelete(task.id)} className="delete">Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={goToPreviousPage} disabled={currentPage === 1}>
            Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
