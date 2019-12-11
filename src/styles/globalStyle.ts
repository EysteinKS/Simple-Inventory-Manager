import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  button {
    width: 100%;
    position: relative;
    border-style: outset;
    border-color: rgba(255, 255, 255, 0.4);
    background-color: #fbfbfb;
    :focus {
      outline: none;
    }
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
  }
  
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }

  svg {
    height: 24px;
    width: 24px;
  }

  .ReactModal__Content {
    animation: fadein 0.25s;
  }

  @keyframes fadein {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export default GlobalStyle;
