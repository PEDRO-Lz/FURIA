import path from 'path';
import { validarDocumentoComImagem } from '../services/openRouterService.js';
import { getUserData } from './userController.js';

export async function validarUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }
    
    const { nome, cpf } = req.body;
    
    if (!nome || !cpf) {
      return res.status(400).json({ message: 'Nome e CPF são obrigatórios.' });
    }
    
    const filePath = path.join(process.cwd(), 'uploads', req.file.filename);
    
    const userData = getUserData(req.user.id);
    
    const resultadoValidacao = await validarDocumentoComImagem(filePath, nome, cpf);
    
    return res.status(200).json({
      message: 'Arquivo enviado e validado!',
      resultado: resultadoValidacao,
      filename: req.file.filename,
      userData: userData
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao validar documento.', error: error.message });
  }
}
