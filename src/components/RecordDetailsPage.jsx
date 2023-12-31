import {
  getRecords,
  putRecord,
  deleteRecord,
  postAffiliate,
  postBeneficiary,
  filterRecords,
  getRecordBeneficiarys,
  putRecordBeneficiary,
  postRecordBeneficiary,
  deleteRecordBeneficiary,
  getRecordCitas,
  getCita,
  postCita,
  putCita,
  getRecordCitasodon,
  getCitaodon,
  postCitaodon,
  putCitaodon,
  searchReposos,
  searchCuidos,
} from "../tools/api";
import {
  calcAge,
  convertDate,
  dateToString,
  titleCase,
} from "../tools/utilities";
import { useNavigate, useParams } from "react-router-dom";
import { ButtonBig, ButtonSmall, PersonTypeTag } from "./Buttons";
import * as icons from "./Icons";
import React, { useEffect, useState } from "react";
import BasicModal from "./Modal";

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

// TODO hay que validar para poder guardar los datos como en las otras paginas

// TODO limitar el ancho de la pagina

export function RecordDetailsPage() {
  let { id } = useParams();
  let [recordData, setRecordData] = useState({});
  let [focusedTab, setFocusedTab] = useState("basic_tab");
  let navigate = useNavigate()

  useEffect(() => {
    getRecords(id)
      .then((response) => response.json())
      .then((json) => {
        setRecordData(json);
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
      {/* TODO revisar el basic info una sola vez */}
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
                      ? titleCase(
                          recordData.basic_info.names +
                            " " +
                            recordData.basic_info.lastnames
                        )
                      : ""}
                  </span>
                  <PersonTypeTag type={recordData["type"]} />
                </div>
                <span className="title-regular">
                  {recordData.basic_info
                    ? recordData.basic_info.nationality + "-"
                    : ""}
                  {recordData.basic_info ? recordData.basic_info.document : ""}
                </span>
              </div>
            </section>

            <FolderWidget data={recordData} setData={setRecordData} />
          </header>

          <TabSelector focusedTab={focusedTab} setFocusedTab={setFocusedTab}>
            <TableSelectorOption name="basic_tab" label="Datos personales" />
            <TableSelectorOption name="medic_tab" label="Datos médicos" />
            <TableSelectorOption name="odon_tab" label="Datos odontológicos" />

            {recordData["type"] === "affiliate" ? (
              <>
                <TableSelectorOption
                  name="reposos_tab"
                  label="Reposos y cuidos"
                  focusedTab={focusedTab}
                  setFocusedTab={setFocusedTab}
                />
                <TableSelectorOption
                  name="beneficiarys_tab"
                  label="Beneficiarios"
                  focusedTab={focusedTab}
                  setFocusedTab={setFocusedTab}
                />
              </>
            ) : (
              <></>
            )}
            <TableSelectorOption name="options_tab" label="Opciones" />
          </TabSelector>

          <TabContainer name="basic_tab" focusedTab={focusedTab}>
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
          </TabContainer>

          <TabContainer name="medic_tab" focusedTab={focusedTab}>
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
          </TabContainer>

          <TabContainer name="odon_tab" focusedTab={focusedTab}>
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
          </TabContainer>

          {recordData["type"] === "affiliate" ? (
            <>
              <TabContainer name="reposos_tab" focusedTab={focusedTab}>
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
              </TabContainer>

              <TabContainer name="beneficiarys_tab" focusedTab={focusedTab}>
                <BeneficiarysTable recordId={recordData["id"]} />
              </TabContainer>
            </>
          ) : null}
          <TabContainer name="options_tab" focusedTab={focusedTab}>
            <section className="gap48 flex-h pad24">
              <div className="flex-v gap4">
                <span className="title-regular">Borrar esta historia</span>
                <p className="paragraph-regular ">
                  Esto eliminará todos los datos de esta historia, incluyendo
                  las citas, los reposos y los cuidos. También se eliminará de
                  la lista de relaciones que tengan a esta historia.
                </p>
              </div>
              <ButtonBig
                type="danger"
                text="Borrar historia"
                icon={icons.Trash2}
                action={() => {
                  if (
                    window.confirm(
                      "¿Está seguro de querer ELIMINAR esta historia? Perderá todos los datos de esta historia incluidas las citas, reposos y cuidos. También SE ELIMINARÁN LOS BENEFICIARIOS que no posean más afiliados."
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
                      return;
                    }
                  } else {
                    alert("Cancelado, no se eliminará esta historia.");
                    return;
                  }

                  console.log("Borrando historia...");
                  deleteRecord(recordData["id"])
                    .then((response) => response.json())
                    .then((json) => {
                      if (json["result"] === "ok") {
                        alert("Borrada.");
                        navigate('/viewrecords', {replace: true})
                      } else {
                        throw new Error(json['error'])
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      alert("No se pudo borrar.");
                    });
                }}
              />
            </section>
          </TabContainer>
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
              putRecord(recordData["id"], { [name]: changes })
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
        placeholder="--"
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
  const navigate = useNavigate()

  useEffect(() => {
    // TODO colocar una animacion de carga
    if (recordId === undefined) {
      return;
    }

    getRecordCitas(recordId)
      .then((response) => response.json())
      .then((json) => {
        setCitas(json);
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
                      {cita.fecha
                        ? dateToString(cita.fecha.split("T")[0])
                        : "No indica"}
                    </td>
                    <td>{cita.area || "No indica"}</td>
                    <td>{cita.diagnose || "No indica"}</td>
                    <td className="vermas title-small">
                      <a href={"/edit_cita/" + cita.id}>
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
          action={() => {
            navigate("/add_cita/" + recordId, {replace:true})
          }}
        />
      </div>
    </section>
  );
}
function CitasOdonTable({ recordId }) {
  let [citas, setCitas] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    // TODO colocar una animacion de carga
    if (recordId === undefined) {
      return;
    }
    getRecordCitasodon(recordId)
      .then((response) => response.json())
      .then((json) => {
        setCitas(json);
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
                      {cita.fecha
                        ? dateToString(cita.fecha.split("T")[0])
                        : "No indica"}
                    </td>
                    <td>{cita.diagnose || "No indica"}</td>
                    <td className="vermas title-small">
                      <a href={"/edit_citaodon/" + cita.id}>
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
          action={() => {
            navigate(`/add_citaodon/${recordId}`, {replace:true})
          }}
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
  const navigate = useNavigate()

  useEffect(() => {
    if (recordId === undefined) {
      return;
    }
    searchReposos(recordId)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        throw error;
      });
  }, []);

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
              <td>
                {dateToString(convertDate(row.fecha_inicio)) +
                  " - " +
                  dateToString(convertDate(row.fecha_fin))}
              </td>
              <td>{row.dias || "no indica"}</td>
              <td>{row.especialidad}</td>
              <td className="vermas title-small">
                <a href={`/edit_reposo/${row.id}`}>{icons.EyeOpen(16)} Abrir</a>
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
          <ButtonBig
            text="Añadir"
            icon={icons.DocumentEdit}
            type="secondary"
            action={() => {
              navigate(`/add_reposo/${recordId}`,{replace: true})
            }}
          />
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
  const navigate = useNavigate()

  useEffect(() => {
    if (recordId === undefined) {
      return;
    }
    searchCuidos(recordId)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        throw error;
      });
  }, []);

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
                <td>
                  {dateToString(convertDate(row.fecha_inicio)) +
                    " - " +
                    dateToString(convertDate(row.fecha_fin))}
                </td>
                <td>{row.dias || "no indica"}</td>
                <td>
                  {row.beneficiary_name ||
                    row.beneficiary ||
                    row.beneficiary_id}
                </td>
                <td className="vermas title-small">
                  <a href={`/edit_cuido/${row.id}`}>
                    {icons.EyeOpen(16)} Abrir
                  </a>
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
          <ButtonBig
            text="Añadir"
            icon={icons.DocumentEdit}
            type="secondary"
            action={() => {
              navigate(`/add_reposo/${recordId}`,{replace: true})
            }}
          />
        </div>
      </div>
    </section>
  );
}

function TabSelector({ focusedTab, setFocusedTab, children }) {
  // TODO if children ...
  return (
    <nav className="flex-h recorddetails-nav">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          focusedTab: focusedTab,
          setFocusedTab: setFocusedTab,
        })
      )}
    </nav>
  );
}

