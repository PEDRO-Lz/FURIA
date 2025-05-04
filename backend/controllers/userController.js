import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const users = [{
  id: 'default-id',
  email: 'teste@teste.com',
  name: 'Teste Usuario',
  password: '$2b$10$Fj5NHybbP13VU9F.ezBS5urbK.mmoP2i33yeHBAyTYtgW86ILyFwa',
  twitterData: null,
  youtubeData: null
}];


export function getUserData(userId) {
  const user = users.find(user => user.id === userId);
  if (!user) return null;
  
  const { password, ...userData } = user;
  return userData;
}

export const getCurrentUserData = (req, res) => {
  const userId = req.user.id;
  const data = getUserData(userId);
  if (!data) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }
  res.json(data);
};

export async function cadastro(req, res) {
  try {
    const { email, name, password } = req.body;
    
    if (!email || !name || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    
    const userExists = users.find((user) => user.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'Usuário já cadastrado' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    
    const newUser = {
      id: uuidv4(),
      email,
      name,
      password: hashPassword,
      twitterData: null,
      youtubeData: null
    };
    
    users.push(newUser);
    
    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: { id: newUser.id, email: newUser.email, name: newUser.name }
    });
  } catch (err) {
    console.error('Erro no cadastro:', err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }
    
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha inválida' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(200).json({
      message: 'Login bem-sucedido',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
}

export const updateUserTwitterData = (req, res) => {
  try {
    const userId = req.user.id;
    const { twitterData } = req.body;
    
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    users[userIndex].twitterData = twitterData;
    
    const { password, ...userData } = users[userIndex];
    res.status(200).json(userData);
  } catch (err) {
    console.error('Erro ao atualizar dados do Twitter:', err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};


export const updateUserYoutubeData = (req, res) => {
    try {
      const userId = req.user.id;
      const { youtubeData } = req.body;
      
      const simplifiedYoutubeData = {
        likedVideos: youtubeData.likedVideos.map(video => ({
          id: video.id,
          title: video.title,
          description: video.description
        })),
        subscriptions: youtubeData.subscriptions.map(subscription => ({
          id: subscription.id,
          title: subscription.title,
          description: subscription.description
        }))
      };
      
      const userIndex = users.findIndex(user => user.id === userId);
      if (userIndex === -1) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      users[userIndex].youtubeData = simplifiedYoutubeData;
      
      const { password, ...userData } = users[userIndex];
      res.status(200).json(userData);
    } catch (err) {
      console.error('Erro ao atualizar dados do YouTube:', err);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  };
  