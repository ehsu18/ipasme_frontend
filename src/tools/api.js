let API_URL = 'http://localhost:8000/api/'
let AFFILIATE_URL = 'affiliate'

export async function getAffiliates() {

    return await fetch(API_URL+AFFILIATE_URL)
    .then((response) => response.json())
    .then((json) => {
      return json
    })

}