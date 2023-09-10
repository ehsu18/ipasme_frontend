import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import * as icons from "./Icons";
import { filterAffiliates, getRecords, getReposos, postReposo, putReposo, deleteReposo} from "../tools/api";
import { ButtonBig, PersonTypeTag } from "./Buttons";
import { calcAge, convertDate } from "../tools/utilities";
import { func } from "prop-types";


// TODO autocompletar los dias totales del reposo actual

export function AddReposoPage(){
  let { affiliate_id } = useParams();
  let [recordData, setRecordData] = useState({});
  let [reposoData, setReposoData] = useState({});

  useEffect(() => {
    getRecords(affiliate_id)
      .then((response) => response.json())
      .then((json) => {
        setRecordData(json);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [affiliate_id]);

  return (
    <main className="main-container">
    <header className="content-header">
      <p className="title-big">Creando Reposo</p>

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
          title="Pedido del reposo"
          data={reposoData}
          setData={setReposoData}
        >
          <DateInput label="Desde" name="fecha_inicio" />
          <DateInput label="Hasta" name="fecha_fin" />
          <NumberInput label="Días" name="dias"/>

        </DataSection>
        <DataSection 
        title="Información del reposo"
        data={reposoData}
          setData={setReposoData}>
          <TextInput label="Otorgado por la unidad Ipasme" name="otorgado"/>
          <TextInput label="Conformado por la unidad Ipasme" name="conformado"/>
          <TextInput label="Médico que otorga" name="medico"/>
          <TextInput label="Especialidad" name="especialidad"/>
        </DataSection>
        <div className="gap12 recorddetails-section">
          <span>Reposos Acumulados</span>
          <span>Dias acumulados</span>
        </div>
        <div className="flex-h flex-center-h gap24 pad24">
            
            <ButtonBig
              type="danger"
              text="Cancelar"
              icon={icons.DocumentCross}
              action={() => {
                if (Object.keys(reposoData) !== 0 &&
                  window.confirm(
                    "¿Está seguro de querer cancelar? se limpiarán los campos y perderá lo que haya escrito."
                  )
                ) {
                  setReposoData({});
                  window.history.go(-1);
                }
              }}
            />
            <ButtonBig
              type="good"
              text="Guardar"
              icon={icons.DocumentAdd}
              action={(e) => {
                if (Object.keys(reposoData) === 0) {
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
                  fecha_inicio: DATE_REGX,
                  fecha_fin: DATE_REGX,
                  medico: TXT_REGX,
                  especialidad: TXT_REGX,

                };

                for (let keyword in validations) {
                  const input = document.getElementsByName(keyword)[0];
                  const container = input.parentElement;
                  const msg =
                    container.getElementsByClassName("fielderror-msg")[0];
                  if (reposoData[keyword] === undefined) {
                    // field requerido
                    input.classList.add("entry-1-errorstatus");
                    msg.style.display = "block";
                    msg.textContent = "Por favor llene este campo";
                    alert("Hay campos que no se llenaron");
                    return;
                  } else if (validations[keyword].test(reposoData[keyword])) {
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
                    return;
                  }
                }

                if (affiliate_id && recordData.basic_info){
                  reposoData['record_id'] = affiliate_id
                } else {
                  // TODO rellenar con los datos basicos que igual deberian haberse llenado directamente pero bueno lo anoto por si acaso
                }

                postReposo(reposoData)
                  .then((response) => response.json())
                  .then((json) => {
                    // console.log(json);
                    if (json["result"] === "ok") {
                      console.log("guardada");
                      alert("Reposo registrado con éxito.");
                      setReposoData({});
                      window.history.go(-1);
                    } else if (json["error"]) {
                      throw new Error(json["error"]);
                    }
                  })
                  .catch((error) => {
                    alert(
                      "Ocurrió un error tratando de registrar el reposo."
                    );
                    console.log(error.msg);
                  });
              }}
            />
          </div>
        </div>
    </div>
    </main>
  )


}

export function EditReposoPage(){
    let { reposoId } = useParams();
    let [recordData, setRecordData] = useState({});
    let [reposoData, setReposoData] = useState({});
    let [initialData, setInitialData] = useState({})
  
    useEffect(() => {
      getReposos(reposoId)
        .then((response) => response.json())
        .then((json) => {
          setReposoData(json);
          setInitialData(json)
          if(json.record_id){
            getRecords(json.record_id)
            .then(response=>response.json())
            .then(record_json=>{
              setRecordData(record_json)
            })
            .catch(error=>{
              setRecordData({})
            })
          }
        })
        .catch((error) => {
          throw new Error(error);
          alert('Error cargando este reposo')
        });
    }, [reposoId]);
  
    return (
      <main className="main-container">
      <header className="content-header">
        <p className="title-big">Editando Reposo</p>
  
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
            title="Pedido del reposo"
            data={reposoData}
            setData={setReposoData}
          >
            <DateInput label="Desde" name="fecha_inicio" />
            <DateInput label="Hasta" name="fecha_fin" />
            <NumberInput label="Días" name="dias"/>
  
          </DataSection>
          <DataSection 
          title="Información del reposo"
          data={reposoData}
            setData={setReposoData}>
            <TextInput label="Otorgado por la unidad Ipasme" name="otorgado"/>
            <TextInput label="Conformado por la unidad Ipasme" name="conformado"/>
            <TextInput label="Médico que otorga" name="medico"/>
            <TextInput label="Especialidad" name="especialidad"/>
          </DataSection>
          <div className="gap12 recorddetails-section">
            <span>Reposos Acumulados</span>
            <span>Dias acumulados</span>
          </div>
          <div className="flex-h flex-center-h gap24 pad24">
          <ButtonBig
              type="danger"
              text="Eliminar"
              icon={icons.DocumentCross}
              action={() => {
                if (Object.keys(reposoData) !== 0 &&
                  window.confirm(
                    "¿Está seguro de querer ELIMINAR este reposo? no hay vuelta atrás para este cambio."
                  )
                ) {
                  deleteReposo(reposoId)
                  .then(response=>response.json())
                  .then(json=>{
                    if(json['result'] === 'ok'){
                      alert('Eliminado.')
                      window.history.go(-1)
                    } else {
                      throw new Error(json['error'])
                    }
                  })
                  .catch(error=>{
                    alert('Ocurrió un error, no se pudo comprobar la eliminación')
                    console.error(error)
                  })
                }
              }}
            />
              <ButtonBig
                type="danger"
                text="Cancelar"
                icon={icons.DocumentCross}
                action={() => {
                  if (Object.keys(reposoData) !== 0 &&
                    window.confirm(
                      "¿Está seguro de querer cancelar? se limpiarán los campos y perderá lo que haya escrito."
                    )
                  ) {
                    setReposoData({});
                    window.history.go(-1);
                  }
                }}
              />
              <ButtonBig
                type="good"
                text="Guardar"
                icon={icons.DocumentAdd}
                action={(e) => {
                  if (Object.keys(reposoData) === 0) {
                    alert("Llene los datos primero");
                  }
  
                  let changes = {}
                  for (let key in reposoData){
                    if (reposoData[key] !== initialData[key]){
                      changes[key] =reposoData[key]
                    }
                  }
  
                  if(Object.keys(changes).length === 0){
                    alert('No hay cambios que guardar')
                    return
                  }



                  // TODO esto se puede llevar a utilities
                  const TXT_REGX = /^\w/;
                  const NUM_REGX = /^\d+$/;
                  const NATIONALITY_REGX = /^[V||E]$/; //puede expandirse
                  const DATE_REGX = /^\d{4}-\d{2}-\d{2}/; // TODO esto no se si aplicarlo a todos o solo aqui
                  const JOBSTAT_REGX = /^$/; // TODO terminar este regx
                  const GENDER_REGX = /^[M||F]$/;
  
                  let validations = {
                    fecha_inicio: DATE_REGX,
                    fecha_fin: DATE_REGX,
                    medico: TXT_REGX,
                    especialidad: TXT_REGX,
  
                  };
  
                  for (let keyword in validations) {
                    const input = document.getElementsByName(keyword)[0];
                    const container = input.parentElement;
                    const msg =
                      container.getElementsByClassName("fielderror-msg")[0];
                    if (reposoData[keyword] === undefined) {
                      // field requerido
                      input.classList.add("entry-1-errorstatus");
                      msg.style.display = "block";
                      msg.textContent = "Por favor llene este campo";
                      alert("Hay campos que no se llenaron");
                      return;
                    } else if (validations[keyword].test(reposoData[keyword])) {
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
                      return;
                    }
                  }
  
  
                  putReposo(reposoId, changes)
                    .then((response) => response.json())
                    .then((json) => {
                      // console.log(json);
                      if (json["result"] === "ok") {
                        console.log("guardado");
                        alert("Reposo editado con éxito.");
                        window.history.go(-1);
                      } else if (json["error"]) {
                        throw new Error(json["error"]);
                      }
                    })
                    .catch((error) => {
                      alert(
                        "Ocurrió un error tratando de editar el reposo."
                      );
                      console.log(error.msg);
                    });
                }}
              />
            </div>
          </div>
      </div>
      </main>
    )
  
  
  }
  
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
        value={data[name] ? convertDate(data[name]) : ""}
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

