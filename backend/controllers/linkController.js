import { validarLink } from "../services/openRouterService.js";

export const validarLinkController = async (req, res) => {
  const { content, link } = req.body;

  try {
    const resultadoValidacao = await validarLink(content, link);

    res.json({
      isRelevant: resultadoValidacao.toLowerCase().includes('sim'),
      message: resultadoValidacao,
    });
  } catch (error) {
    console.error('Erro ao validar o link:', error);
    res.status(500).json({
      isRelevant: false,
      message: 'Erro ao validar o link. Tente novamente mais tarde.',
    });
  }
};
