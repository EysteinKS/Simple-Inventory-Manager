import React from "react";
import styled, { css } from "styled-components";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";

interface BckColorProps {
  bckColor?: string;
}

interface HeightProps {
  inputHeight?: string;
}

const bottomBorder = css`
  /*border-bottom: 4px solid #0000000a;*/
`;

export const InputWrapper = styled.div<HeightProps>`
  display: grid;
  min-height: 30px;
  ${props => props.inputHeight && `height: ${props.inputHeight};`}
  padding: 0.5em 0;
  grid-template-columns: 1fr 2fr;
  ${bottomBorder}

  & > label {
    padding-left: 0.5em;
  }

  & > :nth-child(2n) {
    height: 100%;
    margin-right: 0.5em;
  }
`;

export const InputLabel = styled.label`
  font-size: 14px;
  height: 100%;
  display: flex;
  place-items: center;
  color: #000c;
  align-self: center;
  svg {
    color: #000c;
    height: 20px;
    width: 20px;
    margin-right: 0.5em;
  }
`;

export const FakeInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  min-height: 30px;
  padding: 0 0.5em;
  margin: 0;
  border: 1px solid #e9e9e9;
  justify-self: center;

  font: 400 11px system-ui;
  background-color: white;
  text-align: start;
  text-rendering: auto;
  color: initial;
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;

  margin-right: 0.5em !important;
  width: 92%;

  :hover {
    cursor: pointer;
  }

  svg {
    color: #000c;
    height: 20px;
    width: 20px;
  }
`;

export const TextInput = styled.input`
  border: 1px solid #e9e9e9;
  padding: 0 0 0 0.5em;
  min-height: 30px;
`;

export const TextareaInput = styled.textarea`
  height: auto !important;
  resize: none;
  border: 1px solid #e9e9e9;
`;

export const CheckboxInput = styled.input`
  justify-self: start;
  align-self: center;
`;

export const SelectInput = styled.select`
  background: none;
  border-color: #0002;
`;

export const OptionInput = styled.option``;

interface ColumnsProps {
  columns?: string;
}

export const InputWithButton = styled.div<ColumnsProps>`
  display: grid;
  grid-template-columns: ${props => props.columns || "5fr 1fr"};

  svg {
    height: 20px;
    width: 20px;
  }
`;

export const InputButton = styled.button<BckColorProps>`
  margin: 0;
  border: none;
  background: ${props => props.bckColor || "none"};
  min-height: 30px;

  svg {
    color: #000c;
    height: 20px;
    width: 20px;
  }

  :hover {
    cursor: pointer;
    svg {
      color: #0008;
    }
  }
`;

export const InputWithIcon: React.FC<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = ({ children, ...rest }) => {
  return (
    <InputWithIconWrapper>
      <input {...rest} />
      {children}
    </InputWithIconWrapper>
  );
};

const InputWithIconWrapper = styled.div`
  position: relative;
  padding: 0;
  margin-bottom: 10px;

  input {
    display: inline-block;
    height: 30px;
    margin: 0;
    padding: 0;
    width: 250px;
    padding-left: 40px;
  }

  & > :nth-child(2) {
    position: absolute;
    display: inline-block;
    left: 10px;
    top: 5px;
    width: 25px;
    height: 25px;
    color: #000b;
  }
`;
