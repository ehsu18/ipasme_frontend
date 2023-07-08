import { getRecords } from "../tools/api";
import { useParams } from "react-router-dom";
import { ButtonBig, PersonTypeTag } from "./Buttons";
import * as icons from "./Icons";
import { useEffect, useState } from "react";

export function RecordDetailsPage() {
  let { id } = useParams();
  const [ recordBasic, configRecordBasic ] = useState({});

  useEffect(()=>{getRecords(id)
    .then((response) => response.json())
    .then((json) => {
      configRecordBasic(json);
    })
    .catch((error) => {
      throw new Error(error);
    })
  }, [id])

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
            type="secondary"
            text="Imprimir datos"
            icon={icons.DocumentEdit}
          />
        </div>
      </header>
      <div className="recorddetails-container">
        <div className="recorddetails common-container flex-v">
          
          <header className="recorddetails-header flex-h">

            <section className="left flex-h">
              <div style={ recordBasic['type']==='beneficiary' ?
                { backgroundColor: "var(--main-beneficiario)" } :
                { backgroundColor: "var(--main-afiliado)" }}
                className="accent"></div>

              <div className="felx-v">
                <div className="title flex-h">
                  <span className="title-big">{recordBasic.name + ' ' + recordBasic.lastname}</span>
                  <PersonTypeTag type={recordBasic['type']} />
                </div>
                <span className="title-regular">{recordBasic.document}</span>
              </div>

            </section>

            <section className="right flex-v">
              <div className=" flex-h" style={{gap: "8px"}}>
                <span className="title-regular">Ubicaci&oacute;n de la carpeta</span>
                {icons.Edit4(20)}
              </div>
              <p>Este texto es solo de ejemplo y no deberia verse</p>
              {/* TODO hacer esto funcional */}
            </section>
          </header>
          <nav className="flex-h recorddetails-nav">
            <div className="title-small recorddetails-tab recorddetails-tab-selected"><span>Datos personales</span></div>
            <div className="title-small recorddetails-tab"><span>Datos m&eacute;dicos</span></div>
            <div className="title-small recorddetails-tab"><span>Datos odontol&oacute;gicos</span></div>
            <div className="title-small recorddetails-tab"><span>Reposos y cuidos</span></div>
            <div className="title-small recorddetails-tab"><span>Opciones</span></div>
          </nav>

          <section className="recorddetails-section">
            <header className="felx-h">
              {icons.User1(24)}
              <span className="title-regular">Datos personales</span>
            </header>
            <div className="recorddetails-section-datacontainer">
              <span className="micro-italic">C&eacute;dula</span>
              <input className="entry-1-disabled paragraph-regular" type="text" value={"29.730.724"}/>
            </div>
            <div className="recorddetails-section-datacontainer">
              <span className="micro-italic">C&eacute;dula</span>
              <input className="entry-1-selected paragraph-regular" type="text" value={"29.730.724"}/>
            </div>
            <div className="recorddetails-section-datacontainer">
              <span className="micro-italic">C&eacute;dula</span>
              <input className="entry-1-blocked paragraph-regular" type="text" value={"29.730.724"}/>
            </div>
            <div className="recorddetails-section-datacontainer">
              <span className="micro-italic">C&eacute;dula</span>
              <input className="entry-1-active paragraph-regular" type="text" value={"29.730.724"}/>
            </div>
            <div className="flex-h recorddetails-section-info">
              <span className="micro-italic">Realice los cambios necesarios y luego haga click en guardar</span>
              <ButtonBig text="Editar" icon={icons.DocumentEdit} type='main' />
          </div>
          </section>
          <section className="recorddetails-section">
            <header className="felx-h">
              {icons.User1(24)}
              <span className="title-regular">Datos personales</span>
            </header>
            <div className="recorddetails-section-datacontainer">
              <span className="micro-italic">C&eacute;dula</span>
              <input className="entry-1-disabled paragraph-regular" type="text" value={"29.730.724"}/>
            </div>
            <div className="recorddetails-section-datacontainer">
              <span className="micro-italic">C&eacute;dula</span>
              <input className="entry-1-selected paragraph-regular" type="text" value={"29.730.724"}/>
            </div>
            <div className="recorddetails-section-datacontainer">
              <span className="micro-italic">C&eacute;dula</span>
              <input className="entry-1-blocked paragraph-regular" type="text" value={"29.730.724"}/>
            </div>
            <div className="recorddetails-section-datacontainer">
              <span className="micro-italic">C&eacute;dula</span>
              <input className="entry-1-active paragraph-regular" type="text" value={"29.730.724"}/>
            </div>

          </section>
          <section className="recorddetails-section">
            <header className="felx-h">
              {icons.User1(24)}
              <span className="title-regular">Datos personales</span>
            </header>
            <div className="recorddetails-section-datacontainer">
              <span className="micro-italic">C&eacute;dula</span>
              <input className="entry-1-disabled paragraph-regular" type="text" value={"29.730.724"}/>
            </div>
            <div className="recorddetails-section-datacontainer">
              <span className="micro-italic">C&eacute;dula</span>
              <input className="entry-1-selected paragraph-regular" type="text" value={"29.730.724"}/>
            </div>
            <div className="recorddetails-section-datacontainer">
              <span className="micro-italic">C&eacute;dula</span>
              <input className="entry-1-blocked paragraph-regular" type="text" value={"29.730.724"}/>
            </div>
            <div className="recorddetails-section-datacontainer">
              <span className="micro-italic">C&eacute;dula</span>
              <input className="entry-1-active paragraph-regular" type="text" value={"29.730.724"}/>
            </div>

          </section>
          <section className="recorddetails-section">
            <header className="felx-h">
              {icons.User1(24)}
              <span className="title-regular">Datos personales</span>
            </header>
            <div className="recorddetails-section-datacontainer">
              <span className="micro-italic">C&eacute;dula</span>
              <input className="entry-1-disabled paragraph-regular" type="text" value={"29.730.724"}/>
            </div>
            <div className="recorddetails-section-datacontainer">
              <span className="micro-italic">C&eacute;dula</span>
              <input className="entry-1-selected paragraph-regular" type="text" value={"29.730.724"}/>
            </div>
            <div className="recorddetails-section-datacontainer">
              <span className="micro-italic">C&eacute;dula</span>
              <input className="entry-1-blocked paragraph-regular" type="text" value={"29.730.724"}/>
            </div>
            <div className="recorddetails-section-datacontainer">
              <span className="micro-italic">C&eacute;dula</span>
              <input className="entry-1-active paragraph-regular" type="text" value={"29.730.724"}/>
            </div>

          </section>

          

        </div>
        
      </div>
    </main>
  );
}
