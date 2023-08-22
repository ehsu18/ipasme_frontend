export function today(){
    return new Date().toISOString() //.slice(0, -5)
}

export function dateToString(date){
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)){
        throw new Error(`${date} is not a valid dateString`)
    }
    
    const data = date.split('-')
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let mes;
    try{
        mes = meses[parseInt(data[1])]
    } catch {
        throw new Error(`${data[1]} is not a valid month`)
    }
    
    return `${mes.slice(0,3)} ${data[2]}, ${data[0]}`
}