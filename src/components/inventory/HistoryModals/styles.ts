import styled from "styled-components";
import { verticalScroll } from "../../../styles/scroll";

interface BckColorProps {
  bckColor: string;
}

interface ColumnsProps {
  columns: string;
}

export const HistoryHeader = styled.div`
  display: flex;
  height: 50px;
  width: 100%;
  border-bottom: 2px solid #0003;
  ${(props: BckColorProps) => `
    background: ${props.bckColor};
  `}
`;

export const HistoryTitle = styled.h3`
  margin: 0;
  padding: 0;
  padding-left: 0.5em;
  color: #000b;
  align-self: center;
  position: fixed;
`;

export const HistoryContent = styled.div`
  display: grid;
  grid-template-rows: 50px auto;
  background-color: #fff;
  min-width: 650px;
`;

interface ListHeaderProps extends BckColorProps, ColumnsProps {}

export const ListHeader = styled.div`
  display: grid;
  ${(props: ListHeaderProps) => `
    grid-template-columns: ${props.columns};
  `}
  place-content: center;
  place-items: center;
  ${(props: ListHeaderProps) => `
    background: ${props.bckColor};
  `}
  border-bottom: 2px solid #0003;
  & > p {
    font-weight: bold;
    font-size: 14px;
    color: #000c;
  }
`;

export const ListWrapper = styled.div`
  padding: 0 0 0.5em 0;
  max-height: 65vh;
  min-width: 650px;
  overflow-x: hidden;
  ${verticalScroll}
`;

interface ItemWrapperProps extends ColumnsProps {
  expanded?: string | null;
}

export const ItemWrapper = styled.div`
  height: 50px;
  display: grid;
  ${(props: ItemWrapperProps) => `
    grid-template-columns: ${props.columns};
  `}
  place-content: center;
  place-items: center;
  :nth-child(2n) {
    background-color: #0001;
  }
`;

export const ItemText = styled.p``;

export const ExpandedHistoryItem = styled.div`
  width: 100%;
  display: grid;
  grid-auto-rows: 30px;
  background: #eee;
  border-left: 5px solid
    ${(props: { borderColor: string }) => props.borderColor || "#bbb"};
`;

export const ExpandedHistoryListItem = styled.div`
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

export const ExpandButton = styled.button`
  height: 100%;
  width: 100%;
  background: none;
  border: none;
`;
