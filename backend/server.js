import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import apiRoutes from "./routes/apiRoutes.js";
import http from 'http';
import { initializeSocketIO } from "./services/socketService.js"; 

dotenv.config();

const app = express();
const server = http.createServer(app); 
const io = initializeSocketIO(server);  
const PORT = process.env.PORT;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use("/api", apiRoutes);
app.use("/auth", apiRoutes);

app.get('/twitterHome', (req, res) => {
  const { code, state } = req.query;
  res.redirect(`/auth/twitter/callback?code=${code}&state=${state}`);
});
app.get('/auth/callback', (req, res) => {
    const { code, state } = req.query;
    res.redirect(`/auth/google/callback?code=${code}&state=${state}`);
  });
app.get('/', (req, res) => {
  res.send('API está funcionando!');
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
