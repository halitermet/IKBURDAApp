import React, { useState, useEffect, useContext } from 'react';
import Navi from '../components/Navi';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import '../styles/DetailPage.css';
import AuthContext from '../context/AuthContext';

const DetailPage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth, setAuth } = useContext(AuthContext); 

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (auth.token) {
        try {
          const response = await axios.get('https://ikprojesitakimiki.azurewebsites.net/api/User/getUserByToken', {
            headers: {
              'Authorization': `Bearer ${auth.token}`
            }
          });
          setUserDetails(response.data.data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching user details:', err);
          setError('Sayfa yüklenemedi');
          setLoading(false);
        }
      } else {
        setError('Token bulunamadı');
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [auth.token]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  return (
    <>
      <Navi />
      <Sidebar />
      {loading ? (
        <div className="loading">Yükleniyor...</div>
      ) : error ? (
        <div className="error">Hata: {error}</div>
      ) : (
        <div className={`user-detail-card ${auth.role}`}>
          <h2 className={`${auth.role}`}>Kullanıcı Detayları</h2>
          <img src={`data:image/jpeg;base64,${userDetails.photo}`} alt={userDetails.firstName} className="user-photo" />
          <div className={`user-info ${auth.role}`}>
            <p><strong>Ad:</strong> {capitalizeFirstLetter(userDetails.firstName)}</p>
            {userDetails.secondName && <p><strong>İkinci Ad:</strong> {capitalizeFirstLetter(userDetails.secondName)}</p>}
            <p><strong>Soyad:</strong> {capitalizeFirstLetter(userDetails.lastName)}</p>
            {userDetails.secondLastName && <p><strong>İkinci Soyad:</strong> {capitalizeFirstLetter(userDetails.secondLastName)}</p>}
            <p><strong>TC:</strong> {userDetails.tc}</p>
            <p><strong>Doğum Tarihi:</strong> {formatDate(userDetails.birthDate)}</p>
            <p><strong>Doğum Yeri:</strong> {capitalizeFirstLetter(userDetails.placeOfBirth)}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Telefon:</strong> {userDetails.phoneNumber}</p>
            <p><strong>Adres:</strong> {capitalizeFirstLetter(userDetails.address)}</p>
            <p><strong>Başlangıç Tarihi:</strong> {formatDate(userDetails.startDate)}</p>
            {userDetails.endDate && <p><strong>Çıkış Tarihi:</strong> {formatDate(userDetails.endDate)}</p>}
            <p><strong>Meslek:</strong> {capitalizeFirstLetter(userDetails.profession)}</p>
            <p><strong>Departman:</strong> {capitalizeFirstLetter(userDetails.department)}</p>
            {userDetails.salary !== null && <p><strong>Maaş:</strong> {userDetails.salary}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default DetailPage;
