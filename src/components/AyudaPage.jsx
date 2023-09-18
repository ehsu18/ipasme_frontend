import { useEffect } from "react";
import { redirect } from "react-router-dom";
import { ButtonBig } from "./Buttons";
import { iconClasses } from "@mui/material";
import * as icons from "./Icons";
import logoIpasme from "../assets/png/logo-ipasme.png";
import fondoIllustraciones from "../assets/png/fondo-ilustraciones.png";

export function AyudaPage(){
    return (<main
  className="floatingcontainer-parent flex-h flex-center-h"
  style={{
    alignItems: "center",
    position: "relative",
  }}
>
  <div
    className="common-container flex-v flex-center-v gap24"
    style={{
      padding: "24px",
      alignItems: "center",
      justifyContent: "center",
      width: "340px",
      position: "relative",
      boxShadow: "0px 2px 5px 0px #CCC",
    }}
  >
    <span className="title-big">Desarrolladores</span>
    <table>
      <tr>
        <th>Nombre</th>
        <th>Cédula</th>
      </tr>
      <tr>
        <td>T.S.U. Sumalave Elian</td>
        <td>V 29.730.724</td>
      </tr>
      <tr>
        <td>T.S.U. Porras Sarai</td>
        <td>V 29.918.358</td>
      </tr>
      <tr>
        <td>T.S.U. Beltrán Victor</td>
        <td>V 28.191.022</td>
      </tr>
      <tr>
        <td>T.S.U. Ramírez Anthony</td>
        <td>V 29.674.493</td>
      </tr>
      <tr>
        <td>T.S.U. Kelly Gomez</td>
        <td>V 29.848.997</td>
      </tr>
    </table>
  </div>
</main>)

}

