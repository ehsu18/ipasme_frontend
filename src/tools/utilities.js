export function today() {
  return new Date().toISOString(); //.slice(0, -5)
}

export function dateToString(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`${date} is not a valid dateString`);
  }

  const data = date.split("-");
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  let mes;
  try {
    mes = meses[parseInt(data[1]) - 1];
  } catch {
    throw new Error(`${data[1]} is not a valid month`);
  }

  return `${mes.slice(0, 3)} ${data[2]}, ${data[0]}`;
}

export function calcAge(date) {
  try {
    let dob = new Date(date);
    let month_diff = Date.now() - dob.getTime();
    let age_d = new Date(month_diff);
    let year = age_d.getUTCFullYear();

    return Math.abs(year - 1970);
  } catch {
    return "";
  }
}

export function convertDate(date) {
  try {
    return date.split("T")[0];
  } catch {
    return "";
  }
}

export function titleCase(text) {
  try {
    let words = text.split(" ");
    words = words.map((word) => word.split(""));
    words = words.map((word) => {
      word[0] = word[0].toUpperCase();
      return word;
    });
    words = words.map((word) => word.join(""));
    return words.join(" ");
  } catch {
    return text;
  }
}
