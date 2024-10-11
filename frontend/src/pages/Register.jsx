import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { sha256 } from "js-sha256";
import toast from "react-hot-toast";
import DOMPurify from "dompurify";
import RegisterForm from "../components/RegisterForm";

// Regex for validation
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/; // Alphanumeric and underscore, length 3-20
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/; // At least 6 characters, mix of upper/lower case, numbers, special chars

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleRegisterForm = async (evt) => {
    evt.preventDefault();

    // Sanitize inputs to avoid XSS
    const sanitizedUsername = DOMPurify.sanitize(formData.username);
    const sanitizedEmail = DOMPurify.sanitize(formData.email);
    const sanitizedPassword = DOMPurify.sanitize(formData.password);
    const sanitizedConfirmPassword = DOMPurify.sanitize(
      formData.confirmPassword
    );

    // Validate inputs
    const validationErrors = validateForm({
      username: sanitizedUsername,
      email: sanitizedEmail,
      password: sanitizedPassword,
      confirmPassword: sanitizedConfirmPassword,
    });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Hash the password using SHA256
        const hashedPassword = sha256(sanitizedPassword);

        // Send the hashed password to the backend
        await axios.post("http://localhost:5000/register", {
          username: sanitizedUsername,
          email: sanitizedEmail,
          password: hashedPassword, // Send SHA256 hashed password
        });

        toast.success("Registration successful! Please login.");
        navigate("/");
      } catch (err) {
        console.error(err);
        toast.error("Registration failed. Try again.");
      }
    }
  };

  const validateForm = (formData) => {
    let errors = {};

    // Username validation
    if (!formData.username) {
      errors.username = "Username is required";
    } else if (!usernameRegex.test(formData.username)) {
      errors.username =
        "Username must be 3-20 characters long and can only contain letters, numbers, and underscores";
    }

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email address format";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      errors.password =
        "Password must be at least 6 characters long and include a combination of upper/lower case letters, numbers, and special characters";
    }

    // Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleInputChange = (evt) => {
    evt.persist();
    setFormData((prevData) => ({
      ...prevData,
      [evt.target.name]: evt.target.value,
    }));
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-t from-slate-700 via-slate-800 to-slate-900 px-5 py-10">
      <RegisterForm
        handleRegisterForm={handleRegisterForm}
        handleInputChange={handleInputChange}
        formData={formData}
        errors={errors}
      />
    </div>
  );
};

export default Register;
