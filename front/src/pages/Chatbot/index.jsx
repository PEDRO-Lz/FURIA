import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './style.css';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const simulateTyping = (text, sender) => {
    let index = 0;
    setIsTyping(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: text[0], sender, isTyping: true },
    ]);

    const interval = setInterval(() => {
      index++;
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1] = {
          text: text.slice(0, index),
          sender,
          isTyping: true,
        };
        return newMessages;
      });

      if (index === text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 25);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input, sender: 'user' },
      { text: 'Carregando ', sender: 'bot', loading: true },
    ]);
    setInput('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/chatbot', {
        mensagem: input,
      });
      const botResponse = response.data.botResponse;
      setMessages((prevMessages) => {
        const messagesWithoutLoading = prevMessages.filter((msg) => !msg.loading);
        return [...messagesWithoutLoading];
      });
      simulateTyping(botResponse, 'bot');
    } catch (err) {
      console.error('Erro ao enviar mensagem', err);

      setMessages((prevMessages) => {
        const messagesWithoutLoading = prevMessages.filter((msg) => !msg.loading);
        return [
          ...messagesWithoutLoading,
          { text: 'Erro ao gerar resposta', sender: 'bot' },
        ];
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
        <div className="chatbot-container">
          <div className="intro">Experiência Conversacional FURIA</div>

          <div className="chat-window">
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message ${message.sender === 'user' ? 'user' : 'bot'} ${message.isTyping ? 'typing' : ''} ${message.loading ? 'loading' : ''}`}
                >
                  <p>{message.text}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
              placeholder="Digite uma mensagem..."
            />
            <button onClick={sendMessage} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </div>
  );
}

export default Chatbot;