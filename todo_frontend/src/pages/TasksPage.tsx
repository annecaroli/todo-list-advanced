// todo_frontend/src/pages/TasksPage.tsx
import React, { useState, useEffect, type FormEvent } from 'react';
import axios, { type AxiosResponse } from 'axios';
import type { Task } from '../types'; // Importa a interface Task
 // Importa a interface Task

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState<string>('');

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>('/api/tasks/');
      setTasks(response.data);
      setError('');
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
      setError('Erro ao carregar tarefas. Tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'> = {
      title,
      description,
      completed: false,
    };

    try {
      let response: AxiosResponse<Task, any>;
      if (editingTask) {
        response = await axios.put<Task>(`/api/tasks/${editingTask.id}/`, {
          ...taskData,
          completed: editingTask.completed, // Mantém o status de conclusão existente
        });
        setTasks(tasks.map((task) => (task.id === editingTask.id ? response.data : task)));
        setEditingTask(null);
      } else {
        response = await axios.post<Task>('/api/tasks/', taskData);
        setTasks([...tasks, response.data]);
      }
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Erro ao salvar tarefa. Verifique os dados e tente novamente.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/tasks/${id}/`);
      setTasks(tasks.filter((task) => task.id !== id));
      setError('');
    } catch (err) {
      console.error("Erro ao excluir tarefa:", err);
      setError('Erro ao excluir tarefa. Tente novamente.');
    }
  };

  // Função para MARCAR/DESMARCAR tarefa como concluída (PATCH)
  // Agora será chamada pelo onChange do checkbox
  const toggleComplete = async (taskToToggle: Task) => {
    try {
      const response = await axios.patch<Task>(`/api/tasks/${taskToToggle.id}/`, {
        completed: !taskToToggle.completed, // Inverte o status atual
      });
      setTasks(tasks.map((task) => (task.id === taskToToggle.id ? response.data : task)));
      setError('');
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      setError('Erro ao atualizar status da tarefa.');
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

      <h2>Lista de Tarefas</h2>
      {tasks.length === 0 ? (
        <p>Nenhuma tarefa encontrada. Adicione uma nova!</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <div className="task-content"> {/* Novo div para o conteúdo da tarefa */}
                {/* Checkbox para marcar/desmarcar conclusão */}
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task)} // Chama toggleComplete no clique do checkbox
                />
                <div> {/* Envolve título e descrição */}
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
    </div>
  );
};

export default TasksPage;