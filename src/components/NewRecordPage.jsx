export function NewRecordPage(){
    return <>
         <div className="main-container">
        <div className="create-record-header">
            <h1>Crear Historia</h1>
            <div className="frame-63">
            <div className="frame-81">
                <div className="frame-82">
                <h1>¿Qué tipo de historia quieres crear?</h1>
                <p>Tenga en cuenta que para registrar a una nueva persona, esta debe haber llenado <br /> la planilla correspondiente en el departamento de CAIA</p>
                </div>
                <div className="frame-85">
                <div className="frame-83">
                    <div className="frame-84">
                    <h1>Afiliado</h1>
                    <p>Estas son las personas que <br /> forman parte del <br /> de Educación y que reciben <br /> los servicios del IPASME.</p>
                    <button className="buttom-1">Crear Afiliado</button>
                    </div>
                </div>
                <div className="frame-96">
                    <div className="frame-84">
                    <h1>Beneficiario</h1>
                    <p>Estas son las cargas <br /> familiares que los afiliados <br /> registran ante el IPASME para <br /> que reciban sus beneficios.</p>
                    <button className="buttom-2">Crear beneficiario</button>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>

        </>
}
