import React from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const AddMarkerModal = ({ open, handleClose, marker, setMarker }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMarker({ ...marker, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/addMarker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...marker, userId: localStorage.getItem('userId'), date: new Date()}),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Marker saved:", data);
      handleClose();
      marker.description = '';
    } catch (error) {
      console.error("Error saving marker:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Add Marker Information
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          onChange={handleChange}
        />
        <Button onClick={handleSave} variant="contained" sx={{ mt: 2 }}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default AddMarkerModal;
