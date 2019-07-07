
import React, { MouseEventHandler } from "react"
import Icons from "./Icons"
import ReactTooltip from "react-tooltip"

interface ICloudStatus {
  className?: string | null,
  style?: any,
  save: MouseEventHandler<HTMLButtonElement>,
  isSaving: Boolean,
  isSaved: Boolean,
  error: Boolean
}

export default function CloudStatus({ className, style, save, isSaving, isSaved, error }: ICloudStatus) {

  let icon = <Icons.CloudDone/>
  let tooltip
  let styling = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "4vh", 
    width: "4vw", 
    backgroundColor: "lightgrey", 
    cursor: "default",
    borderRadius: "5px",
    border: "2px black solid"
  }
  //error color : #ff9999
  //unsaved / saving : #ffe599
  //saved : #bbff99

  if(error){
    icon = <Icons.WarningIcon/>
    tooltip = "En feil oppsto! Prøv igjen?"
    styling["cursor"] = "pointer"
    styling["backgroundColor"] = "#ff9999"
  } else if(isSaving){
    icon = <Icons.CloudUpload/>
    tooltip = "Lagrer..."
    styling["backgroundColor"] = "#ffe599"
  } else if (!isSaving && !isSaved){
    icon = <Icons.CloudOff/>
    tooltip = "Lagre endringer?"
    styling["cursor"] = "pointer"
    styling["backgroundColor"] = "#ffe599"
  } else {
    icon = <Icons.CloudDone/>
    tooltip = "Alle endringer lagret"
    styling["backgroundColor"] = "#21b110"
  }
  

  return (
    <>
      <button 
        data-tip data-for="cloudTooltip"
        onClick={((!isSaving && !isSaved) || error) ? save : undefined}
        style={styling}
      >
        {icon}
      </button>
      <ReactTooltip id="cloudTooltip" place="bottom" type="dark" effect="solid">
        <span>{tooltip}</span>
      </ReactTooltip>
    </>
  )
}