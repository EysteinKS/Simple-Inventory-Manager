import React from "react";
import SectionHeader, {
  Row,
  HeaderButton,
  HeaderTop,
  Title,
  HeaderButtons,
  KeyButton
} from "./SectionHeader";
import styled from "styled-components";
import Icons from "./Icons";
import { TableWrapper } from "../../styles/table";

interface IProps {
  title: string;
}

const TableSkeleton: React.FC<IProps> = ({ title }) => {
  return (
    <TableWrapper>
      <SectionHeader>
        <HeaderTop>
          <Title>{title}</Title>
          <HeaderButtons>  
            <HeaderButton />
            <HeaderButton />
          </HeaderButtons>
        </HeaderTop>
        <Row grid="repeat(4, 10%) 60%">
          <KeyButton>#</KeyButton>

          <KeyButton>
            <Icons.FormatQuote />
          </KeyButton>

          <KeyButton>...</KeyButton>

          <KeyButton>...</KeyButton>
        </Row>
      </SectionHeader>
      <SkeletonList>
        {[1, 2, 3, 4, 5, 6].map((item, index) => (
          <SkeletonItem index={index} key={"placeholder_" + item} />
        ))}
      </SkeletonList>
    </TableWrapper>
  );
};

const SkeletonList = styled.div`
  width: 100%;
`;

const SkeletonItem = styled.div`
  height: 50px;
  width: 100%;
  background: ${(props: { index: number }) => {
    if (props.index % 2 !== 0) {
      return "linear-gradient(-60deg, #D0D0D0, #EFEFEF)";
    } else {
      return "linear-gradient(-60deg, #E0E0E0, #FFFFFF)";
    }
  }};
  background-size: 400% 400%;
  animation: pulse 1.2s ease infinite;
  @keyframes pulse {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

export default TableSkeleton;
