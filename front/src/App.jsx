import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Cadastro from './pages/cadastro';
import Home from './pages/Home';
import './App.css';
import Chat from './pages/Livechat';
import Chatbot from './pages/Chatbot';
import PainelFuria from './pages/Painel';
import Challenge1 from './pages/Challenge1';
import Challenge2 from './pages/Challenge2';
import Perfil from './pages/Perfil';

function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<PrivateRoute> <Home /> </PrivateRoute>}/>
        <Route path="/challenge1" element={<PrivateRoute> <Challenge1 /> </PrivateRoute>}/>
        <Route path="/challenge2" element={<PrivateRoute> <Challenge2 /> </PrivateRoute>}/>
        <Route path="/perfil" element={<PrivateRoute> <Perfil /> </PrivateRoute> } />
        <Route path="/chat" element={<PrivateRoute> <Chat /> </PrivateRoute>}/>
        <Route path="/chatbot" element={<PrivateRoute> <Chatbot /> </PrivateRoute>}/>
        <Route path="/painel" element={<PrivateRoute> <PainelFuria /> </PrivateRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
