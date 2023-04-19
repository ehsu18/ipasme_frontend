import { Button1, Button2, PersonTypeTag } from "./Buttons";
import * as icons from "./Icons";

function repeatComponent(n, component) {
  let list = [];
  for (let i = 0; i < n; i++) {
    list.push(component({ key: i }));
  }
  return list;
}

export function RecordsList() {
  return (
    <main className="main-container">
      <header className="content-header">
        <p className="title-big">Historias M&eacute;dicas</p>

        <div className="flex-h gap24">
          <Button1 text="Añadir historia" icon={icons.DocumentEdit} />
          <Button1 text="Añadir historia" icon={icons.DocumentEdit} />
        </div>
      </header>

      <div className="flex-h gap-auto recordslist-options">
        <Button1 text="Buscar" icon={icons.Search} />

        <div className="flex-h gap12">
          <Button1 text="Filtrar" icon={icons.Filters1} />
          <Button1 text="Ordenar" icon={icons.Filters2} />
          <Button1 text="M&aacute;s" icon={icons.MenuVertical} />
        </div>
      </div>

      <div className="recordslist-container flex-h">
        <div className="recordslist">
          <div className="columns">
            <div className="selection-box"></div>
            <span className="micro-italic">Número de cédula</span>
            <span className="micro-italic">Nombre</span>
            <span className="micro-italic">Edad</span>
            {/* <span className="micro-italic">Sexo</span> */}
            <span className="micro-italic">Tipo</span>
            <span className="micro-italic">Ver</span>
          </div>
          {repeatComponent(30, RecordsListItem)}
        </div>
        <RelationWidgets />
      </div>
    </main>
  );
}

function RecordsListItem() {
  return (
    <div className="recordslist-item">
      <div className="selection-box"></div>
      <span className="identification-text title-regular">V-29730724</span>
      <span className="name-text paragraph-regular">
        Elian Enrique Sumalave Urbina
      </span>
      <span className="age-text paragraph-regular">21 a&ntilde;os</span>
      {/* <span className="sex-text paragraph-regular">Masculino</span> */}
      <div className="flex-h">
        <PersonTypeTag type="afiliado" />
      </div>
      <div>
        <Button2 text="Abrir"/>
        {/* <a href="">Abrir</a>   */}
      </div>
    </div>
  );
}

function RelationWidgets({ record = 0 }) {
  return (
    <aside className="relations-widget">
      <p className="title-regular">Beneficiarios de esta persona</p>
      <RelationCard />
      <p className="title-regular">Afiliados de esta persona</p>
      <RelationCard />
    </aside>
  );
}

function RelationCard({ relation = {} }) {
  return (
    <div className="relation-card">
      <div style={{backgroundColor: 'var(--main-beneficiario)'}}></div>
      <div>
        <p className="title-small">Lorem Ipsum Dolor Sit Amet</p>
        <p className="title-small">V-29.730.724</p>
        <p className="paragraph-micro">
          Lorem Ipsum Dolor Sit Amet es hija/hijo de Elian Enrique Sumalave
          Urbina.
        </p>
      </div>
      <div>{icons.MenuVertical("24px")}</div>
    </div>
  );
}
