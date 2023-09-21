import { useEffect } from "react";
import { redirect } from "react-router-dom";
import { ButtonBig } from "./Buttons";
import { iconClasses } from "@mui/material";
import * as icons from "./Icons";
import logoIpasme from "../assets/png/logo-ipasme.png";
import fondoIllustraciones from "../assets/png/fondo-ilustraciones.png";


// TODO enter para ingresar

export function LoginPage({ userToken, setUserToken, setUserData, userData }) {
  useEffect(() => {
    // si se llama a esta pagina se debe borrar el token
    setUserToken(null);
    window.localStorage.removeItem("IpasmeRMSUserToken");
    window.localStorage.removeItem("IpasmeRMSUserData");
  }, []);

  const inputStyle = {
    border: "solid 1px var(--border)",
    borderRadius: "4px",
    height: "36px",
    padding: "12px",
  };

  const loginFunction = () => {
    let username =
      document.getElementsByName("input-username")[0].value;
    let password =
      document.getElementsByName("input-password")[0].value;
    let advice = document.getElementsByName("advice")[0];
    advice.textContent = "";
    advice.style.display = "none";

    fetch(process.env.REACT_APP_DEV_APIURL + "login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json.token && json.user ) {
          advice.textContent = "";
          advice.style.display = "none";
          setUserToken(json.token);
          setUserData(json.user)
          window.localStorage.setItem("IpasmeRMSUserToken", json.token);
          window.localStorage.setItem("IpasmeRMSUserData", JSON.stringify(json.user));
          redirect("/");
        } else {
          throw new Error(json.detail);
        }
      })
      .catch((error) => {
        console.error(error);
        advice.textContent = "Error de credenciales";
        advice.style.display = "Block";
        setUserToken(null);
        window.localStorage.removeItem("IpasmeRMSUserToken");
        window.localStorage.removeItem("IpasmeRMSUserData");
      });
  }

  return (
    <main
      className="floatingcontainer-parent flex-h flex-center-h"
      style={{
        alignItems: "center",
        position: "relative",
        backgroundImage: `url(${fondoIllustraciones})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <img
        src={logoIpasme}
        alt=""
        style={{
          position: "absolute",
          height: "60px",
          top: "60px",
          left: "80px",
        }}
      />
      <div
        className="common-container flex-v flex-center-v gap24"
        style={{
          padding: "24px",
          alignItems: "center",
          justifyContent: "center",
          width: "340px",
          position: "relative",
          paddingTop: "80px",
          boxShadow: "0px 2px 5px 0px #CCC",
        }}
      >
        <div
          className="innerSVGcolor-white"
          style={{
            borderRadius: "50%",
            backgroundColor: "var(--main-color)",
            width: "125px",
            height: "125px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",

            top: "0px",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {icons.User1(64)}
        </div>
        <span className="title-big">Iniciar Sesión</span>
        <div
          className="flex-v gap12"
          style={{
            alignSelf: "stretch",
          }}
        >
          <input
            style={inputStyle}
            name="input-username"
            type="text"
            placeholder="Usuario"
          />
          <input
            style={inputStyle}
            name="input-password"
            type="password"
            placeholder="Contraseña"
            onKeyUp={(e)=>{
              if (e.key === 'Enter'){
                loginFunction()
              }
            }}
          />
        </div>
        <ButtonBig
          text="Ingresar"
          type="main"
          icon={icons.ArrowCircleRight}
          action={loginFunction}
        />
        <span className="title-regular"
          style={{
            display: "none",
            color: 'var(--act-danger)'
          }}
          name="advice"
        ></span>
      </div>
    </main>
  );
}
