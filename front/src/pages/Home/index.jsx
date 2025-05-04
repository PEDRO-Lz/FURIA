import { Link } from 'react-router-dom';
import './style.css';

function Home() {
  return (
    <div className="container">
      <img src="/furiaFB.png" alt="Logo FURIA" className="logo-furia" />
      <h1>Bem-vindo ao FURIA Challenge!</h1>
      <p>Escolha o desafio</p>
      <div className="links">
        <Link to="/challenge1">
          <button>Experiência Conversacional FURIA (Challenge 1)</button>
        </Link>
        <Link to="/challenge2">
          <button>Gerar Perfil (Challenge 2)</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;