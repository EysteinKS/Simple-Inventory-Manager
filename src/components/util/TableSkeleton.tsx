import React from "react";
import { HeaderButton, Title, HeaderButtons, KeyButton } from "./SectionHeader";
import styled from "styled-components";
import Icons from "./Icons";
import {
  TableWrapper,
  TableHeader,
  TableContent,
  ContentHeader,
  getTableStyle,
  TableItem
} from "../../styles/table";
import useAuthLocation from "../../hooks/useAuthLocation";

interface IProps {
  title: string;
}

const TableSkeleton: React.FC<IProps> = ({ title }) => {
  const { secondary } = useAuthLocation();

  const columns = React.useMemo(() => {
    return getTableStyle(["small", "large", "medium"], 0);
  }, []);

  return (
    <TableWrapper>
      <TableHeader bckColor={secondary}>
        <Title>{title}</Title>
        <HeaderButtons>
          <HeaderButton onClick={() => {}}>
            <Icons.Add />
          </HeaderButton>
        </HeaderButtons>
      </TableHeader>
      <TableContent>
        <ContentHeader bckColor={secondary} columns={columns.header}>
          <KeyButton>#</KeyButton>

          <KeyButton>
            <Icons.Name />
          </KeyButton>

          <KeyButton>...</KeyButton>
        </ContentHeader>
        <SkeletonList>
          {[1, 2, 3, 4, 5, 6].map(item => (
            <TableItem columns={columns.item} key={"placeholder_" + item} />
          ))}
        </SkeletonList>
      </TableContent>
    </TableWrapper>
  );
};

const SkeletonList = styled.div`
  width: 100%;
`;

export default TableSkeleton;
