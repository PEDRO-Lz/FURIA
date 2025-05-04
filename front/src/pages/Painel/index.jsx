import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css'

function PainelFuria() {
  const [dadosFuria, setDadosFuria] = useState({
    ultimosJogos: [],
    proximaPartida: null,
    partidaAoVivo: null,
  });

  useEffect(() => {
    async function fetchFuria() {
      try {
        const res = await axios.get('http://localhost:3000/api/painel-furia');
        setDadosFuria(res.data);
      } catch (error) {
        console.error('Erro ao buscar dados da Furia:', error);
      }
    }

    fetchFuria();
  }, []);

  return (
    <div className="painel-furia">
      {dadosFuria.partidaAoVivo && (
        <>
          <h2>Partida Ao Vivo</h2>
          <p><strong>Adversário:</strong> {dadosFuria.partidaAoVivo.adversario}</p>
          <p><strong>Placar:</strong> {dadosFuria.partidaAoVivo.placar}</p>
          <a href={`https://draft5.gg${dadosFuria.partidaAoVivo.revejaLink}`} target="_blank" rel="noopener noreferrer">
            Acompanhar ao Vivo
          </a>
        </>
      )}
      <h2>Próxima Partida</h2>
      {dadosFuria.proximaPartida ? (
        <div className="proxima-partida">
          <p><strong>Adversário:</strong> {dadosFuria.proximaPartida.adversario}</p>
          <p><strong>Data:</strong> {dadosFuria.proximaPartida.data}</p>
        </div>
      ) : (
        <p>Não marcada</p>
      )}
      <h2>Últimos Jogos</h2>
      {dadosFuria.ultimosJogos.length > 0 ? (
        <table>
          <tbody>
            {dadosFuria.ultimosJogos.map((jogo, idx) => (
              <tr key={idx}>
                <td>
                  <img src={jogo.logoTime1} alt="Logo FURIA" className="logo-time" />
                </td>
                <td>{jogo.placar}</td>
                <td>{jogo.adversario}</td>
                <td>
                  <img src={jogo.logoTime2} alt="Logo do Adversário" className="logo-time" />
                </td>
                <td>
                  <a href={jogo.revejaLink} target="_blank" rel="noopener noreferrer">
                    Lances
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Carregando dados dos últimos jogos...</p>
      )}
    </div>
  );
}

export default PainelFuria;
