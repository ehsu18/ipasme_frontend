import * as icons from "./Icons";

export function Button1({ type = "main", text = "", icon }) {
  return (
    <button className="main-button">
      {icon()}
      <span className="title-small">{text}</span>
    </button>
  );
}

export function Button2({ type = "main", text = "" }) {
  return (
    <button className="second-button">
      <span className="title-small">{text}</span>
    </button>
  );
}

export function PersonTypeTag({ type = "afiliado" }) {
  return type ? (
    <div className="persontype-tag afiliado">
      {icons.User1(14)} 
      <span className="title-micro">Afiliado</span>
    </div>
  ) : (
    <div className="persontype-tag beneficiario">
      {icons.Users(14)}
      <span className="title-micro">Beneficiario</span>
    </div>
  );
}
