import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Form.css";
import axios from "axios";
import Password from "./Password";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loginlogo from "../assets/image/Loginlogo.png";
import AuthContext from "../context/AuthContext";

function Form() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth, auth } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mail && password) {
      try {
        const response = await axios.post(
          "https://ikprojesitakimiki.azurewebsites.net/api/User/login",
          {
            email: mail,
            password: password,
          }
        );
        const token = response.data.token;
        localStorage.setItem("token", token);
        setAuth({ token });
        if (!response.data.mustChangePassword)
          navigate("/resetPassword", {
            state: { email: mail, screen: "Login" ,mustChangePassword:false},
          });
        // Doğrudan yeniden yönlendirme
        else{
          localStorage.setItem('email',mail)
          navigate("/main");
        } 
      } catch (error) {
        setError("Geçersiz e-posta veya şifre. Lütfen tekrar deneyin.");
      }
    } else {
      setError("Lütfen e-posta ve şifre alanlarını doldurun.");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (auth.token) {
      navigate("/main");
    }
  }, [auth.token, navigate]);

  return (
    <div className="container">
      <div className="login-box">
        <img className="Loginlogo" src={Loginlogo} alt="Loginlogo" />
        <form onSubmit={handleSubmit}>
          <div className="textbox">
            <input
              type="text"
              placeholder="Mail"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
            />
          </div>
          <div className="textbox">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="btn">
            Giriş Yap
          </button>
        </form>
        {error && <p className="FormError">{error}</p>}
        <a href="#" className="forgot-password" onClick={openModal}>
          Şifremi Unuttum
        </a>
      </div>
      <Password isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default Form;
