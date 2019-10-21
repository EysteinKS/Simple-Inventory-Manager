import styled, { css } from "styled-components";

export const ListWrapper = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

export const SectionItem = styled.li`
  width: 100%;
  height: 5vh;
  padding: 0px 7px;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  place-items: center;
  place-content: center;
  box-sizing: border-box;
  border-bottom: 1px solid #CCC;
  ${(props: {current: boolean}) => css`
    color: ${props.current ? "#FFF" : "#000"};
    background-color: ${props.current ? "#BDBDBD" : "#FFF"};
  `}
  ${(props: {current: boolean}) => 
    (!props.current) && css`
      :hover {
        background-color: #DEDEDE;
        cursor: pointer;
      }
    `
  }
`

export const SectionIcon = styled.div`
  justify-self: start;
  & > * {
    margin: 0
  }
`

export const SectionName = styled.p`
  margin: 0
`