import "./Form.scss";
import appLogo from "../assets/img/todo-logo-app.png";
import showPassword from "../assets/img/show-password-icon.jpg";
import hidePassword from "../assets/img/hide-password-icon.jpg";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

interface User {
  username: string;
  email: string;
  password: string;
  gender: string;
  country: string;
}

export default function SignUpForm() {
  //Form Logic
  const [country, setCountry] = useState<string>("Choose your country:");
  const [openSelect, setOpenSelect] = useState<boolean>(false);
  const [revealPassword, setRevealPassword] = useState<boolean>(false);

  const handleCountry = (country: string): void => {
    setCountry(country);
    setOpenSelect(false);

    setValue("country", country);
  };

  const handleOpenSelect = (): void => {
    setOpenSelect((prevCountry) => !prevCountry);
  };

  const handleRevealPassword = (): void => {
    setRevealPassword((prevPassword) => !prevPassword);
  };

  //Password pattern check
  const [passwordRequirements, setPasswordRequirements] = useState({
    hasNumber: false,
    hasSpecialCharacter: false,
  });

  const checkPasswordPattern = (password: string): void => {
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[_@$!%*#?&]/.test(password);

    setPasswordRequirements({
      hasNumber: hasNumber,
      hasSpecialCharacter: hasSpecialCharacter,
    });
  };

  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newPassword = event.target.value;
    checkPasswordPattern(newPassword);
  };

  //React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError
  } = useForm<User>();

  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleFormSubmit = handleSubmit(async (data) => {
    data.country = country;

    try {
      await axios.post("http://localhost:3000/auth/register", data);
      console.log("User registered successfully");

      setShowSuccessMessage(true);

      setTimeout(() => {
        navigate("/auth/login")
      }, 2000)

    } catch (error) {
      console.error("Error registering user:", error);

      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.error === "This username has been taken before") {
          setError("username", { type: "manual", message: "This username has been taken before" });
        } else {
          setError("email", { type: "manual", message: "This email is used already" });
        }
        
      } else {
        alert("An unknown error occurred");
      }
    }
  });

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
      <form onSubmit={handleFormSubmit} className="sign-up-form">
        <div className="app-info app-info-signup">
          <div className="app-info--img">
            <img
              src={appLogo}
              alt="app-logo"
              width="80"
              height="80"
              draggable="false"
            />
          </div>
          <div className="app-info--title">
            <h1>Dave's Todo App</h1>
          </div>
        </div>
        <div className="form-inner-container">
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              {...register("username", {
                required: { value: true, message: "This field is required" },
                minLength: { value: 5, message: "The length is not enough" },
                maxLength: { value: 15, message: "The length is too much" },
              })}
              type="text"
              id="username"
              placeholder="Enter username"
              autoComplete="username"
              aria-invalid={errors.username ? "true" : "false"}
            />
            {errors.username && <p role="alert">{errors.username.message}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              {...register("email", {
                required: { value: true, message: "This field is required" },
                pattern: {
                  value: /^[a-zA-z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-z]{2,3}$/,
                  message: "Enter valid email",
                },
              })}
              type="email"
              id="email"
              placeholder="Enter email"
              autoComplete="email"
            />
            {errors.email && <p role="alert">{errors.email.message}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              {...register("password", {
                required: { value: true, message: "This field is required" },
                minLength: { value: 8, message: "The password is too short" },
                maxLength: { value: 15, message: "The password is too long" },
                pattern: {
                  value:
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[_@$!%*#?&])[A-Za-z\d@_$!%*#?&]{8,}$/,
                  message: "The password doesn't match the pattern",
                },
              })}
              type={revealPassword ? "text" : "password"}
              id="password"
              placeholder="Enter password"
              autoComplete="current-password"
              onChange={handlePasswordChange}
            />
            {errors.password && <p role="alert">{errors.password.message}</p>}
            <p className="password-pattern">
              <span className={passwordRequirements.hasNumber ? "correct" : ""}>
                at least 1 number
              </span>
              <span
                className={
                  passwordRequirements.hasSpecialCharacter ? "correct" : ""
                }
              >
                at least 1 special character (_@$!%*#?&)
              </span>
            </p>
            <img
              onClick={handleRevealPassword}
              src={revealPassword ? hidePassword : showPassword}
              alt="password-visibility"
              width="30"
              height="30"
            />
          </div>
          <div className="form-field">
            <div className="radio-option">
              <input
                {...register("gender", {
                  required: {
                    value: true,
                    message: "You must choose the gender",
                  },
                })}
                type="radio"
                value="Male"
                id="male"
              />
              <label htmlFor="male">Male</label>
            </div>
            <div className="radio-option">
              <input
                {...register("gender", {
                  required: {
                    value: true,
                    message: "You must choose the gender",
                  },
                })}
                type="radio"
                value="Female"
                id="female"
              />
              <label htmlFor="female">Female</label>
            </div>
            {errors.gender && <p role="alert">{errors.gender.message}</p>}
          </div>
          <div className="form-field">
            <div className="select">
              <div
                onClick={handleOpenSelect}
                className="select-option"
                style={{ borderColor: openSelect ? "#7a5cfa" : "#ccc" }}
              >
                {country}
              </div>
              {openSelect && (
                <div
                  className="select-option"
                  style={{
                    pointerEvents: country === "Ukraine" ? "none" : "auto",
                    opacity: country === "Ukraine" ? "0.5" : "initial",
                  }}
                  onClick={() => handleCountry("Ukraine")}
                >
                  Ukraine
                </div>
              )}
              {openSelect && (
                <div
                  className="select-option"
                  style={{
                    pointerEvents: country === "Poland" ? "none" : "auto",
                    opacity: country === "Poland" ? "0.5" : "initial",
                  }}
                  onClick={() => handleCountry("Poland")}
                >
                  Poland
                </div>
              )}
              {openSelect && (
                <div
                  className="select-option"
                  style={{
                    pointerEvents:
                      country === "Czech Republic" ? "none" : "auto",
                    opacity: country === "Czech Republic" ? "0.5" : "initial",
                  }}
                  onClick={() => handleCountry("Czech Republic")}
                >
                  Czech Republic
                </div>
              )}
            </div>
            <input
              {...register("country", {
                required: {
                  value: true,
                  message: "You must choose the country",
                },
              })}
              type="hidden"
            />
            {errors.country && <p role="alert">{errors.country.message}</p>}
          </div>
          <button type="submit">Sign Up</button>

          <div className="dont-have-an-account">
            <p>Already have an account?</p>
            <Link to="/auth/login">Log in</Link>
          </div>

        </div>

        <div style={{display: showSuccessMessage ? "block" : "none"}} className="check-wrapper"> <svg className="animated-check" viewBox="0 0 24 24">
          <path d="M4.1 12.7L9 17.6 20.3 6.3" fill="none" /> </svg>
        </div>

      </form>
    </div>
  );
}



