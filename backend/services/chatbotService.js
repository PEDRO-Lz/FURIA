import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const chatbotService = async (mensagem) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Você é um chatbot amigável e fã da FURIA, sempre pronto para conversar sobre eSports e FURIA.'
          },
          {
            role: 'user',
            content: mensagem,
          }
        ],
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      return data.choices[0].message.content;
    } else {
      console.error('Erro na resposta da API:', data);
      throw new Error('Erro na API do chatbot');
    }
  } catch (error) {
    console.error('Erro ao interagir com o chatbot:', error);
    throw new Error('Erro ao processar a mensagem no chatbot');
  }
};

export default chatbotService;
