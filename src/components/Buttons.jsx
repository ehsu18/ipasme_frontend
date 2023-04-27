import * as icons from "./Icons";

export function ButtonBig({ type = "main", text = "", icon }) {
  /* button types:
    main: blue background
    secondary: white background
    disabled:
    good:
    danger:
    warning:
  
  */
  return (
    <button className={"button-big "+type}>
      {icon()}
      <span className="title-small">{text}</span>
    </button>
  );
}

export function ButtonSmall({ type = "main", text = "" }) {
  return (
    <button className="button-small">
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
