import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import * as icons from "./Icons";
import { filterAffiliates, getRecords, postCita } from "../tools/api";
import { ButtonBig, PersonTypeTag } from "./Buttons";
import { calcAge } from "../tools/utilities";
import { object } from "prop-types";

export function AddCitaPage() {
  let { id } = useParams();
  let [recordData, setRecordData] = useState({});
  let [citaData, setCitaData] = useState({});

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
        <p className="title-big">Creando Cita</p>

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
          <div className="gap12 recorddetails-section">
            {recordData.basic_info ? (
              <>
                <div className="flex-h gap12">
                  <span className="title-big" style={{ gridColumn: "span 2" }}>
                    {recordData.basic_info.names +
                      " " +
                      recordData.basic_info.lastnames}
                  </span>
                  <PersonTypeTag type={recordData.type} />
                </div>

                <span
                  className="title-regular"
                  style={{ gridColumn: "span 2" }}
                >
                  {recordData.basic_info.nationality +
                    "-" +
                    recordData.basic_info.document}
                </span>
                <span className="text-regular" style={{ gridColumn: "span 2" }}>
                  {calcAge(recordData.basic_info.dateofbirth) +
                    " años - Sexo: " +
                    recordData.basic_info.gender}
                </span>
              </>
            ) : (
              <></>
            )}
          </div>
          <DataSection
            title="Datos médicos"
            data={citaData}
            setData={setCitaData}
          >
            <TextInput label="Tensión arterial" name="tension_arterial" />
            <TextInput label="Peso" name="peso" />
          </DataSection>
          <DataSection title="Consulta" data={citaData} setData={setCitaData}>
            <TextInput label="Área médica" name="area" />
            <TextInput label="Primera Cita" name="first_cita" />
            <TextInput label="Exámenes de laboratorio" name="estudio_lab" />
            <TextInput label="Rayos X" name="estudio_rx" />
            <TextInput label="Ecograía" name="estudio_eco" />
            <NumberInput label="Días de reposo" name="reposo" />
            <TextInput label="Referido" name="ref" />
            <TextInput label="Diagnóstico" name="diagnose" doubleColumn />
          </DataSection>
          <div className="flex-h flex-center-h gap24 pad24">
            <ButtonBig
              type="danger"
              text="Cancelar"
              icon={icons.DocumentCross}
              action={() => {
                if (Object.keys(citaData) !== 0 &&
                  window.confirm(
                    "¿Está seguro de querer cancelar? se limpiarán los campos y perderá lo que haya escrito."
                  )
                ) {
                  setCitaData({});
                  window.history.go(-1);
                }
              }}
            />
            <ButtonBig
              type="good"
              text="Guardar"
              icon={icons.DocumentAdd}
              action={(e) => {
                if (Object.keys(citaData) === 0) {
                  alert("Llene los datos primero");
                }

                // TODO esto se puede llevar a utilities
                const TXT_REGX = /^\w/;
                const NUM_REGX = /^\d+$/;
                const NATIONALITY_REGX = /^[V||E]$/; //puede expandirse
                const DATE_REGX = /^\d{4}-\d{2}-\d{2}$/;
                const JOBSTAT_REGX = /^$/; // TODO terminar este regx
                const GENDER_REGX = /^[M||F]$/;

                let validations = {
                  area: TXT_REGX,
                };

                for (let keyword in validations) {
                  const input = document.getElementsByName(keyword)[0];
                  const container = input.parentElement;
                  const msg =
                    container.getElementsByClassName("fielderror-msg")[0];
                  if (citaData[keyword] === undefined) {
                    // field requerido
                    input.classList.add("entry-1-errorstatus");
                    msg.style.display = "block";
                    msg.textContent = "Por favor llene este campo";
                    alert("Hay campos que no se llenaron");
                    return;
                  } else if (validations[keyword].test(citaData[keyword])) {
                    //todo bien
                    input.classList.remove("entry-1-errorstatus");
                    msg.style.display = "none";
                    msg.textContent = null;
                  } else {
                    // existe pero no es valido
                    input.classList.add("entry-1-errorstatus");
                    msg.style.display = "block";
                    msg.textContent =
                      "Por favor llene este campo correctamente";
                    alert("Hay campos que no se llenaron correctamente");
                  }
                }

                if (id && recordData.basic_info){
                  citaData['record_id'] = id
                } else {
                  // TODO rellenar con los datos basicos que igual deberian haberse llenado directamente pero bueno lo anoto por si acaso
                }

                postCita(citaData)
                  .then((response) => response.json())
                  .then((json) => {
                    // console.log(json);
                    if (json["result"] === "ok") {
                      console.log("guardada");
                      alert("Cita registrada con éxito.");
                      setCitaData({});
                      window.history.go(-1);
                    } else if (json["error"]) {
                      throw new Error(json["error"]);
                    }
                  })
                  .catch((error) => {
                    alert(
                      "Ocurrió un error tratando de registrar la historia."
                    );
                    console.log(error.msg);
                  });
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

// TODO hay que hacer un componente checkbox y checkbox list
// export function EditCitaPage(){

// }

function DataSection({
  title,
  name,
  children,
  icon,

  data,
  setData,
}) {
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
function SearchInput({
  label = "",
  name = "",
  doubleColumn = false,

  data = {},
  setData = () => {},
  text,
  setText,
}) {
  // let [state, setState] = useState();
  // TODO los valores indefinidos se deben representar con el placeholder
  // readonly, active, blocked, selected ... soon -> hover, error, warning
  let [options, setOptions] = useState([]);

  return (
    <div
      className="recorddetails-section-datacontainer"
      style={{
        position: "relative",
        ...(doubleColumn ? { gridColumn: "span 2" } : {}),
      }}
    >
      <span className="micro-italic">{label}</span>
      <input
        list="options"
        className="paragraph-regular entry-1-active "
        type="text"
        name={name}
        value={text}
        onChange={(e) => {
          // se hace la busqueda
          //

          // api
          filterAffiliates(e.target.value)
            .then((response) => response.json())
            .then((json) => {
              setOptions(json);
            })
            .catch((error) => {
              setOptions([]);
            });
          setText(e.target.value);
          // setOptions([
          //   {
          //     names: "elian",
          //     id: "123456",
          //     document: "29730724",
          //   },
          // ]);
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
      <span
        style={{
          display: "none",
          color: "var(--act-danger)",
        }}
        className="title-small fielderror-msg"
      >
        Llene este campo correctamente
      </span>
    </div>
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
        className="paragraph-regular entry-1-active "
        type="text"
        name={name}
        value={data[name] || ""}
        onChange={(e) => {
          setData({
            ...data,
            [name]: e.target.value,
          });
        }}
      />
      <span
        style={{ display: "none", color: "var(--act-danger)" }}
        className="title-small fielderror-msg"
      >
        Llene este campo correctamente
      </span>
    </div>
  );
}
function NumberInput({
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
        className="paragraph-regular entry-1-active "
        type="text"
        name={name}
        value={data[name] || ""}
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
      <span
        style={{ display: "none", color: "var(--act-danger)" }}
        className="title-small fielderror-msg"
      >
        Llene este campo correctamente
      </span>
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
  return (
    <div
      className="recorddetails-section-datacontainer"
      style={doubleColumn ? { gridColumn: "span 2" } : {}}
    >
      <span className="micro-italic">{label}</span>
      <select
        className="paragraph-regular entry-1-active"
        name={name}
        value={data[name] || "default"} // TODO esto pasa a cada rato, deberia hacerse el or una sola vez al cargar, podria ser sobreescribir el json original
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
      <span
        style={{ display: "none", color: "var(--act-danger)" }}
        className="title-small fielderror-msg"
      >
        Llene este campo correctamente
      </span>
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
  // let [state, setState] = useState();
  // TODO los valores indefinidos se deben representar con el placeholder

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
        value={data[name] || ""}
        onChange={(e) =>
          setData({
            ...data,
            [name]: e.target.value,
          })
        }
      />
      <span
        style={{ display: "none", color: "var(--act-danger)" }}
        className="title-small fielderror-msg"
      >
        Llene este campo correctamente
      </span>
    </div>
  );
}