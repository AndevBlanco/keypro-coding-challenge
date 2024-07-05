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

const SignUp = () => {
  const navigate = useNavigate();
  if (localStorage.getItem("loggedIn")) {
    navigate("/map");
  }
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    show: false,
    message: "",
  });

  const goToLogin = () => {
    navigate("/");
  };

  const signin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        console.log("User created successfully");
        alert("Registered successful!")
        navigate("/");
      } else {
        console.error("Failed to create user");
        setError({
          show: true,
          message: data.message || "Failed to create user",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setError({ show: true, message: "Error occurred while signing up" });
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
              component="form"
              id="form-signup"
              onSubmit={signin}
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Sign Up
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="formGroupName"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="formGroupLastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="formGroupEmail"
                label="Email Address"
                name="email"
                autoComplete="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="formGroupPassword"
                label="Password"
                name="password"
                autoComplete="current-password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Button
                type="button"
                fullWidth
                variant="outlined"
                sx={{ mt: 1, mb: 2 }}
                onClick={goToLogin}
              >
                Log In
              </Button>
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

export default SignUp;
