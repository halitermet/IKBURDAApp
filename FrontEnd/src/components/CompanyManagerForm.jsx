import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navi from '../components/Navi';
import Sidebar from '../components/Sidebar';
import '../styles/CompanyManagerForm.css';
import AuthContext from '../context/AuthContext';

const CompanyManagerForm = () => {
    const initialFormData = {
        tc: '',
        firstName: '',
        lastName: '',
        secondName: '',
        secondLastName: '',
        phoneNumber: '',
        mail: '',
        birthDate: '',
        placeOfBirth: '',
        startDate: '',
        endDate: '',
        profession: '',
        department: '',
        address: '',
        salary: '',
        photoFile: null,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [formTitle, setFormTitle] = useState('Şirket Yöneticisi Ekle');
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.role === 'manager') {
            setFormTitle('Personel Ekle');
        } else {
            setFormTitle('Şirket Yöneticisi Ekle');
        }
    }, [auth.role]);

    const validateTC = (tc) => {
        if (tc.length !== 11) {
            return false;
        }
        if (!/^[0-9]+$/.test(tc)) {
            return false;
        }
        if (tc[0] === '0') {
            return false;
        }

        let sumOdd = 0;
        let sumEven = 0;
        let total = 0;

        for (let i = 0; i < 9; i++) {
            let val = parseInt(tc[i], 10);
            total += val;

            if (i % 2 === 0) {
                sumOdd += val;
            } else {
                sumEven += val;
            }
        }

        const digit10 = parseInt(tc[9], 10);
        const digit11 = parseInt(tc[10], 10);

        const checkDigit10 = ((sumOdd * 7) - sumEven) % 10;
        const checkDigit11 = (total + digit10) % 10;

        if (checkDigit10 !== digit10) {
            return false;
        }

        if (checkDigit11 !== digit11) {
            return false;
        }

        return true;
    };

    const validateDate = (dateString, minDate, maxDate) => {
        const date = new Date(dateString);
        return date >= minDate && date <= maxDate;
    };

    const validate = () => {
        const newErrors = {};
        const onlyLetters = /^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/;
        const today = new Date();
        const minBirthDate = new Date('1924-01-01'); // Doğum tarihi için en erken kabul edilen tarih

        if (!formData.tc) {
            newErrors.tc = 'TC kimlik numarası boş olamaz';
        } else if (!validateTC(formData.tc)) {
            newErrors.tc = 'Geçersiz TC kimlik numarası';
        }

        if (!formData.firstName) {
            newErrors.firstName = 'Ad boş olamaz';
        } else if (!onlyLetters.test(formData.firstName)) {
            newErrors.firstName = 'Ad sadece harflerden oluşmalıdır';
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = 'Ad en az 2 karakter olmalıdır';
        }

        if (!formData.lastName) {
            newErrors.lastName = 'Soyad boş olamaz';
        } else if (!onlyLetters.test(formData.lastName)) {
            newErrors.lastName = 'Soyad sadece harflerden oluşmalıdır';
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = 'Soyad en az 2 karakter olmalıdır';
        }

        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Telefon numarası boş olamaz';
        } else if (!/^[0-9]{11}$/.test(formData.phoneNumber) || !formData.phoneNumber.startsWith('0')) {
            newErrors.phoneNumber = 'Telefon numarası 0 ile başlamalı ve 11 haneli olmalıdır';
        }

        if (!formData.mail) {
            newErrors.mail = 'Email boş olamaz';
        } else if (!formData.mail.includes('@')) {
            newErrors.mail = 'Geçerli bir email adresi giriniz';
        }

        if (!formData.birthDate) {
            newErrors.birthDate = 'Doğum tarihi boş olamaz';
        } else if (!validateDate(formData.birthDate, minBirthDate, today)) {
            newErrors.birthDate = `Doğum tarihi 01.01.1924 ile bugün arasında olmalıdır`;
        } else {
            const birthYear = new Date(formData.birthDate).getFullYear();
            if (today.getFullYear() - birthYear < 18) {
                newErrors.birthDate = 'Yönetici 18 yaşından büyük olmalıdır';
            }
        }

        if (!newErrors.birthDate) { // doğum tarihi geçerli ise diğer tarihleri kontrol et
            const birthDate = new Date(formData.birthDate);
            const minStartDate = new Date(birthDate.getFullYear() + 18, birthDate.getMonth(), birthDate.getDate());
            if (!formData.startDate) {
                newErrors.startDate = 'Başlangıç tarihi boş olamaz';
            } else if (new Date(formData.startDate) < minStartDate) {
                newErrors.startDate = `Başlangıç tarihi doğum tarihinden en az 18 yıl sonrasında olmalıdır`;
            }

            if (formData.endDate && formData.endDate <= formData.startDate) {
                newErrors.endDate = 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır';
            }
        }

        if (!formData.placeOfBirth) {
            newErrors.placeOfBirth = 'Doğum yeri boş olamaz';
        } else if (!onlyLetters.test(formData.placeOfBirth)) {
            newErrors.placeOfBirth = 'Doğum yeri sadece harflerden oluşmalıdır';
        } else if (formData.placeOfBirth.length < 3) {
            newErrors.placeOfBirth = 'Doğum yeri en az 3 karakter olmalıdır';
        }

        if (!formData.profession) {
            newErrors.profession = 'Meslek boş olamaz';
        } else if (!onlyLetters.test(formData.profession)) {
            newErrors.profession = 'Meslek sadece harflerden oluşmalıdır';
        }

        if (!formData.department) {
            newErrors.department = 'Departman boş olamaz';
        } else if (!onlyLetters.test(formData.department)) {
            newErrors.department = 'Departman sadece harflerden oluşmalıdır';
        }

        if (!formData.address) {
            newErrors.address = 'Adres boş olamaz';
        } else if (formData.address.length < 10) {
            newErrors.address = 'Adres en az 10 karakter olmalıdır';
        }

        if (!formData.salary) {
            newErrors.salary = 'Maaş boş olamaz';
        } else if (isNaN(formData.salary) || formData.salary < 1) {
            newErrors.salary = 'Maaş geçerli bir sayı olmalıdır ve 1\'den küçük olamaz';
        }

        if (!formData.photoFile) {
            newErrors.photoFile = 'Fotoğraf boş olamaz';
        } else {
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!validTypes.includes(formData.photoFile.type)) {
                newErrors.photoFile = 'Fotoğraf png, jpeg veya jpg formatında olmalıdır';
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
            await axios.post('https://ikprojesitakimiki.azurewebsites.net/api/User/register', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${auth.token}`,
                },
            });

            const successMessage = auth.role === 'admin'
                ? 'Şirket yöneticisi başarı ile kaydedildi. E-posta adresine şifre gönderildi.'
                : 'Personel başarı ile kaydedildi. E-posta adresine şifre gönderildi.';
            setSuccessMessage(successMessage);
            setFormData(initialFormData);
            setErrors({});
            setTimeout(() => {
                navigate(auth.role === 'admin' ? '/getAllManager' : '/getAllEmployee');
            }, 3000); // 3 saniye sonra yönlendirme
        } catch (error) {
            const newErrors = {};
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.error;
                if (errorMessage.includes('TC')) {
                    newErrors.tc = 'Bu TC kimlik numarası zaten kayıtlı';
                }
                if (errorMessage.includes('email')) {
                    newErrors.mail = 'Bu email adresi zaten kayıtlı';
                }
                if (!newErrors.tc && !newErrors.mail) {
                    newErrors.form = errorMessage;
                }
            } else {
                newErrors.form = 'Form gönderilirken hata oluştu';
            }
            setErrors(newErrors);
        }
    };

    const today = new Date();
    const minBirthDate = new Date('1924-01-01');

    const handleBirthDateChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            startDate: '', 
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
            startDate: '', 
        }));
    };

    const getStartDateMin = () => {
        if (!formData.birthDate) return '';
        const birthDate = new Date(formData.birthDate);
        const startDateMin = new Date(birthDate.getFullYear() + 18, birthDate.getMonth(), birthDate.getDate());
        return startDateMin.toISOString().split('T')[0];
    };

    return (
        <>
            <Navi />
            <Sidebar />
            <form className="company-executive-form" onSubmit={handleSubmit}>
                <h2 className={`company-executive-form-header ${auth.role}`}>{formTitle}</h2>
                <label>
                    TC Kimlik No:
                    <input type="text" name="tc" value={formData.tc} onChange={handleChange} />
                    {errors.tc && <span className="error">{errors.tc}</span>}
                </label>
                <label>
                    Ad:
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                    {errors.firstName && <span className="error">{errors.firstName}</span>}
                </label>
                <label>
                    Soyad:
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                    {errors.lastName && <span className="error">{errors.lastName}</span>}
                </label>
                <label>
                    İkinci Ad:
                    <input type="text" name="secondName" value={formData.secondName} onChange={handleChange} />
                    {errors.secondName && <span className="error">{errors.secondName}</span>}
                </label>
                <label>
                    İkinci Soyad:
                    <input type="text" name="secondLastName" value={formData.secondLastName} onChange={handleChange} />
                    {errors.secondLastName && <span className="error">{errors.secondLastName}</span>}
                </label>
                <label>
                    Telefon Numarası:
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                    {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
                </label>
                <label>
                    Email:
                    <input type="email" name="mail" value={formData.mail} onChange={handleChange} />
                    {errors.mail && <span className="error">{errors.mail}</span>}
                </label>
                <label>
                    Doğum Tarihi:
                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleBirthDateChange} max={today.toISOString().split('T')[0]} min={minBirthDate.toISOString().split('T')[0]} />
                    {errors.birthDate && <span className="error">{errors.birthDate}</span>}
                </label>
                <label>
                    Doğum Yeri:
                    <input type="text" name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} />
                    {errors.placeOfBirth && <span className="error">{errors.placeOfBirth}</span>}
                </label>
                <label>
                    Başlangıç Tarihi:
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} min={getStartDateMin()} />
                    {errors.startDate && <span className="error">{errors.startDate}</span>}
                </label>
                <label>
                    Bitiş Tarihi:
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                    {errors.endDate && <span className="error">{errors.endDate}</span>}
                </label>
                <label>
                    Meslek:
                    <input type="text" name="profession" value={formData.profession} onChange={handleChange} />
                    {errors.profession && <span className="error">{errors.profession}</span>}
                </label>
                <label>
                    Departman:
                    <input type="text" name="department" value={formData.department} onChange={handleChange} />
                    {errors.department && <span className="error">{errors.department}</span>}
                </label>
                <label>
                    Adres:
                    <input type="text" name="address" value={formData.address} onChange={handleChange} />
                    {errors.address && <span className="error">{errors.address}</span>}
                </label>
                <label>
                    Maaş:
                    <input type="number" name="salary" value={formData.salary} min="1" onChange={handleChange} />
                    {errors.salary && <span className="error">{errors.salary}</span>}
                </label>
                <label>
                    Fotoğraf:
                    <input type="file" name="photoFile" onChange={handleChange} />
                    {errors.photoFile && <span className="error">{errors.photoFile}</span>}
                </label>
                <button className={`company-executive-form-button ${auth.role}`}type="submit">Kaydet</button>
                {errors.form && <p className="error">{errors.form}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
            </form>
        </>
    );
};

export default CompanyManagerForm;
