import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { cadastrarPerfil, obterPerfilUsuario } from '../controllers/perfilController.js';
import { validarUpload } from '../controllers/validacaoController.js';
import { login, cadastro, getCurrentUserData, updateUserTwitterData, updateUserYoutubeData } from '../controllers/userController.js';
import { auth } from '../middlewares/auth.js';
import { redirectToTwitterAuth, handleTwitterCallback, healthCheck } from '../controllers/twitterController.js';
import { redirectToGoogleAuth, handleGoogleCallback, getYoutubeDataFromSession } from '../controllers/googleController.js';
import { chatbotHandler } from '../controllers/chatbotController.js';
import { painelFuriaHandler } from "../controllers/painelController.js";
import { getUserData } from '../controllers/userController.js';
import { validarLinkController } from '../controllers/linkController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(process.cwd(), 'uploads'));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
const upload = multer({ storage: storage });

router.post('/login', login);
router.post('/cadastro', cadastro);
router.get('/me', auth, getCurrentUserData);
router.put('/update-twitter', auth, updateUserTwitterData);
router.put('/update-youtube', auth, updateUserYoutubeData);
router.get('/twitter', redirectToTwitterAuth);
router.get('/twitter/callback', handleTwitterCallback);
router.get('/twitter/health', healthCheck);
router.get('/google', redirectToGoogleAuth);
router.get('/google/callback', handleGoogleCallback);
router.get('/youtube/session-data', getYoutubeDataFromSession);
router.post('/chatbot', chatbotHandler);
router.get('/painel-furia', painelFuriaHandler);
router.post('/cadastrar-perfil', auth, cadastrarPerfil);
router.get('/perfil', auth, obterPerfilUsuario);
router.post('/upload-validate', auth, upload.single('file'), validarUpload);
router.post('/validate-link',auth, validarLinkController);
router.get('/user', auth, (req, res) => {
    const userData = getUserData(req.user.id);
    if (!userData) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(userData);
  });

export default router;
