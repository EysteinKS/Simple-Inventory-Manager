import React from "react";
import styled, { css } from "styled-components";
import { verticalScroll, horizontalScroll } from "./scroll";
import { device } from "./device";
import { Key } from "../components/util/SectionHeader";
import Icons from "../components/util/Icons";

export type TWidth = "tiny" | "small" | "medium" | "large";

const sizeToPercentage: { [key: string]: number } = {
  tiny: 5,
  small: 10,
  medium: 15,
  large: 20
};

const percentageOf = (total: number, percent: number) => {
  return total * (percent / 100);
};

export const getTableStyle = (data: TWidth[], buttons: number) => {
  const maxWidth = 960;

  const buttonSize = sizeToPercentage.tiny;
  const buttonsPercent = buttonSize * buttons;
  const buttonsWidth = percentageOf(maxWidth, buttonsPercent);

  const dataMaxWidth = 960 - buttonsWidth;
  const dataPercentages = data.map(size => sizeToPercentage[size]);

  const dataPixels = dataPercentages.map(percent =>
    percentageOf(maxWidth, percent)
  );

  const sizeToFraction = (size: TWidth) => {
    switch (size) {
      case "tiny":
        return "1fr";
      case "small":
        return "2fr";
      case "medium":
        return "3fr";
      case "large":
        return "4fr";
    }
  };

  const dataFractions = data.map(size => sizeToFraction(size));

  const headerStyle = `
    grid-template-columns: ${dataPixels.join("px ")}px auto ${buttons * 48}px;
    ${device.tablet(`
      grid-template-columns: ${dataFractions.join(" ")} auto ${buttons * 48}px;
    `)}
  `;

  const itemStyle = `
    grid-template-columns: ${dataPixels.join(
      "px "
    )}px auto repeat(${buttons}, 48px);
    ${device.tablet(`
      grid-template-columns: ${dataFractions.join(
        " "
      )} auto repeat(${buttons}, 48px)
    `)}
  `;

  return {
    header: headerStyle,
    item: itemStyle
  };
};

export const TableWrapper = styled.div`
  max-width: 960px;
  margin: 2vh auto 0 auto;
  border-top: 1px solid #0001;
  border-bottom: 1px solid #0001;
`;

export const TableHeader = styled.div`
  width: 100%;
  max-width: 960px;
  display: flex;
  place-items: center;
  justify-content: space-between;
  border-bottom: 1.2px solid #0003;
  height: 60px;
  background-color: ${(props: { bckColor: string }) =>
    props.bckColor ? props.bckColor : "#666"};
`;

export const TableContent = styled.div`
  display: grid;
  max-width: 960px;
  grid-template-rows: 60px 72vh;
  overflow-y: hidden;
  overflow-x: overlay;
`;

interface ContentHeaderProps {
  columns: string;
  bckColor: string;
}

export const ContentHeader = styled.div`
  height: 60px;
  display: grid;
  background-color: ${(props: ContentHeaderProps) =>
    props.bckColor ? props.bckColor : "#666"};
  ${(props: ContentHeaderProps) => (props.columns ? props.columns : null)}
`;

export const ExtendColumnsWrapper = styled(Key)`
  ${device.tablet(`
    color: #0000;
  `)}
`;

interface ExtendColumnsProps {
  extended: boolean;
  setExtended: (extended: boolean) => void;
}

export const ExtendColumns: React.FC<ExtendColumnsProps> = ({
  extended,
  setExtended
}) => {
  if (window.innerWidth > 760) {
    return <div />;
  }
  return (
    <ExtendColumnsWrapper onClick={() => setExtended(!extended)}>
      {extended ? <Icons.ArrowLeft /> : <Icons.ArrowRight />}
    </ExtendColumnsWrapper>
  );
};

export const ListWrapper = styled.div`
  max-height: 75vh;
  overflow-x: hidden;
  ${verticalScroll}
`;

interface ITableItem {
  columns: string;
}

export const TableItem = styled.div`
  display: grid;
  height: 50px;
  width: 100%;
  max-height: 50px;
  place-items: center;
  & > p {
    font-size: 14px;
    margin: 0;
  }
  & > button {
    height: 100%;
  }
  ${(props: ITableItem) => (props.columns ? props.columns : null)}

  background-color: #F3F3F3;
  :nth-child(2n) {
    background-color: #dadada;
  }
`;

export const NewTableItem = styled.div`
  min-width: 100vw;
  max-width: 960px;
  display: grid;
  grid-template-columns: ${(props: { btnWidth: number }) =>
    props.btnWidth
      ? `${
          window.innerWidth < 960
            ? window.innerWidth - props.btnWidth
            : 960 - props.btnWidth
        }px ${props.btnWidth}px`
      : "48px"};

  ${device.mobileS(`
    grid-template-columns: 
  `)}

  background-color: #f3f3f3;
  :nth-child(2n) {
    background-color: #dadada;
  }
`;

interface ItemDataProps {
  width: number;
  styleArray: number[];
}

export const ItemDataList = styled.ul`
  width: 100%;
  max-width: ${(props: ItemDataProps) => props.width.toString()}px;
  padding: 0;
  margin: 0;
  list-style: none;
  display: grid;
  grid-template-rows: 50px;
  grid-template-columns: ${(props: ItemDataProps) =>
    !props.styleArray ? "auto" : props.styleArray.join("px ")}px;
  place-content: center;
  place-items: center;
  ${horizontalScroll}
`;

export const ItemData = styled.p`
  font-size: 14px;
  ${(props: { justify?: "start" | "end" | "center" }) =>
    props.justify && `justify-self: ${props.justify}`}
`;

export const ItemButtons = styled.div`
  display: grid;
  grid-template-columns: ${(props: { buttons?: number }) =>
    props.buttons ? `repeat(${props.buttons}, 48px)` : "48px"};
`;

export const ExpandedTableItem = styled.div`
  ${(props: { expanded: boolean; color?: string }) =>
    props.expanded
      ? css`
          display: grid;
          padding: 10px;
          background-color: ${props.color || "#e6e6e6"};
          place-items: center;
        `
      : css`
          display: none;
        `}
`;
