import "./Form.scss";
import { Link, useNavigate } from "react-router-dom"
import appLogo from '../assets/img/todo-logo-app.png'
import showPassword from '../assets/img/show-password-icon.jpg'
import hidePassword from '../assets/img/hide-password-icon.jpg'
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

interface LoginUser {
  email: string;
  password: string;
  rememberMe: boolean;
}


export default function LogInForm() {
  const [revealPassword, setRevealPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleRevealPassword = (): void => {
    setRevealPassword((prevPassword) => !prevPassword)
  }

  //React Hook Form
  const {register, handleSubmit, formState: { errors }, setError} = useForm<LoginUser>();

  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      data.rememberMe = rememberMe;

      await axios.post("https://todo-app-api-production-f55a.up.railway.app/auth/login", data);
      console.log("User logged in successfully");

      setShowSuccessMessage(true);

      setTimeout(() => {
        navigate("/home")
      }, 2000)

    } catch (error) {
      console.error("Error logging user:", error);

      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.error === 'This email is not registered') {
          setError("email", { type: "manual", message: 'This email is not registered' });
        } else {
          setError("password", { type: "manual", message: "Incorrect password" });
        }
        
      } else {
        alert("An unknown error occurred");
      }
    }
  })

  useEffect(() => {
    if (showSuccessMessage) {
      
      const hideSuccessTimeout = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000); 

      return () => clearTimeout(hideSuccessTimeout);
    }
  }, [showSuccessMessage]);

  return (
    <div className="form-container">
      <form onSubmit={handleFormSubmit} className="log-in-form">
        <div className="app-info app-info-login">
          <div className="app-info--img">
            <img src={appLogo} alt="app-logo" width="80" height="80" draggable="false" />
          </div>
          <div className="app-info--title">
            <h1>Dave's Todo App</h1>
          </div>
        </div>
        <div className="form-inner-container">
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input {...register("email", {required: {value: true, message: "This field is required"}})} type="email" id="email" placeholder="Enter email" autoComplete="email" />

            {errors.email && <p role="alert">{errors.email.message}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input {...register("password", {required: {value: true, message: "This field is required"}})} type={revealPassword ? "text" : "password"} id="password" placeholder="Enter password" autoComplete="current-password" />
            <img onClick={handleRevealPassword} src={revealPassword ? hidePassword : showPassword} alt="password-visibility" width="30" height="30" />

            {errors.password && <p role="alert">{errors.password.message}</p>}
          </div>
          <div className="form-field remember-me">
            <input {...register("rememberMe")} id="remember" type="checkbox" checked={rememberMe} onChange={() => {
              setRememberMe(!rememberMe);
            }} />
            <label htmlFor="remember">Remember Me</label>
          </div>
          <button type="submit">Log In</button>
          <div className="dont-have-an-account">
            <p>Don't have an account?</p>
            <Link to="/auth/signup">Sign Up</Link>
          </div>
        </div>

        <div style={{display: showSuccessMessage ? "block" : "none"}} className="check-wrapper"> <svg className="animated-check" viewBox="0 0 24 24">
          <path d="M4.1 12.7L9 17.6 20.3 6.3" fill="none" /> </svg>
        </div>

      </form>
    </div>
  );
}
