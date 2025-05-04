import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css'

const Perfil = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    cpf: '',
    descricao: ''
  });
  const [perfilAnalise, setPerfilAnalise] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [validationResult, setValidationResult] = useState('');
  const [perfilCadastrado, setPerfilCadastrado] = useState(false);
  const [documentoValidado, setDocumentoValidado] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [perfilData, setPerfilData] = useState(null);
  const [linkToValidate, setLinkToValidate] = useState('');
  const [linkValidationResult, setLinkValidationResult] = useState(null);
  const [isValidatingLink, setIsValidatingLink] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserData(response.data);
      setFormData(prev => ({
        ...prev,
        nome: response.data.name || ''
      }));
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/cadastrar-perfil',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      setPerfilData(response.data.perfil);
      setPerfilCadastrado(true);
      if (response.data.perfil && response.data.perfil.analiseIA) {
        setPerfilAnalise(null);
      }
      alert('Perfil cadastrado com sucesso! Agora faça o upload do documento para validação.');
    } catch (error) {
      console.error('Erro ao cadastrar perfil:', error);
      alert('Erro ao cadastrar perfil: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Nenhum arquivo selecionado.');
      return;
    }
    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('file', selectedFile);
    formDataToSend.append('nome', formData.nome);
    formDataToSend.append('cpf', formData.cpf);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/upload-validate',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
        });
      setUploadStatus(response.data.message);
      setValidationResult(response.data.resultado);
      setDocumentoValidado(true);
      if (perfilData && perfilData.analiseIA) {
        setPerfilAnalise(perfilData.analiseIA);
        alert('Documento validado! Análise de perfil disponível.');
      }
    } catch (error) {
      console.error('Rate limit exceeded: free-models-per-day. Add 10 credits to unlock 1000 free model requests per day??? ', error.response ? error.response.data : error.message);
      setUploadStatus('Rate limit exceeded: free-models-per-day. Add 10 credits to unlock 1000 free model requests per day??? ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkValidation = async () => {
    if (!linkToValidate) {
      alert('Por favor, insira um link para validar.');
      return;
    }

    setIsValidatingLink(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/api/validate-link',
        {
          content: perfilData.descricao, 
          link: linkToValidate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setLinkValidationResult(response.data);
    } catch (error) {
      console.error('Erro ao validar link:', error);
      setLinkValidationResult({
        isRelevant: false,
        message: 'Erro ao validar o link. Por favor, tente novamente mais tarde.'
      });
    } finally {
      setIsValidatingLink(false);
    }
  };

  return (
    <div className="perfil-page">
      <h1>Cadastro e Validação de Perfil</h1>
      
      {userData && (
        <div className="user-info">
          <h3>Dados do Usuário</h3>
          <p><strong>Nome:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Twitter vinculado:</strong> {userData.twitterData ? 'Sim' : 'Não'}</p>
          <p><strong>YouTube vinculado:</strong> {userData.youtubeData ? 'Sim' : 'Não'}</p>
        </div>
      )}

      <div className="form-section">
        <h2>Cadastro de Perfil</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input
              name="nome"
              value={formData.nome}
              onChange={handleFormChange}
              required
              disabled={perfilCadastrado}
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label>Endereço</label>
            <input
              name="endereco"
              value={formData.endereco}
              onChange={handleFormChange}
              required
              disabled={perfilCadastrado}
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label>CPF</label>
            <input
              name="cpf"
              value={formData.cpf}
              onChange={handleFormChange}
              required
              disabled={perfilCadastrado}
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              placeholder="Fale aqui sobre o tipo de conteúdo que você consome, o que gosta de fazer e comprar..."
              onChange={handleFormChange}
              required
              rows="5"
              disabled={perfilCadastrado}
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={perfilCadastrado || isLoading}
          >
            {isLoading ? 'Processando...' : 'Cadastrar Perfil'}
          </button>
        </form>
      </div>

      <div className="upload-section">
        <h2>Upload de Documento</h2>
        <p>Faça upload de um documento de identidade (RG ou CNH) para validação.</p>
        <div className="form-group">
          <input
            type="file"
            onChange={handleFileChange}
            disabled={!perfilCadastrado || documentoValidado}
            className="file-input"
          />
        </div>
        <button
          onClick={handleUpload}
          disabled={!perfilCadastrado || !selectedFile || documentoValidado || isLoading}
          className="btn-primary"
        >
          {isLoading ? 'Processando...' : 'Upload e Validar'}
        </button>
        {uploadStatus && (
          <div className="status-message">
            <p>{uploadStatus}</p>
          </div>
        )}
        {validationResult && (
          <div className="validation-result">
            <h3>Resultado da validação:</h3>
            <p>{validationResult}</p>
          </div>
        )}
      </div>

      {perfilAnalise && documentoValidado && (
        <>
          <div className="analise-section">
            <h2>Análise do Perfil</h2>
            <div className="analise-content">
              {perfilAnalise}
            </div>
          </div>
          
          <div className="link-validation-section">
            <h2>Validar Conteúdo</h2>
            <p>Insira um link para verificar se o conteúdo é relevante para o seu perfil.</p>
            <div className="form-group">
              <label>Link para validar</label>
              <input
                type="url"
                value={linkToValidate}
                onChange={(e) => setLinkToValidate(e.target.value)}
                placeholder="https://exemplo.com/conteudo"
                required
              />
            </div>
            <button
              onClick={handleLinkValidation}
              disabled={isValidatingLink || !linkToValidate}
              className="btn-primary"
            >
              {isValidatingLink ? 'Validando...' : 'Validar Link'}
            </button>
            
            {linkValidationResult && (
              <div className={`link-result ${linkValidationResult.isRelevant ? 'relevant' : 'not-relevant'}`}>
                <h3>Resultado da Análise:</h3>
                <p>{linkValidationResult.message}</p>
                {linkValidationResult.details && (
                  <div className="analysis-details">
                    <h4>Detalhes:</h4>
                    <p>{linkValidationResult.details}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      <button
        onClick={() => navigate('/home')}
        className="btn-secondary"
        style={{ marginTop: '20px' }}
      >
        Voltar para Home
      </button>
    </div>
  );
};

export default Perfil;
