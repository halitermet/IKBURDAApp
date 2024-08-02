import React, { useState, useContext } from 'react';
import axios from 'axios';
import Navi from '../components/Navi';
import Sidebar from '../components/Sidebar';
import '../styles/ExpenseRequestForm.css';
import AuthContext from '../context/AuthContext';
import AdvanceRequestForm from './AdvanceRequestForm';
import LeaveRequestForm from './LeaveRequestForm';

const ExpenseRequestForm = () => {
    const initialFormData = {
        expenseAmount: '',
        expenseType: '',
        currency: '',
        document: null,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [activeTab, setActiveTab] = useState('expense');
    const { auth } = useContext(AuthContext);

    const expenseTypeLimits = {
        'seyahat': { 'TL': { min: 500, max: 50000 }, 'USD': { min: 20, max: 1000 }, 'EURO': { min: 20, max: 1000 } },
        'konaklama': { 'TL': { min: 1000, max: 50000 }, 'USD': { min: 50, max: 1000 }, 'EURO': { min: 50, max: 1000 } },
        'yemek': { 'TL': { min: 500, max: 10000 }, 'USD': { min: 10, max: 500 }, 'EURO': { min: 10, max: 500 } },
        'diğer': { 'TL': { min: 1, max: 10000 }, 'USD': { min: 1, max: 1000 }, 'EURO': { min: 1, max: 1000 } },
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.expenseType) {
            newErrors.expenseType = 'Tür boş olamaz';
        }

        if (!formData.expenseAmount) {
            newErrors.expenseAmount = 'Tutar boş olamaz';
        } else if (isNaN(formData.expenseAmount)) {
            newErrors.expenseAmount = 'Tutar rakamlardan oluşmalıdır';
        } else if (formData.currency && formData.expenseType) {
            const limits = expenseTypeLimits[formData.expenseType][formData.currency];
            if (formData.expenseAmount < limits.min || formData.expenseAmount > limits.max) {
                newErrors.expenseAmount = `Tutar ${limits.min} ile ${limits.max} ${formData.currency} arasında olmalıdır`;
            }
        }

        if (!formData.currency) {
            newErrors.currency = 'Para birimi boş olamaz';
        }

        if (!formData.document) {
            newErrors.document = 'Doküman yüklemek zorunludur';
        } else {
            const validTypes = ['image/png', 'image/jpeg', 'application/pdf', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
            if (!validTypes.includes(formData.document.type)) {
                newErrors.document = 'Doküman png, jpeg, jpg, pdf, doc, docx veya txt formatında olmalıdır';
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

        if (name === 'expenseType' || name === 'currency') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                expenseType: '',
                expenseAmount: '',
                currency: '',
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '',
            }));
        }
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
            await axios.post('https://ikprojesitakimiki.azurewebsites.net/api/Request/CreateExpense', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${auth.token}`,
                },
            });
            setSuccessMessage('Talep başarıyla gönderildi');
            setFormData(initialFormData);
            setErrors({});
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
                setErrors({ form: 'Talep gönderilirken bir hata oluştu. Lütfen tekrar deneyin.' });
            }
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setErrors({});
        setSuccessMessage('');
    };

    return (
        <>
            <Navi />
            <Sidebar />
            <div className="expense-form-container">
                <div className="tabs">
                    <button
                        className={activeTab === 'expense' ? 'active' : ''}
                        onClick={() => handleTabChange('expense')}
                    >
                        Harcama Talebi
                    </button>
                    <button
                        className={activeTab === 'leave' ? 'active' : ''}
                        onClick={() => handleTabChange('leave')}
                    >
                        İzin Talebi
                    </button>
                    <button
                        className={activeTab === 'advance' ? 'active' : ''}
                        onClick={() => handleTabChange('advance')}
                    >
                        Avans Talebi
                    </button>
                </div>
                {activeTab === 'expense' && (
                    <form className="expense-form" onSubmit={handleSubmit}>
                        <div className="form-content">
                            <label>
                                Tür:
                                <select
                                    name="expenseType"
                                    value={formData.expenseType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Tür Seçiniz</option>
                                    <option value="seyahat">Seyahat</option>
                                    <option value="konaklama">Konaklama</option>
                                    <option value="yemek">Yemek</option>
                                    <option value="diğer">Diğer</option>
                                </select>
                            </label>
                            <div className="form-row">
                                <label>
                                    Tutar:
                                    <input
                                        type="number"
                                        name="expenseAmount"
                                        value={formData.expenseAmount}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                    />
                                </label>
                                <label>
                                    Para Birimi:
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>Para Birimi Seçiniz</option>
                                        <option value="TL">TL</option>
                                        <option value="USD">USD</option>
                                        <option value="EURO">EURO</option>
                                    </select>
                                </label>
                            </div>
                            <label>
                                Doküman Yükle:
                                <input
                                    type="file"
                                    name="document"
                                    onChange={handleChange}
                                    accept=".png, .jpeg, .pdf, .jpg, .doc, .docx, .txt"
                                    required
                                />
                            </label>
                        </div>
                        <button type="submit">Talebi Gönder</button>
                        {errors.form && <p className="expense-error">{errors.form}</p>}
                        {Object.values(errors).filter((error) => error !== errors.form).map((error, index) => (
                            <p key={index} className="expense-error">{error}</p>
                        ))}
                        {successMessage && <p className="expense-success">{successMessage}</p>}
                    </form>
                )}
                {activeTab === 'advance' && (
                    <AdvanceRequestForm />
                )}
                {activeTab === 'leave' && (
                    <LeaveRequestForm />
                )}
            </div>
        </>
    );
};

export default ExpenseRequestForm;
