import { getRecords } from "../tools/api";
import { useParams } from "react-router-dom";
import { ButtonBig, PersonTypeTag } from "./Buttons";
import * as icons from "./Icons";
import { useEffect, useState } from "react";

export function RecordDetailsPage() {
  let { id } = useParams();
  let [recordBasic, setRecordBasic] = useState({});

  let [basicEditStatus, setBasicEditStatus] = useState(false);
  let [contactEditStatus, setContactEditStatus] = useState(false);
  let [jobEditStatus, setJobEditStatus] = useState(false);

  useEffect(() => {
    getRecords(id)
      .then((response) => response.json())
      .then((json) => {
        setRecordBasic(json);
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

          <RecordDetailsSection
            title="Datos personales"
            lastModified={recordBasic["personal-date-modified"] || "indefinido"}
            editStatus={basicEditStatus}
            setEditStatus={setBasicEditStatus}
          >
            <RecordDetailsDataContainer
              label="Cedula"
              name="document"
              data={recordBasic}
              setData={setRecordBasic}
              sectionEditingStatus={basicEditStatus}
            />
            <RecordDetailsDataContainer
              label="Nacionalidad"
              name="nationality"
              data={recordBasic}
              setData={setRecordBasic}
              sectionEditingStatus={basicEditStatus}
            />
            <RecordDetailsDataContainer
              label="Nombres"
              name="name"
              data={recordBasic}
              setData={setRecordBasic}
              sectionEditingStatus={basicEditStatus}
            />
            <RecordDetailsDataContainer
              label="Apellidos"
              name="lastname"
              data={recordBasic}
              setData={setRecordBasic}
              sectionEditingStatus={basicEditStatus}
            />
            <RecordDetailsDataContainer
              label="Fecha de nacimiento"
              name="dateofbirth"
              data={recordBasic}
              setData={setRecordBasic}
              sectionEditingStatus={basicEditStatus}
            />
            <RecordDetailsDataContainer
              label="Estado civil"
              name="civilstatus"
              data={recordBasic}
              setData={setRecordBasic}
              sectionEditingStatus={basicEditStatus}
            />
            <RecordDetailsDataContainer
              label="Lugar de nacimiento"
              name="placeofbirth"
              data={recordBasic}
              setData={setRecordBasic}
              sectionEditingStatus={basicEditStatus}
            />
            <RecordDetailsDataContainer
              label="Sexo"
              name="sex"
              data={recordBasic}
              setData={setRecordBasic}
              sectionEditingStatus={basicEditStatus}
            />
          </RecordDetailsSection>

          <RecordDetailsSection
            title="Datos de contacto"
            lastModified={recordBasic["contact-date"] || "indefinido"}
            setEditStatus={setContactEditStatus}
            editStatus={contactEditStatus}
          >
            <RecordDetailsDataContainer
              label="Telefono personal"
              name="personalphone"
              data={recordBasic}
              setData={setRecordBasic}
              sectionEditingStatus={contactEditStatus}
            />
            <RecordDetailsDataContainer
              label="Telefono opcional"
              name="optionalphone"
              data={recordBasic}
              setData={setRecordBasic}
              sectionEditingStatus={contactEditStatus}
            />
            <RecordDetailsDataContainer
              label="Direccion de habitacion"
              name="direction"
              data={recordBasic}
              setData={setRecordBasic}
              sectionEditingStatus={contactEditStatus}
              doubleColumn
            />
          </RecordDetailsSection>

          {recordBasic["type"] === "affiliate" ? (
            <RecordDetailsSection
              title="Datos laborales"
              lastModified={recordBasic["job-date"] || "indefinido"}
              editStatus={jobEditStatus}
              setEditStatus={setJobEditStatus}
            >
              <RecordDetailsDataContainer
                label="Estado laboral"
                name="jobstatus"
                data={recordBasic}
                setData={setRecordBasic}
                sectionEditingStatus={jobEditStatus}
              />
              <RecordDetailsDataContainer
                label="Cargo"
                name="jobtitle"
                data={recordBasic}
                setData={setRecordBasic}
                sectionEditingStatus={jobEditStatus}
              />
              <RecordDetailsDataContainer
                label="Direccion del plantel"
                name="jobdirection"
                data={recordBasic}
                setData={setRecordBasic}
                sectionEditingStatus={jobEditStatus}
                doubleColumn
              />
            </RecordDetailsSection>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function RecordDetailsSection({
  title,
  children,
  lastModified,
  editStatus,
  setEditStatus,
}) {
  return (
    <section
      className="recorddetails-section"
      style={
        editStatus
          ? {
              border: "solid 1px var(--main-color)",
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
          {editStatus
            ? "Realice los cambios necesarios y luego haga click en guardar"
            : "Actualizados por ultima vez el: " + lastModified}
        </span>
        <ButtonBig
          text={editStatus ? "Guardar" : "Editar"}
          icon={icons.DocumentEdit}
          type={editStatus ? "main" : "secondary"}
          action={(e) => {
            // qui action deberia cambiar si esta editando o no
            setEditStatus(!editStatus);
          }}
        />
      </div>
    </section>
  );
}

function RecordDetailsDataContainer({
  label,
  data,
  setData,
  name,
  doubleColumn,
  sectionEditingStatus,
}) {
  // let [state, setState] = useState();

  // readonly, active, blocked, selected ... soon -> hover, error, warning
  return (
    <div
      className="recorddetails-section-datacontainer"
      style={doubleColumn ? { gridColumn: "span 2" } : {}}
    >
      <span className="micro-italic">{label}</span>
      <input
        readOnly={!sectionEditingStatus}
        className={
          "paragraph-regular " +
          (sectionEditingStatus ? "entry-1-active " : "entry-1-readonly")
        }
        type={label}
        name={name}
        value={data[name] || "indefinido"}
        
        onChange={(e) =>
          setData({
            ...data,
            [name]: e.target.value,
          })
        }
        
      />
    </div>
  );
}
