import React from 'react';
import { Box, Typography } from '@mui/material';
import styled from 'styled-components';

const TypingContainer = styled(Box)`
  display: flex;
  justify-content: flex-start;
  margin: 8px 0;
`;

const TypingBubble = styled(Box)`
  background: #202C33;
  padding: 12px 16px;
  border-radius: 7.5px 7.5px 7.5px 0;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 50px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: -8px;
    width: 0;
    height: 0;
    border: 4px solid transparent;
    border-bottom-color: #202C33;
    border-left: 0;
    border-bottom-left-radius: 1px;
    transform: rotate(10deg);
  }
`;

const Dot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #8696A0;
  animation: typing 1.4s infinite;
  
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

const TypingIndicator = () => {
  return (
    <TypingContainer>
      <TypingBubble>
        <Dot className="typing-dot" />
        <Dot className="typing-dot" />
        <Dot className="typing-dot" />
      </TypingBubble>
    </TypingContainer>
  );
};

export default TypingIndicator;
