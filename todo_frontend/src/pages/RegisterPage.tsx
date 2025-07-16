import React, { useState, type FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/register/', {
        username,
        email,
        password,
        password2,
      });
      setSuccess('Registro bem-sucedido! Você pode fazer login agora.');
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error('Erro de registro:', err.response?.data || err.message);
      if (err.response && err.response.data) {
        if (err.response.data.username) {
          setError(`Usuário: ${err.response.data.username[0]}`);
        } else if (err.response.data.email) {
          setError(`Email: ${err.response.data.email[0]}`);
        } else if (err.response.data.password) {
          setError(`Senha: ${err.response.data.password[0]}`);
        } else {
          setError('Erro no registro. Tente novamente com dados válidos.');
        }
      } else {
        setError('Ocorreu um erro inesperado ao registrar. Tente novamente.');
      }
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Registrar</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="registerUsername">Usuário:</label>
        <input
          type="text"
          id="registerUsername"
          placeholder="Escolha um nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="registerEmail">Email:</label>
        <input
          type="email"
          id="registerEmail"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="registerPassword">Senha:</label>
        <input
          type="password"
          id="registerPassword"
          placeholder="Crie uma senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="registerPassword2">Confirmar Senha:</label> {/* <-- Novo campo */}
        <input
        type="password"
        id="registerPassword2"
        placeholder="Confirme sua senha"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
        required
        />
        <button type="submit">Registrar</button>
      </form>
      <p>Já tem uma conta? <a href="/login">Faça login aqui</a>.</p>
    </div>
  );
};

export default RegisterPage;