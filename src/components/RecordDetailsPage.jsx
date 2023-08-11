import { getRecords, putAffiliate } from "../tools/api";
import { useParams } from "react-router-dom";
import { ButtonBig, PersonTypeTag } from "./Buttons";
import * as icons from "./Icons";
import { useEffect, useState } from "react";
import { today } from "../tools/utilities";

export function RecordDetailsPage() {
  let { id } = useParams();
  let [recordBasic, setRecordBasic] = useState({});
  let [originalData, setOriginalData] = useState({});
  let [basicEditStatus, setBasicEditStatus] = useState(false);
  let [contactEditStatus, setContactEditStatus] = useState(false);
  let [jobEditStatus, setJobEditStatus] = useState(false);

  useEffect(() => {
    getRecords(id)
      .then((response) => response.json())
      .then((json) => {
        setRecordBasic(json);
        setOriginalData(json);
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
      <div className="recorddetails-container scroll">
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
                    {recordBasic.names + " " + recordBasic.lastnames}
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
            lastModifiedName={"personaldata_last_mod_date"}
            editStatus={basicEditStatus}
            setEditStatus={setBasicEditStatus}
            data={recordBasic}
            originalData={originalData}
            setOriginalData={setOriginalData}
          >
            <RecordDetailsDataContainer
              label="Cedula"
              name="document"
              data={recordBasic}
              setData={setRecordBasic}
              sectionEditingStatus={basicEditStatus}
            />
            <RecordDetailsOptionsContainer
              label="Nacionalidad"
              name="nationality"
              data={recordBasic}
              setData={setRecordBasic}
              options={["V", "E"]}
              sectionEditingStatus={basicEditStatus}
            />
            <RecordDetailsDataContainer
              label="Nombres"
              name="names"
              data={recordBasic}
              setData={setRecordBasic}
              sectionEditingStatus={basicEditStatus}
            />
            <RecordDetailsDataContainer
              label="Apellidos"
              name="lastnames"
              data={recordBasic}
              setData={setRecordBasic}
              sectionEditingStatus={basicEditStatus}
            />
            <RecordDetailsFechaContainer
              label="Fecha de nacimiento"
              name="dateofbirth"
              data={recordBasic}
              setData={setRecordBasic}
              sectionEditingStatus={basicEditStatus}
            />
            <RecordDetailsOptionsContainer
              label="Estado civil"
              name="civilstatus"
              options={["Soltero", "Casado", "Viudo", "Divorciado"]}
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
            <RecordDetailsOptionsContainer
              label="Sexo"
              name="gender"
              data={recordBasic}
              options={["M", "F"]}
              setData={setRecordBasic}
              sectionEditingStatus={basicEditStatus}
            />
          </RecordDetailsSection>

          <RecordDetailsSection
            title="Datos de contacto"
            lastModifiedName={recordBasic["contact-date"] || "indefinido"}
            setEditStatus={setContactEditStatus}
            editStatus={contactEditStatus}
            data={recordBasic}
            originalData={originalData}
            setOriginalData={setOriginalData}
          >
            <RecordDetailsDataContainer
              label="Telefono personal"
              name="phone_personal"
              data={recordBasic}
              setData={setRecordBasic}
              sectionEditingStatus={contactEditStatus}
            />
            <RecordDetailsDataContainer
              label="Telefono opcional"
              name="phone_optional"
              data={recordBasic}
              setData={setRecordBasic}
              sectionEditingStatus={contactEditStatus}
            />
            <RecordDetailsDataContainer
              label="Direccion de habitacion"
              name="home_direction"
              data={recordBasic}
              setData={setRecordBasic}
              sectionEditingStatus={contactEditStatus}
              doubleColumn
            />
          </RecordDetailsSection>

          {recordBasic["type"] === "affiliate" ? (
            <RecordDetailsSection
              title="Datos laborales"
              lastModifiedName={recordBasic["job-date"] || "indefinido"}
              editStatus={jobEditStatus}
              setEditStatus={setJobEditStatus}
              data={recordBasic}
              originalData={originalData}
              setOriginalData={setOriginalData}
            >
              <RecordDetailsDataContainer
                label="Estado laboral"
                name="job_status"
                data={recordBasic}
                setData={setRecordBasic}
                sectionEditingStatus={jobEditStatus}
              />
              <RecordDetailsDataContainer
                label="Cargo"
                name="job_title"
                data={recordBasic}
                setData={setRecordBasic}
                sectionEditingStatus={jobEditStatus}
              />
              <RecordDetailsDataContainer
                label="Direccion del plantel"
                name="job_direction"
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
  // lastModifiedName,
  editStatus,
  setEditStatus,
  data,
  originalData,
  setOriginalData,
}) {
  // let lastModifiedDate = new Date(data[lastModifiedName]) || 'error de fecha';
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
          {
            editStatus
              ? "Realice los cambios necesarios y luego haga click en guardar"
              : "" /*"Actualizados por ultima vez el: " + lastModifiedDate*/
          }
        </span>
        <div className="flex-h gap12">
          {/* TODO cancelar aun no es util */}
          {editStatus ? (
            <ButtonBig
              text="Cancelar"
              icon={icons.CrossSmall}
              type="secondary"
              action={async (e) => {
                setEditStatus(false);
              }}
            />
          ) : (
            ""
          )}
          <ButtonBig
            text={editStatus ? "Guardar" : "Editar"}
            icon={icons.DocumentEdit}
            type={editStatus ? "main" : "secondary"}
            action={(e) => {
              // qui action deberia cambiar si esta editando o no
              // TODO a;adir el boton cancelar
              if (editStatus === true) {
                let changes = {};
                // console.log(children);
                children.forEach((element) => {
                  if (
                    originalData[element.props.name] == data[element.props.name]
                  ) {
                    return;
                  }
                  changes[element.props.name] = data[element.props.name]; // or null?
                });
                if (Object.keys(changes).length === 0) {
                  return;
                }
                // changes[lastModifiedName] = today(); // TODO deberia hacerlo el backend
                let promesa = putAffiliate(data["id"], changes);
                promesa
                  .then((response) => {
                    return response.json();
                  })
                  .then((data) => {
                    if (data["result"] === "ok") {
                      setOriginalData({
                        ...originalData,
                        ...changes,
                      });
                    }
                  })
                  .catch((error) => {
                    console.error(error); // TODO mostrar este error en ui
                  });
              }
              setEditStatus(!editStatus);
            }}
          />
        </div>
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
  // TODO los valores indefinidos se deben representar con el placeholder
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
        type="text" // TODO cambie esto de label a 'text' porque no entendi por que lo habia hecho asi
        name={name}
        value={data[name] || "indefinido"} // TODO esto pasa a cada rato, deberia hacerse el or una sola vez al cargar, podria ser sobreescribir el json original
        onChange={(e) => {
          setData({
            ...data,
            [name]: e.target.value,
          });
        }}
      />
    </div>
  );
}
function RecordDetailsOptionsContainer({
  label,
  data,
  options,
  setData,
  name,
  doubleColumn,
  sectionEditingStatus,
}) {
  // let [state, setState] = useState();
  // TODO los valores indefinidos se deben representar con el placeholder
  // readonly, active, blocked, selected ... soon -> hover, error, warning
  // TODO revisar a fondo porque copie y pegue del otro componente
  return (
    <div
      className="recorddetails-section-datacontainer"
      style={doubleColumn ? { gridColumn: "span 2" } : {}}
    >
      <span className="micro-italic">{label}</span>
      <select
        className={
          "paragraph-regular " +
          (sectionEditingStatus ? "entry-1-active " : "entry-1-readonly")
        }
        name={name}
        value={data[name] || "default"} // TODO esto pasa a cada rato, deberia hacerse el or una sola vez al cargar, podria ser sobreescribir el json original
        onChange={(e) =>
          setData({
            ...data,
            [name]: e.target.value,
          })
        }
        placeholder="Indefinido"
        disabled={!sectionEditingStatus}
      >
        <option disabled value="default">
          - seleccione -
        </option>
        {options.map((option, index) => {
          return (
            <option key={index} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
}
function RecordDetailsFechaContainer({
  label,
  data,
  setData,
  name,
  doubleColumn,
  sectionEditingStatus,
}) {
  // let [state, setState] = useState();
  // TODO los valores indefinidos se deben representar con el placeholder
  // readonly, active, blocked, selected ... soon -> hover, error, warning
  let [date, setDate] = useState("");
  useEffect(() => {
    if (data[name]) {
      setDate(data[name].split("T")[0]);
    }
  }, [data]);

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
        type="date"
        name={name}
        value={date} // TODO esto pasa a cada rato, deberia hacerse el or una sola vez al cargar, podria ser sobreescribir el json original
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
