import { ButtonBig, ButtonSmall, PersonTypeTag } from "./Buttons";
import * as icons from "./Icons";
import { useState } from "react";

// function repeatComponent(n, component) {
//   let list = [];
//   for (let i = 0; i < n; i++) {
//     list.push(component({ key: i }));
//   }
//   return list;
// }

export function ViewRecordsPage() {
  // este componente deberia ser una pagina y aparte deberia haber un componente especifico para la lista nada mas
  // ahora mismo se comporta como pagina a pesar de que fue diseñado como componente individual

  

  return (
    <main className="main-container">
      <header className="content-header">
        <p className="title-big">Historias M&eacute;dicas</p>

        <div className="flex-h gap24">
          <ButtonBig type="main" text="Añadir historia" icon={icons.DocumentEdit} />
          <ButtonBig type="secondary" text="Selector" icon={icons.DocumentEdit} />
        </div>
      </header>

      <div className="flex-h gap-auto recordslist-options">
        <ButtonBig  type="secondary"  text="Buscar" icon={icons.Search} />

        <div className="flex-h gap12">
          <ButtonBig type="secondary" text="Filtrar" icon={icons.Filters1} />
          <ButtonBig  type="secondary" text="Ordenar" icon={icons.Filters2} />
          <ButtonBig  type="secondary" text="M&aacute;s" icon={icons.MenuVertical} />
        </div>
      </div>

      <div className="recordslist-container flex-h">
        {/* asi como esta relationwitget deberia haber un recordslist abajo */}
        <RecordsList/>
        <RelationWidget />
      </div>
    </main>
  );
}

export function RecordsList() {
  let [selected, setSelected] = useState(-1);
  return (
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
      <RecordsListItem
        key={1}
        id={1}
        selected={selected}
        setSelected={setSelected}
      />
      <RecordsListItem
        key={2}
        id={2}
        selected={selected}
        setSelected={setSelected}
      />

      {/* {repeatComponent(30, RecordsListItem)} */}
    </div>
  );
}

export function RecordsListItem({ id, selected, setSelected }) {
  // let [selected, setSelected] = useState(false);

  return (
    <div
      className={
        selected === id ? "recordslist-item selected" : "recordslist-item"
      }
      onClick={() => {
        setSelected(id);
      }}
    >
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
        <ButtonSmall text="Abrir" />
        {/* <a href="">Abrir</a>   */}
      </div>
    </div>
  );
}

export function RelationWidget({ record = 0 }) {
  return (
    <aside className="relations-widget">
      <p className="title-regular">Beneficiarios de esta persona</p>
      <RelationCard />
      <p className="title-regular">Afiliados de esta persona</p>
      <RelationCard />
    </aside>
  );
}

export function RelationCard({ relation = {} }) {
  return (
    <div className="relation-card">
      <div style={{ backgroundColor: "var(--main-beneficiario)" }}></div>
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
