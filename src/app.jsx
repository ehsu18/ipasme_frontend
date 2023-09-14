import NavBar from "./components/NavBar";
import { HomePage } from "./components/HomePage";
import { ViewRecordsPage } from "./components/RecordsList";
import { NewRecordPage } from "./components/NewRecordPage";
import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/app.css";
import "./styles/records-list.css";
import "./styles/NewRecordPage.css";
import "./styles/record-details.css";
import "./styles/creating_record.css";
import "./styles/home-page.css"
import {
  Routes,
  Route,
  Switch,
} from "react-router-dom";
import { AddCitaPage, EditCitaPage, AddCitaodonPage, EditCitaodonPage} from './components/CitaPage';
import { CreatingAffiliatePage, CreatingBeneficiaryPage } from "./components/CreatingRecordPage";
import { RecordDetailsPage } from "./components/RecordDetailsPage";
import { AddReposoPage, EditReposoPage } from "./components/RepososPage";
import { AddCuidoPage, EditCuidoPage } from "./components/CuidosPage";
import { PageNotFound } from "./components/PageNotFound";
import { LoginPage } from "./components/LoginPage";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
// TODO revisar si es mejor importar los css asi o en sus respectivas paginas
// TODO hay que hacer algo si al momento de usar la api el token da error, en ese caso 
// se debe reiniciar la sesion
// TODO se debe parar IpasmeRMSUserToken a una variable de entorno
// TODO hacer un effect que revise si esta el token y si es valido o no

function App() {
  let [userToken, setUserToken] = useState(window.localStorage.getItem('IpasmeRMSUserToken'));
  useEffect(()=>{
    let token = window.localStorage.getItem('IpasmeRMSUserToken')
    if (token){
      setUserToken(token) // TODO el problema es saber si el token es valido o no
    }
  },[])

  return ( userToken ?
    <main className="app-container">
      <NavBar userToken={userToken} setUserToken={setUserToken} /> {/* tiene que estar aqui para que se repita en todos las demas paginas aunque hay que ver bien eso */}
      <Routes>
        <Route path="/viewrecords" element={<ViewRecordsPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/record_details/:id" element={<RecordDetailsPage />} />
        <Route path="/newrecord" element={<NewRecordPage />}/>
        <Route path="/creating_record/affiliate" element={<CreatingAffiliatePage  />}/>
        <Route path="/creating_record/beneficiary" element={<CreatingBeneficiaryPage />}/>
        <Route path="/add_cita/:id" element={<AddCitaPage/>}/>
        <Route path="/edit_cita/:id" element={<EditCitaPage/>}/>
        <Route path="/add_citaodon/:id" element={<AddCitaodonPage/>}/>
        <Route path="/edit_citaodon/:id" element={<EditCitaodonPage/>}/>
        <Route path="/add_reposo/:affiliate_id" element={<AddReposoPage/>}/>
        <Route path="/edit_reposo/:reposoId" element={<EditReposoPage/>}/>
        <Route path="/add_cuido/:affiliate_id" element={<AddCuidoPage/>}/>
        <Route path="/edit_cuido/:cuidoId" element={<EditCuidoPage/>}/>
        <Route path="/login" element={<Navigate to='/' />}/>
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </main> 
    :
    <main className="app-container">
      <Routes>
        <Route path="/login" element={<LoginPage userToken={userToken} setUserToken={setUserToken} />}/>
        <Route path="*" element={<Navigate to='/login' />}/>
      </Routes>
    </main> 
    
  );
}

export default App;
