import { ButtonBig } from "./Buttons";
import * as icons from './Icons';

export function RecordDetailPage() {
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
    </main>
  );
}
