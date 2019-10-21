import React from "react";
import { useSelector } from "react-redux";
import LinkWrapper from "../util/LinkWrapper";
import { RootState } from "../../redux/types";
import Typography from "@material-ui/core/Typography";

const LocationSelector = () => {
  const locationName = useSelector(
    (state: RootState) => state.auth.location.name
  );
  const locationLogo = useSelector(
    (state: RootState) => state.auth.location.logoUrl
  );

  if (locationLogo) {
    return (
      <LinkWrapper linkTo="/">
        <img
          src={locationLogo}
          alt={locationName}
          style={{ height: "5vh", padding: "0.5rem", placeSelf: "start" }}
        />
      </LinkWrapper>
    );
  }
  return (
    <LinkWrapper linkTo="/">
      <Typography variant="h4" style={{ placeSelf: "center" }}>
        {locationName || "LAGER"}
      </Typography>
    </LinkWrapper>
  );
};

export default LocationSelector;
