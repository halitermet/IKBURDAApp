import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navi from "../components/Navi";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/ResetPassword.css";
import AuthContext from "../context/AuthContext";
import Loginlogo from "../assets/image/Loginlogo.png";

const ResetPassword = () => {
  const { auth } = useContext(AuthContext); // AuthContext'ten auth bilgisini alın

  const navigate = useNavigate();
  const location = useLocation();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tempPassword, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const { email, screen } = location.state || {};

  useEffect(() => {
    if (!screen) navigate("/login");

    if (screen === "Password") {
      const timer =
        timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const sendResetEmailClick = async () => {
    try {
      setTimeLeft(120);
      await axios.post(
        "https://ikprojesitakimiki.azurewebsites.net/api/Mail/send-verification-code",
        {
          email: email,
        }
      );
      setMessage("Doğrulama kodu yeniden E-posta adresinize gönderildi.");
      setError("");
    } catch (error) {
      setError("E-posta gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const validatePassword = (password) => {
    const minLength = 6;
    const countUpperCase = password.match(/[A-Z]/g);
    const countLowerCase = password.match(/[a-z]/g);
    const countNumber = password.match(/[0-9]/g);
    const countSpecialChar = password.match(/[!@#$%^&*(),.?":{}|<>]/g);

    if (password.length < minLength) {
      return `Şifre en az ${minLength} karakter uzunluğunda olmalıdır.`;
    }
    if (!countUpperCase || countUpperCase.length < 2) {
      return "Şifre en az iki büyük harf içermelidir.";
    }
    if (!countLowerCase || countLowerCase.length < 2) {
      return "Şifre en az iki küçük harf içermelidir.";
    }
    if (!countNumber || countNumber.length < 2) {
      return "Şifre en az iki rakam içermelidir.";
    }
    if (!countSpecialChar || countSpecialChar.length < 2) {
      return "Şifre en az iki özel karakter içermelidir.";
    }
    return null;
  };

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const resetPasswordClick = async (e) => {
    setError("");
    e.preventDefault();
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Şifreler uyuşmuyor.");
      return;
    }

    try {
      await axios.post(
        "https://ikprojesitakimiki.azurewebsites.net/api/Mail/reset-password",
        {
          email: email,
          verificationCode: tempPassword === "" ? null : tempPassword,
          mustChangePassword: screen === "Password",
          newPassword: newPassword,
        }
      );

      setMessage("Şifreniz başarıyla yenilendi.");
      setError("");
      await wait(3000);
      navigate("/login");
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === "IInvalid verification code."
      ) {
        setError("Doğrulama kodu yanlış.");
      } else {
        setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
      setMessage("");
    }
  };

  return (
    <>
      <Navi />
      <div className={`reset-password ${auth.role}`}>
        <div className="reset-password-box">
          <img className="LoginlogoP" src={Loginlogo} alt="Loginlogo" />
          {screen === "Login" ? (
            <div>
              <h5 className={`txt-warn ${auth.role}`}>Yeni kayıt yaptığınız için lütfen yeni şifre oluşturun!!!</h5>
            </div>
          ) : (
            <div></div>
          )}

          <div className="textbox">
            {screen === "Password" ? (
              <div>
                <input
                  type={showVerificationCode ? "text" : "password"}
                  placeholder="Doğrulama Kodu"
                  value={tempPassword}
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                  }}
                  required
                />
                <span
                  className="password-toggle-icon-a"
                  onClick={() => setShowVerificationCode(!showVerificationCode)}
                >
                  {showVerificationCode ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          {screen === "Password" ? (
            <div className="timer">
              {`Kalan süre: ${Math.floor(timeLeft / 60)}:${String(
                timeLeft % 60
              ).padStart(2, "0")}`}
            </div>
          ) : (
            <div></div>
          )}

          {screen === "Password" && timeLeft === 0 && (
            <button
              id="sendAgain"
              className="btn-yeniden"
              onClick={sendResetEmailClick}
            >
              Yeniden Şifre Gönder
            </button>
          )}

          <div className="textbox">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Yeni Şifre"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              required
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="textbox">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Yeni Şifre (Tekrar)"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              required
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button
            id="resetPassword"
            onClick={resetPasswordClick}
            className={`btn-yeniden ${auth.role}`}
          >
            Şifreyi Yenile
          </button>
          {message && <p className="ResetPasswordMessage">{message}</p>}
          {error && <p className="ResetPasswordError">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
