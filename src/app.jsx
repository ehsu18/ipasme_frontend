import NavBar from "./components/NavBar";
import { HomePage } from "./components/HomePage";
import { RecordDetailPage } from "./components/RecordDetailPage";
import { ViewRecordsPage } from "./components/RecordsList";
import { NewRecordPage } from "./components/NewRecordPage";
import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/app.css";
import "./styles/records-list.css";
import "./styles/NewRecordPage.css"
import { Routes, Route } from "react-router-dom";
import { CreatingRecordPage } from "./components/CreatingRecordPage";
// TODO revisar si es mejor importar los css asi o en sus respectivas paginas


function App() {
  return (
    <main className="app-container">
      <NavBar /> {/* tiene que estar aqui para que se repita en todos las demas paginas aunque hay que ver bien eso */}
      <Routes>
        <Route path="/viewrecords" element={<ViewRecordsPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/record_details" element={<RecordDetailPage />} />
        <Route path="/newrecord" element={<NewRecordPage />}/>
        <Route path="/creating_record" element={<CreatingRecordPage />}/>
      </Routes>
    </main>
  );
}

export default App;
