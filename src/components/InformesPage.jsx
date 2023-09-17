import { useEffect, useState } from "react";

import { ButtonSmall, ButtonBig } from "./Buttons";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { putInforme, getInformeCitas, deleteInforme, getInforme } from "../tools/api";
import * as icons from "./Icons";
import { dateToString } from "../tools/utilities";
import React from "react";
import { AddCitaForm } from "./CitaPage";
import BasicModal from "./Modal";

export function EditInformePage({}) {
  let { informe_id } = useParams();
  let [data, setData] = useState({});
  let navigate = useNavigate();

  useEffect(()=>{
    getInforme(informe_id)
    .then((response) => response.json())
      .then((json) => {
        setData(json);
      })
      .catch((error) => {
        setData({});
        throw new Error(error);
      });
  },[informe_id])

  const saveInforme = (e) => {
    if (Object.keys(data) === 0) {
      alert("Llene los datos primero");
      // TODO si los datos estan vacios se debe borrar del server
      // TODO deleteInforme()
    }

    // TODO esto se puede llevar a utilities
    const TXT_REGX = /^\w/;
    const NUM_REGX = /^\d+$/;
    const NATIONALITY_REGX = /^[V||E]$/; //puede expandirse
    const DATE_REGX = /^\d{4}-\d{2}-\d{2}$/;
    const JOBSTAT_REGX = /^$/; // TODO terminar este regx
    const GENDER_REGX = /^[M||F]$/;

    let validations = {};

    for (let keyword in validations) {
      const input = document.getElementsByName(keyword)[0];
      const container = input.parentElement;
      const msg = container.getElementsByClassName("fielderror-msg")[0];
      if (data[keyword] === undefined) {
        // field requerido
        input.classList.add("entry-1-errorstatus");
        msg.style.display = "block";
        msg.textContent = "Por favor llene este campo";
        alert("Hay campos que no se llenaron");
        return;
      } else if (validations[keyword].test(data[keyword])) {
        //todo bien
        input.classList.remove("entry-1-errorstatus");
        msg.style.display = "none";
        msg.textContent = null;
      } else {
        // existe pero no es valido
        input.classList.add("entry-1-errorstatus");
        msg.style.display = "block";
        msg.textContent = "Por favor llene este campo correctamente";
        alert("Hay campos que no se llenaron correctamente");
        return;
      }
    }

    return putInforme(informe_id, data)
      .then((response) => response.json())
      .then((json) => {
        // console.log(json);
        if (json["result"] === "ok") {
          console.log("Guardado");
          alert("Informe guardado con éxito.");
          setData({});
          navigate(-1);
        } else if (json["error"]) {
          throw new Error(json["error"]);
        }
      })
      .catch((error) => {
        alert("Ocurrió un error tratando de registrar el informe.");
        console.log(error.msg);
      });
  };

  return (
    <main className="main-container">
      <header className="content-header">
        <p className="title-big">Creando Informe</p>

        <div className="flex-h gap24">
          <ButtonBig
            type="secondary"
            text="Obtener ayuda"
            icon={icons.QuestionCircle}
          />
        </div>
      </header>
      <div className="floatingcontainer-parent scroll flex-h flex-center-h">
        <div className="common-container flex-v">
          <InputsContainer
            title="Datos de informe"
            data={data}
            setData={setData}
          >
            <DateInput label="Fecha" name="fecha" />
            <OptionsInput
              label="Turno"
              name="turno"
              options={["Diurno", "Matutino"]}
            />
            <TextInput label="Médico" name="medico" />
            <OptionsInput
              label="Nacionalidad médico"
              name="medico_nationality"
              options={["V", "E"]}
            />
            <NumbersInput label="Cédula médico" name="medico_document" />
            <TextInput label="Especialidad" name="especialidad" />
            <TextInput label="Códico de especialidad" name="cod_especialidad" />
            <NumbersInput label="Horas diarias" name="horas_diarias" />
            <TextInput label="Tipo de cargo" name="tipo_cargo" />
            <TextInput label="Médico suplente" name="medico_suplente" />
            <NumbersInput
              label="Cédula suplente"
              name="medico_suplente_document"
            />
            <OptionsInput
              label="Nacionalidad suplente"
              name="medico_suplente_nationality"
              options={["V", "E"]}
            />
            <TextInput label="Enfermera" name="enfermera" />
            <TextInput label="Tiempo consulta" name="tiempo_consulta" />
            <TextInput label="Rendimiento diario" name="rendimiento_diario" />
            <TextInput label="Observaciones" name="observaciones" />
          </InputsContainer>
          <CitasTable informe_id={informe_id} />
          <div className="flex-h flex-center-h gap24 pad24">
            <ButtonBig
              type="danger"
              text="Eliminar informe"
              icon={icons.DocumentCross}
              action={() => {
                if (
                  Object.keys(data) !== 0 &&
                  window.confirm("¿Está seguro?")
                ) {
                  deleteInforme(informe_id)
                    .then((response) => response.json())
                    .then((json) => {
                      if (json["result"] === "ok") {
                        navigate(-1);
                      } else {
                        throw new Error("not ok recieved");
                      }
                    })
                    .catch((error) => {
                      alert(
                        "No se pudo borrar el informe vacío, intente hacerlo de nuevo o puede dejar el informe y editarlo después."
                      );
                      console.log(error);
                    });
                }
              }}
            />
            <ButtonBig
              type="good"
              text="Guardar y Volver"
              icon={icons.DocumentAdd}
              action={saveInforme}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
function CitasTable({ informe_id }) {
  let [citas, setCitas] = useState(false);
  let [openAdd, setOpenAdd] = useState(false);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    height: "90vh",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "hidden",
    overflowY: "scroll",
  };

  useEffect(() => {
    if (informe_id === undefined) {
      return;
    }

    getInformeCitas(informe_id)
      .then((response) => response.json())
      .then((json) => {
        setCitas(json);
      })
      .catch((error) => {
        setCitas(false);
        throw new Error(error);
      });
  }, [informe_id, openAdd]);

  // TODO todas las tablas deben poder ser ordenadas y filtradas

  return (
    <section className="recorddetails-section citastable">
      <header className="felx-h">
        {icons.PinpaperPlus(24) || null}
        <span className="title-regular">Citas de este informe</span>
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
            setOpenAdd(true); //TODO cambiar la forma de la url para poner la historia o el informe, de alguna manera hay que guardar datos para que se pasen automaticamente sin necsidad de usar la url para que sea mas escalable con mas informacion
          }}
        />
      </div>
      <BasicModal
        open={openAdd}
        style={modalStyle}
        handleClose={() => {
          setOpenAdd(false);
        }}
      >
        <AddCitaForm
          informeId={informe_id}
          handleCancel={() => {
            setOpenAdd(false);
          }}
          handleSave={() => {
            setOpenAdd(false);
          }}
        />
      </BasicModal>
    </section>
  );
}

