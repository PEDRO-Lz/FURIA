# FURIA Fan Experience  —  Chat + Know Your Fan

Este repositório é a entrega dos dois desafios propostos pela **FURIA** no processo seletivo:

- 🎯 **Challenge #1 – Experiência Conversacional**
- 🧠 **Challenge #2 – Know Your Fan**

A proposta foi criar uma experiência interativa e inteligente para fãs da FURIA, unindo tecnologia, inteligência artificial e paixão por e-sports em uma plataforma única!

---

## 🚀 Visão Geral

O projeto consiste em uma aplicação web com frontend em **React** e backend em **Node.js**, oferecendo:

### 🖥️ Frontend (React)

- 🗨️ Chat em tempo real com um bot temático da FURIA  
- 📝 Preenchimento do perfil de fã (dados pessoais + preferências)  
- 📤 Upload de documentos para validação com IA  
- 🐦 Conexão com **Twitter** e 📺 **YouTube** via OAuth  
- 🔍 Análise de links com IA, baseada no perfil do usuário  

### 🧠 Backend (Node.js + Express)

- 🔐 Autenticação segura com JWT  
- 📸 Validação visual de documentos usando IA
- 🔗 Integração com APIs do Twitter e YouTube  
- 🧠 Processamento de dados com IA via OpenRouter  
- 🧾 Armazenamento em memória (sem banco de dados)

---

## 📦 Tecnologias Utilizadas

### 🧩 Frontend

- React + Vite  
- Axios  
- React Router  
- Context API  
- Socket.IO Client  

### 🛠️ Backend

- Node.js + Express  
- Socket.IO  
- Puppeteer
- JWT + bcrypt (autenticação)  
- Twitter API (OAuth2 + PKCE)
- Google OAuth + YouTube API  
- OpenRouter (IA para análise)

---

## 🗂️ Estrutura do Projeto

```bash
/FURIA
│
├── /frontend           # Aplicação React
│   ├── /pages          # Páginas da aplicação
│   ├── /services       # Chamadas à API backend
│   ├── /public         # Imagens e ícones
│   └── main.jsx        # Inicialização da aplicação
│
├── /backend
│   ├── /controllers    # Lógica das rotas
│   ├── /services       # Lógica de negócio e integrações
│   ├── /routes         # Definição das rotas da API
│   ├── /middlewares    # Autenticação
│   ├── server.js       # Inicialização do servidor
│   └── .env            # Configurações e tokens
│
└── README.md           # Este documento
```  

# 🔧 Como Rodar Localmente

🛠 Backend
`cd backend`
`npm install`
`node server.js`


💻 Frontend
`cd frontend`
`npm install`
`npm run dev`  

Crie um arquivo .env na raiz da pasta /backend com o seguinte conteúdo:

```bash

# Twitter OAuth
CLIENT_ID=seu_twitter_client_id
CLIENT_SECRET=seu_twitter_client_secret
REDIRECT_URL=sua_url_configurada_no_site

# Google OAuth (YouTube)
GOOGLE_CLIENT_ID=seu_google_client_id

# OpenRouter API Key
OPENROUTER_API_KEY=sua_openrouter_key

# Site
SITE_URL=http://localhost:<porta>
SITE_NAME=FuriaFan

# Servidor
PORT=<porta>
JWT_SECRET=sua_chave_secreta_para_jwt
```

⚠️ Você pode obter essas credenciais em:

https://developer.twitter.com/  
https://openrouter.ai/  
https://console.cloud.google.com
