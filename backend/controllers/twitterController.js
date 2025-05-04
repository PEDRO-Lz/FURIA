import { getTwitterAuthUrl, exchangeCodeForTokenAndFetchUser } from "../services/twitterService.js";

export const healthCheck = (req, res) => {
  res.status(200).send("healthy");
};

export const redirectToTwitterAuth = async (req, res) => {
  try {
    const { codeChallenge, codeVerifier, authUrl } = await getTwitterAuthUrl();
    req.session.codeVerifier = codeVerifier;
    res.redirect(authUrl);
  } catch (error) {
    console.error("Error generating code challenge:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const handleTwitterCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const codeVerifier = req.session.codeVerifier;
    
    if (!codeVerifier) {
      return res.status(400).send("Code verifier not found in session");
    }
    
    const user = await exchangeCodeForTokenAndFetchUser(code, codeVerifier);
    
    res.redirect(`http://localhost:5173/challenge2?twitterConnected=true&twitterData=${encodeURIComponent(JSON.stringify(user))}`);
  } catch (error) {
    console.error("Error exchanging authorization code:", error);
    res.redirect(`http://localhost:5173/challenge2?twitterError=${encodeURIComponent("Falha na autenticação do Twitter")}`);
  }
};
