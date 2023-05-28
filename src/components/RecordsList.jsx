import { ButtonBig, ButtonSmall, PersonTypeTag } from "./Buttons";
import * as icons from "./Icons";
import { useState, useEffect } from "react";
import * as api from '../tools/api';

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
        <RecordsList/>
        <RelationWidget />
      </div>
    </main>
  );
}

export function RecordsList() {
  let [selectedItem, setSelectedItem] = useState(-1);
  let [recordsList, setRecords] = useState([])


  useEffect(() => {
    api.getAffiliates()
    .then(data=>setRecords(data))
    .catch(error=>console.log(error))

  }, []);


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

      {recordsList ? recordsList.map((r, index)=>{
        console.log(r)
        return <RecordsListItem
          key={index} id={index}
          selected={selectedItem}
          setSelected={setSelectedItem}
          recordData={r}
        />
      }) : <h1>Error</h1> }

     
    </div>
  );
}

export function RecordsListItem({ id, selected, setSelected, recordData }) {
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
      <span className="identification-text title-regular">{'V-'+recordData['document']}</span>
      <span className="name-text paragraph-regular">
        {recordData['name'].trim() + ' ' + recordData['lastname'].trim()}
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
