import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useGameData } from "../../contexts/GameDataContext";
import "./Auth.scss";

const Login = () => {
  const { gameData, setGameData } = useGameData();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (gameData.playerId) {
      setRedirect(true);
    }
  }, [gameData.playerId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setErrorMessage("");

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setFormData({ username: "", password: "" });
    setErrorMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.playerId && result.playerName) {
          localStorage.setItem("playerId", result.playerId);
          localStorage.setItem("playerName", result.playerName);
          setGameData({
            ...gameData,
            playerId: result.playerId,
            playerName: result.playerName,
          });
          setLoading(false);
          setRedirect(true);
        } else {
          setErrorMessage("Invalid username or password");
        }
        setLoading(false);
      })

      .catch(() => {
        setLoading(false);
        setErrorMessage("Network error. Please try again later.");
      });
  };

  if (redirect) {
    return <Navigate to="/gameroom" replace />;
  }

  return (
    <div className="auth-container">
      <h2 className="auth-header">Log In</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="form-label">
          Username:
          <input
            className="form-input"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <label className="form-label">
          Password:
          <input
            className="form-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="button-container">
          <button type="submit" disabled={loading} className="auth-button">
            Log In
          </button>

          <button type="button" onClick={handleClear} className="auth-button">
            Clear
          </button>
        </div>
      </form>

      <Link to="/signup" className="link">
        <div>Don't have an account? Sign up!</div>
      </Link>
    </div>
  );
};

export default Login;
