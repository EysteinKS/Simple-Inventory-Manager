import styled, { css } from "styled-components";
import { device, tallDevice } from "../../styles/device";
import { DropdownWrapper, DropdownContent } from "../util/Dropdown";

export const HeaderWrapper = styled.header`
  color: #000c;
  display: flex;
  justify-content: space-between;
  height: 5.5vh;
  width: 100%;
  max-width: 100vw;
  column-gap: 2px;
  box-sizing: border-box;
  border-bottom: 2px solid #0002;
  background-color: ${(props: { bckColor: string }) => props.bckColor};
  position: fixed;
  top: 0;
  z-index: 10;
  :first-child {
    justify-self: flex-start;
  }
  ${tallDevice(`
    height: 4vh;
  `)}
`;

export const UtilityWrapper = styled.div`
  display: flex;
  justify-content: center;
  & > :first-child {
    padding-right: 0.5em;
  }
  & > :last-child {
    padding: 0 0.5em;
  }
  ${device.tablet(`
    & > :first-child {
      padding-right: 1em;
    }
    & > :last-child {
      padding: 0 1em;
    }
  `)}
`;

export const PagesWrapper = styled.nav`
  display: flex;
  align-self: center;
  place-items: center;
  justify-content: center;
  height: 100%;
  padding-left: 0.5em;
  ${(props: { expand: boolean }) =>
    props.expand &&
    css`
      min-width: 96vw;
      padding-right: 2vw;
      justify-content: space-between;
    `}
`;

export interface PageLinkProps {
  current: boolean;
  expand: boolean;
}

export const PageExpand = styled.div`
  display: block;
  padding-left: 0.1em;
  padding-right: 0.1em;
  :hover {
    cursor: pointer;
    color: #fff8;
  }
  ${device.tablet(`
    display: none;
  `)}
`;

export const PageLink = styled.div`
  padding-left: 0.1em;
  padding-right: 0.1em;
  :hover {
    cursor: pointer;
    color: #fff8;
  }
  ${(props: PageLinkProps) =>
    props.current
      ? css`
          color: #fffb;
          :hover {
            cursor: default;
            color: #fffb;
          }
        `
      : !props.expand && `display: none;`}
  ${device.tablet(`
      padding-left: 0.5em;
      padding-right: 0.5em;
      display: block;
  `)}
`;

export const ClientImage = styled.img`
  padding: 0;
  padding-right: 0.5em;
  margin: 0;
  height: 22px;
`;

export const ProfileWrapper = styled.div`
  display: flex;
  place-items: center;
  height: 100%;
  padding-right: 0.2em;
  ${(props: { current: boolean }) =>
    props.current
      ? css`
          color: #fffb;
        `
      : css`
          :hover {
            color: #fff8;
          }
        `}
`;

export const UserWrapper = styled(DropdownWrapper)`
  height: 100%;
  align-self: center;
  :hover {
    ${ProfileWrapper} {
      color: #fff8;
    }
  }
`;

export const UserDropdownContent = styled(DropdownContent)``;

export const UserName = styled.p`
  padding: 0;
  padding-right: 0.5em;
  margin: 0;
  text-align: end;
`;

export const LogoutButton = styled.div`
  height: 24px;
  :hover {
    cursor: pointer;
    color: #fff8;
  }
`;

export const NoMargin = styled.div`
  & > * {
    margin: 0;
  }
`;

export const SectionText = styled.h4`
  margin: 0;
  padding: 0;
  align-self: center;
  justify-self: center;
`;

export const NonAuthTitle = styled.h2`
  margin: 0;
  justify-self: start;
  align-self: center;
  padding-left: 0.5em;
`;
