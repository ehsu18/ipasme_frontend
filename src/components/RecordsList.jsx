import { ButtonBig, ButtonSmall, PersonTypeTag, DualSelector } from "./Buttons";
import * as icons from "./Icons";
import { useState, useEffect } from "react";
import * as api from '../tools/api';

export function ViewRecordsPage() {
  // este componente deberia ser una pagina y aparte deberia haber un componente especifico para la lista nada mas
  // ahora mismo se comporta como pagina a pesar de que fue diseñado como componente individual
  
  // TODO se deberia poder deseleccionar usando la tecla esc

  let [selectedItem, setSelectedItem] = useState(-1);
  let [recordsList, setRecords] = useState([])
  let [selectedListMode, setSelectedListMode] = useState('Todos')

  // TODO se debe hacer el useeffect para que se traiga la configuracion del selector desde la base de datos

  useEffect(() => {
    api.getAffiliates()
    .then(data=>setRecords(data))
    .catch(error=>console.log(error))
  }, []);
  
  return (
    <main className="main-container">
      <header className="content-header">
        <p className="title-big">Historias M&eacute;dicas</p>

        <div className="flex-h gap24">
          <ButtonBig type="main" text="Añadir historia" icon={icons.DocumentEdit} />
          <DualSelector 
            left='Todos'
            right='Afiliados'
            selected = {selectedListMode}
            setSelected =  {setSelectedListMode}
          />   
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
        <RecordsList
        selectedItem = {selectedItem}
        setSelectedItem = {setSelectedItem}
        recordsList = {recordsList}
        />

        <RelationWidget 
        selectedItem = {selectedItem}
        recordsList = {recordsList}
        />
      </div>
    </main>
  );
}

export function RecordsList({selectedItem, setSelectedItem, recordsList}) {

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

export function RelationWidget({selectedItem, recordsList}) {

  let [affiliates, setAffiliates] = useState([])
  let [beneficiarys, setBeneficiarys] = useState([])

  useEffect(()=>{
    if (recordsList[selectedItem] === undefined) {
      return
    }

    api.getAffiliateAffiliates(recordsList[selectedItem]['id'])
    .then(data=>setAffiliates(data))
    .catch(error=>console.error(error))
  },[selectedItem, recordsList])

  useEffect(()=>{
    if (recordsList[selectedItem] === undefined) {
      return
    }

    api.getAffiliateBeneficiarys(recordsList[selectedItem]['id'])
    .then(data=>setBeneficiarys(data))
    .catch(error=>console.error(error))
  },[selectedItem, recordsList])

  if (selectedItem === -1){
    return (
      <aside className="relations-widget">
        <p className="empty-message">Seleccione una historia para ver sus relaciones.</p>
      </aside>
    )
  }
  return (
    <aside className="relations-widget">
      <p className="title-regular">Afiliados de esta persona</p>
      { affiliates.length > 0 ? affiliates.map((aff, index)=>{
        return <RelationCard 
          key={index}
          record={aff}
        />
      }) : <span>Esta persona no tiene afiliados</span> }
      <p className="title-regular">Beneficiarios de esta persona</p>
      { beneficiarys.length > 0 ? beneficiarys.map((aff, index)=>{
        return <RelationCard 
          key={index}
          record={aff}
        />
      }) : <span>Esta persona no tiene beneficiarios</span> }
    </aside>
  );
}

export function RelationCard({ record = {}}) {

  return (
    <div className="relation-card">
      {/* TODO hay que checar cuando falle el type ver que se hace porque sino se pone como affiliado */}

      <div style={ record['type']==='beneficiary' ?
                  { backgroundColor: "var(--main-beneficiario)" } :
                  { backgroundColor: "var(--main-afiliado)" }}></div>
      <div>
        <p className="title-small">{record['name'].trim() + ' ' + record['lastname'].trim()}</p>
        <p className="title-small">{'V-' + record['document']}</p>
        <p className="paragraph-micro">
          Lorem Ipsum Dolor Sit Amet es hija/hijo de Elian Enrique Sumalave
          Urbina.
          {/* esto lo deberia mandar la api */}
        </p>
      </div>
      <div>{icons.MenuVertical("24px")}</div>
    </div>
  );
}
