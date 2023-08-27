import React, { useEffect, useState } from "react";
import * as icons from "./Icons";
import { ButtonBig, PersonTypeTag } from "./Buttons";
import { postAffiliate } from "../tools/api";

export function CreatingRecordPage() {
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
              label="Nombres"
              name="names"
              doubleColumn
            />
            <RecordDetailsDataContainer
              label="Apellidos"
              name="lastnames"
              doubleColumn
            />
            <RecordDetailsDataContainer label="Cédula" name="document" />
            {/* se debe hacer un componente para numero o validar de alguna manera */}
            <RecordDetailsOptionsContainer
              label="Nacionalidad"
              name="nationality"
              options={["V", "E"]}
            />
            <RecordDetailsDataContainer
              label="Fecha de nacimiento"
              name="dateofbirth"
            />
            <RecordDetailsOptionsContainer
              label="Sexo / género"
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
            <RecordDetailsDataContainer
              label="Teléfono 1"
              name="phone_personal"
            />
            <RecordDetailsDataContainer
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
              label="Nombre del plantel"
              name="job_name"
              doubleColumn
            />
            <RecordDetailsDataContainer
              label="Dirección"
              name="job_direction"
              doubleColumn
            />
            <RecordDetailsDataContainer label="Cargo" name="job_title" />
            {/* se debe hacer un componente para numero o validar de alguna manera */}
            <RecordDetailsOptionsContainer
              label="Estado laboral"
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
            />
            <ButtonBig
              type="good"
              text="Guardar historia"
              icon={icons.DocumentAdd}
              action={(e) => {
                if (Object.keys(data) === 0) {
                  alert("Llene los datos primero");
                }
                postAffiliate(data)
                  .then((response) => response.json())
                  .then((json) => {
                    console.log(json);
                    if(json['result'] === 'ok'){
                      console.log('guardado')
                      alert('Afiliado registrado con éxito.')
                    }
                  })
                  .catch((error) => {
                    alert('Error, no se guardó.')
                    throw new Error(error);
                  });
              }}
            />
          </div>
        </div>
        <ProgressWidget data={data} />
        <div></div>
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
        value={data[name] || ''}
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
  // let [state, setState] = useState();
  // TODO los valores indefinidos se deben representar con el placeholder
  // readonly, active, blocked, selected ... soon -> hover, error, warning
  let [date, setDate] = useState("");
  useEffect(() => {
    if (data[name]) {
      setDate(data[name].split("T")[0]);
    }
  }, [data, name]);

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

function ProgressWidget({ data }) {
  // TODO adaptar esto para poderlo utilizar en otras paginas y componentes

  let [status, setStatus] = useState(0);

  useEffect(() => {
    setStatus(50);
  }, [data]);

  return <aside className="progress-widget"></aside>;
}
