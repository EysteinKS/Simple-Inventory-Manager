import React, {Fragment} from "react"
import Icons from "./Icons"
import ReactTooltip from "react-tooltip"

export default function CloudStatus({ className, style, save, isSaving, isSaved, error }) {
  
  let icon = <Icons.CloudDone/>
  let tooltip
  let styling = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "3vh", 
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
    icon = <Icons.Warning/>
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
    <Fragment>
    <div 
      data-tip data-for="cloudTooltip"
      onClick={((!isSaving && !isSaved) || error) ? save : null}
      style={styling}
    >
      {icon}
    </div>
    <ReactTooltip id="cloudTooltip" place="bottom" type="dark" effect="solid">
      <span>{tooltip}</span>
    </ReactTooltip>
    </Fragment>
  )
}