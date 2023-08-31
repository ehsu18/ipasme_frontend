import {
  getCitas,
  getCitasOdon,
  getRecords,
  putAffiliate,
  getAffiliateReposos,
  getAffiliateCuidos,
  deleteAffiliate,
} from "../tools/api";
import { dateToString } from "../tools/utilities";
import { useParams } from "react-router-dom";
import { ButtonBig, PersonTypeTag } from "./Buttons";
import * as icons from "./Icons";
import React, { useEffect, useState } from "react";

// TODO notificaciones -> https://www.npmjs.com/package/react-notifications

// TODO MANEJAR EL 404

// TODO manejar las fechas correctamente
//  - new Date da un isostring
//  - input date da un date string (yyyy-mm-dd)
//  esto genera problemas porque la fecha se guarda como
//  isostring lo que hace que se intente convertir luego a
//  hora local (por lo que se muestra un dia erroneo)
//  opciones
//  - guardar la fecha solo como fecha
//  - guardarla como isostring pero bien hecho (local) para
//    evitar el error del dia

// TODO se debe poder cambiar el tipo de historia si es afiliado o no

// TODO No estan funcionando los option

// TODO hacer el componente de numeros o validar no se

// TODO mostrar en interfaz el resultado de guardar las secciones

// TODO manejar reposos y cuidos vacios

