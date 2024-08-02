import React, { useContext, useEffect } from "react";
import ProfileCard from "./ProfileCard";
import Sidebar from "./Sidebar";
import Navi from "./Navi";
import "../styles/Main.css";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PrivateRoute from '../components/PrivateRoute';

const Main = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!response.data.mustChangePassword) {
  //     navigate("/login");
  //   }
  // }, []);

  if (!auth.role) {
    return <div>Unauthorized Access</div>;
  }

  return (
    <>
    {/* <PrivateRoute element={Navi} roles={['admin', 'manager','employee']}/>
    <PrivateRoute element={Sidebar} roles={['admin', 'manager','employee']}/>
    <PrivateRoute element={ProfileCard} roles={['admin', 'manager','employee']}/> */}

      <Navi />
      <Sidebar />
      <ProfileCard />
    </>
  );
};

export default Main;
