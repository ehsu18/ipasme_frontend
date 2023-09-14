const API_URL = process.env.REACT_APP_DEV_APIURL;
const RECORD = "record";
const RECORD_AFFILIATES = "record_affiliates";
const RECORD_BENEFICIARYS = "record_beneficiarys";
const CREATE_AFFILIATE = "create_affiliate";
const CREATE_BENEFICIARY = "create_beneficiary";
const FILTER_AFFILIATES = "filter_affiliates";
const FILTER_RECORDS = "filter_records"; 

const CITAS = "citas";
const RECORD_CITAS = "record_citas";
const CITASODON = "citasodon";
const RECORD_CITASODON = "record_citasodon";

const REPOSOS = "reposos";
const SEARCH_REPOSOS = "search_reposos";
const CUIDOS = "cuidos";
const SEARCH_CUIDOS = "search_cuidos";


// TODO faltan algunas validaciones
// TODO si sobra tiempo se puede pasar a un modelo orientado a objetos

function authToken(){
  return window.localStorage.getItem('IpasmeRMSUserToken')
}

function checkResponseCode(func){
  return func.then((response)=>{
    if(response.status === 403 || response.status === 401){
      alert('Error de credenciales, deberá ingresar de nuevo.');
      window.localStorage.removeItem('IpasmeRMSUserToken');
      window.location.href = '/';
    }
    return response
  })
}

export async function getRecords(id = "") {
  if (id !== "") {
    id = "/" + id;
  }
  return await checkResponseCode(fetch(API_URL + RECORD + id, {
    headers: {
      Authorization: `token ${authToken()}`  
    },
  }));
}

export async function getRecordAffiliates(id) {
  if (!id) {
    throw new Error("An id is needed to get relations");
  }

  return await checkResponseCode(fetch(API_URL + RECORD_AFFILIATES + "/" + id , {
    headers: {
      Authorization: `token ${authToken()}`  
    },
  }))
}

export async function getRecordBeneficiarys(id) {
  if (!id) {
    // console.log(id)
    throw new Error("An id is needed to get relations");
  }

  return await checkResponseCode(fetch(API_URL + RECORD_BENEFICIARYS + "/" + id, {
    headers: {
      Authorization: `token ${authToken()}`  
    },
  }))
}
export function putRecordBeneficiary(id, data){
  return checkResponseCode(fetch(API_URL + RECORD_BENEFICIARYS + "/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `token ${authToken()}`  
    },
    body: JSON.stringify(data),
  }))
}
export function postRecordBeneficiary(id, data){
  return checkResponseCode(fetch(API_URL + RECORD_BENEFICIARYS + "/" + id, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `token ${authToken()}`  
    },
    body: JSON.stringify(data),
  }))
}
export function deleteRecordBeneficiary(id, beneficiaryId){
  return checkResponseCode(fetch(API_URL + RECORD_BENEFICIARYS + "/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `token ${authToken()}`  
    },
    body: JSON.stringify({'beneficiary':beneficiaryId}),
  }))
}
export function putRecord(id, data) {
  // console.log(data)
  if (!id.match("^[\\w]{24}$")) {
    throw new Error(`invalid id (${id}) at put affiliate`);
  }
  if (data === undefined) {
    throw new Error("no data received");
  }
  return checkResponseCode(fetch(API_URL + RECORD + "/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `token ${authToken()}`  
    },
    body: JSON.stringify(data),
  }));
}
export function postAffiliate(data) {
  // console.log(data)
  if (data === undefined) {
    throw new Error("no data received");
  }
  return checkResponseCode(fetch(API_URL + CREATE_AFFILIATE, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `token ${authToken()}`  
    },
    body: JSON.stringify(data),
  }));
}
export function postBeneficiary(data, relationData) {
  // console.log(data)
  if (data === undefined) {
    throw new Error("no data received");
  }
  return checkResponseCode(fetch(API_URL + CREATE_BENEFICIARY + '/' + relationData['affiliate'], {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `token ${authToken()}`  
    },
    body: JSON.stringify({'record_data': data, 'relation_data':relationData}),
  }));
}
export function deleteRecord(id) {
  // console.log(data)
  if (id && !id.match("^[\\w]{24}$")) {
    throw new Error(`invalid id (${id}) at put affiliate`);
  }
  return checkResponseCode(fetch(API_URL + RECORD + "/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `token ${authToken()}`  
    }
  }));
}

export function filterAffiliates(text=''){
  return checkResponseCode(fetch(API_URL + FILTER_AFFILIATES + '/' + text, {
    headers: {
      Authorization: `token ${authToken()}`  
    },
  }))
}
export function filterRecords(text=''){
  return checkResponseCode(fetch(API_URL + FILTER_RECORDS + '/' + text, {
    headers: {
      Authorization: `token ${authToken()}`  
    },
  }))
}

