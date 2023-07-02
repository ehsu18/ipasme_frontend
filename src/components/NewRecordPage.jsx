import {ButtonBig} from "./Buttons" ;
import { User1, Users } from "./Icons";

export function NewRecordPage(){
    return <>
        <div className="main-container">
            <header className="content-header">
                <h1 className="title-big">Crear Historia</h1>
            </header>
               
            <div className="frame-63">
            <div className="frame-81">
                <div className="frame-82">
                <h1 className="title-big text-center">¿Qué tipo de historia quieres crear?</h1>
                <p className="paragraph-regular text-center">Tenga en cuenta que para registrar a una nueva persona, esta debe haber llenado <br /> la planilla correspondiente en el departamento de CAIA</p>
                </div>
                <div className="frame-85">
                    <div className="card">
                        <div className="frame-84">
                            <h1 className="title-big text-center">Afiliado</h1>
                            <p className="paragraph-regular text-center">Estas son las personas que <br /> forman parte del <br /> de Educación y que reciben <br /> los servicios del IPASME.</p>
                        </div>
                        {/* <button className="button">Crear Afiliado</button> */}
                        <ButtonBig id="create-affiliate-btn" text="Crear Afiliado" icon={User1} action={() => {window.location.href = '/creating_record?type=affiliate'}} />
                    </div>
                    <div className="card">
                        <div className="frame-84">
                            <h1 className="title-big text-center">Beneficiario</h1>
                            <p className="paragraph-regular text-center">Estas son las cargas <br /> familiares que los afiliados <br /> registran ante el IPASME para <br /> que reciban sus beneficios.</p>
                        </div>
                        {/* <button className="button">Crear beneficiario</button> */}
                        <ButtonBig id="create-beneficiary-btn" text="Crear Beneficiario" icon={Users} action={() => {window.location.href = '/creating_record?type=beneficiary'}}/>
                    </div>
                </div>
            </div>
            </div>
        
        </div>


        </>
}
