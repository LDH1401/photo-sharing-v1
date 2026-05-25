import React, { useState } from "react";
import { Alert, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

const emptyRegistration = {
  login_name: "",
  password: "",
  confirmPassword: "",
  first_name: "",
  last_name: "",
  location: "",
  description: "",
  occupation: "",
};

function LoginRegister({ onLogin }) {
  const navigate = useNavigate();
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registration, setRegistration] = useState(emptyRegistration);
  const [registrationError, setRegistrationError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState("");
  const [registering, setRegistering] = useState(false);

  const updateRegistration = (field, value) => {
    setRegistration((currentRegistration) => ({
      ...currentRegistration,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedLoginName = loginName.trim();
    if (!trimmedLoginName) {
      setError("Please enter a login name.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    setSubmitting(true);
    setError("");

    fetchModel("/admin/login", {
      method: "POST",
      body: JSON.stringify({ login_name: trimmedLoginName, password }),
    })
      .then((user) => {
        onLogin(user);
        navigate(`/users/${user._id}`, { replace: true });
      })
      .catch((loginError) => {
        setError(loginError.message || "Login failed. Please try again.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const validateRegistration = () => {
    if (!registration.login_name.trim()) {
      return "Login name is required.";
    }

    if (!registration.password) {
      return "Password is required.";
    }

    if (registration.password !== registration.confirmPassword) {
      return "Password and confirmation password must match.";
    }

    if (!registration.first_name.trim()) {
      return "First name is required.";
    }

    if (!registration.last_name.trim()) {
      return "Last name is required.";
    }

    return "";
  };

  const handleRegister = (event) => {
    event.preventDefault();

    const validationError = validateRegistration();
    if (validationError) {
      setRegistrationError(validationError);
      setRegistrationSuccess("");
      return;
    }

    setRegistering(true);
    setRegistrationError("");
    setRegistrationSuccess("");

    fetchModel("/user", {
      method: "POST",
      body: JSON.stringify({
        login_name: registration.login_name.trim(),
        password: registration.password,
        first_name: registration.first_name.trim(),
        last_name: registration.last_name.trim(),
        location: registration.location.trim(),
        description: registration.description.trim(),
        occupation: registration.occupation.trim(),
      }),
    })
      .then((user) => {
        setRegistration(emptyRegistration);
        setRegistrationSuccess(
          `Registered ${user.first_name} ${user.last_name}. You can now login.`
        );
      })
      .catch((registerError) => {
        setRegistrationError(registerError.message || "Registration failed.");
      })
      .finally(() => {
        setRegistering(false);
      });
  };

  return (
    <div className="login-register">
      <div className="login-register-panel">
        <section>
          <Typography variant="h4">Please Login</Typography>
          <form className="login-register-form" onSubmit={handleSubmit}>
            <TextField
              autoFocus
              fullWidth
              label="Login name"
              onChange={(event) => setLoginName(event.target.value)}
              value={loginName}
            />
            <TextField
              fullWidth
              label="Password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button disabled={submitting} type="submit" variant="contained">
              {submitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </section>

        <section className="login-register-section">
          <Typography variant="h5">Register</Typography>
          <form className="login-register-form" onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="Login name"
              onChange={(event) => updateRegistration("login_name", event.target.value)}
              value={registration.login_name}
            />
            <TextField
              fullWidth
              label="Password"
              onChange={(event) => updateRegistration("password", event.target.value)}
              type="password"
              value={registration.password}
            />
            <TextField
              fullWidth
              label="Confirm password"
              onChange={(event) =>
                updateRegistration("confirmPassword", event.target.value)
              }
              type="password"
              value={registration.confirmPassword}
            />
            <div className="login-register-name-row">
              <TextField
                fullWidth
                label="First name"
                onChange={(event) =>
                  updateRegistration("first_name", event.target.value)
                }
                value={registration.first_name}
              />
              <TextField
                fullWidth
                label="Last name"
                onChange={(event) =>
                  updateRegistration("last_name", event.target.value)
                }
                value={registration.last_name}
              />
            </div>
            <TextField
              fullWidth
              label="Location"
              onChange={(event) => updateRegistration("location", event.target.value)}
              value={registration.location}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              onChange={(event) =>
                updateRegistration("description", event.target.value)
              }
              rows={3}
              value={registration.description}
            />
            <TextField
              fullWidth
              label="Occupation"
              onChange={(event) => updateRegistration("occupation", event.target.value)}
              value={registration.occupation}
            />
            {registrationError && (
              <Alert severity="error">{registrationError}</Alert>
            )}
            {registrationSuccess && (
              <Alert severity="success">{registrationSuccess}</Alert>
            )}
            <Button disabled={registering} type="submit" variant="contained">
              {registering ? "Registering..." : "Register Me"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default LoginRegister;
