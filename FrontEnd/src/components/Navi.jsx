import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navi.css';
import logo from '../assets/image/logo.png';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

function Navi() {
  const [profile, setProfile] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { auth, setAuth } = useContext(AuthContext); // AuthContext'ten auth bilgisini alın

  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.token) {
        try {
          const response = await axios.get('https://ikprojesitakimiki.azurewebsites.net/api/User/getUserByToken', {
            headers: {
              'Authorization': `Bearer ${auth.token}`
            }
          });
          const data = response.data.data;
          setProfile(data);
        } catch (error) {
          console.error('Error fetching profile:', error);
          setAuth({ token: null, role: null });
        }
      }
    };

    fetchProfile(); 

    // Tıklama olaylarını dinleyen bir işlev
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-menu')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth({ token: null, role: null });
    window.location.href = '/login';
  };

  //Menüyü açma kapatma işlemleri.
  const toggleMenu = (event) => {
    event.stopPropagation(); 
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar ${auth.role}`}>
      <div className="navbar-left">
        <img className="resim" src={logo} alt="Logo" />
        <div className="title-container">
          { <Link to="/main" className="ik-burada">İK BURADA</Link>}
          
          <p>İnsan Kaynakları Yönetim Sistemi</p>
        </div>
      </div>
      {auth.token  && (
        <div className="navbar-right">
          <div className="profile-menu">
            {profile && (
              <>
                <img
                  src={`data:image/jpeg;base64,${profile.photo}`}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="navbar-user-photo"
                  onClick={toggleMenu}
                />
                {isMenuOpen && (
                  <div className={`dropdown-menu  ${auth.role}`}>
                    <Link to="/userDetail" className={`dropdown-item ${auth.role}`}>Detay</Link>
                    <Link to="/updateUser" className={`dropdown-item ${auth.role}`}>Güncelle</Link>
                    <button onClick={handleLogout} className={`logout-button ${auth.role}`}>Çıkış Yap</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navi;
