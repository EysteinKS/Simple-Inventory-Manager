import React from "react";
import styled from "styled-components";
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

  const dataPercentages = data.map(size => sizeToPercentage[size]);
  const dataPixels = dataPercentages.map(percent =>
    percentageOf(maxWidth, percent)
  );

  const sizeToFraction = (size: TWidth) => {
    switch (size) {
      case "small":
        return "minmax(96px, 2fr)";
      case "medium":
        return "minmax(144px, 3fr)";
      case "large":
        return "minmax(192px, 4fr)";
      case "tiny":
      default:
        return "minmax(48px, 1fr)";
    }
  };

  const minmaxTotal =
    dataPixels.reduce((acc, cur) => {
      acc += cur * 2;
      return acc;
    }, 0) +
    buttons * 48;

  const dataFractions = data.map(size => sizeToFraction(size));

  const minmax =
    minmaxTotal > maxWidth
      ? dataFractions
      : dataPixels.map(px => {
          return `minmax(${px}px, ${px * 2}px)`;
        });

  const headerStyle = `
    grid-template-columns: ${minmax.join(" ")} auto ${buttons * 48}px;
  `;

  const itemStyle = `
    grid-template-columns: ${minmax.join(" ")} auto repeat(${buttons}, 48px);
  `;

  return {
    header: headerStyle,
    item: itemStyle
  };
};

export const TableWrapper = styled.div`
  max-width: 960px;
  margin: 0;
  border-top: 1px solid #0001;
  ${device.tablet(`
    margin: 2vh auto 0 auto;
  `)}
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
  expanded?: string | null;
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

  button {
    height: 100%;
    background: none;
    border: none;
  }

  svg {
    color: #000b;
  }

  svg:hover {
    cursor: pointer;
    color: #0008;
  }

  ${(props: ITableItem) => (props.columns ? props.columns : null)}

  background-color: #F3F3F3;
  :nth-of-type(2n) {
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

  svg {
    height: 22px;
    width: 22px;
  }
`;

export const ItemButtons = styled.div`
  display: grid;
  grid-template-columns: ${(props: { buttons?: number }) =>
    props.buttons ? `repeat(${props.buttons}, 48px)` : "48px"};
`;

export const ExpandedContent = styled.div`
  width: 100%;
  display: grid;
  grid-auto-rows: 30px;
  background-color: #eee;
  border-left: 5px solid
    ${(props: { borderColor: string }) => props.borderColor || "#bbb"};
`;

interface ColumnsProps {
  columns: string;
}

export const ExpandedContentItem = styled.div`
  display: grid;
  place-items: center;
  place-content: center;
  ${(props: ColumnsProps) => `
    grid-template-columns: ${props.columns};
  `}
    :nth-child(2n) {
    background-color: #0001;
  }
  & > p {
    margin: 0;
    :nth-child(1) {
      justify-self: end;
    }
    :nth-child(3) {
      justify-self: start;
    }
  }
`;

interface ExpandedTableItemProps {
  expanded: boolean;
  borderColor: string;
}

export const ExpandedTableItem: React.FC<ExpandedTableItemProps> = ({
  expanded,
  borderColor,
  children
}) => {
  return (
    <ExpandedWrapper expanded={expanded}>
      <ExpandedContent borderColor={borderColor}>{children}</ExpandedContent>
    </ExpandedWrapper>
  );
};

export const ExpandedWrapper = styled.aside`
  float: left;
  width: 100%;
  display: ${(props: { expanded: boolean }) =>
    props.expanded ? "block" : "none"};
`;
