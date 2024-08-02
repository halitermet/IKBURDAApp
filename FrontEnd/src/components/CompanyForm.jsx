import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navi from '../components/Navi';
import Sidebar from '../components/Sidebar';
import '../styles/CompanyForm.css';
import AuthContext from '../context/AuthContext';

const CompanyForm = () => {
  const initialFormData = {
    name: '',
    title: '',
    mersisNo: '',
    taxNo: '',
    taxOffice: '',
    numberOfEmployees: 1,
    logo: null,
    phoneNumber: '',
    address: '',
    email: '',
    foundationYear: '',
    contractStartDate: '',
    contractEndDate: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const alphabeticRegex = /^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/;

  const companyTitles = [
    "A.Ş.",
    "Ltd. Şti.",
    "Teknoloji Hizmetleri A.Ş.",
    "Yazılım Çözümleri Ltd. Şti.",
    "İnşaat ve Taahhüt A.Ş.",
    "Gayrimenkul Geliştirme Ltd. Şti.",
    "Gıda Sanayi ve Ticaret A.Ş.",
    "İçecek Dağıtım Ltd. Şti.",
    "Sağlık Hizmetleri A.Ş.",
    "Medikal Ekipmanlar Ltd. Şti.",
    "Eğitim ve Danışmanlık Hizmetleri A.Ş.",
    "Kariyer ve Eğitim Danışmanlığı Ltd. Şti.",
    "Markası A.Ş.",
    "Global Ltd. Şti.",
    "İnşaat A.Ş.",
    "Danışmanlık Ltd. Şti.",
    "Teknoloji Hizmetleri A.Ş.",
    "İnşaat Ltd. Şti."
  ];

  const validate = () => {
    const newErrors = {};
    const today = new Date().getFullYear();
    const maxYear = today - 100;

    if (!formData.name) {
      newErrors.name = 'Şirket adı boş olamaz';
    } else if (formData.name.length < 1) {
      newErrors.name = 'Şirket adı en az 1 karakter olmalıdır';
    }

    if (!formData.mersisNo) {
      newErrors.mersisNo = 'Mersis No boş olamaz';
    } else if (formData.mersisNo.length !== 16) {
      newErrors.mersisNo = 'Mersis No 16 karakterden oluşmalıdır';
    } else if (!/^\d+$/.test(formData.mersisNo)) {
      newErrors.mersisNo = 'Mersis No sadece rakamlardan oluşmalıdır';
    }

    if (!formData.taxNo) {
      newErrors.taxNo = 'Vergi No boş olamaz';
    } else if (formData.taxNo.length !== 10) {
      newErrors.taxNo = 'Vergi No 10 karakterden oluşmalıdır';
    } else if (!/^\d+$/.test(formData.taxNo)) {
      newErrors.taxNo = 'Vergi No sadece rakamlardan oluşmalıdır';
    }

    if (!formData.taxOffice) {
      newErrors.taxOffice = 'Vergi Dairesi boş olamaz';
    } else if (formData.taxOffice.length < 4) {
      newErrors.taxOffice = 'Vergi Dairesi en az 4 karakter olmalıdır';
    } else if (!alphabeticRegex.test(formData.taxOffice)) {
      newErrors.taxOffice = 'Vergi Dairesi sadece harflerden oluşmalıdır';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Telefon numarası boş olamaz';
    } else if (!/^[0-9]{11}$/.test(formData.phoneNumber) || !formData.phoneNumber.startsWith('0')) {
      newErrors.phoneNumber = 'Telefon numarası 0 ile başlamalı ve 11 haneli olmalıdır';
    }

    if (!formData.address) {
      newErrors.address = 'Adres boş olamaz';
    } else if (formData.address.length < 10) {
      newErrors.address = 'Adres en az 10 karakter olmalıdır';
    }

    if (!formData.email) {
      newErrors.email = 'Email boş olamaz';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Geçerli bir email adresi giriniz';
    }

    if (!formData.foundationYear) {
      newErrors.foundationYear = 'Kuruluş yılı boş olamaz';
    } else if (formData.foundationYear > today) {
      newErrors.foundationYear = 'Kuruluş yılı gelecekte olamaz';
    } else if (formData.foundationYear < maxYear) {
      newErrors.foundationYear = `Kuruluş yılı ${maxYear} yılından daha eski olamaz`;
    }

    if (!formData.contractStartDate) {
      newErrors.contractStartDate = 'Sözleşme başlangıç tarihi boş olamaz';
    } else if (formData.foundationYear && formData.contractStartDate <= formData.foundationYear) {
      newErrors.contractStartDate = 'Sözleşme başlangıç tarihi kuruluş tarihine eşit ya da büyük olmalıdır';
    }

    if (!formData.contractEndDate) {
      newErrors.contractEndDate = 'Sözleşme bitiş tarihi boş olamaz';
    } else if (formData.contractStartDate && formData.contractEndDate < formData.contractStartDate) {
      newErrors.contractEndDate = 'Sözleşme bitiş tarihi başlangıç tarihinden önce olamaz';
    }

    if (formData.numberOfEmployees < 1) {
      newErrors.numberOfEmployees = 'Çalışan sayısı en az 1 olmalıdır';
    }

    if (!formData.logo) {
      newErrors.logo = 'Logo boş olamaz';
    } else {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(formData.logo.type)) {
        newErrors.logo = 'Logo png, jpeg veya jpg formatında olmalıdır';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await axios.post('https://ikprojesitakimiki.azurewebsites.net/api/Company/Register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      setSuccessMessage('Form başarıyla gönderildi');
      setFormData(initialFormData);
      setErrors({});
      setTimeout(() => {
        navigate('/getAllCompanies');  // Kayıt başarılı olduğunda yönlendirme
      }, 3000);  // 3 saniye bekle
    } catch (error) {
      console.error('Form gönderilirken hata oluştu:', error);

      if (error.response && error.response.data && error.response.data.errors) {
        const backendErrors = error.response.data.errors;
        const newErrors = {};
        for (const key in backendErrors) {
          newErrors[key] = backendErrors[key].join(', ');
        }
        setErrors(newErrors);
      } else {
        setErrors({ form: 'Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.' });
      }
    }
  };

  const handleFoundationYearInput = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Sadece rakamları tut
    if (value.length <= 4) { // Maksimum 4 karaktere izin ver
      setFormData((prevData) => ({
        ...prevData,
        foundationYear: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        foundationYear: '',
      }));
    }
  };

  const handleDateInput = (e) => {
    const { name, value } = e.target;
    const newValue = value.replace(/(\d{4})\d+/, '$1'); // Yıl kısmını 4 basamak ile sınırlandır
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  return (
    <>
      <Navi />
      <Sidebar />
      <form className="company-form" onSubmit={handleSubmit}>
        <h2 className="company-form-h2">Şirket Ekle</h2>
        <label>
          Şirket Adı:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <span className="error">{errors.name}</span>}
        </label>
        <label>
          Şirket Ünvanı:
          <select name="title" value={formData.title} onChange={handleChange}>
            <option value="" disabled>Şirket Ünvanı Seçiniz</option>
            {companyTitles.map((title, index) => (
              <option key={index} value={title}>
                {title}
              </option>
            ))}
          </select>
          {errors.title && <span className="error">{errors.title}</span>}
        </label>
        <label>
          Mersis No:
          <input type="text" name="mersisNo" value={formData.mersisNo} onChange={handleChange} />
          {errors.mersisNo && <span className="error">{errors.mersisNo}</span>}
        </label>
        <label>
          Vergi No:
          <input type="text" name="taxNo" value={formData.taxNo} onChange={handleChange} />
          {errors.taxNo && <span className="error">{errors.taxNo}</span>}
        </label>
        <label>
          Vergi Dairesi:
          <input type="text" name="taxOffice" value={formData.taxOffice} onChange={handleChange} />
          {errors.taxOffice && <span className="error">{errors.taxOffice}</span>}
        </label>
        <label>
          Çalışan Sayısı:
          <input type="number" name="numberOfEmployees" value={formData.numberOfEmployees} onChange={handleChange} min="1" />
          {errors.numberOfEmployees && <span className="error">{errors.numberOfEmployees}</span>}
        </label>
        <label>
          Logo:
          <input type="file" name="logo" onChange={handleChange} />
          {errors.logo && <span className="error">{errors.logo}</span>}
        </label>
        <label>
          Telefon Numarası:
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
        </label>
        <label>
          Adres:
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
          {errors.address && <span className="error">{errors.address}</span>}
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </label>
        <label>
          Kuruluş Yılı:
          <input
            type="text"
            name="foundationYear"
            value={formData.foundationYear}
            onInput={handleFoundationYearInput}
            placeholder="YYYY"
          />
          {errors.foundationYear && <span className="error">{errors.foundationYear}</span>}
        </label>
        <label>
          Sözleşme Başlangıç Tarihi:
          <input type="date" name="contractStartDate" value={formData.contractStartDate} onChange={handleDateInput} />
          {errors.contractStartDate && <span className="error">{errors.contractStartDate}</span>}
        </label>
        <label>
          Sözleşme Bitiş Tarihi:
          <input type="date" name="contractEndDate" value={formData.contractEndDate} onChange={handleDateInput} />
          {errors.contractEndDate && <span className="error">{errors.contractEndDate}</span>}
        </label>
        <button type="submit">Gönder</button>
        {Object.values(errors).map((error, index) => (
          <p key={index} className="error">{error}</p>
        ))}
        {successMessage && <p className="success">{successMessage}</p>}
      </form>
    </>
  );
};

export default CompanyForm;
