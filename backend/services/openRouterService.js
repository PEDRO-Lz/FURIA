import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.SITE_URL;
const SITE_NAME = process.env.SITE_NAME;

export async function validarDocumentoComImagem(filePath, nomeFormulario, cpfFormulario) {

  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("O arquivo não foi encontrado.");
    }

    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');

    if (!base64Image) {
      throw new Error("Falha ao converter a imagem em base64.");
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': SITE_URL,
        'X-Title': SITE_NAME,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Essa imagem é um documento brasileiro (RG ou CNH)? Se sim, o nome "${nomeFormulario}" e o CPF "${cpfFormulario}" correspondem aos dados
                 que aparecem no documento? Responda apenas "Sim" ou "Não", e se possível, explique rapidamente.`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content.trim();
    } else {
      throw new Error('Resposta inesperada da IA');
    }
  } catch (error) {
    console.error('Erro na validação com a IA:', error.response?.data || error.message);
    throw error;
  }
}

export async function analisarPerfilUsuario(userData, formData) {
  try {
    const dadosTwitter = userData.twitterData
      ? `Dados do Twitter: Nome: ${userData.twitterData.name}, Username: ${userData.twitterData.username}`
      : 'Não possui dados do Twitter';

    let dadosYoutube = 'Não possui dados do YouTube';
    if (userData.youtubeData) {
      const videosGostados = userData.youtubeData.likedVideos
        ? userData.youtubeData.likedVideos
          .map(video => `- ${video.title || 'Sem título'}: ${video.description || 'Sem descrição'}`)
          .join('\n')
        : 'Nenhum vídeo curtido';

      const inscricoes = userData.youtubeData.subscriptions
        ? userData.youtubeData.subscriptions
          .map(sub => `- ${sub.title || 'Sem título'}: ${sub.description || 'Sem descrição'}`)
          .join('\n')
        : 'Nenhuma inscrição';

         dadosYoutube = `Dados do YouTube: Vídeos que gostou: ${videosGostados} Inscrições: ${inscricoes}`;
    }

    const dadosFormulario = `
     Dados do formulário:
     - Nome: ${formData.nome}
     - CPF: ${formData.cpf}
      - Endereço: ${formData.endereco}
      - Descrição pessoal: ${formData.descricao}`;

    const prompt = `
     Com base nos dados a seguir, crie um perfil deste usuário, descrevendo seus interesses, comportamento de consumo e preferências.
     Inclua também recomendações personalizadas de produtos ou conteúdos, seja breve.
  
     ${dadosFormulario}
     ${dadosTwitter}
     ${dadosYoutube}
  
     Formato da resposta:
     1. Resumo do perfil (2-3 frases)
     2. Interesses principais (liste 2-4 interesses)
     3. Preferências de conteúdo (2-3 frases)
     4. Recomendações personalizadas (liste 2-4 recomendações)`;

    if (!OPENROUTER_API_KEY) {
      throw new Error('Chave da API OpenRouter não configurada');
    }

    const requestBody = {
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': SITE_URL,
        'X-Title': SITE_NAME,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta da API OpenRouter:', errorText);
      throw new Error(`Erro na API OpenRouter: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    let content = null;

    if (data.choices && data.choices[0]?.message?.content) {
      content = data.choices[0].message.content.trim();
    } else if (data.choices && data.choices[0]?.text) {
      content = data.choices[0].text.trim();
    } else if (data.content) {
      content = data.content.trim();
    } else if (data.message && data.message.content) {
      content = data.message.content.trim();
    } else if (data.output) {
      content = data.output.trim();
    } else if (typeof data === 'string') {
      content = data.trim();
    }

    if (content) {
      return content;
    } else {
      console.error('Formato de resposta não reconhecido:', data);
      return "Não foi possível analisar o perfil. A IA retornou um formato de resposta não reconhecido.";
    }
  } catch (error) {
    console.error('Erro na análise de perfil com a IA:', error);

    return "Ocorreu um erro ao analisar o perfil: " + (error.message || "Erro desconhecido");
  }
}

export async function validarLink(content, linkFormulario) {

  try {

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': SITE_URL,
        'X-Title': SITE_NAME,
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `O conteudo deste link"${linkFormulario}" seria algo relevante para este usuario: "${content}" Responda "Sim" ou "Não", e explique brevemente.`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content.trim();
    } else {
      throw new Error('Resposta inesperada da IA');
    }
  } catch (error) {
    console.error('Erro na validação com a IA:', error.response?.data || error.message);
    throw error;
  }
}
