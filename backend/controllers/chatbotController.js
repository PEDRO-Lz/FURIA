import chatbotService from '../services/chatbotService.js';

export const chatbotHandler = async (req, res) => {
  const { mensagem } = req.body;

  try {
    const botResponse = await chatbotService(mensagem);
    res.json({ botResponse });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar a mensagem' });
  }
};