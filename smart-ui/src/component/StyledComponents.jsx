import styled, { keyframes } from 'styled-components';

const waveAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
`;

const micWave = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
`;

export const ChatBotWrapper = styled.div`
  position: fixed;
  bottom: 6%;
  right: 2%;
  width: 18%;
  height: 60%;
  background-color: #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  border: none;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  font-family: 'Roboto', sans-serif;
`;

export const ChatBotHeader = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  width: 100%;
  height: 10%;
  color: white;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 10px 15px;


  & .x-icon {
    color: black;
    font-size: 1.5em;
    cursor: pointer;
  }

  & .header-one {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    & .x-icon-area-one{
      display: flex;
      justify-content: end;
      width: 10%;
    }

    & button {
      border: none;
      background-color: transparent;
      cursor: pointer;
      font-size: 1.6em;
      color: black;
    }
  }

  & .header-two {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;

    & .i-icon {
      color: black;
      font-size: 1.2em;
      cursor: pointer;
      width: 5%;
    }
    & .x-icon-area-two{
    display: flex;
    justify-content: end;
    width: 20%;
    }

    & .i-icon:hover {
      color: gray;
    }

    & .repeat-icon {
      color: black;
      cursor: pointer;
      font-size: 1.2em;
      width: 5%;
    }
  }
`;

export const ChatBotContent = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  background-color: #C9D3E1;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ChatBotFooter = styled.div`
  height: 10%;
  border-top: 1px solid #ddd;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #f1f1f1;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  & .img-icon,
  .arrow-icon{
    font-size: 2em;
    
  }
  & .arrow-icon{
    color: gray;
  }

  & .img-icon:hover,
  .arrow-icon:hover {
    color: skyblue;
    cursor: pointer;
  }

  & .input-area {
    display: flex;
    align-items: center;
    width: 70%;
    height: 50%;
    position: relative;
    background-color: #ffffff;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 5px 10px;
    transition: width 0.3s ease, left 0.3s ease;

    &.centered {
      width: 70%;
    }
  }

  & .mic-icon,
  & .recording-icon {
    height: 30px;
    width: 30px;
    cursor: pointer;
    transition: opacity 0.5s ease, transform 0.3s ease;
    color: gray;
    right: 30px;
  }

  & .recording-icon {
    color: red;
    animation: ${waveAnimation} 1s infinite;
  }

  & :hover {
    color: skyblue;
  }

  & .input-focused .mic-icon,
  .input-focused .recording-icon {
    opacity: 0;
    width: 0;
  }

  & .mic-waves {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 100px;
    pointer-events: none;

    & div {
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: red;
      animation: ${micWave} 1s infinite;
      cursor: pointer;  // Ensure the cursor is a pointer for the waves
    }

    & div:nth-child(2) {
      animation-delay: 0.3s;
    }

    & div:nth-child(3) {
      animation-delay: 0.6s;
    }
  }
`;

export const ChatBotInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  width: 80%;
  padding-right: 40px;
  transition: width 0.3s ease;
  font-size: 0.9em;
  border-radius: 20px;
  background-color: transparent;

  &.input-focused {
    width: calc(100% - 40px);
  }

  &:focus::placeholder {
    color: transparent;
  }
`;

export const MicWaves = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  pointer-events: auto;  // Allow clicks on the waves

  & div {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: red;
    animation: ${micWave} 1s infinite;
    cursor: pointer;  // Ensure the cursor is a pointer for the waves
  }

  & div:nth-child(2) {
    animation-delay: 0.3s;
  }

  & div:nth-child(3) {
    animation-delay: 0.6s;
  }
`;

export const MessageBubble = styled.div`
  font-size: 0.9em;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
  position: relative;
  color: #333;
  background-color: ${({ sender }) => {
    if (sender === 'user') return '#daf8cb';
    if (sender === 'system') return 'none'; // 시스템 메시지의 배경색 (밝은 회색)
    return 'white';
  }};
  
  ${({ sender }) =>
    sender === 'user'
      ? `
    align-self: flex-end;
    max-width: 80%;
    margin-left: auto;
    margin-right: 10px;
  `
      : sender === 'system'
      ? `
    text-align: center;
    display: flex;
    justify-content: center;
    border: none;
    width: 100%;
  `
      : `
    align-self: flex-start;
    max-width: 80%;
    margin-left: 10px;
    margin-right: auto;
  `}
`;

export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ sender }) => 
    sender === 'user' ? 'flex-end' : 
    sender === 'system' ? 'center' : 
    'flex-start'
  };
  margin-bottom: 20px;

  .profile-container {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    ${({ sender }) =>
      sender === 'user'
        ? `
        flex-direction: row-reverse;
    `
    :sender === 'system'
      ?`
    `
      : `
        flex-direction: row;
    `}
  }

  .profile-image {
    width: 15%;
    height: 15%;
    border-radius: 50%;
    margin: 0;
  }

  .timestamp {
    font-size: 0.8em;
    color: gray;
    margin-top: 2px;
  }
`;

export const MessageButton = styled.button`
  border: none;
  padding: 5% 10%;
  width: 50%;
  border-radius: 8px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  font-weight: 600;
  transition: 0.25s;
  background-color: aliceblue;
  color: #1e6b7b;
  margin: 2px;

  &:hover {
    background-color: skyblue;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

export const ImagePreview = styled.img`
  max-width: 90%;
  height: auto;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
`;

export const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;

  button {
    border: none;
    background-color: white;
    color: black;
    padding: 10px;
    margin: 0 5px;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

export const SliderDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 70%;
    max-height: 70%;
  }

  div {
    width: 100%;
    text-align: center;
  }
`;