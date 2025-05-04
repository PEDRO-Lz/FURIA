import { getGoogleAuthUrl, fetchYouTubeData } from "../services/googleService.js";

export const redirectToGoogleAuth = (req, res) => {
  const url = getGoogleAuthUrl();
  res.redirect(url);
};

export const handleGoogleCallback = async (req, res) => {
  try {
    const code = req.query.code;
    const youtubeData = await fetchYouTubeData(code);
    
    req.session.youtubeData = youtubeData;
    
    res.redirect(`http://localhost:5173/challenge2?youtubeConnected=true&sessionId=${req.sessionID}`);
  } catch (error) {
    console.error("Erro na autenticação do Google:", error.response?.data || error.message);
    res.redirect(`http://localhost:5173/challenge2?youtubeError=${encodeURIComponent("Erro ao autenticar com Google")}`);
  }
};

export const getYoutubeDataFromSession = (req, res) => {
  if (req.session.youtubeData) {
    res.json(req.session.youtubeData);
    delete req.session.youtubeData;
  } else {
    res.status(404).json({ message: 'Dados do YouTube não encontrados' });
  }
};
