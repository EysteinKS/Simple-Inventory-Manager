import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/types";
import { HeaderWrapper, UtilityWrapper } from "./styles";
import Client from "./Client";
import User from "./User";
import Pages from "./Pages";

type THeader = {
  locationIsLoaded: boolean;
};

export default function Header({ locationIsLoaded }: THeader) {
  const primaryColor = useSelector(
    (state: RootState) => state.auth.location.primaryColor
  );
  const bckColor = useMemo(() => {
    if (primaryColor && locationIsLoaded) {
      return primaryColor;
    } else {
      return "#a9a9a9";
    }
  }, [primaryColor, locationIsLoaded]);

  if (!locationIsLoaded) return null;

  return (
    <HeaderWrapper bckColor={bckColor}>
      <AuthHeader />
    </HeaderWrapper>
  );
}

const AuthHeader = () => (
  <>
    <Pages />
    <UtilityWrapper>
      <User />
      <Client />
    </UtilityWrapper>
  </>
);
