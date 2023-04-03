// import './styles.css'
import logoIpasme from './assets/logo-ipasme.png'
import inicioIcon from './assets/inicio.png'

function Componente() {
    return <nav className="navbar">
        <div className='nav-logo-container'><img src={logoIpasme} alt="" /></div>
        <ul>
            <TabOption selected={true} text='Inicio' icon={inicioIcon} />
        </ul>
    
    </nav>
}

function TabOption({selected=false, text="", icon, link="#"}){
    return <li className={selected ? 'tab-option selected' : 'tab-option'}>
        <img src={icon} alt="" />
        <a href={link}>{text}</a>
    </li>
}

export default Componente;