function TableSelectorOption({ focusedTab, setFocusedTab, name, label }) {
  return (
    <div
      className={
        "title-small " +
        (focusedTab === name
          ? "recorddetails-tab-selected"
          : "recorddetails-tab")
      }
      onClick={(event) => {
        setFocusedTab(name);
      }}
    >
      <span>{label}</span>
    </div>
  );
}

function TabContainer({ name, focusedTab, children }) {
  return (
    <div
      className="recorddetails-tab-container"
      style={focusedTab === name ? { display: "block" } : { display: "none" }}
    >
      {children}
    </div>
  );
}

function BeneficiarysTable({ recordId, icon, title = "Beneficiarios" }) {
  let [beneficiarys, setBeneficiarys] = useState([]);
  let [openEditDialog, setOpenEditDialog] = useState(false);
  let [editingRelation, setEditingRelation] = useState({});
  let [openCreateDialog, setOpenCreateDialog] = useState(false);
  let [createData, setCreateData] = useState({});
  const navigate = useNavigate()

  useEffect(() => {
    if (recordId === undefined) {
      setBeneficiarys([]);
      return;
    }

    getRecordBeneficiarys(recordId)
      .then((response) => response.json())
      .then((json) => {
        setBeneficiarys(json);
      })
      .catch((json) => {
        setBeneficiarys([]);
      });
  }, [recordId]);

  return (
    <section className="recorddetails-section">
      <header className="felx-h">
        {icon ? icon(24) : icons.User1(24)}
        <span className="title-regular">{title}</span>
      </header>

      {Array.isArray(beneficiarys) && beneficiarys.length > 0 ? (
        <>
          <table
            className="details-table"
            style={{ gridColumn: "span 2 / auto" }}
          >
            <thead>
              <tr className="details-table-headerrow">
                <th>Cédula</th>
                <th>Nombre</th>
                {/* <th>Edad</th> */}
                <th>Tipo</th>
                <th>Relación</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {beneficiarys.map((row, index) => {
                return (
                  <tr key={index}>
                    <td className="title-regular">
                      {row.nationality + row.document}
                    </td>
                    <td className="paragraph-regular">
                      {titleCase(row.names + " " + row.lastnames)}
                    </td>
                    {/* <td>{calcAge(row.dateofbirth)}</td> */}
                    <td style={{ display: "flex", justifyContent: "center" }}>
                      <PersonTypeTag type={row.type} />
                    </td>
                    <td>{row.level_description}</td>
                    <td
                      className="flex-h gap12"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <ButtonSmall
                        type="secondary"
                        text="Ver"
                        action={() => {
                          navigate(`/record_details/${row.id}`, {replace: true})
                        }}
                      />
                      <ButtonSmall
                        type="secondary"
                        text="Editar"
                        action={() => {
                          setEditingRelation({
                            record: row.record,
                            level: row.level_code,
                          });
                          setOpenEditDialog(true);
                        }}
                      />
                      <ButtonSmall
                        type="danger"
                        text="Eliminar"
                        action={() => {
                          if (
                            window.confirm("¿Desea eliminar esta relación?")
                          ) {
                            //eliminar
                            let beneficiaryId = row.record;
                            deleteRecordBeneficiary(recordId, beneficiaryId)
                              .then((response) => response.json())
                              .then((json) => {
                                if (json["result"] === "ok") {
                                  alert("Se eliminó la relación exitosamente");
                                } else if (
                                  json["error"] ===
                                  "not in the beneficiarys list"
                                ) {
                                  throw new Error(
                                    "La API indica que el beneficiario no perteneca al Afiliado"
                                  );
                                } else if (
                                  json["error"] === "unique affiliate"
                                ) {
                                  alert(
                                    "No se puede borrar la relación porque el beneficiario no posee más afiliados, debe borrar el beneficiario o beneficiarlo con otro afiliado"
                                  );
                                } else {
                                  throw new Error();
                                }
                              })
                              .catch((error) => {
                                alert("Ocurrió un error");
                                console.log(error);
                              });

                            // si dice ok, bueno

                            // si dice 'unique affiliate of beneficiary'
                            // debera eliminar la historia manualmente
                            // debido a que los beneficiarios requieren
                            // al menos un afiliado, al eliminar esta relacion,
                            // dicho beneficiario quedara sin afiliado
                          }
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <BasicModal
            open={openEditDialog}
            handleClose={() => {
              setEditingRelation({});
              setOpenEditDialog(false);
            }}
          >
            <div className="flex-v gap24">
              <RecordDetailsOptionsContainer
                label="Relacion"
                name="level"
                options={[2, 3, 4, 5]}
                data={editingRelation}
                setData={setEditingRelation}
                sectionEditingStatus={true}
              />

              <div className="flex-h gap12">
                <ButtonBig
                  text="Guardar cambios"
                  icon={icons.Save}
                  action={() => {
                    if (
                      editingRelation.record &&
                      window.confirm("¿Desea guardar los cambios?")
                    ) {
                      editingRelation.level = parseInt(editingRelation.level);
                      putRecordBeneficiary(recordId, editingRelation)
                        .then((response) => response.json())
                        .then((json) => {
                          if (json["result"] === "ok") {
                            alert("Editado con éxito.");
                          } else if (json["error"]) {
                            throw new Error(json["error"]);
                          }
                        })
                        .catch((error) => {
                          alert("Ocurrió un error.");
                          console.log(error);
                        });
                    }
                    setOpenEditDialog(false);
                    setEditingRelation({});
                  }}
                />
                <ButtonBig
                  text="Cancelar"
                  icon={icons.Cross}
                  type="secondary"
                  action={() => {
                    setOpenEditDialog(false);
                    setEditingRelation({});
                  }}
                />
              </div>
            </div>
          </BasicModal>
        </>
      ) : (
        <span>Vac&iacute;o</span>
      )}

      <div className="flex-h recorddetails-section-info">
        <span className="micro-italic">{/* aqui puede ir un texto */}</span>
        <div className="flex-h gap12">
          <ButtonBig
            text="Añadir"
            icon={icons.DocumentEdit}
            type="secondary"
            action={() => {
              setOpenCreateDialog(true);
            }}
          />
        </div>
      </div>
      <BasicModal
        open={openCreateDialog}
        handleClose={() => {
          setCreateData({});
          setOpenCreateDialog(false);
        }}
      >
        <div className="flex-v gap24">
          <RecordDetailsSearchContainer
            label="Buscar historia"
            name="record"
            data={createData}
            setData={setCreateData}
          />
          <RecordDetailsOptionsContainer
            label="Relacion"
            name="level"
            options={[2, 3, 4, 5]}
            data={createData}
            setData={setCreateData}
            sectionEditingStatus={true}
          />
          <div className="flex-h gap12">
            <ButtonBig
              text="Cancelar"
              icon={icons.Cross}
              action={() => {
                setCreateData({});
                setOpenCreateDialog(false);
              }}
            />
            <ButtonBig
              text="Guardar"
              icon={icons.User1}
              action={() => {
                if (
                  createData.record &&
                  createData.level &&
                  window.confirm("¿Seguro que desea guardar esta relación?")
                ) {
                  createData.level = parseInt(createData.level);
                  postRecordBeneficiary(recordId, createData)
                    .then((response) => response.json())
                    .then((json) => {
                      if (json["result"] === "ok") {
                        alert("Registrado con exito");
                      } else if (json["error"]) {
                        throw new Error(json["error"]);
                      } else {
                        throw new Error();
                      }
                    })
                    .catch((error) => {
                      alert("Ocurrió un error.");
                      console.log(error);
                    });
                }
                setCreateData({});
                setOpenCreateDialog(false);
              }}
            />
          </div>
        </div>
      </BasicModal>
    </section>
  );
}

function RecordDetailsSearchContainer({
  label = "",
  name = "",
  data = {},
  setData = () => {},
}) {
  let [options, setOptions] = useState([]);
  let [text, setText] = useState("");

  return (
    <div
      className="recorddetails-section-datacontainer"
      style={{ position: "relative" }}
    >
      <span className="micro-italic">{label}</span>
      <input
        className="paragraph-regular entry-1-active "
        type="text"
        name={name}
        value={text}
        onChange={(e) => {
          filterRecords(e.target.value)
            .then((response) => response.json())
            .then((json) => {
              setOptions(json);
            })
            .catch((error) => {
              setOptions([]);
            });
          setText(e.target.value); // TODO ver si se puede quitar
          setData({
            ...data,
            [name]: null, // TODO esto creo que no ocurre en la otra pagina y se puede quedar ahi el id sin querer
          });
        }}
      />
      {Array.isArray(options) && options.length > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            top: "52.5px",
            border: "solid 1px var(--border)",
            borderRadius: "0px 0px 12px 12px",
            width: "100%",
            backgroundColor: "var(--white)",
          }}
        >
          {options.map((opt, index) => {
            let innerText =
              opt.nationality +
              opt.document +
              " " +
              opt.names +
              " " +
              opt.lastnames;
            return (
              <span
                style={{ width: "100%", maxWidth: "100%", padding: "8px 4px" }}
                key={index}
                ind={index}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "var(--gray)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = null;
                }}
                onClick={(e) => {
                  setData({
                    ...data,
                    [name]: opt.id,
                  });
                  setText(innerText);
                  setOptions([]);
                }}
              >
                {innerText}
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function FolderWidget({ data, setData }) {
  let [modalOpen, setModalOpen] = useState(false);
  let [text, setText] = useState("");

  useEffect(() => {
    setText(data.basic_info ? data.basic_info.folder : "");
  }, [data]);

  return (
    <section className="right flex-v">
      <div className=" flex-h" style={{ gap: "8px" }}>
        <span className="title-regular">Ubicaci&oacute;n de la carpeta</span>
        <div
          onClick={(e) => {
            setModalOpen(true);
          }}
        >
          {icons.Edit4(20)}
        </div>
      </div>
      <p>{data.basic_info ? data.basic_info.folder : "No indica"}</p>
      {/* TODO hacer esto funcional */}
      <BasicModal
        open={modalOpen}
        handleClose={() => {
          setModalOpen(false);
        }}
      >
        <div className="flex-v gap8 flex-center-h">
          <span className="title-regular">Ubicaci&oacute;n de la carpeta</span>
          <input
            type="text"
            name="folder"
            className="paragraph-regular"
            style={{
              height: "36px",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              padding: "0px 12px",
            }}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <div className="flex-h gap12">
            <ButtonBig
              text="Cancelar"
              icon={icons.Cross}
              type="danger"
              action={(e) => {
                setText("");
                setModalOpen(false);
              }}
            />
            <ButtonBig
              text="Guardar"
              icon={icons.Save}
              type="main"
              action={(e) => {
                // TODO validad primero
                putRecord(data.id, { folder: text })
                  .then((response) => response.json())
                  .then((json) => {
                    if (json["result"] === "ok") {
                      let obj = data;
                      obj.basic_info["folder"] = text;
                      setData(obj);
                      alert("Guardado");
                      setModalOpen(false);
                    } else {
                      throw new Error(json["error"]);
                    }
                  })
                  .catch((error) => {
                    alert("Ocurrió un error");
                  });
              }}
            />
          </div>
        </div>
      </BasicModal>
    </section>
  );
}
