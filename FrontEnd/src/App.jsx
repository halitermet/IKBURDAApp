import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Main from './components/Main';
import DetailPage from './components/DetailPage';
import PrivateRoute from './components/PrivateRoute';
import ResetPassword from './components/ResetPassword';
import UpdatePage from './components/UpdatePage';
import CompanyForm from './components/CompanyForm';
import { GetAllCompanies } from './components/GetAllCompanies';
import CompanyManagerForm from './components/CompanyManagerForm';
import CompanyDetailPage from './components/CompanyDetailPage';
import ManagerList from './components/ManagerList';
import PersonalList from './components/PersonalList';
import AuthContext, { AuthProvider } from './context/AuthContext';
import './App.css';
import ExpenseRequestForm from './components/ExpenseRequestForm';
import AdvanceRequestForm from './components/AdvanceRequestForm';
import LeaveRequestForm from './components/LeaveRequestForm';
import EmployeeRequests from './components/EmployeeRequests';
import Unauthorized from './components/Unauthorized';
import RequestList from './components/RequestList';

const App = () => {
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth.role) {
      document.body.classList.add(auth.role);
    }
    return () => {
      if (auth.role) {
        document.body.classList.remove(auth.role);
      }
    };
  }, [auth.role]);

  return (
    <Router>
      <div className={`app-container ${auth.role}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/main" element={<PrivateRoute element={Main} roles={['admin', 'manager','employee']} />} />
          <Route path="/userDetail" element={<PrivateRoute element={DetailPage} roles={['admin', 'manager','employee']} />} />
          <Route path="/updateUser" element={<PrivateRoute element={UpdatePage} roles={['admin', 'manager','employee']} />} />
          <Route path="/addCompany" element={<PrivateRoute element={CompanyForm} roles={['admin']} />} />
          <Route path="/getAllCompanies" element={<PrivateRoute element={GetAllCompanies} roles={['admin']} />} />
          <Route path="/addCompanyManager" element={<PrivateRoute element={CompanyManagerForm} roles={['admin']} />} />
          <Route path="/addEmployee" element={<PrivateRoute element={CompanyManagerForm} roles={['manager']} />} />
          <Route path="/companyDetail" element={<PrivateRoute element={CompanyDetailPage} roles={['admin', 'manager']} />} />
          <Route path="/getAllManager" element={<PrivateRoute element={ManagerList} roles={['admin',]} />} />
          <Route path="/getAllEmployee" element={<PrivateRoute element={PersonalList} roles={['admin','manager']} />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/expenseRequest" element={<PrivateRoute element={ExpenseRequestForm} roles={['employee']} />} />
          <Route path="/advanceRequest" element={<PrivateRoute element={AdvanceRequestForm} roles={['employee']} />} />
          <Route path="/leaveRequest" element={<PrivateRoute element={LeaveRequestForm} roles={['employee']} />} />
          <Route path="/allRequests" element={<PrivateRoute element={EmployeeRequests} roles={['manager']} />} />
          <Route path="/" element={<PrivateRoute element={Main} roles={['admin', 'manager','employee']} />} />
          <Route path="/requestList" element={<PrivateRoute element={RequestList} roles={['employee']} />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </div>
    </Router>
  );
};

const AppWrapper = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default AppWrapper;
