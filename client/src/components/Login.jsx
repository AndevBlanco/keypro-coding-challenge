import React, { useState } from "react";
import { TextField, Button, Box, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const goToSignUp = () => {
    navigate("/signup");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Login successful");
        // Aquí podrías redirigir a otra página o manejar el estado de login
      } else {
        console.error("Login failed");
        // Manejo de errores, por ejemplo mostrar un mensaje al usuario
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <main id="login">
      <section className="main-container">
        <section id="section-logo">
          <h1 id="title-login">
            Map <i className="fas fa-question-circle"></i>
          </h1>
        </section>
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
                  sx={{ mt: 3, mb: 2 }}
                  onClick={goToSignUp}
                >
                  Sign Up
                </Button>
              </Box>
            </Box>
          </Container>
        </section>
      </section>
    </main>
  );
};

export default Login;
