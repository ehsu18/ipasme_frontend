import { getAffiliates } from "../tools/api";
import { useParams } from "react-router-dom";
import { ButtonBig } from "./Buttons";
import * as icons from "./Icons";

export function RecordDetailsPage({}) {
  let { id } = useParams();
  console.log(id);
  if (id == undefined) {
    return <>No hay id</>;
  }

  // recibir la informacion del usuario

  
  return (
    <main className="main-container">
      <header className="content-header">
        <p className="title-big">Detalle de Historia M&eacute;dica</p>

        <div className="flex-h gap24">
          <ButtonBig
            type="main"
            text="Exportar a excel"
            icon={icons.DocumentEdit}
          />
          <ButtonBig
            type="main"
            text="Imprimir datos"
            icon={icons.DocumentEdit}
          />
        </div>
      </header>
      <h1>{id}</h1>
    </main>
  );
}
