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

function Componente() {
    return <nav className="navbar">
        <div className='nav-logo-container'><img src={logoIpasme} alt="" /></div>
        <ul className='micro-italic'>
            <li>Navegar</li>
        </ul>
        <ul>
            <TabOption selected={true} text='Inicio' icon={inicioIcon} />
            <TabOption selected={true} text='Notificaciones' icon={Notificaciones}/>
            <TabOption selected={true} text='Ver Historias' icon={verhistorias}/>
            <TabOption selected={true} text='Crear Historia' icon={crearhistoria}/>
            <TabOption selected={true} text='Estadisticas' icon={estadisticas}/>

        </ul>
        <hr/>
        <ul className='micro-italic'>
            <li>Opciones</li>
        </ul>
        <ul>
            <TabOption selected={true} text='configuracion' icon={configuracion}/>
            <TabOption selected={true} text='Ayuda' icon={ayuda}/>
        </ul>

       <hr />

        <div className='user-card'>
            <img src={user} alt="" />
            <div className='usuario-info'>
                <small className='title-small'>Lorena Chacón</small>
                <small className='paragraph-small'>Usuario Estandar</small>
            </div>
        </div>


    </nav>
}

function TabOption({selected=false, text="", icon, link="#"}){
    return <li className={selected ? 'tab-option selected' : 'tab-option'}>
        <img src={icon} alt="" />
        <a href={link}>{text}</a>
    </li>
}

export default Componente;