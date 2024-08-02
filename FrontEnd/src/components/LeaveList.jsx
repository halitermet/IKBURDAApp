import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

const RequestList = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [requestData, setRequestData] = useState([]);
  

  useEffect(() => {
    if (auth.role !== "employee" && auth.role !== "manager") {
      navigate("/unauthorized");
    } else {
      const email = localStorage.getItem("email");
      axios
        .get(
          "https://ikprojesitakimiki.azurewebsites.net/api/Request/GetAllRequests",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        )
        .then((result) => {
          const newData = result.data.data.leaveRequests
            .filter((x) => x.email === email)
            .map((x) => ({
              "Türü":x.leaveType,
              "Talep Tarihi":formatDate(x.added),
              "İzin Bitiş Tarihi": formatDate(x.leaveEndDate),
              "İzin Başlama Tarihi": formatDate(x.leaveStartDate),
              "Onaylanma Durumu":x.requestStatus,
              id: x.id,
            }));
          setRequestData(newData);
        })
        .catch((error) => {
          console.error("Veri çekme hatası:", error);
        });
    }
  }, [auth, navigate]);

  const handleDelete = (id) => {
    console.log(id, auth);
    axios
      .delete(
        `https://ikprojesitakimiki.azurewebsites.net/api/Request/DeleteLeaveRequest/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      )
      .then(() => {
        setRequestData(requestData.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error("Silme hatası:", error);
      });
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
          <TableHead className="tableHead">
            <TableRow className="tableRow">
              {requestData.length > 0 &&
                Object.keys(requestData[0]).map(
                  (d) =>
                    d !== "id" && (
                      <TableCell
                        key={d}
                        align="center"
                        style={{ padding: "2px 4px", paddingRight: "4px" }}
                      >
                        {d}
                      </TableCell>
                    )
                )}
              <TableCell
                align="center"
                style={{ padding: "2px 4px", paddingRight: "4px" }}
              >
                Talebi Sil
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requestData.map((row, index) => (
              <TableRow key={index}>
                {Object.keys(row).map(
                  (key) =>
                    key !== "id" && (
                      <TableCell
                        key={key}
                        align="center"
                        style={{ padding: "2px 4px" }}
                      >
                        {row[key]}
                      </TableCell>
                    )
                )}
                <TableCell align="center" style={{ padding: "2px 4px" }}>
                  <Button
                    variant="contained"
                    class="btn-delete"
                    onClick={() => handleDelete(row.id)}
                  >
                    Sil
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RequestList;
