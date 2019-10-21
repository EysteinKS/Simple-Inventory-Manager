import React from "react";
import styled from "styled-components";

const SkeletonWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 10px;
`;

const SkeletonHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0 15px;
`;

const HeaderText = styled.p`
  text-align: ${(props: { align: string }) => props.align};
`;

export default () => {
  return (
    <SkeletonWrapper>
      <SkeletonHeader>
        <HeaderText align="start"></HeaderText>
        <HeaderText align="end"></HeaderText>
      </SkeletonHeader>
    </SkeletonWrapper>
  );
};
