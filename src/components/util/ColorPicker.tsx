import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/types";
import { hexToHSL } from "../../styles/colors";
import styled from "styled-components";

const ColorPicker = () => {
  const color = useSelector(
    (state: RootState) => state.auth.location.primaryColor
  );

  const [primaryColor, setPrimaryColor] = useState(color || "#999");

  const colorToHSL = useMemo(() => {
    return hexToHSL(primaryColor);
  }, [primaryColor]);

  const [secondSaturation, setSecondSaturation] = useState(55);
  const [secondLightness, setSecondLightness] = useState(51);

  /*eslint-disable-next-line*/
  const [thirdSaturation, setThirdSaturation] = useState(25);
  /*eslint-disable-next-line*/
  const [thirdLightness, setThirdLightness] = useState(85);

  const secondColor = useMemo(() => {
    return `hsl(${colorToHSL[0]}, ${secondSaturation}%, ${secondLightness}%)`;
  }, [colorToHSL, secondSaturation, secondLightness]);

  return (
    <ColorPickerWrapper>
      <HeaderWrapper>
        <p>Velg farge</p>
        <ResetColor onClick={() => setPrimaryColor(color as string)}>
          Nullstill
        </ResetColor>
      </HeaderWrapper>
      <ColorWrapper>
        <InputsWrapper>
          <p>Hovedfarge</p>
          <input
            type="text"
            value={primaryColor}
            onChange={e => setPrimaryColor(e.target.value)}
          />
        </InputsWrapper>
        <PrimaryColorInput value={primaryColor} setValue={setPrimaryColor} />
      </ColorWrapper>
      <ColorWrapper>
        <InputsWrapper>
          <p>Fargemetning</p>
          <PercentInput
            value={secondSaturation}
            setValue={setSecondSaturation}
          />
          <p>Valør</p>
          <PercentInput value={secondLightness} setValue={setSecondLightness} />
        </InputsWrapper>
        <DisplayColor clr={secondColor} />
      </ColorWrapper>
    </ColorPickerWrapper>
  );
};

const ColorPickerWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 2fr 3fr 3fr;
  padding: 1em;
  background-color: #eee;
`;

const HeaderWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  margin-bottom: 0.5em;
`;

const ResetColor = styled.button`
  width: 100%;
`;

const ColorWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
`;

const InputsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const DisplayColor = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${(props: { clr: string }) => props.clr || "none"};
`;

interface PrimaryColorInputProps {
  value: string;
  setValue: (value: string) => void;
}

const PrimaryColorInput: React.FC<PrimaryColorInputProps> = ({
  value,
  setValue
}) => {
  return (
    <PrimaryWrapper
      type="color"
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
};

const PrimaryWrapper = styled.input`
  height: 100%;
  width: 100%;
  border: none;
  padding: 0;
  margin: 0;
`;

interface PercentInputProps {
  value: number;
  setValue: (value: number) => void;
}

const PercentInput: React.FC<PercentInputProps> = ({ value, setValue }) => {
  return (
    <input
      type="range"
      min={0}
      max={100}
      value={value}
      onChange={e => setValue(Number(e.target.value))}
    />
  );
};

export default ColorPicker;
