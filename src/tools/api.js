const API_URL = 'http://localhost:8000/api/'
const AFFILIATE_URL = 'affiliate'
const RELATION_AFFILIATES_URL = 'affiliate_affiliates/'
const RELATION_BENEFICIARYS_URL = 'affiliate_beneficiarys/'

export async function getAffiliates() {

    return await fetch(API_URL+AFFILIATE_URL)
    .then((response) => response.json())
    .then((json) => {
      return json
    })

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