import axios from "axios";
import qs from "querystring";
import dotenv from "dotenv";

dotenv.config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
const redirect_uri = "http://localhost:3000/auth/callback";

export function getGoogleAuthUrl() {
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code&scope=https://www.googleapis.com/auth/youtube.readonly&access_type=offline&prompt=consent`;
}

export async function fetchYouTubeData(code) {
  const tokenUrl = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri,
    grant_type: "authorization_code",
  };

  const response = await axios.post(tokenUrl, qs.stringify(values), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const { access_token } = response.data;

  const likedVideos = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
    params: {
      part: "snippet",
      myRating: "like",
    },
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const subscriptions = await axios.get("https://www.googleapis.com/youtube/v3/subscriptions", {
    params: {
      part: "snippet",
      mine: true,
      maxResults: 10,
    },
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const simplifiedLikedVideos = likedVideos.data.items.map(video => ({
    id: video.id,
    title: video.snippet.title,
    description: video.snippet.description
  }));

  const simplifiedSubscriptions = subscriptions.data.items.map(subscription => ({
    id: subscription.id,
    title: subscription.snippet.title,
    description: subscription.snippet.description
  }));

  return {
    likedVideos: simplifiedLikedVideos,
    subscriptions: simplifiedSubscriptions,
  };
}