export async function getRecordCitas(recordId) {
  return await checkResponseCode(fetch(API_URL + RECORD_CITAS + "/" + recordId, {
    headers: {
      Authorization: `token ${authToken()}`  
    },
  }));
}
export async function getCita(citaId) {
  return await checkResponseCode(fetch(API_URL + CITAS + "/" + citaId, {
    headers: {
      Authorization: `token ${authToken()}`  
    },
  }));
}
export function postCita(citaData){
  if (citaData === undefined) {
    throw new Error("no data received");
  }
  return checkResponseCode(fetch(API_URL + CITAS, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `token ${authToken()}`  
    },
    body: JSON.stringify(citaData),
  }));
}
export function putCita(citaId, citaData){
  if (citaData === undefined) {
    throw new Error("no data received");
  }
  return checkResponseCode(fetch(API_URL + CITAS + '/' + citaId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `token ${authToken()}`  
    },
    body: JSON.stringify(citaData),
  }));
}
export function deleteCita(citaId){
  return checkResponseCode(fetch(API_URL + CITAS + '/' + citaId, {
    method: "DELETE",
    headers: {
      Authorization: `token ${authToken()}`  
    },
  }));
}

export async function getRecordCitasodon(recordId) {
  return await checkResponseCode(fetch(API_URL + RECORD_CITASODON + "/" + recordId, {
    headers: {
      Authorization: `token ${authToken()}`  
    },
  }));
}
export async function getCitaodon(citaodonId) {
  return await checkResponseCode(fetch(API_URL + CITASODON + "/" + citaodonId, {
    headers: {
      Authorization: `token ${authToken()}`  
    },
  }));
}
export function postCitaodon(citaodonData){
  if (citaodonData === undefined) {
    throw new Error("no data received");
  }
  return checkResponseCode(fetch(API_URL + CITASODON, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `token ${authToken()}`
    },
    body: JSON.stringify(citaodonData),
  }));
}
export function putCitaodon(citaodonId, citaodonData){
  if (citaodonData === undefined) {
    throw new Error("no data received");
  }
  return checkResponseCode(fetch(API_URL + CITASODON + '/' + citaodonId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `token ${authToken()}`
    },
    body: JSON.stringify(citaodonData),
  }));
}
export function deleteCitaodon(citaodonId){
  return checkResponseCode(fetch(API_URL + CITASODON + '/' + citaodonId, {
    method: "DELETE",
    headers: {
      Authorization: `token ${authToken()}`  
    },
  }));
}


export async function getReposos(id = "") {
  if (id !== "") {
    id = "/" + id;
  }
  return await checkResponseCode(fetch(API_URL + REPOSOS + id, {
    headers: {
      Authorization: `token ${authToken()}`  
    },
  }));
}
export function postReposo(data){
  if (data === undefined) {
    throw new Error("no data received");
  }
  return checkResponseCode(fetch(API_URL + REPOSOS, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `token ${authToken()}`
    },
    body: JSON.stringify(data),
  }));
}
export function putReposo(reposoId ,data){
  if (data === undefined) {
    throw new Error("no data received");
  }
  return checkResponseCode(fetch(API_URL + REPOSOS + '/'+reposoId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `token ${authToken()}`
    },
    body: JSON.stringify(data),
  }));
}
export function deleteReposo(id){
  return checkResponseCode(fetch(API_URL + REPOSOS + '/' + id, {
    method: "DELETE",
    headers: {
      Authorization: `token ${authToken()}`  
    },
  }));
}
export async function searchReposos(record_id = "") {
  if (record_id !== "") {
    record_id = "/" + record_id;
  }
  return await checkResponseCode(fetch(API_URL + SEARCH_REPOSOS + record_id, {
    headers: {
      Authorization: `token ${authToken()}`
    },
  }));
}

export async function getCuidos(id = "") {
  if (id !== "") {
    id = "/" + id;
  }
  return await checkResponseCode(fetch(API_URL + CUIDOS + id, {
    headers: {
      Authorization: `token ${authToken()}`
    },
  }));
}
export function postCuido(data){
  if (data === undefined) {
    throw new Error("no data received");
  }
  return checkResponseCode(fetch(API_URL + CUIDOS, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `token ${authToken()}`
    },
    body: JSON.stringify(data),
  }));
}
export function putCuido(cuidoId ,data){
  if (data === undefined) {
    throw new Error("no data received");
  }
  return checkResponseCode(fetch(API_URL + CUIDOS + '/'+cuidoId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `token ${authToken()}`
    },
    body: JSON.stringify(data),
  }));
}
export function deleteCuido(id){
  return checkResponseCode(fetch(API_URL + CUIDOS + '/' + id, {
    method: "DELETE",
    headers: {
      Authorization: `token ${authToken()}`
    },
  }));
}
export async function searchCuidos(record_id = "") {
  if (record_id !== "") {
    record_id = "/" + record_id;
  }
  return await checkResponseCode(fetch(API_URL + SEARCH_CUIDOS + record_id, {
    headers: {
      Authorization: `token ${authToken()}`
    },
  }));
}

export function getRecordsCount(){
  return checkResponseCode(fetch(API_URL + 'records_count', {
    headers: {
      Authorization: `token ${authToken()}`
    },
  }))
}