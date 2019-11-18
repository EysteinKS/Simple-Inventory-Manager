import { css } from "styled-components";

export const verticalScroll = css`
  overflow-y: hidden;
  :hover {
    overflow-y: overlay;
  }
  ::-webkit-scrollbar {
    width: 5px;
    background: #0001;
  }
  ::-webkit-scrollbar-thumb {
    background: #3339;
  }
`

export const horizontalScroll = css`
  overflow-x: hidden;
  :hover {
    overflow-x: overlay;
  }
  ::-webkit-scrollbar {
    height: 5px;
    background: #0001;
  }
  ::-webkit-scrollbar-thumb {
    background: #3339;
  }
`