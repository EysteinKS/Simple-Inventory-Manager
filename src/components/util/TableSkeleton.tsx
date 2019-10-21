import React from 'react'
import SectionHeader, { Row, RowSplitter, Key, ColumnSplitter } from './SectionHeader'
import styled from 'styled-components'
import CloudStatus from './CloudStatus'

interface IProps {
  title: string
}

const TableSkeleton: React.FC<IProps> = ({ title }) => {
  return (
    <div style={{ margin: "5vh 10vw 10vh" }}>
      <SectionHeader>
        <Row grid="15% 15% 43.5% 14.5% 12%">
          <SkeletonButton>...</SkeletonButton>
          <SkeletonButton>...</SkeletonButton>
          <h1 style={{ placeSelf: "center" }}>{title}</h1>
          <br/>
          <CloudStatus/>
        </Row>
        <RowSplitter/>
        <Row grid="10% 1% 10% 1% 10% 1% 10% 1% 56%">
          <Key>...</Key>
          <ColumnSplitter/>
          <Key>...</Key>
          <ColumnSplitter/>
          <Key>...</Key>
          <ColumnSplitter/>
          <Key>...</Key>
          <ColumnSplitter/>
        </Row>
      </SectionHeader>
      <SkeletonList>
        {[1, 2, 3, 4, 5, 6].map((item, index) => 
          <SkeletonItem index={index} key={"placeholder_" + item}/>
        )}
      </SkeletonList>
    </div>
  )
}

const SkeletonButton = styled.button`
  height: 75%;
  width: 75%;
  border-radius: 15px;
`

const SkeletonList = styled.div`
  width: 100%;
`

const SkeletonItem = styled.div`
  height: 50px;
  width: 100%;
  background: ${(props: {index: number}) => {
    if(props.index % 2 === 0){
      return "linear-gradient(-60deg, #D0D0D0, #EFEFEF)"
    } else {
      return "linear-gradient(-60deg, #E0E0E0, #FFFFFF)"
    }
  }};
  background-size: 200% 200%;
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
  };
`

export default TableSkeleton