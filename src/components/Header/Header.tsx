import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../redux/types";
import { HeaderWrapper } from "./styles";
import LocationSelector from "./LocationSelector";
import UserSelector from "./UserSelector";
import SectionSelector from "./SectionSelector";

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

  return (
    <HeaderWrapper bckColor={bckColor}>
      {locationIsLoaded ? <AuthHeader /> : <div />}
    </HeaderWrapper>
  );
}

const AuthHeader = () => {
  return (
    <>
      <LocationSelector />
      <UserSelector />
      <SectionSelector />
    </>
  );
};
