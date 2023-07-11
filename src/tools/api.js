const API_URL = 'http://localhost:8000/api/'
const AFFILIATE_URL = 'affiliate';
const RECORDS_URL = 'records'
const RELATION_AFFILIATES_URL = 'affiliate_affiliates/'
const RELATION_BENEFICIARYS_URL = 'affiliate_beneficiarys/'

export async function getAffiliates(id='') {

    if( id !=='' ){id = '/'+id}
    return await fetch(API_URL+AFFILIATE_URL+id)
    // .then((response) => response.json())
    // .then((json) => {
    //   return json
    // })
    // .catch((error)=>{
    //   throw new Error(error)
    // })

}

export async function getAffiliateAffiliates(id) {

  if(!id){
    console.log(id)
    throw new Error('An id is needed to get relations');
  }

  return await fetch(API_URL+RELATION_AFFILIATES_URL+id)
  .then((response) => response.json())
  .then((json) => {
    return json
  })

}

export async function getAffiliateBeneficiarys(id) {

  if(!id){
    console.log(id)
    throw new Error('An id is needed to get relations');
  }

  return await fetch(API_URL+RELATION_BENEFICIARYS_URL+id)
  .then((response) => response.json())
  .then((json) => {
    return json
  })

}

export async function putAffiliate(id, data) {
  if (!id.match("^[\\w]{24}$")){throw new Error(`invalid id (${id}) at put affiliate`)}
  if (data == undefined){throw new Error('no data received')}
  let response = await fetch(API_URL+AFFILIATE_URL+'/'+id,{
    method:'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  return await response.json();
}

export async function getRecords(id='') {

  if( id !=='' ){id = '/'+id}
  return await fetch(API_URL+RECORDS_URL+id)
  // .then((response) => response.json())
  // .then((json) => {
  //   return json
  // })
  // .catch((error)=>{
  //   throw new Error(error)
  // })

}