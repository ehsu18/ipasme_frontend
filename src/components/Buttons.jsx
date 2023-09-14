import * as icons from "./Icons";
import { useState } from "react";
import React from "react";
import { filterRecords } from "../tools/api";
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

export function ButtonSmall({ type = "main", text = "" , action}) {
  return (
    <button onClick={action} className="button-small">
      <span className="title-small">{text}</span>
    </button>
  );
}

export function PersonTypeTag({ type = "undefined" }) {

  if ( type === 'affiliate'){
    return <div className="persontype-tag afiliado">
    {icons.User1(14)} 
    <span className="title-micro">Afiliado</span>
  </div>
  } else if (type === 'beneficiary') {
    return (
    <div className="persontype-tag beneficiario">
      {icons.Users(14)}
      <span className="title-micro">Beneficiario</span>
    </div>
  );
  } else {
    return (
      <div className="persontype-tag undefined">
        {icons.UserCross(14)}
        <span className="title-micro">Indefinido</span>
      </div>
    );
  }
  
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


// TODO ponerle una sombrita a esta vaina
export function SearchWidget({}) {
  let [options, setOptions] = useState([]);
  let [text, setText] = useState("");

  return (
    <div
      className="flex-h"
      style={{
        position: "relative",
        borderRadius: "4px",
        // border: "1px solid var(--border)",
        backgroundColor: 'var(--white)',
        alignItems:'center',
        paddingRight:'8px',
        boxShadow: '0px 1px 6px rgba(0, 0, 0, 0.12)',
        height: '36px',
        minHeight:'36px'
      }}
    >
      <input
        className="paragraph-regular"
        style={{
          border:'none',
          borderRadius:'4px',
          backgroundColor: 'var(--white)',
          paddingLeft: '12px',
          height: '36px',
        }}
        type="text"
        value={text}
        placeholder="Buscar"
        onChange={(e) => {
          filterRecords(e.target.value)
            .then((response) => response.json())
            .then((json) => {
              setOptions(json);
              console.log(json)
            })
            .catch((error) => {
              setOptions([]);
              console.log(error)
            });
          setText(e.target.value);
        }}
      />
      {icons.Search(24)}
      {Array.isArray(options) && options.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            top: "34.5px",
            border: "solid 1px var(--border)",
            borderRadius: "0px 0px 12px 12px",
            width: "100%",
            backgroundColor: "var(--white)",
          }}
        >
          {options.map((opt, index) => {
            let innerText =
              opt.nationality +
              opt.document +
              " " +
              opt.names +
              " " +
              opt.lastnames;
            return (
              <span
                style={{ width: "100%", maxWidth: "100%", padding: "8px 4px" }}
                key={index}
                ind={index}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "var(--gray)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = null;
                }}
                onClick={(e) => {
                  window.location.href = `/record_details/${opt.id}`;
                }}
              >
                {innerText}
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}