import React, { useMemo } from "react";
import ReactModal from "react-modal";
import {
  HistoryTitle,
  HistoryContent,
  ListHeader,
  ListWrapper,
  HistoryHeader
} from "./styles";
import useAuthLocation from "../../../hooks/useAuthLocation";
import useMargin from "../../../hooks/useMargin";
import Icons from "../../util/Icons";
ReactModal.setAppElement("#root");

interface HistoryModalProps {
  isOpen: boolean;
  label: string;
  name: string;
  close: () => void;
  columns: string;
  columnNames: string[];
}

const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  label,
  name,
  close,
  columns,
  columnNames,
  children
}) => {
  const { color, secondary } = useAuthLocation();

  const width = 664;
  const margin = useMargin(650);
  const calculatedMargin = useMemo(() => {
    let calcMarg = parseInt(margin);
    return calcMarg > 7 ? calcMarg - 7 : calcMarg;
  }, [margin]);

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel={label}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onRequestClose={close}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: "10"
        },
        content: {
          top: "10vh",
          left: `${calculatedMargin}px`,
          right: `${calculatedMargin}px`,
          bottom: "none",
          display: "grid",
          padding: "0",
          border: `7px solid ${color}`,
          backgroundColor: color,
          width: "auto",
          maxWidth: `${width}px`
        }
      }}
    >
      <HistoryHeader bckColor={color as string}>
        <HistoryTitle>
          <Icons.History /> Historikk - {name}
        </HistoryTitle>
      </HistoryHeader>
      <HistoryContent>
        <ListHeader bckColor={secondary} columns={columns}>
          {columnNames.map((name, i) => (
            <p key={"history_header_cell_" + i}>{name}</p>
          ))}
        </ListHeader>
        <ListWrapper>{children}</ListWrapper>
      </HistoryContent>
    </ReactModal>
  );
};

export default HistoryModal;
