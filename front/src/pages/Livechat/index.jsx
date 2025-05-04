import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './style.css';

const socket = io('http://localhost:3000', { 
  reconnectionDelayMax: 10000,
  autoConnect: true
});

function LiveChat() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/me');
        setUserData(response.data);
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
        if (err.response?.status === 403) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    function onChatMessage(msgData) {
      setChat(prevChat => [...prevChat, msgData]);
    }

    socket.on('chat message', onChatMessage);

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== '') {
      const messageData = {
        text: message,
        username: userData?.name || 'Anônimo',
        userId: userData?.id || 'unknown',
        timestamp: new Date().toISOString()
      };
      
      socket.emit('chat message', messageData);
      setMessage('');
    }
  };

  const goBack = () => {
    navigate('/home');
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <div className="bottom-container">
        <div className="twitch-chat">
          <div className="chat-header">
            <h2>Chat ao Vivo</h2>
            <div className="user-info">
              Logado como: <span>{userData?.name || 'Usuário'}</span>
            </div>
          </div>
          
          <div className="chat-live-messages">
            {chat.length === 0 ? (
              <div className="empty-chat-message">
                Nenhuma mensagem ainda. Seja o primeiro a enviar!
              </div>
            ) : (
              chat.map((msg, idx) => (
                <div key={idx} className="chat-live-message">
                  <div className="message-header">
                    <span className="username">{msg.username}</span>
                    <span className="timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="message-text">{msg.text}</div>
                </div>
              ))
            )}
          </div>
          <div className="chat-live-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveChat;
