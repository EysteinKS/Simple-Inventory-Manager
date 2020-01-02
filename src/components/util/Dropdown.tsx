import React from "react";
import styled from "styled-components";

interface DropdownProps {
  content: JSX.Element;
}

const Dropdown: React.FC<DropdownProps> = ({ content, children }) => {
  return (
    <DropdownWrapper>
      {children}
      <DropdownContent>{content}</DropdownContent>
    </DropdownWrapper>
  );
};

export const DropdownContent = styled.div`
  display: none;
  position: absolute;
  right: 0;
  min-width: 120px;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border: 1px solid #0003;
`;

export const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;

  :hover {
    ${DropdownContent} {
      display: block;
    }
  }
`;

export const DropdownList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0.2em 0;
  width: 100%;
`;

export const DropdownListItem = styled.li`
  height: 40px;
  width: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5em 0 1em;
  background-color: #f8f8f8;
  color: #000;
  :hover {
    background: #0001;
    cursor: pointer;
  }

  svg {
    height: 20px;
    width: 20px;
  }

  p {
    font-size: 14px;
  }
`;

export const ListSplitter = styled.div`
  height: 0px;
  width: 90%;
  margin-left: 5%;
  border-bottom: 1px solid #0003;
`;

export default Dropdown;
