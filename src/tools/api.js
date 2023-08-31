const API_URL = "http://localhost:8000/api/";
const AFFILIATE_URL = "affiliate";
const CITAS_URL = "citas";
const CITASODON_URL = "citasodon";
const RECORDS_URL = "records";
const REPOSOS_URL = "reposos";
const AFFILIATECUIDOS_URL = "affiliate_cuidos";
const AFFILIATEREPOSOS_URL = "affiliate_reposos";
const RELATION_AFFILIATES_URL = "affiliate_affiliates/";
const RELATION_BENEFICIARYS_URL = "affiliate_beneficiarys/";

export async function getAffiliates(id = "") {
  if (id !== "") {
    id = "/" + id;
  }
  return await fetch(API_URL + AFFILIATE_URL + id);
  // .then((response) => response.json())
  // .then((json) => {
  //   return json
  // })
  // .catch((error)=>{
  //   throw new Error(error)
  // })
}

export async function getAffiliateAffiliates(id) {
  if (!id) {
    // console.log(id)
    throw new Error("An id is needed to get relations");
  }

  return await fetch(API_URL + RELATION_AFFILIATES_URL + id)
    .then((response) => response.json())
    .then((json) => {
      return json;
    });
}

export async function getAffiliateBeneficiarys(id) {
  if (!id) {
    // console.log(id)
    throw new Error("An id is needed to get relations");
  }

  return await fetch(API_URL + RELATION_BENEFICIARYS_URL + id)
    .then((response) => response.json())
    .then((json) => {
      return json;
    });
}

export function putAffiliate(id, data) {
  // console.log(data)
  if (!id.match("^[\\w]{24}$")) {
    throw new Error(`invalid id (${id}) at put affiliate`);
  }
  if (data === undefined) {
    throw new Error("no data received");
  }
  return fetch(API_URL + AFFILIATE_URL + "/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
export function postAffiliate(data) {
  // console.log(data)
  if (data === undefined) {
    throw new Error("no data received");
  }
  return fetch(API_URL + AFFILIATE_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export function deleteAffiliate(id) {
  // console.log(data)
  if (id && !id.match("^[\\w]{24}$")) {
    throw new Error(`invalid id (${id}) at put affiliate`);
  }
  return fetch(API_URL + AFFILIATE_URL + "/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    }
  });
}

export async function getRecords(id = "") {
  if (id !== "") {
    id = "/" + id;
  }
  return await fetch(API_URL + RECORDS_URL + id);
  // .then((response) => response.json())
  // .then((json) => {
  //   return json
  // })
  // .catch((error)=>{
  //   throw new Error(error)
  // })
}

export async function getCitas(citaId) {
  return await fetch(API_URL + CITAS_URL + "/" + citaId);
}

export async function getCitasOdon(citaId) {
  return await fetch(API_URL + CITASODON_URL + "/" + citaId);
}

export async function getReposos(id = "") {
  if (id !== "") {
    id = "/" + id;
  }
  return await fetch(API_URL + REPOSOS_URL + id);
}

export async function getAffiliateReposos(record_id = "") {
  if (record_id !== "") {
    record_id = "/" + record_id;
  }
  return await fetch(API_URL + AFFILIATEREPOSOS_URL + record_id);
}

export async function getAffiliateCuidos(record_id = "") {
  if (record_id !== "") {
    record_id = "/" + record_id;
  }
  return await fetch(API_URL + AFFILIATECUIDOS_URL + record_id);
}
