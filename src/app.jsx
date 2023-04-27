import NavBar from "./components/NavBar";
import { HomePage } from "./components/HomePage";
import { ViewRecordsPage } from "./components/RecordsList";
import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/app.css";
import "./styles/records-list.css";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <main className="app-container">
      <NavBar /> {/* tiene que estar aqui para que se repita en todos las demas paginas aunque hay que ver bien eso */}
      <Routes>
        <Route path="/viewrecords" element={<ViewRecordsPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </main>
  );
}

export default App;
