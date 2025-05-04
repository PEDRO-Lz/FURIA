import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

function Challenge2() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/me');
        setUserData(response.data);
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
        if (err.response?.status === 403) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    const handleCallbacks = async () => {
      const params = new URLSearchParams(location.search);

      const twitterConnected = params.get('twitterConnected');
      const twitterData = params.get('twitterData');
      const twitterError = params.get('twitterError');

      const youtubeConnected = params.get('youtubeConnected');
      const sessionId = params.get('sessionId');
      const youtubeError = params.get('youtubeError');


      if (twitterError) {
        setErrorMessage(decodeURIComponent(twitterError));
        navigate('/challenge2', { replace: true });
        return;
      }

      if (youtubeError) {
        setErrorMessage(decodeURIComponent(youtubeError));
        navigate('/challenge2', { replace: true });
        return;
      }

      if (twitterConnected && twitterData) {
        try {
          const parsedData = JSON.parse(decodeURIComponent(twitterData));
          await api.put('/update-twitter', { twitterData: parsedData });
          setSuccessMessage('Conta do Twitter conectada com sucesso!');
          fetchUserData();
          navigate('/challenge2', { replace: true });
        } catch (err) {
          console.error('Erro ao salvar dados do Twitter:', err);
          setErrorMessage('Erro ao salvar dados do Twitter');
          navigate('/challenge2', { replace: true });
        }
      }

      if (youtubeConnected && sessionId) {
        try {
          const response = await api.get('/youtube/session-data');
          await api.put('/update-youtube', { youtubeData: response.data });
          setSuccessMessage('Conta do YouTube conectada com sucesso!');
          fetchUserData();
          navigate('/challenge2', { replace: true });
        } catch (err) {
          console.error('Erro ao buscar dados do YouTube:', err);
          setErrorMessage('Erro ao salvar dados do YouTube');
          navigate('/challenge2', { replace: true });
        }
      }
    };

    fetchUserData();
    handleCallbacks();
  }, [location, navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const connectTwitter = () => {
    window.location.href = 'http://localhost:3000/auth/twitter';
  };

  const connectYoutube = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="home-container">
      <header>
        <h1>Bem-vindo, {userData?.name || 'Usuário'}</h1>
        <button onClick={logout} className="logout-btn">Sair</button>
      </header>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}

      <div className="user-info">
        <h2>Seus dados</h2>
        <p><strong>Nome:</strong> {userData?.name}</p>
        <p><strong>Email:</strong> {userData?.email}</p>
      </div>

      <div className="integration-section">
        <h2>Integrações</h2>
        <div className="integration-cards">
          <div className="card">
            <h3>Twitter</h3>
            {userData?.twitterData ? (
              <>
                <p className="connected">Conectado</p>
                <button onClick={connectTwitter}>Reconectar Twitter</button>
              </>
            ) : (
              <>
                <p>Não conectado</p>
                <button onClick={connectTwitter}>Conectar Twitter</button>
              </>
            )}
          </div>

          <div className="card">
            <h3>YouTube</h3>
            {userData?.youtubeData ? (
              <>
                <p className="connected">Conectado</p>
                <button onClick={connectYoutube}>Reconectar YouTube</button>
              </>
            ) : (
              <>
                <p>Não conectado</p>
                <button onClick={connectYoutube}>Conectar YouTube</button>
              </>
            )}
          </div>
          <button onClick={() => navigate('/perfil')} className="feature-button">
            Cadastrar e Validar Perfil
          </button>

        </div>
      </div>
    </div>
  );
}

export default Challenge2;
