import * as icons from "./Icons";
// import { useState } from "react";

export function ButtonBig({ action, id, type = "main", text = "", icon }) {
  /* button types:
    main: blue background
    secondary: white background
    disabled:
    good:
    danger:
    warning:
  
  */
  return (
    <button id={id} onClick={action} className={"button-big "+type}>
      {icon()}
      <span className="title-small">{text}</span>
    </button>
  );
}

export function ButtonSmall({ type = "main", text = "" }) {
  return (
    <button className="button-small">
      <span className="title-small">{text}</span>
    </button>
  );
}

export function PersonTypeTag({ type = "afiliado" }) {
  return type ? (
    <div className="persontype-tag afiliado">
      {icons.User1(14)} 
      <span className="title-micro">Afiliado</span>
    </div>
  ) : (
    <div className="persontype-tag beneficiario">
      {icons.Users(14)}
      <span className="title-micro">Beneficiario</span>
    </div>
  );
}

export function DualSelector({left='left', right='right', selected, setSelected}){
  
  // TODO no se puede seleccionar el fondo blanco
  return (
    <div className="dual-selector">
      <div className={
        selected===left ? "selection-background left" :
        selected === right ? "selection-background right" :
        "no-display"}></div>
      
      <div
        className={selected===left ? "title-small left-container selected" : "title-small left-container"}
        onClick={(e)=> {setSelected(left)}}
      >{left}</div>

      <div
        className={selected===right ? "title-small right-container selected" : "title-small right-container"}
        onClick={(e)=> {setSelected(right)}}
      >{right}</div>
    </div>
  )
}