import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import useSavingGate from "../../hooks/useSaving";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/types";
import styled from "styled-components";
import Icons from "../util/Icons";

export default function CloudStatus() {
  const [isSaving, isSaved, error, save] = useSavingGate();
  const hasNewChanges = useSelector(
    (state: RootState) => state.auth.hasNewChanges
  );

  const [icon, setIcon] = useState(<Icons.CloudDone />);
  const [tooltip, setTooltip] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (error) {
      setIcon(<Icons.WarningIcon />);
      setTooltip("En feil oppsto! Prøv igjen?");
      setStatus("error");
    } else if (hasNewChanges) {
      setIcon(<Icons.WarningIcon />);
      setTooltip("Nye endringer oppdaget, last inn siden på nytt!");
      setStatus("error");
    } else if (isSaving) {
      setIcon(<Icons.CloudUpload />);
      setTooltip("Lagrer...");
      setStatus("saving");
    } else if (!isSaving && !isSaved) {
      setIcon(<Icons.Save />);
      setTooltip("Lagre endringer?");
      setStatus("warning");
    } else {
      setIcon(<Icons.CloudDone />);
      setTooltip("Alle endringer lagret");
      setStatus("default");
    }
  }, [error, hasNewChanges, isSaving, isSaved, setIcon, setTooltip]);

  const onClick = () => {
    if (hasNewChanges) {
      window.location.reload();
    } else if (typeof save !== "boolean") {
      save();
    }
  };

  return (
    <>
      <StyledStatus
        data-tip
        data-for="cloudTooltip"
        onClick={e => {
          e.currentTarget.blur();
          onClick();
        }}
        status={status}
      >
        {icon}
      </StyledStatus>
      <ReactTooltip id="cloudTooltip" place="bottom" type="dark" effect="solid">
        <span>{tooltip}</span>
      </ReactTooltip>
    </>
  );
}

const StyledStatus = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  border: none;
  padding: 0;
  background: none;
  color: ${(props: { status: string }) => {
    switch (props.status) {
      case "error":
        return "#ea2727";
      case "warning":
        return "#ffe000";
      case "saving":
        return "#ffe000";
      default:
        return "#000000";
    }
  }}CC;
  cursor: ${(props: { status: string }) => {
    switch (props.status) {
      case "error":
      case "warning":
        return "pointer";
      default:
        return "default";
    }
  }};
`;
