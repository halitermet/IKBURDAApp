import React, { useState,useEffect,useContext } from 'react'
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Yönlendirme için import
import Navi from "./Navi.jsx";
import Sidebar from "./Sidebar.jsx";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";

const PersonalList = () => {
    const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const[personalData,setPersonalData]=useState([]);
  useEffect(()=>{
    if (auth.role !== "admin" && auth.role !== "manager" ) {
        navigate("/unauthorized");
      }
      else{
        axios
        // getAllEmployee ile istek değişecek
        .get(
          "https://ikprojesitakimiki.azurewebsites.net/api/User/GetAllEmployees",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        )
        .then((result) => {
            const newData = [];
            result.data.data.forEach((x) => {
              newData.push({
                
                Ad:capitalizeFirstLetter(x.firstName) ,
                Soyad:capitalizeFirstLetter(x.lastName),
                Mail:x.email

              });
            });
     
            setPersonalData(newData);
            
          });
      }
  }, [auth, navigate]);


  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  return (
    
    <div>
         <Navi />
      <Sidebar />
      <div>
      <div className="main-container">
        <TableContainer  component={Paper}>
          <Table  sx={{ minWidth: 650 }} size="small" aria-label="simple table">
            <TableHead className="tableHead">
              <TableRow className="tableRow">
                {personalData &&
                  personalData.length > 0 &&
                  Object.keys(personalData[0]).map((d) => (
                    <TableCell 
                      key={d}
                      align="center"
                      style={{ padding: "2px 4px", paddingRight: "4px" }}
                    >
                      {d}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {personalData.map((row) => (
                <TableRow key={row.Mail}>
                  {personalData &&
                    personalData.length > 0 &&
                    Object.entries(row).map(([k, v]) => {
                      return (
                        <TableCell
                          key={k}
                          align="center"
                          style={{ padding: "2px 4px" }}
                        >
                          {v}
                        </TableCell>
                      );
                    })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      </div>
    </div>
  )
}

export default PersonalList