export function RecordDetailsPage() {
  let { id } = useParams();
  let [recordData, setRecordData] = useState({});

  useEffect(() => {
    getRecords(id)
      .then((response) => response.json())
      .then((json) => {
        setRecordData(json);
        console.log(json);
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
      <div className="recorddetails-container floatingcontainer-parent scroll">
        <div className="recorddetails common-container flex-v">
          <header className="recorddetails-header flex-h">
            <section className="left flex-h">
              <div
                style={
                  recordData["type"] === "beneficiary"
                    ? { backgroundColor: "var(--main-beneficiario)" }
                    : { backgroundColor: "var(--main-afiliado)" }
                }
                className="accent"
              ></div>

              <div className="felx-v">
                <div className="title flex-h">
                  <span className="title-big">
                    {recordData.basic_info // TODO el titulo y la cedula se deben actualizar en tiempo real con las ediciones
                      ? recordData.basic_info.names +
                        " " +
                        recordData.basic_info.lastnames
                      : ""}
                  </span>
                  <PersonTypeTag type={recordData["type"]} />
                </div>
                <span className="title-regular">
                  {recordData.basic_info ? recordData.basic_info.document : ""}
                </span>
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
            name="basic_info"
            recordData={recordData}
            setRecordData={setRecordData}
          >
            <RecordDetailsNumbersContainer label="Cedula" name="document" />
            <RecordDetailsOptionsContainer
              label="Nacionalidad"
              name="nationality"
              options={["V", "E"]}
            />
            <RecordDetailsDataContainer label="Nombres" name="names" />
            <RecordDetailsDataContainer label="Apellidos" name="lastnames" />
            <RecordDetailsFechaContainer
              label="Fecha de nacimiento"
              name="dateofbirth"
            />
            <RecordDetailsOptionsContainer
              label="Estado civil"
              name="civilstatus"
              options={["Soltero", "Casado", "Viudo", "Divorciado"]}
            />
            <RecordDetailsDataContainer
              label="Lugar de nacimiento"
              name="placeofbirth"
            />
            <RecordDetailsOptionsContainer
              label="Sexo"
              name="gender"
              options={["M", "F"]}
            />
          </RecordDetailsSection>

          <RecordDetailsSection
            title="Datos de contacto"
            name={"contact_info"}
            recordData={recordData}
            setRecordData={setRecordData}
            icon={icons.Phone}
          >
            <RecordDetailsNumbersContainer
              label="Telefono personal"
              name="phone_personal"
            />
            <RecordDetailsNumbersContainer
              label="Telefono opcional"
              name="phone_optional"
            />
            <RecordDetailsDataContainer
              label="Direccion de habitacion"
              name="home_direction"
              doubleColumn
            />
          </RecordDetailsSection>

          {recordData["type"] === "affiliate" ? (
            <RecordDetailsSection
              title="Datos laborales"
              name="job_info"
              recordData={recordData}
              setRecordData={setRecordData}
              icon={icons.Suitcase}
            >
              <RecordDetailsOptionsContainer
                label="Estado laboral"
                name="job_status"
                options={["Activo", "Reposo", "Jubilado", "Inactivo"]}
              />
              <RecordDetailsDataContainer label="Cargo" name="job_title" />
              <RecordDetailsDataContainer
                label="Direccion del plantel"
                name="job_direction"
                doubleColumn
              />
            </RecordDetailsSection>
          ) : null}

          <RecordDetailsSection
            title="Datos médicos básicos"
            name="medic_info"
            recordData={recordData}
            setRecordData={setRecordData}
            icon={icons.PinpaperPlus}
          >
            <RecordDetailsDataContainer label="Grupo RH" name="rh_group" />
            <RecordDetailsDataContainer
              label="Enfermedades hereditarias"
              name="enfermedades_hereditarias"
            />
            <RecordDetailsDataContainer
              label="Enfermedades Crónicas"
              name="enfermedades_cronicas"
            />
            <RecordDetailsDataContainer label="Alergias" name="alergias" />
          </RecordDetailsSection>
          <CitasTable recordId={recordData.id} />
          <RecordDetailsSection
            title="Datos odontológicos básicos"
            name="odon_info"
            recordData={recordData}
            setRecordData={setRecordData}
            icon={icons.Tooth}
          >
            <RecordDetailsDataContainer
              label="Ubicacion de la carpeta"
              name="odon_folder"
            />
            <RecordDetailsDataContainer
              label="Padecimientos"
              name="odon_padecimientos"
            />
            <RecordDetailsDataContainer
              label="Procedimientos anteriores"
              name="odon_procedimientos"
              doubleColumn
            />
          </RecordDetailsSection>
          <CitasOdonTable recordId={recordData.id} />
          {/* solo para afiliados */}
          <RecordDetailsRepososTable
            title="Record de reposos"
            name="reposos"
            icon={icons.CalendarUser}
            recordId={recordData.id}
          />
          <RecordDetailsCuidosTable
            title="Record de cuidos"
            name="cuidos"
            icon={icons.CalendarUser}
            recordId={recordData.id}
          />
          <section className="gap48 flex-h pad24">
            <div className="flex-v gap4">
              <span className="title-regular">Borrar esta historia</span>
              <p className="paragraph-regular ">Esto eliminará todos los datos de esta historia, incluyendo las citas, los reposos y los cuidos. También se eliminará de la lista de relaciones que tengan a esta historia.
              </p>
            </div>
            <ButtonBig
              type="danger"
              text="Borrar historia"
              icon={icons.Trash2}
              action={() => {
                if (
                  window.confirm(
                    "¿Está seguro de querer ELIMINAR esta historia? Esto no se puede deshacer, por lo que se perderán todos los datos de esta historia incluidas las citas, reposos y cuidos."
                  )
                ) {
                  if (
                    prompt(
                      `Escriba el nombre de la historia "${recordData["basic_info"]["names"]}":`
                    ) !== recordData["basic_info"]["names"]
                  ) {
                    alert(
                      "Escribió mal el nombre, debe escribirlo exactamente igual."
                    );
                    return
                  }
                } else {
                  alert("Cancelado, no se eliminará esta historia.");
                  return
                }

                console.log("Borrando historia...");
                deleteAffiliate(recordData['id'])
                .then(response=>response.json())
                .then(json=>{
                  if(json['result']==="ok"){
                    alert("Borrada.");
                  } else {
                    alert("No se pudo borrar.");
                  }
                })
                .catch((error)=>{
                  console.log(error)
                })
                
              }}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

function RecordDetailsSection({
  title,
  name,
  children,
  icon,

  recordData,
  setRecordData,
}) {
  let [editStatus, setEditStatus] = useState(false);
  let [data, setData] = useState({});

  useEffect(() => {
    setData(recordData[name]);
    // console.log("section loading data", name);
  }, [recordData, name]);

  // TODO manejar la seleccion del icono

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
        {icon ? icon(24) : icons.User1(24)}
        <span className="title-regular">{title}</span>
      </header>

      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          data: data,
          setData: setData,
          sectionEditingStatus: editStatus,
        })
      )}

      <div className="flex-h recorddetails-section-info">
        <span className="micro-italic">
          {
            editStatus
              ? "Realice los cambios necesarios y luego haga click en guardar"
              : "" /*"Actualizados por ultima vez el: " + lastModifiedDate*/
          }
        </span>
        <div className="flex-h gap12">
          {editStatus ? (
            <ButtonBig
              text="Cancelar"
              icon={icons.CrossSmall}
              type="secondary"
              action={async (e) => {
                setData(recordData[name]);
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
              if (editStatus === false) {
                setEditStatus(true);
                return;
              }

              setEditStatus(false); // TODO se puede mostrar un mensaje de carga

              let changes = {};
              // ver si existe la data en el objeto principal
              if (recordData[name]) {
                // si existe, compararla
                for (let key in data) {
                  if (data[key] !== recordData[name][key]) {
                    changes[key] = data[key];
                  }
                }

                //no hay cambios
                if (Object.keys(changes).length === 0) {
                  // TODO lanzar un mensaje de sin cambios
                  return;
                }
              } else {
                changes = data;
              }

              // si hay cambios
              putAffiliate(recordData["id"], { [name]: changes })
                .then((response) => {
                  return response.json();
                })
                .then((json) => {
                  // mostrar un mensaje en ui
                  if (json["result"] === "ok") {
                    alert("Datos guardados");
                    setRecordData({
                      ...recordData,
                      [name]: data,
                    });
                  } else if (json["error"]) {
                    alert("Ocurrió un error y no se guardaron los datos.");
                  }
                })
                .catch((error) => {
                  console.error(error); // TODO mostrar este error en ui con un mensaje
                  alert("Ocurrió un error."); //TODO esto es necesario o lo hace el useEffect?
                });
            }}
          />
        </div>
      </div>
    </section>
  );
}
function RecordDetailsDataContainer({
  label = "",
  name = "",
  doubleColumn = false,

  data = {},
  setData = () => {},
  sectionEditingStatus = false,
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
        placeholder="indefinido"
        value={data[name] || ""} // TODO esto pasa a cada rato, deberia hacerse el or una sola vez al cargar, podria ser sobreescribir el json original
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
function RecordDetailsNumbersContainer({
  label = "",
  name = "",
  doubleColumn = false,

  data = {},
  setData = () => {},
  sectionEditingStatus = false,
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
        placeholder="indefinido"
        className={
          "paragraph-regular " +
          (sectionEditingStatus ? "entry-1-active " : "entry-1-readonly")
        }
        type="text" // TODO cambie esto de label a 'text' porque no entendi por que lo habia hecho asi
        name={name}
        value={data[name] || ""} // TODO esto pasa a cada rato, deberia hacerse el or una sola vez al cargar, podria ser sobreescribir el json original
        onChange={(e) => {
          e.target.value = e.target.value
            .replace(/[^0-9.]/g, "")
            .replace(/(\.*)\./g, "");
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
  label = "",
  name = "",
  doubleColumn = false,
  options = [],
  data = {},
  setData = () => {},
  sectionEditingStatus = false,
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
        value={data[name] || "default"}
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
  label = "",
  name = "",
  doubleColumn = false,
  data = {},
  setData = () => {},
  sectionEditingStatus = false,
}) {
  function convertDate(date) {
    try {
      return date.split("T")[0];
    } catch {
      return "";
    }
  }

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
        value={convertDate(data[name])}
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
function CitasTable({ recordId }) {
  let [citas, setCitas] = useState(false);

  useEffect(() => {
    // TODO colocar una animacion de carga

    getCitas(recordId)
      .then((response) => response.json())
      .then((json) => {
        setCitas(json);
        console.log(json);
      })
      .catch((error) => {
        setCitas(false);
        throw new Error(error);
      });
  }, [recordId]);

  // TODO todas las tablas deben poder ser ordenadas y filtradas

  return (
    <section className="recorddetails-section citastable">
      <header className="felx-h">
        {icons.PinpaperPlus(24) || null}
        <span className="title-regular">Record de citas médicas</span>
      </header>
      <div
        className="recorddetails-section-datacontainer"
        style={{ gridColumn: "span 2" }}
      >
        {Array.isArray(citas) && citas.length > 0 ? (
          <table className="details-table">
            <thead>
              <tr className="details-table-headerrow">
                <th>Fecha</th>
                <th>Área médica</th>
                <th>Diagnóstico</th>
                <th className="vermas">Ver Consulta</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita, index) => {
                return (
                  <tr key={index} className="details-table-row">
                    <td>
                      {dateToString(cita.fecha.split("T")[0]) || "No indica"}
                    </td>
                    <td>{cita.area || "No indica"}</td>
                    <td>{cita.diagnose || "No indica"}</td>
                    <td className="vermas title-small">
                      <a href={"/citas/" + cita.id}>
                        {icons.EyeOpen(16)} Ver más
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          "Sin citas"
        )}
      </div>
      {/* TODO hace falta paginar la lista de citas para que no se haga infinita */}
      <div
        className="flex-h gap12"
        style={{ gridColumn: "2", justifyContent: "right" }}
      >
        <ButtonBig
          text="Añadir cita"
          icon={icons.DocumentEdit}
          type="secondary"
        />
      </div>
    </section>
  );
}
function CitasOdonTable({ recordId }) {
  let [citas, setCitas] = useState(false);

  useEffect(() => {
    // TODO colocar una animacion de carga

    getCitasOdon(recordId)
      .then((response) => response.json())
      .then((json) => {
        setCitas(json);
        console.log(json);
      })
      .catch((error) => {
        setCitas(false);
        throw new Error(error);
      });
  }, [recordId]);
  return (
    <section className="recorddetails-section citastable">
      <header className="felx-h">
        {icons.Tooth(24) || null}
        <span className="title-regular">Record de citas odontológicas</span>
      </header>
      <div
        className="recorddetails-section-datacontainer"
        style={{ gridColumn: "span 2" }}
      >
        {Array.isArray(citas) && citas.length > 0 ? (
          <table className="details-table">
            <thead>
              <tr className="details-table-headerrow">
                {/* <th className="selector-container">selector</th> */}
                <th>Fecha</th>
                <th>Diagnóstico</th>
                <th className="vermas">Ver Consulta</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita, index) => {
                return (
                  <tr key={index} className="details-table-row">
                    {/* <td className="selector-container">selector</td> */}
                    <td>
                      {dateToString(cita.fecha.split("T")[0]) || "No indica"}
                    </td>
                    <td>{cita.diagnose || "No indica"}</td>
                    <td className="vermas title-small">
                      <a href={"/citasodon/" + cita.id}>
                        {icons.EyeOpen(16)} Ver más
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          "Sin citas"
        )}
      </div>
      {/* TODO hace falta paginar la lista de citas para que no se haga infinita */}
      <div
        className="flex-h gap12"
        style={{ gridColumn: "2", justifyContent: "right" }}
      >
        <ButtonBig
          text="Añadir cita"
          icon={icons.DocumentEdit}
          type="secondary"
        />
      </div>
    </section>
  );
}
function RecordDetailsRepososTable({
  title,
  name,
  icon,

  recordId,
}) {
  let [data, setData] = useState({});

  useEffect(() => {
    getAffiliateReposos(recordId)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        throw error;
      });
    // console.log("section loading data", name);
    // setData([
    //   {
    //     fecha_inicio: "2023-05-09",
    //     fecha_fin:"2023-05-19",
    //     dias:10,
    //     area:'Medicina interna',
    //     id:'adfasdfasdf'
    //   },
    //   {
    //     fecha_inicio: "2023-05-09",
    //     fecha_fin:"2023-05-19",
    //     dias:10,
    //     area:'Medicina interna',
    //     id:'adfasdfasdf'
    //   }
    // ])
  }, [recordId, name]);

  return (
    <section className="recorddetails-section">
      <header className="felx-h">
        {icon ? icon(24) : icons.User1(24)}
        <span className="title-regular">{title}</span>
      </header>

      {Array.isArray(data) && data.length > 0 ? (
        <table
          className="details-table"
          style={{ gridColumn: "span 2 / auto" }}
        >
          <tr className="details-table-headerrow">
            <th>Fechas</th>
            <th>D&iacute;as</th>
            <th>Especialidad médica</th>
            <th>Ver reposo</th>
          </tr>
          {data.map((row, index) => (
            <tr key={index} className="details-table-row">
              <td>{row.fecha_inicio + " - " + row.fecha_fin}</td>
              <td>{row.dias}</td>
              <td>{row.especialidad}</td>
              <td className="vermas title-small">
                <a>{icons.EyeOpen(16)} Abrir</a>
              </td>
            </tr>
          ))}
        </table>
      ) : (
        <span>Vac&iacute;o</span>
      )}

      <div className="flex-h recorddetails-section-info">
        <span className="micro-italic">{/* aqui puede ir un texto */}</span>
        <div className="flex-h gap12">
          <ButtonBig text="Añadir" icon={icons.DocumentEdit} type="secondary" />
        </div>
      </div>
    </section>
  );
}
function RecordDetailsCuidosTable({
  title,
  name,
  icon,

  recordId,
}) {
  let [data, setData] = useState({});

  useEffect(() => {
    getAffiliateCuidos(recordId)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        throw error;
      });
  }, [recordId, name]);

  return (
    <section className="recorddetails-section">
      <header className="felx-h">
        {icon ? icon(24) : icons.User1(24)}
        <span className="title-regular">{title}</span>
      </header>

      {Array.isArray(data) && data.length > 0 ? (
        <table
          className="details-table"
          style={{ gridColumn: "span 2 / auto" }}
        >
          <thead>
            <tr className="details-table-headerrow">
              <th>Fechas</th>
              <th>D&iacute;as</th>
              <th>Beneficiario</th>
              <th>Ver cuido</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="details-table-row">
                <td>{row.fecha_inicio + " - " + row.fecha_fin}</td>
                <td>{row.dias}</td>
                <td>
                  {row.beneficiary_name ||
                    row.beneficiary ||
                    row.beneficiary_id}
                </td>
                <td className="vermas title-small">
                  <a>{icons.EyeOpen(16)} Abrir</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <span>Vac&iacute;o</span>
      )}

      <div className="flex-h recorddetails-section-info">
        <span className="micro-italic">{/* aqui puede ir un texto */}</span>
        <div className="flex-h gap12">
          <ButtonBig text="Añadir" icon={icons.DocumentEdit} type="secondary" />
        </div>
      </div>
    </section>
  );
}
