import NavBar from "./components/NavBar";
import { RecordsList } from "./components/RecordsList";
import "./styles/global.css";
import "./styles/navbar.css"
import "./styles/app.css"
import "./styles/records-list.css"


function App(){
 return (<main className="app-container">
    <NavBar />
    <RecordsList/>
  </main>)   
}

export default App;