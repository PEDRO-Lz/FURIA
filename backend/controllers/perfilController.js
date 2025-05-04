import { getUserData } from './userController.js';
import { analisarPerfilUsuario } from '../services/openRouterService.js';

let perfis = [];

export async function cadastrarPerfil(req, res) {
  try {
    const { nome, endereco, cpf, descricao } = req.body;
    
    if (!nome || !endereco || !cpf || !descricao) {
      return res.status(400).json({ message: 'Nome, endereço, CPF e descrição são obrigatórios.' });
    }
    
    const userData = getUserData(req.user.id);
    
    if (!userData) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    
    const formData = { nome, endereco, cpf, descricao };
    
    let analiseIA = "Análise não disponível no momento.";
    
    try {
      analiseIA = await analisarPerfilUsuario(userData, formData);
    } catch (iaError) {
      console.error('Erro ao analisar perfil com IA:', iaError);
      analiseIA = "Não foi possível gerar a análise do perfil: " + iaError.message;
    }
    
    const novoPerfil = {
      id: perfis.length + 1,
      userId: req.user.id,
      nome,
      endereco,
      cpf,
      descricao,
      twitterData: userData.twitterData,
      youtubeData: userData.youtubeData,
      dataCriacao: new Date(),
      analiseIA
    };
    
    perfis.push(novoPerfil);
    
    return res.status(201).json({ 
      message: 'Perfil cadastrado com sucesso!', 
      perfil: novoPerfil 
    });
  } catch (error) {
    console.error('Erro ao cadastrar perfil:', error);
    return res.status(500).json({ message: 'Erro ao cadastrar perfil.', error: error.message });
  }
}

export function obterPerfilUsuario(req, res) {
  try {
    const userId = req.user.id;
    
    const perfil = [...perfis]
      .filter(p => p.userId === userId)
      .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))[0];
    
    if (!perfil) {
      return res.status(404).json({ message: 'Perfil não encontrado para este usuário.' });
    }
    
    return res.status(200).json({ perfil });
  } catch (error) {
    console.error('Erro ao obter perfil do usuário:', error);
    return res.status(500).json({ message: 'Erro ao obter perfil.', error: error.message });
  }
}
