import { SearchWidget } from "./Buttons";
import { useEffect, useState } from "react";
import homeGirl from "../assets/svg/home-girl.svg";
import { filterRecords, getRecordsCount } from "../tools/api";
import * as icons from "./Icons";

export function HomePage() {
  let [records, setRecords] = useState({});
  useEffect(()=>{
    getRecordsCount()
    .then(response=>response.json())
    .then(json=>{
        setRecords(json)
        console.log(json)
    })
    .catch(error=>{
        setRecords({})
    })
  },[])

  return (
    <main
      className="main-container"
      style={{ backgroundColor: "var(--white)" }}
    >
      <div
        className="flex-v gap24"
        style={{
          padding: "24px",
        //   alignItems: "center",
          
        }}
      >
        <div
          className="flex-h"
          style={{
            backgroundColor: "var(--white)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            boxShadow: '0px 1px 6px 0px rgba(0, 0, 0, 0.12)'
          }}
        >
          <div
            style={{
              //   alignSelf: "stretch",
              flexGrow: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              //   backgroundColor:'#FF0'
            }}
          >
            <img src={homeGirl} alt="" style={{ alignSelf: "center" }} />
          </div>
          <div
            className="flex-v gap24"
            style={{
              alignItems: "flex-start",
              justifyContent: "center",
              flexGrow: "1",
              padding: "24px",
            }}
          >
            <span
              className="title-huge"
              style={{
                color: "var(--main-color)",
              }}
            >
              Bienvenido, busca una historia
            </span>
            <SearchWidget />
          </div>
        </div>
        <div className="flex-h gap24">
          <RecordsCard
            color="var(--main-beneficiario)"
            text="Total de beneficiarios"
            number={records['beneficiarys']}
            icon={icons.User1}
            type='beneficiary'
          />
          <RecordsCard
            color="var(--main-afiliado)"
            text="Total de afiliados"
            number={records['affiliates']}
            icon={icons.User1}
            type='affiliate'
          />
          <RecordsCard
            color="var(--main-color)"
            text="Total de historias"
            number={records['records']}
            icon={icons.User1}
            type='record'
          />
        </div>
      </div>
    </main>
  );
}



function RecordsCard({ color, text, number, icon, type }) {
  return (
    <div
      className={`flex-v gap12 home-card ${type}`}
      style={{
        padding: "56px 24px 24px 24px",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--white)",
        border: "1px solid var(--border)",
        borderRadius: "4px",
        overflow: "clip-content",
        flexGrow: "1",
      }}
    >
      <div
        style={{
          backgroundColor: color,
          width: "100%",
          height: "32px",
          position: "absolute",
          top: "0",
        }}
      ></div>
      <div className="title-regular flex-h gap8">
        {text}
        <div style={{ stroke: color }}>{icon(16)}</div>
      </div>
      <span style={{ color: color }} className="title-regular">
        {number}
      </span>
    </div>
  );
}
