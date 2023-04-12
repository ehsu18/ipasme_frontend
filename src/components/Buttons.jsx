export function Button1({ type = "main", text = "", icon }) {
    return (
      <button className="main-button">
        {icon()}
        <span className="title-small">{text}</span>
      </button>
    );
  }
  