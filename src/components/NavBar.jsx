import logoIpasme from "../assets/png/logo-ipasme.png";
import * as icons from "./Icons";
import { ButtonBig } from "./Buttons";
import { NavLink, useHistory } from "react-router-dom";
import { useState } from "react";

function NavBar() {
  // TODO esto se puede sacar a App
  let [selected, setSelected] = useState(-1);
  // hay que ver si el selected se maneja de otra manera para poder
  // poner un selected por defecto

  return (
    <nav className="navbar">
      <div className="nav-logo-container">
        <img src={logoIpasme} alt="" />
      </div>

      <ul>
        <li className="micro-italic" style={{paddingLeft:'24px'}}>Navegar</li>
        <TabOption
          id={1}
          selected={selected}
          setSelected={setSelected}
          link="/"
          text="Inicio"
          icon={icons.Home1}
        />
        {/* <TabOption id={2} selected={selected} setSelected={setSelected} link="/notifications" text="Notificaciones" icon={icons.Bell} /> */}
        <TabOption
          id={3}
          selected={selected}
          setSelected={setSelected}
          link="/viewrecords"
          text="Ver Historias"
          icon={icons.DocumentFilled}
        />
        <TabOption
          id={4}
          selected={selected}
          setSelected={setSelected}
          link="/newrecord"
          text="Crear Historia"
          icon={icons.DocumentPlus}
        />
        <TabOption
          id={5}
          selected={selected}
          setSelected={setSelected}
          link="/stats"
          text="Estad&iacute;sticas"
          icon={icons.Stats}
        />
      </ul>
      <div className="divider">
        <div></div>
      </div>
      <ul>
        <li className="micro-italic" style={{paddingLeft:'24px'}}>Opciones</li>
        <TabOption
          id={6}
          selected={selected}
          setSelected={setSelected}
          link="/config"
          text="Configuraci&oacute;n"
          icon={icons.Settings}
        />
        <TabOption
          id={7}
          selected={selected}
          setSelected={setSelected}
          link="/help"
          text="Ayuda"
          icon={icons.QuestionCircle}
        />
      </ul>

      <div className="divider">
        <div></div>
      </div>

      <div className="user-card">
        {icons.User2(36)}
        <div className="usuario-info">
          <small className="title-small">Lorena Chacón</small>
          <small className="paragraph-small">Usuario Estandar</small>
        </div>
      </div>

      <div className="button-container">
        <ButtonBig
          type="secondary"
          text="Cerrar Sesión"
          icon={icons.ArrowCircleLeft}
        />
      </div>
    </nav>
  );
}

function TabOption({ id, selected, setSelected, text = "", link = "#", icon }) {
  return (
    <li>
      
      {/* <icons.Stats/> */}
      <NavLink
        className={selected === id ? "tab-option selected" : "tab-option"}
        to={link}
        onClick={() => {
          setSelected(id);
        }}
      >
        {icon(24)}
        <span className={selected === id ? "title-small selected" : "title-small"}>{text}</span>
      </NavLink>
    </li>
  );
}

export default NavBar;
