import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Password.css";
import Loginlogo from "../assets/image/Loginlogo.png";

 
const Password = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
 
  const navigate = useNavigate();
 
  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }
    try {
       await axios.post("https://ikprojesitakimiki.azurewebsites.net/api/Mail/send-verification-code", {
        email:email,
       });
      setMessage("Doğrulama kodu e-posta adresinize gönderildi. Şifre yenileme sayfasına yönlendiriliyorsunuz...");
      setError("");
      await wait(3000);
      navigate("/ResetPassword",{state:{email:email,screen:"Password"}});
 
    } catch (error) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      setMessage("");
    }
    // navigate("/ResetPassword")
    // Düzeltilince alt satır silinecek!!!!!
    navigate("/ResetPassword",{state:{email:email,screen:"Password"}});
  };
 
  if (!isOpen) return null;
 
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <img className="LoginlogoP" src={Loginlogo} alt="Loginlogo" />
        <form onSubmit={handleSubmit}>
          <div className="textbox">
            <input
              //type="email"
              placeholder="E-posta Adresiniz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
             
            />
          </div>
          <button type="submit" className="btn">
            Gönder
          </button>
        </form>
        {message && <p className="PasswordMessage">{message}</p>}
        {error && <p className="PasswordError">{error}</p>}
      </div>
    </div>
  );
};
 
export default Password;