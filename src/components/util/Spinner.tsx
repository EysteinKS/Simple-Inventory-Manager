import React from "react";
import styled from "styled-components";

interface SpinnerProps {
  size?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size }) => (
  <StyledSpinner viewBox="0 0 50 50" size={size}>
    <circle
      className="path"
      cx="25"
      cy="25"
      r="20"
      fill="none"
      strokeWidth="4"
    />
  </StyledSpinner>
);

const StyledSpinner = styled.svg`
  animation: rotate 2s linear infinite;
  width: ${(props: SpinnerProps) => props.size || "50px"};
  height: ${(props: SpinnerProps) => props.size || "50px"};
  justify-self: center;
  align-self: center;

  & .path {
    stroke: #5652bf;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;

export default Spinner;
