import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import SignUpForm from "./components/SignUpForm";
import LogInForm from "./components/LogInForm";
import Home from "./components/Home";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" />} />
        <Route path="/auth/login" element={<LogInForm />} />
        <Route path="/auth/signup" element={<SignUpForm />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
