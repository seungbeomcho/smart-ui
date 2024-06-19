import React from 'react';
import {
    MessageBubble,
    MessageContainer,
    ChatBotContent,
    ButtonGroup,
    MessageButton,
    ImagePreview
} from './StyledComponents';
import img from '../img/smartimg.jpg';

const createMarkup = (text) => {
    return { __html: text.replace(/\n/g, '<br>') };
};

const MessageList = ({ messages, onButtonClick, onDownloadClick }) => {
    return (
        <ChatBotContent>
            {messages.map((message, index) => (
                <MessageContainer key={index} sender={message.sender}>
                    <div className="profile-container">
                        {message.sender === 'user' || message.sender === 'system'? (
                            ''
                        ) : (
                            <img
                                src={img}
                                alt="profile"
                                className="profile-image"
                            />
                        )}
                        <MessageBubble sender={message.sender}>
                            {message.text && (typeof message.text === 'string' && message.text.includes('<') && message.text.includes('>')) ? (
                                <span dangerouslySetInnerHTML={createMarkup(message.text)} />
                            ) : (
                                <span>{typeof message.text === 'object' && message.text !== null ? JSON.stringify(message.text) : message.text}</span>
                            )}
                            {message.buttons && (
                                <ButtonGroup>
                                    {message.buttons.map((buttonText, btnIndex) => (
                                        <MessageButton key={btnIndex} onClick={() => onButtonClick(buttonText)}>
                                            {buttonText}
                                        </MessageButton>
                                    ))}
                                </ButtonGroup>
                            )}
                            {message.image && (
                                <>
                                    <ImagePreview src={message.image} alt="preview" />
                                    {message.sender !== 'user' && (
                                        <MessageButton onClick={() => onDownloadClick(message.image)}>
                                            Download Image
                                        </MessageButton>
                                    )}
                                </>
                            )}
                        </MessageBubble>
                    </div>
                    <div className="timestamp">
                        {message.timestamp}
                    </div>
                </MessageContainer>
            ))}
        </ChatBotContent>
    );
};
export default MessageList;