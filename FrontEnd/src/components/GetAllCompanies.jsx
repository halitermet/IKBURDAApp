import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom'; // Yönlendirme için import
import Navi from "./Navi.jsx";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../styles/sirketleriListele.css";
import AssignManager from "./AssignManager.jsx";
import AuthContext from '../context/AuthContext';
 
export const GetAllCompanies = () => {
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow,setSelectedRow]=useState();
  const { auth } = useContext(AuthContext)
  const navigate = useNavigate();
 
  useEffect(() => {
    if (auth.role !== 'admin') {
      navigate('/unauthorized'); 
    } else {
      getData();
    }
  }, [auth, navigate]);
 
  const getData = async () => {
    await axios
      .get(
        "https://ikprojesitakimiki.azurewebsites.net/api/Company/GetAllCompanies",
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
            Logo: x.logo,
            Ad:capitalizeFirstLetter(x.name) ,
            Ünvan:capitalizeFirstLetter(x.title) ,
            Mail: x.email,
            Tel: x.phoneNumber,
          });
        });
 
        setShowData(newData);
        setData(result.data.data);
      });
  };
 
  const openModal = (row) => {
    setSelectedRow(row)
    setIsModalOpen(true);
  };
 
  const closeModal = () => {
    setIsModalOpen(false);
  };
 
  const handleDetailsClick = (row) => {
    const allRowData=data.find(a=>a.email===row.Mail)
    navigate('/companyDetail', { state: allRowData });
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  return (
    <div>
      <Navi />
      <Sidebar />
      <div className="main-container">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
            <TableHead className="tableHead">
              <TableRow className="tableRow">
                {showData &&
                  showData.length > 0 &&
                  Object.keys(showData[0]).map((d) => (
                    <TableCell
                      key={d}
                      align="center"
                      style={{ padding: "2px 4px", paddingRight: "4px" }}
                    >
                      {d}
                    </TableCell>
                  ))}
                <TableCell
                  align="center"
                  style={{ padding: "2px 4px", paddingRight: "4px" }}
                >
                  Yöneticiyi Ata
                </TableCell>
                <TableCell
                  align="center"
                  style={{ padding: "2px 4px", paddingRight: "4px" }}
                >
                  Ayrıntılar
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {showData &&
                showData.length > 0 &&
                showData.map((row) => (
                  <TableRow
                  
                    key={row.Mail}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {showData &&
                      showData.length > 0 &&
                      Object.entries(row).map(([k, v]) => {
                        if (k !== "Logo") {
                          return (
                            <TableCell
                              key={k}
                              align="center"
                              style={{ padding: "2px 4px" }}
                            >
                              {v}
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell
                              key={k}
                              align="center"
                              style={{ padding: " 2px 4px" }}
                            >
                              <img
                                height={40}
                                src={"data:image/png;base64," + v}
                                alt="Company Logo"
                              />
                            </TableCell>
                          );
                        }
                      })}
                    <TableCell align="center" style={{ padding: "2px 4px" }}>
                      <button className="btnAta" onClick={()=>openModal(row)}>Şirket Yöneticisi Ata</button>
                    </TableCell>
                    <TableCell align="center" style={{ padding: "2px 4px" }}>
                      <IconButton
                        aria-label="details"
                        onClick={() => handleDetailsClick(row)}
                      >
                        <SearchIcon fontSize="small" />
                        <span style={{ fontSize: "12px" }}>Detay Sayfası</span>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <AssignManager allCompanies={data} getData={getData} selectedRow={selectedRow} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};
 