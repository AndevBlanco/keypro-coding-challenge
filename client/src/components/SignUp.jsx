import React, { useState } from "react";
import { TextField, Button, Box, Container, Typography } from "@mui/material";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });

  const signin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://172.20.0.3:5001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("User created successfully");
      } else {
        console.error("Failed to create user");
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
            </Box>
          </Container>
        </section>
      </section>
    </main>
  );
};

export default SignUp;
