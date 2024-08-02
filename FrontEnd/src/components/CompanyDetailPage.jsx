import React from "react";
import { useLocation } from "react-router-dom";
import Navi from "./Navi";
import "../styles/CompanyDetails.css";
import Sidebar from "./Sidebar";

const capitalizeFirstLetter = (string) => {
  if (string)
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  return null;
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("tr-TR", options);
};

const CompanyDetailPage = () => {
  const location = useLocation();
  const { state: company } = location;

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navi />
      <Sidebar />
      <div className="details-container">
        <h2 className="details-title">Şirket Detayları</h2>
        <div className="details-content">
          <img
            className="company-logo"
            src={"data:image/png;base64," + company.logo}
            alt="Company Logo"
          />
          <div className="company-info">
            <p>
              <span className="info-label">Şirket Adı:</span>{" "}
              {capitalizeFirstLetter(company.name)}
            </p>
            <p>
              <span className="info-label">Şirket Ünvanı:</span>{" "}
              {capitalizeFirstLetter(company.title)}
            </p>
            <p>
              <span className="info-label">Şirket Mersis No:</span>{" "}
              {company.mersisNo}
            </p>
            <p>
              <span className="info-label">Şirket Vergi No:</span>{" "}
              {company.taxNo}
            </p>
            <p>
              <span className="info-label">Şirket Vergi Dairesi:</span>{" "}
              {capitalizeFirstLetter(company.taxOffice)}
            </p>
            <p>
              <span className="info-label">Çalışan Sayısı:</span>{" "}
              {company.numberOfEmployees}
            </p>
            <p>
              <span className="info-label">Şirket Mail Adresi:</span>{" "}
              {company.email}
            </p>
            <p>
              <span className="info-label">Şirket Adresi:</span>{" "}
              {capitalizeFirstLetter(company.address)}
            </p>
            <p>
              <span className="info-label">Şirket Telefonu:</span>{" "}
              {company.phoneNumber}
            </p>
            <p>
              <span className="info-label">Şirket Kuruluş Yılı:</span>{" "}
              {formatDate(company.foundationYear)}
            </p>
            <p>
              <span className="info-label">Sözleşme Başlama Tarihi:</span>{" "}
              {formatDate(company.contractStartDate)}
            </p>
            <p>
              <span className="info-label">Sözleşme Bitiş Tarihi:</span>{" "}
              {formatDate(company.contractEndDate)}
            </p>
            {/* <p><span className="info-label">Şirket Yöneticisi:</span> {company.managerName? (capitalizeFirstLetter(company.managerName)+' '+capitalizeFirstLetter(company.managerLastName)):null}</p> */}
            <p>
              <span className="info-label">Şirket Yöneticileri:</span>
              {company.managers && company.managers.length > 0
                ? company.managers.map((manager, index) => (
                    <span key={index}>
                      {capitalizeFirstLetter(manager.split(",")[0])}{" "}
                      {capitalizeFirstLetter(manager.split(",")[1])}
                      {index < company.managers.length - 1 && ", "}
                    </span>
                  ))
                : "Bilgi yok"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyDetailPage;
