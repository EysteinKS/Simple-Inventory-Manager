import styled from "styled-components";

export const HistoryTitle = styled.h3`
  justify-self: center;
  align-self: center;
  padding: 0;
  margin: 0;
`

export const HistoryContent = styled.div`
  display: grid;
  grid-template-rows: 8vh 65vh;
  margin: 1em;
  background-color: #fafafa;
`

export const ListHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 4fr 3fr 2fr;
  place-content: center;
  place-items: center;
  background-color: #ddd;
  border: 1px solid #aaa;
  & > p {
    font-weight: bold;
    font-size: 14px;
  }
`

export const ListWrapper = styled.div`
  overflow-y: auto;
  overflow: overlay;
  border: 1px solid #aaa;
`

export const ItemWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 4fr 3fr 2fr;
  place-content: center;
  place-items: center;
`