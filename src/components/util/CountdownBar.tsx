import React from "react";
import styled, { keyframes } from "styled-components";

interface CountdownBarProps {
  time: number;
  color: string;
}

const CountdownBar: React.FC<CountdownBarProps> = ({ time, color }) => {
  return (
    <BarWrapper>
      <Bar color={color} time={time} />
    </BarWrapper>
  );
};

const BarWrapper = styled.div`
  height: 100%;
  width: 100%;
`;

const fill = keyframes`
  0% { width: 0% };
  100% { width: 100% };
`;

const Bar = styled.div<CountdownBarProps>`
  background: ${props => props.color};
  height: 100%;
  animation: ${fill} ${props => props.time}s linear;
`;

export default CountdownBar;
