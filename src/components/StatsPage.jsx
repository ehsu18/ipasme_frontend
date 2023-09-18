import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ButtonSmall, ButtonBig } from "./Buttons";
import { NavLink, useNavigate } from "react-router-dom";
import {
  deleteInforme,
  getInformes,
  getRecords,
  postInforme,
} from "../tools/api";
import * as icons from "./Icons";
import React from "react";


export function StatsPage({}) {
  const navigate = useNavigate();
  return (
    <main className="main-container flex-v">
      <header className="content-header">
        <p className="title-big">Estadísticas</p>

        <div className="flex-h gap24"></div>
      </header>
      <div
        className=" overflow flex-h flex-center-h pad24"
        style={{ flexGrow: "1" }}
      >
        <InformesTable navigate={navigate} />
      </div>
    </main>
  );
}

function InformesTable({ navigate }) {
  let [informes, setInformes] = useState([]);
  
  useEffect(() => {
    getInformes()
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setInformes(json);
      })
      .catch((error) => {
        setInformes([]);
        console.log("Error cargando informes");
      });
  }, []);

  return (
    <div className="common-container flex-v">
      <div className="gap12 recorddetails-section">
        <span className="title-regular">Informes diarios</span>
      </div>
      {Array.isArray(informes) && informes.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Fecha</TableCell>
                <TableCell align="center">Turno</TableCell>
                <TableCell align="center">Especialidad</TableCell>
                <TableCell align="center">Abrir</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {informes.map((informe, index) => (
                <TableRow 
                  align="center"
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{informe.fecha}</TableCell>
                  <TableCell align="center">{informe.turno}</TableCell>
                  <TableCell align="center">{informe.especialidad}</TableCell>
                  <TableCell align="center">
                    <div
                      className="flex-h gap12"
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ButtonSmall
                        text="Abrir"
                        action={() => {
                          navigate(`/edit_informe/${informe.id}`);
                        }}
                      />
                      <ButtonSmall
                        text="Borrar"
                        type="danger" //TODO implementar danger
                        action={() => {
                          if (window.confirm("¿Está seguro?")) {
                            deleteInforme(informe.id)
                              .then((response) => response.json())
                              .then((json) => {
                                if (json["result"] === "ok") {
                                  alert("Eliminado");
                                  getInformes()
                                    .then((response) => response.json())
                                    .then((json) => {
                                      console.log(json);
                                      setInformes(json);
                                    })
                                    .catch((error) => {
                                      setInformes([]);
                                      console.log("Error cargando informes");
                                    });
                                } else {
                                  throw new Error(
                                    "Error, no se sabe si se eliminó"
                                  );
                                }
                              });
                          }
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <span
          className="title-small"
          style={{ textAlign: "center", paddingTop: "12px" }}
        >
          Vac&iacute;o
        </span>
      )}
      <div className="flex-h recorddetails-section-info">
        <span className="micro-italic">{/* aqui puede ir un texto */}</span>
        <div
          className="flex-h gap12"
          style={{
            padding: "12px",
          }}
        >
          <ButtonBig
            text="Añadir"
            icon={icons.DocumentEdit}
            type="secondary"
            action={() => {
              postInforme({})
                .then((response) => response.json())
                .then((json) => {
                  if (json["result"] === "ok" && json["informe_id"]) {
                    navigate(`/edit_informe/${json["informe_id"]}`, {replace:true});
                  } else {
                    throw new Error(
                      "An error ocurred recieving the informe id"
                    );
                  }
                })
                .catch((error) => {
                  alert("No se pudo crear el informe");
                  console.log(error);
                });
            }}
          />
        </div>
      </div>
      
    </div>
  );
}
