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
import {
  Routes,
  Route,
  Switch,
} from "react-router-dom";
import { AddCitaPage, EditCitaPage} from './components/CitaPage';
import { CreatingAffiliatePage, CreatingBeneficiaryPage } from "./components/CreatingRecordPage";
import { RecordDetailsPage } from "./components/RecordDetailsPage";
// TODO revisar si es mejor importar los css asi o en sus respectivas paginas

function App() {
  return (
    <main className="app-container">
      <NavBar /> {/* tiene que estar aqui para que se repita en todos las demas paginas aunque hay que ver bien eso */}
      <Routes>
        <Route path="/viewrecords" element={<ViewRecordsPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/record_details/:id" element={<RecordDetailsPage />} />
        <Route path="/newrecord" element={<NewRecordPage />}/>
        <Route path="/creating_record/affiliate" element={<CreatingAffiliatePage  />}/>
        <Route path="/creating_record/beneficiary" element={<CreatingBeneficiaryPage />}/>
        <Route path="/add_cita/:id" element={<AddCitaPage/>}/>
        <Route path="/edit_cita/:id" element={<EditCitaPage/>}/>
      </Routes>
    </main>
  );
}

export default App;
