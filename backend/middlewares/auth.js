import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;


export const auth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Token não fornecido!' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Erro ao verificar token:', err);
      return res.status(403).json({ message: 'Token inválido!' });
    }
    req.user = user;
    next();
  });
  
};