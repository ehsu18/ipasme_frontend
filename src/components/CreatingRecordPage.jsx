import React, { useEffect, useState } from "react";
import * as icons from "./Icons";
import { ButtonBig } from "./Buttons";
import { postAffiliate, postBeneficiary, filterAffiliates } from "../tools/api";

// TODO hay que manejar la situacion de "la historia ya existe"

// TODO hay que poner un indicador de obligatoriedad en los campos

// TODO recargar o cambiar de pagina cuando se registre una historia

export function CreatingAffiliatePage() {
  let [data, setData] = useState({});
  // este va a ser a un solo nivel y no separado como en recodDetails

  return (
    <main className="main-container">
      <header className="content-header">
        <p className="title-big">Creando historia de afiliado</p>

        <div className="flex-h gap24">
          <ButtonBig
            type="secondary"
            text="Obtener ayuda"
            icon={icons.QuestionCircle}
          />
        </div>
      </header>
      <div className="floatingcontainer-parent scroll flex-h flex-center-h">
        <div className="creatingrecord common-container flex-v">
          <RecordDetailsSection
            title="Datos personales"
            name="basic_info"
            data={data}
            setData={setData}
          >
            <RecordDetailsDataContainer
              label="Nombres (obligatorio)"
              name="names"
              doubleColumn
            />
            <RecordDetailsDataContainer
              label="Apellidos (obligatorio)"
              name="lastnames"
              doubleColumn
            />
            <RecordDetailsNumberContainer
              label="Cédula (obligatorio)"
              name="document"
            />
            {/* se debe hacer un componente para numero o validar de alguna manera */}
            <RecordDetailsOptionsContainer
              label="Nacionalidad (obligatorio)"
              name="nationality"
              options={["V", "E"]}
            />
            <RecordDetailsFechaContainer
              label="Fecha de nacimiento (obligatorio)"
              name="dateofbirth"
            />
            <RecordDetailsOptionsContainer
              label="Sexo / género (obligatorio)"
              name="gender"
              options={["M", "F"]}
            />
            <RecordDetailsDataContainer
              label="Lugar de nacimiento"
              name="placeofbirth"
              doubleColumn
            />
          </RecordDetailsSection>
          <RecordDetailsSection
            title="Datos de contacto"
            name="contact_info"
            data={data}
            setData={setData}
          >
            <RecordDetailsDataContainer
              label="Correo electrónico"
              name="email"
              doubleColumn
            />
            <RecordDetailsNumberContainer
              label="Teléfono 1 (obligatorio)"
              name="phone_personal"
            />
            <RecordDetailsNumberContainer
              label="Teléfono 2"
              name="phone_optional"
            />
            {/* se debe hacer un componente para numero o validar de alguna manera */}
            <RecordDetailsDataContainer
              label="Dirección de vivienda"
              name="home_direction"
              doubleColumn
            />
          </RecordDetailsSection>
          <RecordDetailsSection
            title="Datos laborales"
            name="job_info"
            data={data}
            setData={setData}
          >
            <RecordDetailsDataContainer
              label="Nombre del plantel (obligatorio)"
              name="job_name"
              doubleColumn
            />
            <RecordDetailsDataContainer
              label="Dirección"
              name="job_direction"
              doubleColumn
            />
            <RecordDetailsDataContainer
              label="Cargo (obligatorio)"
              name="job_title"
            />
            {/* se debe hacer un componente para numero o validar de alguna manera */}
            <RecordDetailsOptionsContainer
              label="Estado laboral (obligatorio)"
              name="job_status"
              options={["Activo", "Reposo", "Jubilado", "Inactivo"]}
            />
          </RecordDetailsSection>
          <RecordDetailsSection
            title="Datos médicos básicos"
            name="medic_info"
            data={data}
            setData={setData}
          >
            <RecordDetailsDataContainer
              label="Grupo Sanguíneo"
              name="rh_group"
            />
            <RecordDetailsDataContainer
              label="Enfermedades hereditarias"
              name="enfermedades_hereditarias"
            />
            <RecordDetailsDataContainer
              label="Enfermedades crónicas"
              name="enfermedades_cronicas"
            />
            <RecordDetailsDataContainer label="Alergias" name="alergias" />
          </RecordDetailsSection>

          <div className="flex-h flex-center-h gap24 pad24">
            <ButtonBig
              type="danger"
              text="Cancelar historia"
              icon={icons.DocumentCross}
              action={() => {
                if (
                  window.confirm(
                    "¿Está seguro de querer cancelar? se limpiarán los campos y perderá lo que haya escrito."
                  )
                ) {
                  setData({});
                }
              }}
            />
            <ButtonBig
              type="good"
              text="Guardar historia"
              icon={icons.DocumentAdd}
              action={(e) => {
                if (Object.keys(data) === 0) {
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
                  names: TXT_REGX,
                  lastnames: TXT_REGX,
                  document: NUM_REGX,
                  nationality: NATIONALITY_REGX,
                  dateofbirth: DATE_REGX,
                  gender: GENDER_REGX,
                  phone_personal: NUM_REGX,
                  job_name: TXT_REGX,
                  job_title: TXT_REGX,
                  job_status: TXT_REGX,
                };

                for (let keyword in validations) {
                  const input = document.getElementsByName(keyword)[0];
                  const container = input.parentElement;
                  const msg =
                    container.getElementsByClassName("fielderror-msg")[0];
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
                    msg.textContent =
                      "Por favor llene este campo correctamente";
                    alert("Hay que no se llenaron correctamente");
                  }
                }

                postAffiliate(data)
                  .then((response) => response.json())
                  .then((json) => {
                    // console.log(json);
                    if (json["result"] === "ok") {
                      console.log("guardado");
                      alert("Afiliado registrado con éxito.");
                      setData({});
                    } else if (json["error"] === "Document already exists") {
                      try {
                        let input = document.getElementsByName("document")[0];
                        let msg =
                          input.parentElement.getElementsByClassName(
                            "fielderror-msg"
                          )[0];

                        input.classList.add("entry-1-errorstatus");
                        msg.style.display = "block";
                        msg.textContent =
                          "Ya existe una historia con esta cédula";
                      } catch (error) {
                        throw error;
                      } finally {
                        alert(
                          "Ya hay una historia registrada con es cédula. Por favor revise que esté bien escrita."
                        );
                      }
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
        {/* <ProgressWidget data={data} s/> */}
      </div>
    </main>
  );
}
export function CreatingBeneficiaryPage() {
  let [data, setData] = useState({});
  let [relationData, setRelationData] = useState({});
  let [searchText, setSearchText] = useState("");
  // este va a ser a un solo nivel y no separado como en recodDetails

  return (
    <main className="main-container">
      {/* TODO esto podria ser un componente */}
      <header className="content-header">
        <p className="title-big">Creando historia de Beneficiario</p>

        <div className="flex-h gap24">
          <ButtonBig
            type="secondary"
            text="Obtener ayuda"
            icon={icons.QuestionCircle}
          />
        </div>
      </header>
      <div className="floatingcontainer-parent scroll flex-h flex-center-h">
        <div className="creatingrecord common-container flex-v">
          <RecordDetailsSection
            title="Afiliado"
            name="affiliate_selector"
            data={relationData}
            setData={setRelationData}
          >
            <RecordDetailsSearchContainer
              label="Affiliado (obligatorio)"
              name="affiliate"
              text={searchText}
              setText={setSearchText}
            />
            <RecordDetailsOptionsContainer
              label="Relación (obligatorio)"
              name="level"
              options={[2, 3, 4, 5]}
            />
          </RecordDetailsSection>
          <RecordDetailsSection
            title="Datos personales"
            name="basic_info"
            data={data}
            setData={setData}
          >
            <RecordDetailsDataContainer
              label="Nombres (obligatorio)"
              name="names"
              doubleColumn
            />
            <RecordDetailsDataContainer
              label="Apellidos (obligatorio)"
              name="lastnames"
              doubleColumn
            />
            <RecordDetailsNumberContainer label="Cédula" name="document" />
            {/* se debe hacer un componente para numero o validar de alguna manera */}
            <RecordDetailsOptionsContainer
              label="Nacionalidad (obligatorio)"
              name="nationality"
              options={["V", "E"]}
            />
            <RecordDetailsFechaContainer
              label="Fecha de nacimiento (obligatorio)"
              name="dateofbirth"
            />
            <RecordDetailsOptionsContainer
              label="Sexo / género (obligatorio)"
              name="gender"
              options={["M", "F"]}
            />
            <RecordDetailsDataContainer
              label="Lugar de nacimiento"
              name="placeofbirth"
              doubleColumn
            />
          </RecordDetailsSection>
          <RecordDetailsSection
            title="Datos de contacto"
            name="contact_info"
            data={data}
            setData={setData}
          >
            <RecordDetailsDataContainer
              label="Correo electrónico"
              name="email"
              doubleColumn
            />
            <RecordDetailsNumberContainer
              label="Teléfono 1 (obligatorio)"
              name="phone_personal"
            />
            <RecordDetailsNumberContainer
              label="Teléfono 2"
              name="phone_optional"
            />
            {/* se debe hacer un componente para numero o validar de alguna manera */}
            <RecordDetailsDataContainer
              label="Dirección de vivienda"
              name="home_direction"
              doubleColumn
            />
          </RecordDetailsSection>

          <RecordDetailsSection
            title="Datos médicos básicos"
            name="medic_info"
            data={data}
            setData={setData}
          >
            <RecordDetailsDataContainer
              label="Grupo Sanguíneo"
              name="rh_group"
            />
            <RecordDetailsDataContainer
              label="Enfermedades hereditarias"
              name="enfermedades_hereditarias"
            />
            <RecordDetailsDataContainer
              label="Enfermedades crónicas"
              name="enfermedades_cronicas"
            />
            <RecordDetailsDataContainer label="Alergias" name="alergias" />
          </RecordDetailsSection>

          <div className="flex-h flex-center-h gap24 pad24">
            <ButtonBig
              type="danger"
              text="Cancelar historia"
              icon={icons.DocumentCross}
              action={() => {
                if (
                  window.confirm(
                    "¿Está seguro de querer cancelar? se limpiarán los campos y perderá lo que haya escrito."
                  )
                ) {
                  setData({});
                  setRelationData({});
                }
              }}
            />
            <ButtonBig
              type="good"
              text="Guardar historia"
              icon={icons.DocumentAdd}
              action={(e) => {
                if (Object.keys(data) === 0) {
                  alert("Llene los datos primero");
                }

                // TODO esto se puede llevar a utilities
                const TXT_REGX = /^\w/; //TODO modificar esto porque no permite numeros asi
                const ID_REGX = /^[\d||\w]{24}$/;
                const NUM_REGX = /^\d+$/;
                const NATIONALITY_REGX = /^[V||E]$/; //puede expandirse
                const LVL_REGX = /^[2-5]$/; //TODO no se si esta bien
                const DATE_REGX = /^\d{4}-\d{2}-\d{2}$/;
                const GENDER_REGX = /^[M||F]$/;

                let validations = {
                  affiliate : ID_REGX,
                  level: LVL_REGX,
                  names: TXT_REGX,
                  lastnames: TXT_REGX,
                  nationality: NATIONALITY_REGX,
                  dateofbirth: DATE_REGX,
                  gender: GENDER_REGX,
                  phone_personal: NUM_REGX,
                };

                for (let keyword in validations) {
                  const input = document.getElementsByName(keyword)[0];
                  const container = input.parentElement;
                  const msg =
                    container.getElementsByClassName("fielderror-msg")[0];
                  input.classList.remove("entry-1-errorstatus");
                  msg.style.display = "none";
                  msg.textContent = null;
                  if (data[keyword] === undefined && relationData[keyword] === undefined) {
                    // field requerido
                    input.classList.add("entry-1-errorstatus");
                    msg.style.display = "block";
                    msg.textContent = "Por favor llene este campo";
                    alert("Hay campos que no se llenaron");
                    return;
                  } else if (validations[keyword].test(data[keyword]) || validations[keyword].test(relationData[keyword])) {
                    //todo bien                   
                  } else {
                    // existe pero no es valido
                    input.classList.add("entry-1-errorstatus");
                    msg.style.display = "block";
                    msg.textContent =
                      "Por favor llene este campo correctamente";
                    alert("Hay que no se llenaron correctamente");
                  }
                }

                postBeneficiary(data, relationData)
                  .then((response) => response.json())
                  .then((json) => {
                    // console.log(json);
                    if (json["result"] === "ok") {
                      console.log("guardado");
                      alert("Beneficiario registrado con éxito.");
                      setData({});
                      setRelationData({})
                      setSearchText('')
                    } else if (json["error"] === "Document already exists") { //TODO cambiar esto en ambos botones
                      try {
                        let input = document.getElementsByName("document")[0];
                        let msg =
                          input.parentElement.getElementsByClassName(
                            "fielderror-msg"
                          )[0];

                        input.classList.add("entry-1-errorstatus");
                        msg.style.display = "block";
                        msg.textContent =
                          "Ya existe una historia con esta cédula";
                      } catch (error) {
                        throw error;
                      } finally {
                        alert(
                          "Ya hay una historia registrada con es cédula. Por favor revise que esté bien escrita."
                        );
                      }
                    } else if (json["error"]){
                      console.log(json["error"])
                      throw new Error();
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
        {/* <ProgressWidget data={data} s/> */}
      </div>
    </main>
  );
}

function RecordDetailsSection({
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
function RecordDetailsSearchContainer({
  label = "",
  name = "",
  doubleColumn = false,

  data = {},
  setData = () => {},
  text,
  setText
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
            let innerText = opt.nationality+ opt.document + " " + opt.names + ' ' + opt.lastnames;
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
function RecordDetailsDataContainer({
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
function RecordDetailsNumberContainer({
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
function RecordDetailsOptionsContainer({
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
function RecordDetailsFechaContainer({
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
function ProgressWidget({ data }) {
  // TODO adaptar esto para poderlo utilizar en otras paginas y componentes

  let [status, setStatus] = useState(0);

  useEffect(() => {
    setStatus(50);
  }, [data]);

  return <aside className="progress-widget"></aside>;
}
