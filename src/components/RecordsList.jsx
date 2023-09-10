import { ButtonBig, ButtonSmall, PersonTypeTag, DualSelector } from "./Buttons";
import * as icons from "./Icons";
import { useState, useEffect } from "react";
import * as api from "../tools/api";
import { calcAge } from "../tools/utilities";

// TODO estilo del componente "cargando"
// TODO el cuadrito de seleccion debe conservar su tama;o
// TODO para ordenar/filtrar los elementos se debe hacer directamente en recordsList

export function ViewRecordsPage() {
  // este componente deberia ser una pagina y aparte deberia haber un componente especifico para la lista nada mas
  // ahora mismo se comporta como pagina a pesar de que fue diseñado como componente individual

  // TODO se deberia poder deseleccionar usando la tecla esc

  let [selectedItem, setSelectedItem] = useState(-1);
  let [recordsList, setRecords] = useState([]);
  let [selectedListMode, setSelectedListMode] = useState('todos');

  // TODO se debe hacer el useeffect para que se traiga la configuracion del selector desde la base de datos
  // TODO manejar errores de conexion, de lista vacia, etc


  useEffect(() => {
    api.getRecords()
      .then((response) => response.json())
      .then((data) => {setRecords(data)
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <main className="main-container">
      <header className="content-header">
        <p className="title-big">Historias M&eacute;dicas</p>

        <div className="flex-h gap24">
          <ButtonBig
            type="main"
            text="Añadir historia"
            icon={icons.DocumentEdit}
            action={()=>{
              window.location.href = '/newrecord';
            }}
          />
          <DualSelector
            left="todos"
            right="affiliates"
            selected={selectedListMode}
            setSelected={setSelectedListMode}
          />
        </div>
      </header>

      <div className="flex-h gap-auto recordslist-options">
        <ButtonBig type="secondary" text="Buscar" icon={icons.Search} />

        <div className="flex-h gap12">
          <ButtonBig type="secondary" text="Filtrar" icon={icons.Filters1} />
          <ButtonBig type="secondary" text="Ordenar" icon={icons.Filters2} />
          <ButtonBig
            type="secondary"
            text="M&aacute;s"
            icon={icons.MenuVertical}
          />
        </div>
      </div>

      <div className="recordslist-container flex-h">
        <RecordsList
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          recordsList={recordsList}
          selectedListMode={selectedListMode}
        />

        <RelationWidget selectedItem={selectedItem} recordsList={recordsList} />
      </div>
    </main>
  );
}

export function RecordsList({ selectedItem, setSelectedItem, recordsList, selectedListMode }) {
  console.log("cargando RecordsList\n", "recodsList: ", recordsList);

  return (
    <div className="common-container recordslist">
      <div className="columns">
        <div className="selection-box"></div>
        <span className="micro-italic">Número de cédula</span>
        <span className="micro-italic">Nombre</span>
        <span className="micro-italic">Edad</span>
        {/* <span className="micro-italic">Sexo</span> */}
        <span className="micro-italic">Tipo</span>
        <span className="micro-italic">Ver</span>
      </div>

      {Array.isArray(recordsList) && recordsList.length > 0 ? (
        recordsList.map((r, index) => {
          if(selectedListMode==='affiliates' && r.type!=='affiliate'){
            return
          }

          try {
            return (
              <RecordsListItem
                key={index}
                id={index}
                selected={selectedItem}
                setSelected={setSelectedItem}
                recordData={r}
              />
            );
          } catch {
            return (
              <div className="recordslist-item">
                <span>
                  Error cargando esta historia:
                  {r["id"] + " " + r["basic_info"]["names"]}
                </span>
              </div>
            );
          }
        })
      ) : (
        <h3>Lista vacía</h3>
      )}
    </div>
  );
}

export function RecordsListItem({ id, selected, setSelected, recordData }) {
  // let [selected, setSelected] = useState(false);
  // console.log(recordData)

  

  try {
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
        <span className="identification-text title-regular">
          {(recordData["basic_info"]["nationality"]
            ? recordData["basic_info"]["nationality"] + "-"
            : "") +
            (recordData["basic_info"]["document"]
              ? recordData["basic_info"]["document"]
              : "")}
        </span>
        <span className="name-text paragraph-regular">
          {(recordData["basic_info"]["names"]
            ? recordData["basic_info"]["names"].trim()
            : "") +
            " " +
            (recordData["basic_info"]["lastnames"]
              ? recordData["basic_info"]["lastnames"].trim()
              : "")}
        </span>
        <span className="age-text paragraph-regular">
          {calcAge(recordData["basic_info"]["dateofbirth"])}
        </span>
        {/* <span className="sex-text paragraph-regular">Masculino</span> */}
        <div className="flex-h">
          {/* TODO debe resvisarse el tipo */}
          <PersonTypeTag type={recordData["type"]} />
        </div>
        <div>
          <ButtonSmall
            text="Abrir"
            action={() => {
              window.location.href = "/record_details/" + recordData["id"];
            }}
          />
          {/* <a href="">Abrir</a>   */}
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="recordslist-item">
        <span>
          Faltan datos de esta historia:
          {recordData["id"] + " " + recordData["basic_info"]["names"]}
        </span>
      </div>
    );
  }
}

export function RelationWidget({ selectedItem, recordsList }) {

  let [affiliates, setAffiliates] = useState([]);
  let [beneficiarys, setBeneficiarys] = useState([]);
  let [record, setRecord] = useState(null)

  useEffect(() => {

    setAffiliates([])
    setBeneficiarys([])
    if (recordsList[selectedItem] === undefined) {
      return;
    }
    setRecord(recordsList[selectedItem])
    api
      .getRecordAffiliates(recordsList[selectedItem]["id"])
      .then(response=>response.json())
      .then((json) => setAffiliates(json))
      .catch((error) => console.error(error));
    api
      .getRecordBeneficiarys(recordsList[selectedItem]["id"])
      .then(response=>response.json())
      .then((json) => setBeneficiarys(json))
      .catch((error) => console.error(error));
  }, [selectedItem, recordsList]);

  return selectedItem !== -1 ?
    (<aside className="relations-widget">
      <p className="title-regular">Afiliados de esta persona</p>
      {affiliates.length > 0 ? (
        affiliates.map((relation, index) => {
          return <RelationBeneficiaryCard key={index} relation={relation} record={record}/>;
        })
      ) : (
        <span style={{height:'74.45px'}} className="micro-italic">Esta persona no tiene afiliados</span>
      )}
      <p className="title-regular">Beneficiarios de esta persona</p>
      {beneficiarys.length > 0 ? (
        beneficiarys.map((relation, index) => {
          return <RelationAffiliateCard key={index} relation={relation} record={record}/>;
        })
      ) : (
        <span style={{height:'74.45px'}} className="micro-italic">Esta persona no tiene beneficiarios</span>
      )}
    </aside>
    ) :
    (<aside className="relations-widget">
        <p className="empty-message">
          Seleccione una historia<br/>para ver sus relaciones.
        </p>
      </aside>
    );
}
function RelationAffiliateCard({ relation, record}) {
  return (
    <div className="relation-card">
      <div
        style={
          relation['type'] === "beneficiary"? { backgroundColor: "var(--main-beneficiario)" }:
          relation['type'] === "affiliate"? { backgroundColor: "var(--main-afiliado)" } :
          { backgroundColor: "var(--medium" }
        }
      ></div>
      <div>
        <p className="title-small">
          {
            (relation["names"] ? relation["names"].trim() : '')
            + " " +
            (relation["lastnames"] ? relation["lastnames"].trim() : '')
          }
        </p>
        <p className="title-small">{
          (relation['nationality'] ? relation['nationality'] :'') +
          (relation["document"] ? relation["document"] : '')
        }</p>
        <p className="paragraph-micro">{
          (relation["names"] ? relation["names"] : '')
          + ' es ' +
          (relation["level_description"])
          + ' de ' + 
          (record['basic_info']["names"] ? record['basic_info']["names"] : '')
          }
        </p>
      </div>
      <div>{icons.MenuVertical("24px")}</div>
    </div>
  );
}
function RelationBeneficiaryCard({ relation, record}) {
  return (
    <div className="relation-card">

      <div
        style={
          relation['type'] === "beneficiary"? { backgroundColor: "var(--main-beneficiario)" }:
          relation['type'] === "affiliate"? { backgroundColor: "var(--main-afiliado)" } :
          { backgroundColor: "var(--medium" }
        }
      ></div>
      <div>
        <p className="title-small">
          {
            (relation["names"] ? relation["names"].trim() : '')
            + " " +
            (relation["lastnames"] ? relation["lastnames"].trim() : '')
          }
        </p>
        <p className="title-small">{
          (relation['nationality'] ? relation['nationality'] :'') +
          (relation["document"] ? relation["document"] : '')
        }</p>
        <p className="paragraph-micro">{
          (record['basic_info']["names"] ? record['basic_info']["names"].trim() : '')
          + ' es ' +
          (relation["level_description"])
          + ' de ' + 
          (relation["names"] ? relation["names"] : '')
          }
        </p>
      </div>
      <div>{icons.MenuVertical("24px")}</div>
    </div>
  );
}
