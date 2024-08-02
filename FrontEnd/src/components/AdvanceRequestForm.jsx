import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import '../styles/AdvanceRequestForm.css';

const AdvanceRequestForm = () => {
    const initialFormData = {
        AdvanceType: '',
        AdvanceAmount: '',
        AdvanceCurrency: 'TL', 
        Description: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [salary, setSalary] = useState(0); 
    const { auth } = useContext(AuthContext);

    const corporateLimits = {
        'TL': { min: 1000, max: 50000 },
        'USD': { min: 50, max: 5000 },
        'EURO': { min: 50, max: 5000 },
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get('https://ikprojesitakimiki.azurewebsites.net/api/User/getUserByToken', {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                    },
                });
                setSalary(response.data.data.salary); 
            } catch (error) {
                console.error('Kullanıcı bilgisi alınırken hata oluştu:', error);
            }
        };

        fetchUserDetails();
    }, [auth.token]);

    const validate = () => {
        const newErrors = {};

        if (!formData.AdvanceType) {
            newErrors.AdvanceType = 'Tür boş olamaz';
        }

        if (!formData.AdvanceAmount) {
            newErrors.AdvanceAmount = 'Tutar boş olamaz';
        } else if (formData.AdvanceType === 'individual') {
            if (isNaN(formData.AdvanceAmount) || formData.AdvanceAmount < 1000 || formData.AdvanceAmount > salary * 3) {
                newErrors.AdvanceAmount = `Tutar en az 1000 TL ve en fazla maaşınızın 3 katı (${salary * 3} TL) olmalıdır.`;
            }
        } else if (formData.AdvanceType === 'corporate') {
            const limits = corporateLimits[formData.AdvanceCurrency];
            if (isNaN(formData.AdvanceAmount) || formData.AdvanceAmount < limits.min || formData.AdvanceAmount > limits.max) {
                newErrors.AdvanceAmount = `Tutar ${limits.min} ile ${limits.max} ${formData.AdvanceCurrency} arasında olmalıdır.`;
            }
        }

        if (!formData.AdvanceCurrency && formData.AdvanceType === 'corporate') {
            newErrors.AdvanceCurrency = 'Para birimi boş olamaz';
        }

        if (formData.AdvanceType === 'individual') {
            if (!formData.Description) {
                newErrors.Description = 'Açıklama boş olamaz';
            } else if (formData.Description.length < 10 || formData.Description.length > 300) {
                newErrors.Description = 'Açıklama en az 10, en fazla 300 karakter olmalıdır';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const handleTypeChange = (type) => {
        setFormData({
            AdvanceType: type,
            AdvanceAmount: '',
            AdvanceCurrency: 'TL', 
            Description: '',
        });
        setErrors({});
        setSuccessMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        const submitData = {
            advanceType: formData.AdvanceType,
            advanceAmount: formData.AdvanceAmount,
            advanceCurrency: formData.AdvanceCurrency,
            description: formData.Description
        };

        try {
            await axios.post('https://ikprojesitakimiki.azurewebsites.net/api/Request/CreateAdvance', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${auth.token}`,
                },
            });
            setSuccessMessage('Talep başarıyla gönderildi');
            setFormData(initialFormData);
            setErrors({});
        } catch (error) {
            console.error('Talep gönderilirken hata oluştu:', error);
            setErrors({ form: 'Talep gönderilirken bir hata oluştu. Lütfen tekrar deneyin.' });
        }
    };

    return (
        <div className="advance-form-container">
            <form className="advance-form" onSubmit={handleSubmit}>
                <div className="styled-radio-group">
                    <label className={`styled-radio ${formData.AdvanceType === 'corporate' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="AdvanceType"
                            value="corporate"
                            onChange={() => handleTypeChange('corporate')}
                        />
                        Kurumsal
                    </label>
                    <label className={`styled-radio ${formData.AdvanceType === 'individual' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="AdvanceType"
                            value="individual"
                            onChange={() => handleTypeChange('individual')}
                        />
                        Bireysel
                    </label>
                </div>
                {errors.AdvanceType && <span className="advance-error">{errors.AdvanceType}</span>}

                {formData.AdvanceType && (
                    <>
                        <label>
                            Tutar:
                            <input
                                type="number"
                                name="AdvanceAmount"
                                value={formData.AdvanceAmount}
                                onChange={handleChange}
                                min={formData.AdvanceType === 'individual' ? 1000 : corporateLimits[formData.AdvanceCurrency]?.min}
                                max={formData.AdvanceType === 'individual' ? salary * 3 : corporateLimits[formData.AdvanceCurrency]?.max}
                                required
                            />
                            {errors.AdvanceAmount && <span className="advance-error">{errors.AdvanceAmount}</span>}
                        </label>
                        {formData.AdvanceType === 'corporate' && (
                            <label>
                                Para Birimi:
                                <select 
                                    name="AdvanceCurrency" 
                                    value={formData.AdvanceCurrency} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="TL">TL</option>
                                    <option value="USD">USD</option>
                                    <option value="EURO">EURO</option>
                                </select>
                                {errors.AdvanceCurrency && <span className="advance-error">{errors.AdvanceCurrency}</span>}
                            </label>
                        )}
                        {formData.AdvanceType === 'individual' && (
                            <label>
                                Açıklama:
                                <textarea
                                    name="Description"
                                    value={formData.Description}
                                    onChange={handleChange}
                                    minLength="10"
                                    maxLength="300"
                                    required
                                />
                                {errors.Description && <span className="advance-error">{errors.Description}</span>}
                            </label>
                        )}
                        <button type="submit">Talebi Gönder</button>
                    </>
                )}

                {Object.values(errors).filter((error, index) => formData.AdvanceType === 'individual' || error !== errors.Description).map((error, index) => (
                    <p key={index} className="advance-error">{error}</p>
                ))}
                {successMessage && <p className="advance-success">{successMessage}</p>}
            </form>
        </div>
    );
};

export default AdvanceRequestForm;
