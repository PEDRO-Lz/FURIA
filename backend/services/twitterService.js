import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const { REDIRECT_URL, CLIENT_ID, CLIENT_SECRET } = process.env;

function generateCodeVerifier() {
  const length = 128;
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let codeVerifier = '';
  for (let i = 0; i < length; i++) {
    codeVerifier += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return codeVerifier;
}

async function generateCodeChallenge(codeVerifier) {
  const hash = crypto.createHash('sha256').update(codeVerifier).digest('base64');
  return hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function getTwitterAuthUrl() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=tweet.read%20users.read&state=state&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  return { authUrl, codeVerifier, codeChallenge };
}

export async function exchangeCodeForTokenAndFetchUser(code, codeVerifier) {
  const data = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URL,
    code_verifier: codeVerifier,
  });
  
  const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  
  const tokenResponse = await axios.post("https://api.twitter.com/2/oauth2/token", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${authHeader}`,
    },
  });
  
  const access_token = tokenResponse.data.access_token;
  
  const userDetails = await axios.get("https://api.twitter.com/2/users/me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  
  return userDetails.data.data;
}
