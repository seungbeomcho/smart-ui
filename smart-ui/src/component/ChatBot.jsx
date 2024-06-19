import React, { useState, useEffect, useCallback, useRef } from 'react';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion, faImage } from '@fortawesome/free-regular-svg-icons';
import { faXmark, faMicrophone, faCircleArrowUp, faRepeat } from '@fortawesome/free-solid-svg-icons';
import {
    ChatBotWrapper,
    ChatBotHeader,
    ChatBotContent,
    ChatBotFooter,
    ChatBotInput,
    CategoryTabs,
    MicWaves,
    SliderDiv
} from './StyledComponents';
import MessageList from './MessageList';
import logo from '../img/smartimg2.png';

const ChatBot = ({ onClose, socket }) => {
    const [isGuideVisible, setIsGuideVisible] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('챗봇 사용');
    const [isRecording, setIsRecording] = useState(false);
    const [selectedButton, setSelectedButton] = useState('');
    const [uploadUuid, setUploadUuid] = useState(null);
    const contentRef = useRef(null);
    const [equipmentList, setEquipmentList] = useState([]);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const guideContent = {
        '이미지 분석': [
            { content: "카테고리 1 내용 1", imageUrl: logo },
            { content: "카테고리 1 내용 2", imageUrl: "이미지2의 URL" },
        ],
        '챗봇 사용': [
            { content: "카테고리 2 내용 1", imageUrl: "이미지3의 URL" },
            { content: "카테고리 2 내용 2", imageUrl: "이미지4의 URL" },
        ]
    };

    useEffect(() => {
        if (!socket) return;

        const handleConnect = () => {
            console.log('Connected to server');
            socket.emit('join', 'User has connected');
        };

        const handleWelcomeMessage = (message) => {
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: message, timestamp: currentTime }]);
        };

        const handleBotResponse = (message) => {
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: message.response, timestamp: currentTime }]);
        };

        const handleSystemMessage = (message) => {
            setMessages((prevMessages) => [...prevMessages, { sender: 'system', text: message.response}]);
        };

        const handleAudioResponse = (message) => {
            setInputValue(message);
        };

        const handleError = (error) => {
            console.error('Socket error:', error);
        };

        socket.on('connect', handleConnect);
        socket.on('welcomeMessage', handleWelcomeMessage);
        socket.on('botResponse', handleBotResponse);
        socket.on('systemMessage', handleSystemMessage); // 이벤트 이름이 일치하는지 확인
        socket.on('audioResponse', handleAudioResponse);
        socket.on('error', handleError);

        console.log('Setting up socket listeners');

        return () => {
            socket.off('connect', handleConnect);
            socket.off('welcomeMessage', handleWelcomeMessage);
            socket.off('botResponse', handleBotResponse);
            socket.off('systemMessage', handleSystemMessage); // 이벤트 핸들러 해제
            socket.off('audioResponse', handleAudioResponse);
            socket.off('error', handleError);
        };
    }, [socket]); // socket이 변경될 때마다 useEffect 재실행

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = useCallback(() => {
        if (!socket.connected) {
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages((prevMessages) => [...prevMessages, { sender: 'system', text: '연결이 끊어졌습니다. 새로고침을 눌러주세요.', timestamp: currentTime }]);
            return;
        }

        if (inputValue.trim()) {
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const userMessage = { sender: 'user', text: inputValue, timestamp: currentTime };
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            socket.emit('userMessage', inputValue);
            setInputValue('');
        }
    }, [inputValue, socket]);

    const showGuide = useCallback(() => {
        setIsGuideVisible(true);
    }, []);

    const hideGuide = useCallback(() => {
        setIsGuideVisible(false);
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    }, [handleSendMessage]);

    const handleImgClick = useCallback(() => {
        if (!socket.connected) {
            setMessages((prevMessages) => [...prevMessages, { sender: 'system', text: '연결이 끊어졌습니다. 새로고침을 눌러주세요.'}]);
            return;
        }

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages((prevMessages) => [
            ...prevMessages,
            {
                sender: 'bot',
                text: 'Choose an option:',
                buttons: ['도면', '장비'],
                timestamp: currentTime,
            },
        ]);
    }, [socket]);

    const handleButtonClick = useCallback((buttonText) => {
        setSelectedButton(buttonText);
        document.getElementById('imageUpload').click();
    }, []);

    const handleFileUpload = useCallback((e) => {
        if (!socket.connected) {
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages((prevMessages) => [...prevMessages, { sender: 'system', text: '연결이 끊어졌습니다. 새로고침을 눌러주세요.', timestamp: currentTime }]);
            return;
        }

        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        sender: 'user',
                        image: reader.result,
                        timestamp: currentTime,
                    },
                ]);
                const formData = new FormData();
                formData.append('file', file);

                if (selectedButton === '도면') {
                    fetch('https://localhost:5000/upload_drawing', {
                        method: 'POST',
                        body: formData,
                    })
                        .then(response => response.json())
                        .then(data => {
                            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            setMessages(prevMessages => [
                                ...prevMessages,
                                { sender: 'bot', text: data, timestamp: currentTime },
                            ]);
                        })
                        .catch(error => {
                            console.error('도면 업로드 오류:', error);
                            setMessages(prevMessages => [
                                ...prevMessages,
                                { sender: 'bot', text: '도면 업로드 실패', timestamp: new Date().toLocaleTimeString() },
                            ]);
                        });
                } else if (selectedButton === '장비') {
                    fetch('https://localhost:5000/upload_photo', {
                        method: 'POST',
                        body: formData,
                    })
                        .then(response => response.json())
                        .then(data => {
                            const uuid = data.data.uuid;
                            setUploadUuid(uuid);
                            const equipmentLabels = data.data.result.map(item => item.label).join(', ');
                            setEquipmentList(equipmentLabels);
                        })
                        .catch(error => {
                            console.error('장비 업로드 오류:', error);
                            setMessages(prevMessages => [
                                ...prevMessages,
                                { sender: 'bot', text: '장비 업로드 실패', timestamp: new Date().toLocaleTimeString() },
                            ]);
                        });
                }
            };
            reader.readAsDataURL(file);
        }
    }, [selectedButton, socket]);

    useEffect(() => {
        if (uploadUuid) {
            fetch('https://localhost:5000/download_photo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uuid: uploadUuid }),
            })
                .then(response => response.blob())
                .then(blob => {
                    console.log(equipmentList)
                    const imageUrl = URL.createObjectURL(blob);
                    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { sender: 'bot', image: imageUrl, text: equipmentList, timestamp: currentTime, download: true },
                    ]);
                })
                .catch(error => {
                    console.error('이미지 다운로드 오류:', error);
                });
        }
    }, [uploadUuid, equipmentList]);

    const handleInputFocus = useCallback(() => {
        if (!isRecording) {
            setIsInputFocused(true);
        }
    }, [isRecording]);

    const handleInputBlur = useCallback(() => {
        setIsInputFocused(false);
    }, []);

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    handleAudioUpload(audioBlob);
                };

                mediaRecorder.start();
                setIsRecording(true);
                setIsInputFocused(false);  // Prevent focusing the input
            })
            .catch((error) => {
                console.error('Error accessing media devices.', error);
            });
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleMicClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleAudioUpload = async (audioBlob) => {
        const arrayBuffer = await audioBlob.arrayBuffer();
        socket.emit('audio message', arrayBuffer);
    };

    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: null,
        nextArrow: null
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleDownloadClick = (imageUrl) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = 'downloaded_image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReconnect = () => {
        if (!socket.connected) {
            socket.connect();
        };
    };

    return (
        <ChatBotWrapper>
            <ChatBotHeader>
                {isGuideVisible ? (
                    <div className='header-one'>
                        <button onClick={hideGuide}>&lt;</button>
                        <img src={logo} alt='로고 이미지' width='50%' />
                        <div className='x-icon-area-one'>
                            <FontAwesomeIcon className='x-icon' icon={faXmark} onClick={onClose} />
                        </div>
                    </div>
                ) : (
                    <div className='header-two'>
                        <FontAwesomeIcon className='i-icon' icon={faCircleQuestion} onClick={showGuide} />
                        <FontAwesomeIcon className='repeat-icon' icon={faRepeat} onClick={handleReconnect} />
                        <img src={logo} alt='로고 이미지' width='50%' />
                        <div className='x-icon-area-two'>
                            <FontAwesomeIcon className='x-icon' icon={faXmark} onClick={onClose} />
                        </div>
                    </div>
                )}
            </ChatBotHeader>
            <ChatBotContent ref={contentRef}>
                {isGuideVisible ? (
                    <>
                        <CategoryTabs>
                            {Object.keys(guideContent).map((category) => (
                                <button key={category} onClick={() => handleCategoryClick(category)}>
                                    {category}
                                </button>
                            ))}
                        </CategoryTabs>
                        <Slider {...sliderSettings}>
                            {guideContent[selectedCategory].map((item, index) => (
                                <SliderDiv key={index}>
                                    <img src={item.imageUrl} alt={`Slide ${index}`} />
                                    <div>{item.content}</div>
                                </SliderDiv>
                            ))}
                        </Slider>
                    </>
                ) : (
                    <MessageList messages={messages} onButtonClick={handleButtonClick} onDownloadClick={handleDownloadClick} />
                )}
            </ChatBotContent>
            {!isGuideVisible && (
                <ChatBotFooter>
                    <FontAwesomeIcon className='img-icon' icon={faImage} onClick={handleImgClick} />
                    <input type="file" style={{ display: 'none' }} id="imageUpload" onChange={handleFileUpload} />
                    <div className={`input-area ${isInputFocused ? 'input-focused' : ''} ${isRecording ? 'centered' : ''}`}>
                        <ChatBotInput
                            type="text"
                            placeholder={isRecording ? '' : "질문을 입력해주세요..."}
                            onKeyDown={handleKeyDown}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            className={isInputFocused ? 'input-focused' : ''}
                            readOnly={isRecording}  // Prevent input when recording
                        />
                        {!isRecording && (
                            <FontAwesomeIcon
                                className={`mic-icon ${isInputFocused ? 'focus-input-mic' : ''}`}
                                icon={faMicrophone}
                                onClick={handleMicClick}
                            />
                        )}
                        {isRecording && (
                            <MicWaves onClick={handleMicClick}>
                                <div></div>
                                <div></div>
                                <div></div>
                            </MicWaves>
                        )}
                    </div>
                    <FontAwesomeIcon className='arrow-icon' onClick={handleSendMessage} icon={faCircleArrowUp} />
                </ChatBotFooter>
            )}
        </ChatBotWrapper>
    );
};

export default ChatBot;
