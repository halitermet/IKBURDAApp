import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navi from '../components/Navi';
import Sidebar from '../components/Sidebar';
import '../styles/UpdatePage.css';
import AuthContext from '../context/AuthContext';

const UpdatePage = () => {
  const [user, setUser] = useState({
    PhoneNumber: '',
    Address: ''
  });
  const [photo, setPhoto] = useState('');
  const [newPhoto, setNewPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [inputErrors, setInputErrors] = useState({
    PhoneNumber: '',
    Address: '',
    Photo: ''
  });

  const { auth } = useContext(AuthContext); // AuthContext'ten auth bilgisini alın
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (auth.token) {
        try {
          const response = await axios.get('https://ikprojesitakimiki.azurewebsites.net/api/User/getUserByToken', {
            headers: {
              'Authorization': `Bearer ${auth.token}`
            }
          });
          const data = response.data.data;
          setUser({
            PhoneNumber: data.phoneNumber,
            Address: data.address
          });
          setPhoto(`data:image/jpeg;base64,${data.photo}`);
          setLoading(false);
        } catch (error) {
          setError('Kullanıcı bilgileri alınırken hata oluştu');
          setLoading(false);
        }
      }
    };

    fetchUserDetails();
  }, [auth.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'PhoneNumber' && !/^[0-9]*$/.test(value)) {
      return;
    }
    setUser((prevState) => ({
      ...prevState,
      [name]: value
    }));
    setInputErrors((prevState) => ({
      ...prevState,
      [name]: ''
    }));
    setError('');
    setSuccess('');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validFormats.includes(file.type)) {
        setError('Sadece JPEG, PNG ve JPG formatları desteklenmektedir');
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setError('Fotoğraf boyutu 25 MB\'yi geçemez');
        return;
      }
      setNewPhoto(file);
      setError('');
      setInputErrors((prevState) => ({
        ...prevState,
        Photo: ''
      }));
      setSuccess('');
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^0[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateAddress = (address) => {
    return address.length >= 10;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!user.PhoneNumber) newErrors.PhoneNumber = 'Telefon numarası boş olamaz';
    if (!user.Address) newErrors.Address = 'Adres boş olamaz';
    if (!photo && !newPhoto) newErrors.Photo = 'Fotoğraf boş olamaz';
    setInputErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setError('Tüm alanlar doldurulmalıdır');
      setSuccess('');
      return;
    }

    if (!validateAddress(user.Address)) {
      setInputErrors((prevState) => ({
        ...prevState,
        Address: 'Adres en az 10 karakterli olmalıdır.'
      }));
      setError('Adres en az 10 karakterli olmalıdır.');
      setSuccess('');
      return;
    }

    if (!validatePhone(user.PhoneNumber)) {
      setInputErrors((prevState) => ({
        ...prevState,
        PhoneNumber: 'Telefon numarası 11 haneli olmalı ve sıfır ile başlamalıdır'
      }));
      setError('Telefon numarası 11 haneli olmalı ve sıfır ile başlamalıdır');
      setSuccess('');
      return;
    }

    const formData = new FormData();
    formData.append('PhoneNumber', user.PhoneNumber);
    formData.append('Address', user.Address);
    if (newPhoto) {
      formData.append('PhotoFile', newPhoto);
    }

    try {
      const response = await axios.patch(
        'https://ikprojesitakimiki.azurewebsites.net/api/User/updateUser',
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setSuccess('Bilgiler başarıyla güncellendi. Detay sayfasına yönlendiriliyorsunuz...');
      setError('');
      if (newPhoto) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhoto(reader.result);
        };
        reader.readAsDataURL(newPhoto);
      }
      setTimeout(() => {
        navigate('/userDetail');
      }, 1000); // 1 saniye bekletme süresi
    } catch (error) {
      setError('Bilgiler güncellenirken hata oluştu');
      setSuccess('');
    }
  };

  return (
    <>
      <Navi />
      <Sidebar />
      <div className={`update-form-container ${auth.role}`}>
        <h2 className={`${auth.role}`}>Kullanıcı Bilgilerini Güncelle</h2>
        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <form onSubmit={handleSubmit} className="update-form">
            <div className="form-group">
              <label>Telefon:</label>
              <input
                type="text"
                name="PhoneNumber"
                value={user.PhoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Adres:</label>
              <input
                type="text"
                name="Address"
                value={user.Address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Fotoğraf:</label>
              {photo && <img src={photo} alt="Profile" className="update-profile-photo" />}
              <input
                type="file"
                accept="image/jpeg, image/png, image/jpg"
                onChange={handlePhotoChange}
              />
            </div>
            <button type="submit" className={`btn ${auth.role}`}>Güncelle</button>
            {error && <p className="hata">{error}</p>}
            {success && <p className="basarili">{success}</p>}
          </form>
        )}
      </div>
    </>
  );
};

export default UpdatePage;
