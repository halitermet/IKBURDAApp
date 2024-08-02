import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="unauthorized-container">
      <h1>Yetkisiz Erişim</h1>
      <p>Bu sayfa için erişim yetkiniz bulunmamaktadır.</p>
      <button onClick={handleGoBack}>Geri Dön</button>
    </div>
  );
};

export default Unauthorized;
