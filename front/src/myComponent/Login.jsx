import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/auth", {
        username,
        password,
      });
      if (response.status === 200) {
        console.log("this is ", response.data);
        localStorage.setItem("token", response.data); // Save token
        // Fetch current user info
        const userResponse = await axios.get(
          "http://localhost:8080/api/user/loggedInUserInfo",
          {
            headers: {
              Authorization: `Bearer ${response.data}`,
            },
          }
        );
        const userData = userResponse.data;
        console.log("role and permissions ", userData);

        localStorage.setItem("user", JSON.stringify(userData));

        // ✅ Role-based navigation
        if (userData.roles.includes("ROLE_ADMIN")) {
          navigate("/admin-dashboard");
        } else if (userData.roles.includes("ROLE_DOCTOR")) {
          navigate("/doctor-dashboard");
        } else if (userData.roles.includes("ROLE_USER")) {
          navigate("/home"); // fallback
        }
        localStorage.setItem("user", JSON.stringify(userResponse.data));
      } else if (response.status === 401) {
        console.log(response.data);
        setError(response.data);
      }
    } catch (err) {
      if (err.response) {
        // Backend responded with a status code outside the range of 2xx
        if (err.response.status === 401) {
          setError(err.response.data || "Invalid credentials");
        } else {
          setError(`Error: ${err.response.status} - ${err.response.data}`);
        }
      } else if (err.request) {
        // Request was made but no response received
        setError("Server is not responding. Please try again later.");
      } else {
        // Something else went wrong
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2
          onClick={() => navigate("/user-add")}
          className="text-blue-600 cursor-pointer hover:underline"
          style={{ display: "inline-block" }}
        >
          Signup
        </h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <i className="fa fa-user"></i>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>

          <div className="form-group">
            <i className="fa fa-lock"></i>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
