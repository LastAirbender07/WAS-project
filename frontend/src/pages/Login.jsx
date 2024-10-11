import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { sha256 } from "js-sha256";
import toast from "react-hot-toast";
import DOMPurify from "dompurify";
import LoginForm from "../components/LoginForm";

// Regex for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLoginForm = async (evt) => {
    evt.preventDefault();

    // Sanitize inputs to avoid XSS
    const sanitizedEmail = DOMPurify.sanitize(credentials.email);
    const sanitizedPassword = DOMPurify.sanitize(credentials.password);

    const validationErrors = validateCredentials(
      sanitizedEmail,
      sanitizedPassword
    );
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const hashedPassword = sha256(sanitizedPassword);
        const response = await axios.post("http://localhost:5000/login", {
          email: sanitizedEmail,
          password: hashedPassword,
        });
        if (response.data.success) {
          toast.success("Login successful!");
          navigate("/home", { state: { email: sanitizedEmail } });
        } else {
          toast.error(response.data.message || "Login failed.");
        }
      } catch (err) {
        console.error(err);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const validateCredentials = (email, password) => {
    let errors = {};

    if (!email) {
      errors.email = "This field is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email address format";
    }

    if (!password) {
      errors.password = "This field is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    return errors;
  };

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-t from-slate-700 via-slate-800 to-slate-900 px-5 py-10">
      <LoginForm
        handleLoginForm={handleLoginForm}
        handleInputChange={handleInputChange}
        credentials={credentials}
        errors={errors}
      />
    </div>
  );
};

export default Login;
