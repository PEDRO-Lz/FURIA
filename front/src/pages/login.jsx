import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/login', { email, password });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/home');
    } catch (err) {
      console.error('Erro no login:', err);
      if (err.response) {
        console.error('Detalhes do erro:', err.response.data);
        setError(err.response.data.message || 'Erro ao fazer login');
      } else if (err.request) {
        console.error('Sem resposta do servidor');
        setError('Servidor não respondeu. Verifique sua conexão.');
      } else {
        console.error('Erro na configuração da requisição');
        setError('Erro ao configurar requisição');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <h2 className="login-title">Login</h2>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-form-group">
          <label className="login-label">Email:</label>
          <input
            className="login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="login-form-group">
          <label className="login-label">Senha:</label>
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="login-button" type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p className="login-redirect">
        Não tem uma conta? <a href="/cadastro">Cadastre-se</a>
      </p>
    </div>
  );
}

export default Login;
