import { createContext, useState } from 'react';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [mainContent, setMainContent] = useState('default');

    return (
        <ChatContext.Provider value={{ mainContent, setMainContent }}>
            {children}
        </ChatContext.Provider>
    );
};