function InputsContainer({
  title,
  children,
  icon,

  data,
  setData,
}) {
  // TODO manejar la seleccion del icono

  return (
    <section className="recorddetails-section">
      <header className="felx-h">
        {icon ? icon(24) : icons.User1(24)}
        <span className="title-regular">{title}</span>
      </header>

      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          data: data,
          setData: setData,
        })
      )}
    </section>
  );
}
function TextInput({
  label = "",
  name = "",
  doubleColumn = false,

  data = {},
  setData = () => {},
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
        className={"paragraph-regular entry-1-active"}
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
function NumbersInput({
  label = "",
  name = "",
  doubleColumn = false,

  data = {},
  setData = () => {},
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
        placeholder="indefinido"
        className={"paragraph-regular entry-1-active "}
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
function OptionsInput({
  label = "",
  name = "",
  doubleColumn = false,
  options = [],
  data = {},
  setData = () => {},
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
        className={"paragraph-regular entry-1-active "}
        name={name}
        value={data[name] || "default"}
        onChange={(e) =>
          setData({
            ...data,
            [name]: e.target.value,
          })
        }
        placeholder="Indefinido"
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
function DateInput({
  label = "",
  name = "",
  doubleColumn = false,
  data = {},
  setData = () => {},
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
        className={"paragraph-regular entry-1-active "}
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
