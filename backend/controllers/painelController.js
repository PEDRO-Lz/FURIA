import { obterUltimosJogos } from '../services/puppeteerService.js';

export const painelFuriaHandler = async (req, res) => {
  try {
    const dados = await obterUltimosJogos();
    res.json(dados);
  } catch (error) {
    console.error('Erro ao coletar dados:', error);
    res.status(500).json({ error: 'Erro ao coletar dados' });
  }
};
