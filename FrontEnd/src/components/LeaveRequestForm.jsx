import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import '../styles/LeaveRequestForm.css';

const LeaveRequestForm = () => {
    const initialFormData = {
        LeaveType: '',
        LeaveStartDate: '',
        DaysCount: 1,
        LeaveEndDate: '',
    };

    const leaveTypes = [
        { type: 'Yıllık İzin', fixedDays: null },
        { type: 'Babalık İzni', fixedDays: 5 },
        { type: 'Doğum İzni', fixedDays: 112 },
        { type: 'Hastalık İzni', fixedDays: 10 },
        { type: 'Evlilik İzni', fixedDays: 7 },
        { type: 'Doğal Afet İzni', fixedDays: 10 },
        { type: 'Cenaze İzni', fixedDays: 3 },
        { type: 'Ücretsiz İzin', fixedDays: null },
    ];

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [employeeStartDate, setEmployeeStartDate] = useState('');
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const response = await axios.get('https://ikprojesitakimiki.azurewebsites.net/api/User/getUserByToken', {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                    },
                });
                setEmployeeStartDate(response.data.data.startDate); 
            } catch (error) {
                console.error('Çalışan bilgisi alınırken hata oluştu:', error);
            }
        };

        fetchEmployeeDetails();
    }, [auth.token]);

    useEffect(() => {
        if (formData.LeaveStartDate && formData.DaysCount > 0) {
            const selectedLeave = leaveTypes.find(leave => leave.type === formData.LeaveType);
            if (selectedLeave && selectedLeave.fixedDays) {
                const endDate = new Date(formData.LeaveStartDate);
                endDate.setDate(endDate.getDate() + selectedLeave.fixedDays);
                setFormData(prevData => ({
                    ...prevData,
                    DaysCount: selectedLeave.fixedDays,
                    LeaveEndDate: endDate.toISOString().split('T')[0],
                }));
            } else if (selectedLeave && selectedLeave.type === 'Yıllık İzin') {
                const startDate = new Date(employeeStartDate);
                const currentDate = new Date();
                const yearsWorked = currentDate.getFullYear() - startDate.getFullYear();

                let daysCount = 0;
                if (yearsWorked < 1) {
                    daysCount = 0;
                } else if (yearsWorked >= 1 && yearsWorked < 6) {
                    daysCount = 15;
                } else if (yearsWorked >= 6) {
                    daysCount = 20;
                }

                const endDate = new Date(formData.LeaveStartDate);
                endDate.setDate(endDate.getDate() + daysCount);
                setFormData(prevData => ({
                    ...prevData,
                    DaysCount: daysCount,
                    LeaveEndDate: endDate.toISOString().split('T')[0],
                }));
            } else {
                const endDate = new Date(formData.LeaveStartDate);
                endDate.setDate(endDate.getDate() + (formData.DaysCount - 1));
                setFormData(prevData => ({
                    ...prevData,
                    LeaveEndDate: endDate.toISOString().split('T')[0],
                }));
            }
        }
    }, [formData.LeaveStartDate, formData.DaysCount, formData.LeaveType]);

    const validate = () => {
        const newErrors = {};

        if (!formData.LeaveType) {
            newErrors.LeaveType = 'İzin türü boş olamaz';
        }

        if (!formData.LeaveStartDate) {
            newErrors.LeaveStartDate = 'Başlangıç tarihi boş olamaz';
        } else if (formData.LeaveStartDate < employeeStartDate) {
            newErrors.LeaveStartDate = 'İzin başlangıç tarihi çalışanın işe başlangıç tarihinden sonra olmalıdır';
        }

        if (!formData.DaysCount || isNaN(formData.DaysCount) || formData.DaysCount < 1) {
            newErrors.DaysCount = 'Gün sayısı en az 1 olmalıdır';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: '',
        }));
    };

    const handleLeaveTypeChange = (e) => {
        const { value } = e.target;
        setFormData({
            LeaveType: value,
            LeaveStartDate: '',
            DaysCount: 1,
            LeaveEndDate: '',
        });
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        const submitFormData = { ...formData };

        // İzin türlerini backend'e uygun şekilde dönüştürme
        switch (formData.LeaveType) {
            case 'Yıllık İzin':
                submitFormData.LeaveType = 'Yıllık';
                break;
            case 'Babalık İzni':
                submitFormData.LeaveType = 'Babalık';
                break;
            case 'Doğum İzni':
                submitFormData.LeaveType = 'Doğum';
                break;
            case 'Hastalık İzni':
                submitFormData.LeaveType = 'Hastalık';
                break;
            case 'Evlilik İzni':
                submitFormData.LeaveType = 'Evlilik';
                break;
            case 'Doğal Afet İzni':
                submitFormData.LeaveType = 'DogalAfet';
                break;
            case 'Cenaze İzni':
                submitFormData.LeaveType = 'Cenaze';
                break;
            case 'Ücretsiz İzin':
                submitFormData.LeaveType = 'ücretsiz';
                break;
            default:
                break;
        }

        try {
            await axios.post('https://ikprojesitakimiki.azurewebsites.net/api/Request/CreateLeave', submitFormData, {
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
        <div className="leave-form-container">
            <form className="leave-form" onSubmit={handleSubmit}>
                <label>
                    İzin Türü:
                    <select 
                        name="LeaveType" 
                        value={formData.LeaveType} 
                        onChange={handleLeaveTypeChange} 
                        required
                    >
                        <option value="">Seçiniz</option>
                        {leaveTypes.map((leave, index) => (
                            <option key={index} value={leave.type}>
                                {leave.type}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Başlangıç Tarihi:
                    <input 
                        type="date" 
                        name="LeaveStartDate" 
                        value={formData.LeaveStartDate} 
                        onChange={handleChange} 
                        min={employeeStartDate}
                        required 
                    />
                </label>
                <label>
                    Gün Sayısı:
                    <input 
                        type="number" 
                        name="DaysCount" 
                        value={formData.DaysCount} 
                        onChange={handleChange} 
                        min="1" 
                        disabled={leaveTypes.find(leave => leave.type === formData.LeaveType)?.fixedDays !== null || formData.LeaveType === 'Yıllık İzin'}
                        required 
                    />
                </label>
                <label>
                    Bitiş Tarihi:
                    <input 
                        type="date" 
                        name="LeaveEndDate" 
                        value={formData.LeaveEndDate} 
                        readOnly 
                    />
                </label>
                <button type="submit">Talebi Gönder</button>
                {Object.keys(errors).length > 0 && (
                    <div className="leave-errors">
                        {Object.values(errors).map((error, index) => (
                            <p key={index} className="leave-error">{error}</p>
                        ))}
                    </div>
                )}
                {successMessage && <p className="leave-success">{successMessage}</p>}
            </form>
        </div>
    );
};

export default LeaveRequestForm;
