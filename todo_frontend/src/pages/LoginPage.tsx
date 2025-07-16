import React, { useState, type FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  onLoginSuccess: (accessToken: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/token/', {
        username,
        password,
      });

      const { access, refresh } = response.data;

      localStorage.setItem('refreshToken', refresh);
      onLoginSuccess(access);

      navigate('/tasks');
    } catch (err: any) {
      console.error('Erro de login:', err.response?.data || err.message);
      if (err.response && err.response.status === 401) {
        setError('Nome de usuário ou senha inválidos.');
      } else {
        setError('Ocorreu um erro ao tentar fazer login. Tente novamente.');
      }
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="username">Usuário:</label>
        <input
          type="text"
          id="username"
          placeholder="Seu nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          id="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
      <p>Não tem uma conta? <a href="/register">Registre-se aqui</a>.</p>
    </div>
  );
};

export default LoginPage;