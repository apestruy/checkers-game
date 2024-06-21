import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    passwordRepeat: "",
  });

  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setErrorMessage("");

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setFormData({ name: "", username: "", password: "", passwordRepeat: "" });
    setErrorMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.password !== formData.passwordRepeat) {
      setErrorMessage("Passwords do not match 😔");
      return;
    }

    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: formData.username,
        name: formData.name,
        password: formData.password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setRedirect(true);
        } else {
          response.json().then((data) => {
            if (response.status === 409) {
              setErrorMessage("This username is already taken 😔");
            } else {
              setErrorMessage("Something went wrong. Please try again.");
            }
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Signup failed:", error);
        setLoading(false);
        setErrorMessage("Network error. Please try again later.");
      });
  };

  if (redirect) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="auth-container">
      <h2 className="auth-header">Create Your Account</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        {["name", "username", "password", "passwordRepeat"].map((field) => (
          <React.Fragment key={field}>
            <label className="form-label">
              {field === "passwordRepeat"
                ? "Confirm Password"
                : field.charAt(0).toUpperCase() + field.slice(1)}
              <input
                className="form-input"
                type={field.includes("password") ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </label>
          </React.Fragment>
        ))}

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="button-container">
          <button type="submit" disabled={loading} className="auth-button">
            Sign Up
          </button>

          <button type="button" onClick={handleClear} className="auth-button">
            Clear
          </button>
        </div>
      </form>

      <Link to="/login" className="link">
        Already have an account? Log in!
      </Link>
    </div>
  );
};

export default Signup;
