import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import '../styles/ProfileCard.css';
import AuthContext from '../context/AuthContext';

const ProfileCard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext); // AuthContext'ten auth bilgisini alın

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://ikprojesitakimiki.azurewebsites.net/api/User/getUserByToken', {
          headers: {
            'Authorization': `Bearer ${auth.token}` // AuthContext'teki token'ı kullanın
          }
        });
        const data = response.data.data;
        setProfile(data);
        setLoading(false);
      } catch (error) {
        setError('Profil bilgileri yüklenemedi');
        setLoading(false);
      }
    };

    if (auth.token) {
      fetchProfile();
    } else {
      setError('Token bulunamadı');
      setLoading(false);
    }
  }, [auth.token]); // auth.token değiştiğinde useEffect'i yeniden çalıştırın

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">Hata: {error}</div>
      </div>
    );
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const fullName = `${capitalizeFirstLetter(profile.firstName)} ${profile.secondName ? capitalizeFirstLetter(profile.secondName) + ' ' : ''}${capitalizeFirstLetter(profile.lastName)} ${profile.secondLastName ? capitalizeFirstLetter(profile.secondLastName) : ''}`.trim();

  return (
    <div className={`profile-card ${auth.role}`}>
      <div className="profile-photo-section">
        <img src={`data:image/jpeg;base64,${profile.photo}`} alt={profile.firstName} className="profile-photo-card" />
        <div className="profile-additional-info">
          <p className="aciklama"> {capitalizeFirstLetter(profile.profession)}</p>
          <p className="aciklama"> {capitalizeFirstLetter(profile.department)}</p>
        </div>
      </div>
      <div className="profile-info">
      <h2 className={`${auth.role}`}>Hoşgeldiniz {fullName}</h2>
        <p className="aciklama">{profile.email}</p>
        <p className="aciklama">{profile.phoneNumber}</p>
        <p className="aciklama">{capitalizeFirstLetter(profile.address)}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
