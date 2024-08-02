import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../styles/assignManager.css";

const AssignManager = ({
  allCompanies,
  getData,
  selectedRow,
  isOpen,
  onClose,
}) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setMessage("");
      axios
        .get(
          "https://ikprojesitakimiki.azurewebsites.net/api/User/GetAllManagers",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        )
        .then((response) => {
          const filteredManager = response.data.data.filter(
            (f) => !allCompanies.some((c) => c.managerEmail === f.email)
          );
          setOptions(filteredManager);
        })
        .catch((error) => {
          console.error("Bir hata oluştu.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  if (!isOpen) return null;

  const assignClick = async () => {
    await axios
      .post(
        "https://ikprojesitakimiki.azurewebsites.net/api/Company/SetManager",
        {
          UserEmail: selectedOption,
          CompanyEmail: selectedRow.Mail,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setOptions(response.data.data);
      })
      .catch((error) => {
        console.error("Bir hata oluştu");
      })
      .finally(async () => {
        await getData();
        setMessage("Yönetici başarıyla atandı.");
        await wait(3000);
        onClose();
      });
  };

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="modal-overlay">
      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div className="modal-content">
          <button className="close-button" onClick={onClose}>
            X
          </button>
          <h1 className="baslik">Yönetici Ata</h1>

          <div className="dropdown">
            <select
              className="select"
              value={selectedOption}
              onChange={handleSelectChange}
            >
              <option value="">Seçiniz</option>
              {options &&
                options.map((option) => (
                  <option key={option.email} value={option.email}>
                    {option.firstName +
                      " " +
                      option.lastName +
                      " " +
                      option.email}
                  </option>
                ))}
            </select>
          </div>
          <button onClick={assignClick} className="btn">
            Yönetici Ata
          </button>
          {message && <p className="assignMessage">{message}</p>}
        </div>
      )}
    </div>
  );
};

export default AssignManager;
