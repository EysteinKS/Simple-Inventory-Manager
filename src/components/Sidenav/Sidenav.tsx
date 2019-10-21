import React from "react";
import ReactModal from "react-modal";
import * as routes from "../../constants/routes";
import Icons from "../util/Icons";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/types";
import { ListWrapper } from "./styles";
import NavSection from "./NavSection";

ReactModal.setAppElement("#root");

interface IProps {
  isOpen: boolean;
  close: () => void;
}

export interface ISection {
  name: string;
  linkTo: string;
  icon: JSX.Element;
}

const Sidenav: React.FC<IProps> = ({ isOpen, close }) => {
  const userRole = useSelector((state: RootState) => state.auth.user.role);

  const sections: ISection[] = React.useMemo(() => {
    let sectionArray = [
      { name: "Produkter", linkTo: routes.HOME, icon: <Icons.Storage /> },
      { name: "Bestillinger", linkTo: routes.ORDERS, icon: <Icons.Archive /> },
      { name: "Salg", linkTo: routes.SALES, icon: <Icons.Unarchive /> },
      { name: "Utlån", linkTo: routes.LOANS, icon: <Icons.Cached /> },
      { name: "Logg", linkTo: routes.HISTORY, icon: <Icons.AccessTime /> },
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

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="Side Navigation"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onRequestClose={close}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.6)"
        },
        content: {
          top: "5.1vh",
          bottom: "auto",
          right: "0",
          left: "67vw",
          padding: "0",
          zIndex: "11",
          background: "none",
          border: "none",
          borderRadius: "0"
        }
      }}
    >
      <ListWrapper>
        {sections.map(section => (
          <NavSection
            key={"sidenav_section_" + section.linkTo}
            section={section}
            close={close}
          />
        ))}
      </ListWrapper>
    </ReactModal>
  );
};

export default Sidenav;
