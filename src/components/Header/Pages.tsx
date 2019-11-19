import React from "react";

import useLocation from "../../hooks/useLocation";
import Icons from "../util/Icons";
import { navigate } from "@reach/router";
import * as routes from "../../constants/routes";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/types";
import { PagesWrapper, PageLink, PageExpand } from "./styles";
import { Tooltip } from "../util/HoverInfo";

interface ISection {
  name: string;
  linkTo: string;
  icon: JSX.Element;
}

const Pages = () => {
  const { location } = useLocation();
  const currentPath = location.pathname;
  const userRole = useSelector((state: RootState) => state.auth.user.role);

  const sections: ISection[] = React.useMemo(() => {
    let sectionArray = [
      { name: "Produkter", linkTo: routes.HOME, icon: <Icons.Storage /> },
      { name: "Bestillinger", linkTo: routes.ORDERS, icon: <Icons.Archive /> },
      { name: "Salg", linkTo: routes.SALES, icon: <Icons.Unarchive /> },
      { name: "Utlån", linkTo: routes.LOANS, icon: <Icons.Cached /> },
      { name: "Logg", linkTo: routes.HISTORY, icon: <Icons.History /> },
      { name: "Profil", linkTo: routes.PROFILE, icon: <Icons.AccountCircle /> }
    ];

    if (userRole === "admin") {
      sectionArray.push({
        name: "Admin",
        linkTo: routes.ADMIN,
        icon: <Icons.Assessment />
      });
    }

    return sectionArray;
  }, [userRole]);

  const [expand, setExpand] = React.useState(false);
  const handleClick = (link: string) => {
    if (link !== currentPath) {
      navigate(link);
      if (expand) {
        setExpand(false);
      }
    }
  };

  const isCurrent = (linkTo: string) => {
    if (currentPath === routes.FORGOT_PASSWORD && linkTo === routes.PROFILE) {
      return true;
    } else {
      return linkTo === currentPath;
    }
  };

  return (
    <PagesWrapper expand={expand}>
      <ExpandPages expand={expand} setExpand={setExpand} />
      {sections.map(s => (
        <>
          <PageLink
            key={"link_to_" + s.linkTo}
            onClick={e => {
              e.currentTarget.blur();
              handleClick(s.linkTo);
            }}
            current={isCurrent(s.linkTo)}
            expand={expand}
            data-tip
            data-for={"page_" + s.linkTo}
          >
            {s.icon}
          </PageLink>
          <Tooltip handle={"page_" + s.linkTo} place="right">
            {s.name}
          </Tooltip>
        </>
      ))}
    </PagesWrapper>
  );
};

interface ExpandPagesProps {
  expand: boolean;
  setExpand: (bool: boolean) => void;
}
const ExpandPages: React.FC<ExpandPagesProps> = ({ expand, setExpand }) => {
  return (
    <PageExpand onClick={() => setExpand(!expand)}>
      {expand ? <Icons.Close /> : <Icons.Menu />}
    </PageExpand>
  );
};

export default Pages;
