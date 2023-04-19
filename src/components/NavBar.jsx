import logoIpasme from "../assets/png/logo-ipasme.png";
import * as icons from "./Icons";
import {Button1} from "./Buttons"

function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-logo-container">
        <img src={logoIpasme} alt="" />
      </div>

      <ul>
        <li className="micro-italic">Navegar</li>
        <TabOption selected={true} text="Inicio" icon={icons.Home1} />
        <TabOption text="Notificaciones" icon={icons.Bell} />
        <TabOption text="Ver Historias" icon={icons.DocumentFilled} />
        <TabOption text="Crear Historia" icon={icons.DocumentPlus} />
        <TabOption text="Estad&iacute;sticas" icon={icons.Stats} />
      </ul>
      <div className="divider">
        <div></div>
      </div>
      <ul>
        <li className="micro-italic">Opciones</li>
        <TabOption text="Configuraci&oacute;n" icon={icons.Settings} />
        <TabOption text="Ayuda" icon={icons.QuestionCircle} />
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
        <Button1 text="Cerrar Sesión" icon={icons.ArrowCircleLeft} />
      </div>
    </nav>
  );
}

function TabOption({ selected = false, text = "", link = "#", icon }) {
  return (
    <li className={selected ? "tab-option selected" : "tab-option"}>
      {icon(24)}
      {/* <icons.Stats/> */}
      <a
        className={selected ? "title-small selected" : "title-small"}
        href={link}
      >
        {text}
      </a>
    </li>
  );
}

export default NavBar;
