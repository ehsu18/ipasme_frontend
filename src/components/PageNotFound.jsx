import { ButtonBig } from "./Buttons";
import * as icons from "./Icons";

export function PageNotFound() {
  return (
    <main className="main-container">
        <div className="floatingcontainer-parent scroll flex-h flex-center-h flex-center-v" style={{alignItems:'center'}}>
          <div className="common-container flex-v " style={{
            alignItems:'center', justifyContent:'center',
            padding: '24px', gap:'8px'
          }}>
            {icons.CrossCircle(56)}
            <span className="title-huge">
              No se encontró este link
            </span>
            <span className="paragraph-big">quizá está mal escrito o ya no existe</span>
            <div className="flex-h gap24" style={{paddingTop:'24px'}}>
              <ButtonBig
                text="Ir a inicio"
                icon={icons.Home1}
                type="secondary"
                action={() => {
                  window.location.href = "/";
                }}
              />
              <ButtonBig
                text="Regresar"
                icon={icons.ArrowLeft}
                type="main"
                action={() => {
                  window.history.go(-1);
                }}
              />
            </div>
          </div>
        </div>
    </main>
  );
}
