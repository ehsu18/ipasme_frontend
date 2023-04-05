// import './styles.css'
import logoIpasme from './assets/logo-ipasme.png'
import inicioIcon from './assets/inicio.png'
import Notificaciones from './assets/bell.png'
import verhistorias from './assets/verhistoria.png'
import crearhistoria from './assets/nuevahistoria.png'
import estadisticas from './assets/stats.png'
import configuracion from './assets/config.png'
import ayuda from  './assets/ayuda.png'
import user from './assets/user.png'
import arrow from './assets/arrow-circle-left.png'
import * as icons from './assets/Icons'

function NavBar() {
    return <nav className="navbar">
        <div className='nav-logo-container'><img src={logoIpasme} alt="" /></div>

        <ul>
            <li className='micro-italic'>Navegar</li>
            <TabOption selected={true} text='Inicio' icon={inicioIcon} />
            <TabOption text='Notificaciones' icon={Notificaciones}/>
            <TabOption text='Ver Historias' icon={verhistorias}/>
            <TabOption text='Crear Historia' icon={crearhistoria}/>
            <TabOption text='Estadisticas' icon={estadisticas}/>

        </ul>
        <div className='divider'><div></div></div>
        <ul>
            <li className='micro-italic'>Opciones</li>
            <TabOption text='configuracion' icon={configuracion}/>
            <TabOption text='Ayuda' icon={ayuda}/>
        </ul>

        <div className='divider'><div></div></div>

        <div className='user-card'>
            <img src={user} alt="" />
            <div className='usuario-info'>
                <small className='title-small'>Lorena Chacón</small>
                <small className='paragraph-small'>Usuario Estandar</small>
            </div>
        </div>

        <div className='button-container'>
            <Button text="Cerrar Sesión" icon={icons.ArrowCircleLeft}/>
        </div>


    </nav>
}

function TabOption({selected=false, text="", icon, link="#"}){
    return <li className={selected ? 'tab-option selected' : 'tab-option'}>
        <img src={icon} alt="" />
        <a className={selected ? 'title-small selected' : 'title-small'} href={link}>{text}</a>
    </li>
}

function Button({type='main', text="", icon}){
    return <button className='main-button'>
        {icon()}
        <span className='title-small'>{text}</span>
    </button>
}

export default NavBar;