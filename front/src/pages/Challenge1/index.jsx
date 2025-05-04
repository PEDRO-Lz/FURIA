import React from 'react';
import './style.css';
import Chatbot from '../Chatbot';
import Livechat from '../Livechat';
import Painel from '../Painel';

const Challenge1 = () => {
    return (
        <div className="pagina">

            <div className="chatbot-area">
                <Chatbot />
            </div>

            <div className="liveechatetabela">
                <div>
                    <iframe
                        src="https://player.twitch.tv/?channel=furiatv&parent=localhost"
                        height="500"
                        width="98%"
                        allowFullScreen
                        frameBorder="0"
                        title="Twitch Live Stream"
                    ></iframe>
                </div>

                <div className="chatetabela">
                <div>
                    <Livechat />
                </div>

                <div className='tabela' >
                    <Painel />
                </div>
            </div>
            </div>


        </div>
    );
};

export default Challenge1;