import styled, { css } from "styled-components";
import { verticalScroll, horizontalScroll } from "./scroll";
import { device } from "./device";

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
  const dataWidths = data.map(size => {
    const percentage = sizeToPercentage[size];
    const pixels = percentageOf(maxWidth, percentage);
    return pixels;
  });

  /* TODO: CLEAN UP LOGIC, MAYBE HOOK???
  const styleProps = {
    wrapper: {
      tableProps: dataMaxWidth
    },
    dataList: {}
  };
  */

  return {
    buttons: {
      width: buttonsWidth
    },
    data: {
      maxWidth: dataMaxWidth,
      widths: dataWidths
    }
  };
};

export const TableWrapper = styled.div`
  max-width: 960px;
  margin: 2vh auto 0 auto;
  border-top: 1px solid #0001;
  border-bottom: 1px solid #0001;
`;

export const ListWrapper = styled.div`
  max-height: 75vh;
  ${verticalScroll}
`;

interface ITableItem {
  index: number;
  columns?: string[];
}

export const TableItem = styled.div`
  display: grid;
  height: 50px;
  max-height: 50px;
  place-items: center;
  & > p {
    font-size: 14px;
    margin: 0;
  }
  & > button {
    height: 100%;
  }

  ${(props: ITableItem) => {
    let css: string = "";

    if (props.index % 2 !== 0) {
      css += "background-color: #DADADA;";
    } else {
      css += "background-color: #F3F3F3;";
    }

    if (props.columns) {
      const colStr = props.columns.join(" ");
      css += `grid-template columns: ${colStr};`;
    }
    return css;
  }}
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
