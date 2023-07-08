import { getRecords } from "../tools/api";
import { useParams } from "react-router-dom";
import { ButtonBig, PersonTypeTag } from "./Buttons";
import * as icons from "./Icons";
import { useEffect, useState } from "react";

export function RecordDetailsPage() {
  let { id } = useParams();
  const [recordBasic, configRecordBasic] = useState({});

  useEffect(() => {
    getRecords(id)
      .then((response) => response.json())
      .then((json) => {
        configRecordBasic(json);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [id]);

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
      {/* TODO revisar si no era content-container */}
      <div className="recorddetails-container">
        <div className="recorddetails common-container flex-v">
          <header className="recorddetails-header flex-h">
            <section className="left flex-h">
              <div
                style={
                  recordBasic["type"] === "beneficiary"
                    ? { backgroundColor: "var(--main-beneficiario)" }
                    : { backgroundColor: "var(--main-afiliado)" }
                }
                className="accent"
              ></div>

              <div className="felx-v">
                <div className="title flex-h">
                  <span className="title-big">
                    {recordBasic.name + " " + recordBasic.lastname}
                  </span>
                  <PersonTypeTag type={recordBasic["type"]} />
                </div>
                <span className="title-regular">{recordBasic.document}</span>
              </div>
            </section>

            <section className="right flex-v">
              <div className=" flex-h" style={{ gap: "8px" }}>
                <span className="title-regular">
                  Ubicaci&oacute;n de la carpeta
                </span>
                {icons.Edit4(20)}
              </div>
              <p>Este texto es solo de ejemplo y no deberia verse</p>
              {/* TODO hacer esto funcional */}
            </section>
          </header>
          <nav className="flex-h recorddetails-nav">
            <div className="title-small recorddetails-tab recorddetails-tab-selected">
              <span>Datos personales</span>
            </div>
            <div className="title-small recorddetails-tab">
              <span>Datos m&eacute;dicos</span>
            </div>
            <div className="title-small recorddetails-tab">
              <span>Datos odontol&oacute;gicos</span>
            </div>
            <div className="title-small recorddetails-tab">
              <span>Reposos y cuidos</span>
            </div>
            <div className="title-small recorddetails-tab">
              <span>Opciones</span>
            </div>
          </nav>

          <RecordDetailsSection title="Datos personales" lastModified={recordBasic['personal-date-modified'] || 'indefinido'}>
            <RecordDetailsDataContainer
              label="Cedula"
              name="document"
              data={recordBasic["document"] || "indefinido"}
            />
            <RecordDetailsDataContainer
              label="Nacionalidad"
              name="nationality"
              data={recordBasic["nationality"] || "indefinido"}
            />
            <RecordDetailsDataContainer
              label="Nombres"
              name="name"
              data={recordBasic["name"] || "indefinido"}
            />
            <RecordDetailsDataContainer
              label="Apellidos"
              name="lastname"
              data={recordBasic["lastname"] || "indefinido"}
            />
            <RecordDetailsDataContainer
              label="Fecha de nacimiento"
              name="dateofbirth"
              data={recordBasic["dateofbirth"] || "indefinido"}
            />
            <RecordDetailsDataContainer
              label="Estado civil"
              name="civilstatus"
              data={recordBasic["civilstatus"] || "indefinido"}
            />
            <RecordDetailsDataContainer
              label="Lugar de nacimiento"
              name="placeofbirth"
              data={recordBasic["placeofbirth"] || "indefinido"}
            />
            <RecordDetailsDataContainer
              label="Sexo"
              name="sex"
              data={recordBasic["sex"] || "indefinido"}
            />
          </RecordDetailsSection>
          
          <RecordDetailsSection title="Datos de contacto" lastModified={recordBasic['contact-date-modified'] || 'indefinido'}>
            <RecordDetailsDataContainer
              label="Telefono personal"
              name="personalphone"
              data={recordBasic["personalphone"] || "indefinido"}
            />
            <RecordDetailsDataContainer
              label="Telefono opcional"
              name="optionalphone"
              data={recordBasic["optionalphone"] || "indefinido"}
            />
            <RecordDetailsDataContainer
              label="Direccion de habitacion"
              name="direction"
              data={recordBasic["direction"] || "indefinido"}
              doubleColumn
            />
          </RecordDetailsSection>
          
          {recordBasic["type"] == "affiliate" ? (
            <RecordDetailsSection title="Datos laborales" lastModified={recordBasic['job-date-modified'] || 'indefinido'}>
              <RecordDetailsDataContainer
                label="Estado laboral"
                name="jobstatus"
                data={recordBasic["jobstatus"] || "indefinido"}
              />
              <RecordDetailsDataContainer
                label="Cargo"
                name="jobtitle"
                data={recordBasic["jobtitle"] || "indefinido"}
              />
              <RecordDetailsDataContainer
                label="Direccion del plantel"
                name="jobdirection"
                data={recordBasic["jobdirection"] || "indefinido"}
                doubleColumn
              />
            </RecordDetailsSection>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function RecordDetailsSection({ title, children, lastModified}) {
  let [editingStatus, setEditingStatus] = useState(false);
  return (
    <section
      className="recorddetails-section"
      style={
        editingStatus
          ? {
              border: "solid 1px var(--main-color)",
              background: "var(--back-selected)"
            }
          : {}
      }
    >
      <header className="felx-h">
        {icons.User1(24)}
        <span className="title-regular">{title}</span>
      </header>

      {children}

      <div className="flex-h recorddetails-section-info">
        <span className="micro-italic">
          {editingStatus ? 
          "Realice los cambios necesarios y luego haga click en guardar" :
          "Actualizados por ultima vez el: " + lastModified}
        </span>
        <ButtonBig
          text={editingStatus ? "Guardar" : "Editar"}
          icon={icons.DocumentEdit}
          type={editingStatus ? "main" : "secondary"}
          action={(e) => {
            // qui action deberia cambiar si esta editando o no
            setEditingStatus(!editingStatus);
          }}
        />
      </div>
    </section>
  );
}

function RecordDetailsDataContainer({ label, data, name, doubleColumn }) {
  // let [state, setState] = useState();

  // readonly, active, blocked, selected ... soon -> hover, error, warning
  return (
    <div
      className="recorddetails-section-datacontainer"
      style={doubleColumn ? { gridColumn: "span 2" } : {}}
    >
      <span className="micro-italic">{label}</span>
      <input
        className={"entry-1-" + "readonly" + " paragraph-regular"}
        type={label}
        name={name}
        value={data}
      />
    </div>
  );
}
