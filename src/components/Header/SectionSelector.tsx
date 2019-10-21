import React from "react";

import useLocation from "../../hooks/useLocation";
import Icons from "../util/Icons";
import Typography from "@material-ui/core/Typography";
import { HistoryLocation } from "@reach/router";
import * as routes from "../../constants/routes";
import Sidenav from "../Sidenav";

interface ISection {
  name: string;
  linkTo: string;
  icon: JSX.Element;
}

const SectionSelector = () => {
  const [open, setOpen] = React.useState(false);
  const { location } = useLocation();

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const sections: ISection[] = [
    { name: "Produkter", linkTo: routes.HOME, icon: <Icons.Storage /> },
    { name: "Bestillinger", linkTo: routes.ORDERS, icon: <Icons.Archive /> },
    { name: "Salg", linkTo: routes.SALES, icon: <Icons.Unarchive /> },
    { name: "Utlån", linkTo: routes.LOANS, icon: <Icons.Cached /> },
    { name: "Logg", linkTo: routes.HISTORY, icon: <Icons.AccessTime /> },
    { name: "Profil", linkTo: routes.PROFILE, icon: <Icons.AccountCircle /> },
    { name: "Admin", linkTo: routes.ADMIN, icon: <Icons.Assessment /> }
  ];

  return (
    <div style={{ display: "flex", placeItems: "center" }}>
      <div>
        <CurrentSection
          onClick={handleToggle}
          sections={sections}
          current={location}
        />
      </div>
      <Sidenav isOpen={open} close={() => setOpen(false)} />
    </div>
  );
};

type TCurrentSection = {
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  sections: ISection[];
  current: HistoryLocation;
};

const CurrentSection = ({ onClick, sections, current }: TCurrentSection) => {
  let currentSection = sections.find(
    section => section.linkTo === current.pathname
  ) as ISection;
  return (
    <button onClick={onClick} style={{ width: "33vw", height: "4vh" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
        {currentSection && currentSection.icon}
        <Typography style={{ placeSelf: "center" }}>
          {currentSection && currentSection.name}
        </Typography>
      </div>
    </button>
  );
};

export default SectionSelector;
