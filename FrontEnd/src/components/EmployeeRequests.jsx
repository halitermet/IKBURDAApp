import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import Navi from '../components/Navi';
import Sidebar from '../components/Sidebar';
import '../styles/EmployeeRequests.css';

const EmployeeRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [infoMessage, setInfoMessage] = useState({ text: '', type: '' });
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    fetchEmployeeRequests();
  }, [auth.token]);

  const fetchEmployeeRequests = async () => {
    try {
      const response = await axios.get('https://ikprojesitakimiki.azurewebsites.net/api/Request/GetAllRequests', {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      const data = response.data.data;
      console.log('API Response:', data);

      if (data && data.advanceRequests && data.expenseRequests && data.leaveRequests) {
        const allRequests = [
          ...data.advanceRequests.map(req => ({
            ...req,
            type: 'Avans',
            fullName: req.firstName && req.lastName ? `${req.firstName} ${req.lastName}` : 'Bilinmiyor'
          })),
          ...data.expenseRequests.map(req => ({
            ...req,
            type: 'Harcama',
            fullName: req.firstName && req.lastName ? `${req.firstName} ${req.lastName}` : 'Bilinmiyor'
          })),
          ...data.leaveRequests.map(req => ({
            ...req,
            type: 'İzin',
            fullName: req.firstName && req.lastName ? `${req.firstName} ${req.lastName}` : 'Bilinmiyor'
          }))
        ];
        setRequests(allRequests);
        setFilteredRequests(allRequests);
      } else {
        setError('Beklenmeyen veri formatı');
      }

      setLoading(false);
    } catch (error) {
      setError('Veriler alınırken bir hata oluştu');
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.post('https://ikprojesitakimiki.azurewebsites.net/api/Request/ApproveOrReject', {
        requestId: id,
        requestStatus: status
      }, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      setInfoMessage({
        text: `Talep ${status}.`,
        type: status === 'Onaylandı' ? 'approve' : 'reject'
      });
      const updatedRequests = requests.map(request =>
        request.id === id ? { ...request, requestStatus: status } : request
      );
      setRequests(updatedRequests);
      setFilteredRequests(updatedRequests);
      setTimeout(() => setInfoMessage({ text: '', type: '' }), 3000); // 3 saniye sonra bilgi mesajını kaldır
    } catch (error) {
      setError('Durum güncellenirken bir hata oluştu');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleFilterChange = (type, status) => {
    setFilterType(type);
    setFilterStatus(status);
    applyFilters(type, status);
  };

  const applyFilters = (type, status) => {
    let filtered = requests;
    if (type) {
      filtered = filtered.filter(request => request.type === type);
    }
    if (status) {
      filtered = filtered.filter(request => request.requestStatus === status);
    }
    setFilteredRequests(filtered);
  };

  return (
    <>
      <Navi />
      <Sidebar />
      <div className="employee-requests-container">
        <div className="filter-container">
          <label>
            Talep Türü:
            <select onChange={(e) => handleFilterChange(e.target.value, filterStatus)} value={filterType}>
              <option value="">Tümü</option>
              <option value="Avans">Avans</option>
              <option value="Harcama">Harcama</option>
              <option value="İzin">İzin</option>
            </select>
          </label>
          <label>
            Onay Durumu:
            <select onChange={(e) => handleFilterChange(filterType, e.target.value)} value={filterStatus}>
              <option value="">Tümü</option>
              <option value="Onaylandı">Onaylandı</option>
              <option value="Reddedildi">Reddedildi</option>
              <option value="Beklemede">Beklemede</option>
            </select>
          </label>
        </div>
        {infoMessage.text && (
          <div className={`employee-requests-popup ${infoMessage.type}`}>
            {infoMessage.text}
          </div>
        )}
        {loading ? (
          <p className="loading-message">Yükleniyor...</p>
        ) : error ? (
          <p className="employee-requests-error">{error}</p>
        ) : filteredRequests.length === 0 ? (
          <p>Görüntülenecek talep yok</p>
        ) : (
          <table className="employee-requests-table">
            <thead>
              <tr>
                <th>Personel Adı</th>
                <th>Talep Türü</th>
                <th>Detaylar</th>
                <th>Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.fullName}</td>
                  <td>{request.type}</td>
                  <td>
                    {request.type === 'Avans' && (
                      <>
                        {request.advanceType === 'individual' ? 'Bireysel' : 'Kurumsal'} - {request.advanceAmount} {request.advanceCurrency} <br />
                        Tarih: {formatDate(request.added)} <br />
                        {request.advanceType === 'individual' && <>Açıklama: {request.description || 'N/A'}</>}
                      </>
                    )}
                    {request.type === 'Harcama' && (
                      <>
                        Tür: {request.expenseType} <br />
                        Miktar: {request.expenseAmount} {request.expenseCurrency} <br />
                        Tarih: {formatDate(request.added)}
                      </>
                    )}
                    {request.type === 'İzin' && (
                      <>
                        Tip: {request.leaveType} <br />
                        Başlangıç: {formatDate(request.leaveStartDate)} <br />
                        Bitiş: {formatDate(request.leaveEndDate)} <br />
                        Gün Sayısı: {request.daysCount}
                      </>
                    )}
                  </td>
                  <td>{request.requestStatus}</td>
                  <td>
                    <button
                      onClick={() => handleUpdateStatus(request.id, 'Onaylandı')}
                      className="employee-requests-approve-button"
                      disabled={request.requestStatus !== 'Beklemede'}
                    >
                      Onayla
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(request.id, 'Reddedildi')}
                      className="employee-requests-reject-button"
                      disabled={request.requestStatus !== 'Beklemede'}
                    >
                      Reddet
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default EmployeeRequests;
