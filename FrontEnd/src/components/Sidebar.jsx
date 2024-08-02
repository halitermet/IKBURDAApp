import React, { useState, useEffect, useContext } from 'react';
import { FaUserPlus, FaBuilding, FaListAlt, FaClipboardList, FaFileAlt, FaTasks, FaBriefcase, FaUser, FaCog, FaSuitcase, FaRegClipboard } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';
import AuthContext from '../context/AuthContext';

const Sidebar = () => {
  const { auth } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarClass = `sidebar ${isOpen ? 'open' : 'closed'} ${auth.role}-sidebar`;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={sidebarClass}>
      <ul className={`menu ${isOpen ? 'show' : 'hide'}`}>
        {auth.role === 'admin' && (
          <>
            <li onClick={toggleSidebar} className="menu-item ">
              <FaCog className="sbIconKapsayici" />
              <span className="menu-text">Şirket İşlemleri</span>
            </li>
            <div className="submenu">
              <li>
                <Link to="/addCompanyManager">
                  <FaUserPlus className="sbIcon"/><span className="menu-text">Yöneticisi Ekle</span>
                </Link>
              </li>
              <li>
                <Link to="/addCompany">
                  <FaBuilding className="sbIcon"/><span className="menu-text">Şirket Ekle</span>
                </Link>
              </li>
              <li>
                <Link to="/getAllManager">
                  <FaUser className="sbIcon"/><span className="menu-text">Yönetici Listele</span>
                </Link>
              </li>
              <li>
                <Link to="/getAllEmployee">
                  <FaListAlt className="sbIcon"/><span className="menu-text">Personel Listele</span>
                </Link>
              </li>
              <li>
                <Link to="/getAllCompanies">
                  <FaBuilding className="sbIcon"/><span className="menu-text">Şirketleri Listele</span>
                </Link>
              </li>
            </div>
          </>
        )}

        {auth.role === 'manager' && (
          <>
            <li onClick={toggleSidebar} className="menu-item ">
              <FaSuitcase className="sbIconKapsayici" />
              <span className="menu-text">Personel İşlemleri</span>
            </li>
            <div className="submenu">
              <li>
                <Link to="/addEmployee">
                  <FaUserPlus className="sbIcon"/><span className="menu-text">Personel Ekle</span>
                </Link>
              </li>
              <li>
                <Link to="/getAllEmployee">
                  <FaFileAlt className="sbIcon"/><span className="menu-text">Personelleri Listele</span>
                </Link>
              </li>
              <li>
                <Link to="/allRequests">
                  <FaTasks className="sbIcon"/><span className="menu-text">Talepler</span>
                </Link>
              </li>
            </div>
          </>
        )}

        {auth.role === 'employee' && (
          <>
            <li onClick={toggleSidebar} className="menu-item ">
              <FaRegClipboard className="sbIconKapsayici" />
              <span className="menu-text">Talepler</span>
            </li>
            <div className="submenu">
              <li>
                <Link to="/expenseRequest">
                  <FaClipboardList className="sbIcon"/><span className="menu-text">Talep Oluştur</span>
                </Link>
              </li>
              <li>
                <Link to="/requestList">
                  <FaTasks className="sbIcon"/><span className="menu-text">Talep Listele</span>
                </Link>
              </li>
            </div>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
