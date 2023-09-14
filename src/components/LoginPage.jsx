import { useEffect } from "react";
import { redirect } from "react-router-dom";

export function LoginPage({ userToken, setUserToken }) {

  useEffect(()=>{
    // si se llama a esta pagina se debe borrar el token
    setUserToken(null)
    window.localStorage.removeItem('IpasmeRMSUserToken')
  },[])
  return (
    <div className="flex-v gap12">
      <input name="input-username" type="text" placeholder="Usuario" />
      <input name="input-password" type="password" placeholder="Contraseña" />
      <span name="advice"></span>
      <button
        onClick={() => {
          let username = document.getElementsByName("input-username")[0].value;
          let password = document.getElementsByName("input-password")[0].value;
          let advice = document.getElementsByName("advice")[0];
          advice.textContent = "Cargando";

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
              if (json.token) {
                advice.textContent = "Bien";
                setUserToken(json.token);
                window.localStorage.setItem("IpasmeRMSUserToken", json.token);
                redirect("/");
              } else {
                throw new Error(json.detail)
              }
            })
            .catch((error) => {
              console.error(error);
              advice.textContent = "Mal";
              setUserToken(null);
              window.localStorage.removeItem("IpasmeRMSUserToken");
            });
        }}
      >
        Enviar
      </button>
    </div>
  );
}
