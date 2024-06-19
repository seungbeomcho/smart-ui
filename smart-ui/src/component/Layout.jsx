import { useState } from 'react';
import styled from 'styled-components';
import ChatBot from './ChatBot';
import io from 'socket.io-client';
import img from '../img/smartimg.jpg';

const StyledDiv = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: white;
    position: relative;
`;

const ChatBotButton = styled.img`
    position: fixed;
    border-radius: 100%;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    cursor: pointer;
`;

function Layout() {
    const [isChatBotOpen, setIsChatBotOpen] = useState(false);
    const [socket, setSocket] = useState(null);

    const openChatBot = () => {
        if (!isChatBotOpen) {
            const newSocket = io('https://localhost:3000', {
                transports: ['websocket', 'polling'],
            });

            newSocket.on('connect', () => {
                console.log('Socket connected');
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            setSocket(newSocket);
            setIsChatBotOpen(true);
        }
    };

    const closeChatBot = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
        setIsChatBotOpen(false);
    };

    return (
        <StyledDiv>
            <ChatBotButton
                src={img}
                alt="Chatbot Icon"
                onClick={openChatBot}
            />
            {isChatBotOpen && <ChatBot onClose={closeChatBot} socket={socket} />}   
        </StyledDiv>
    );
}

export default Layout;