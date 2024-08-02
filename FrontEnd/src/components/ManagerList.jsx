import React, { useContext, useEffect, useState } from "react";
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
import AuthContext from "../context/AuthContext";

const ManagerList = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [managerData, setManagerData] = useState([]);
  useEffect(() => {
    if (auth.role !== "admin") {
      navigate("/unauthorized");
    } else {
      axios
        .get(
          "https://ikprojesitakimiki.azurewebsites.net/api/Company/GetAllCompanies",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        )
        .then((companiesResult) => {
          axios
            .get(
              "https://ikprojesitakimiki.azurewebsites.net/api/User/GetAllManagers",
              {
                headers: {
                  Authorization: `Bearer ${auth.token}`,
                },
              }
            )
            .then((result) => {
              const newData = [];
              result.data.data.forEach((x) => {
                const company = companiesResult.data.data.find(
                  (c) => c.managers && c.managers.find(m=>m.split(",")[2]===x.email)
                );
                newData.push({
                  Ad: capitalizeFirstLetter(x.firstName),
                  Soyad: capitalizeFirstLetter(x.lastName),
                  Mail: x.email,
                  Tel: x.phoneNumber,
                  Sirket: company ? company.name : "",
                });
              });
              setManagerData(newData);
            });
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
      <div className="main-container">
        <TableContainer  component={Paper}>
          <Table  sx={{ minWidth: 650 }} size="small" aria-label="simple table">
            <TableHead className="tableHead">
              <TableRow className="tableRow">
                {managerData &&
                  managerData.length > 0 &&
                  Object.keys(managerData[0]).map((d) => (
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
              {managerData.map((row) => (
                <TableRow key={row.Mail}>
                  {managerData &&
                    managerData.length > 0 &&
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
  );
};

export default ManagerList;
