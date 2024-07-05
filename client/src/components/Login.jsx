import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  Modal,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Login.scss";

const Login = () => {
  const navigate = useNavigate();
  if (localStorage.getItem('loggedIn')){
    navigate("/map");
  }
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    show: false,
    message: "",
  });

  const goToSignUp = () => {
    navigate("/signup");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`http://127.0.0.1:5000/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Login successful");
        localStorage.setItem("userId", JSON.stringify(data.user_id));
        localStorage.setItem("loggedIn", true);
        navigate("/map");
      } else {
        console.error("Login failed");
        setError({
          show: true,
          message: data.message || "Login failed",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setError({ show: true, message: "Error occurred while login" });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCloseErrorModal = () => {
    setError({ show: false, message: "" });
  };

  return (
    <main id="login">
      <section className="main-container">
        <section id="section-logo"></section>
        <section id="section-form">
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Login
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Log In
                </Button>
                <Button
                  type="button"
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 1, mb: 2 }}
                  onClick={goToSignUp}
                >
                  Sign Up
                </Button>
              </Box>
            </Box>
          </Container>
        </section>
      </section>
      <Modal
        open={error.show}
        onClose={handleCloseErrorModal}
        aria-labelledby="error-modal-title"
        aria-describedby="error-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 250,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="error-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            Error
          </Typography>
          <Typography
            id="error-modal-description"
            variant="body1"
            component="p"
          >
            {error.message}
          </Typography>
        </Box>
      </Modal>
    </main>
  );
};

export default Login;
