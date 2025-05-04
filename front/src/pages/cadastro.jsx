import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './cadastro.css';

function Cadastro() {
  const [name, setName] = useState('');
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
      const response = await api.post('/cadastro', { name, email, password });

      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err) {
      console.error('Erro no cadastro:', err);
      if (err.response) {
        setError(err.response.data.message || 'Erro ao realizar cadastro');
      } else if (err.request) {
        setError('Servidor não respondeu. Verifique sua conexão.');
      } else {
        setError('Erro ao configurar requisição');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-form-container">
      <h2 className="cadastro-title">Cadastro</h2>
      {error && <p className="cadastro-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="cadastro-form-group">
          <label className="cadastro-label">Nome:</label>
          <input
            type="text"
            className="cadastro-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="cadastro-form-group">
          <label className="cadastro-label">Email:</label>
          <input
            type="email"
            className="cadastro-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="cadastro-form-group">
          <label className="cadastro-label">Senha:</label>
          <input
            type="password"
            className="cadastro-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="cadastro-button" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      <p className="cadastro-redirect">
        Já tem uma conta? <a href="/login">Faça login</a>
      </p>
    </div>
  );
}

export default Cadastro;
