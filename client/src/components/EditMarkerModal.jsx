import React, { useEffect, useState } from "react";
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

const EditMarkerModal = ({ open, handleClose, marker, setMarker }) => {
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (marker.userId == localStorage.getItem("userId")) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMarker({ ...marker, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/editMarker/${marker.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(marker),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Marker updated:", data);
      handleClose();
    } catch (error) {
      console.error("Error updating marker:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/deleteMarker/${marker.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Marker deleted:", data);
      handleClose();
    } catch (error) {
      console.error("Error updating marker:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Edit marker Information
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="User Name"
          name="name"
          value={marker.name}
          onChange={handleChange}
          disabled
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={marker.description}
          onChange={handleChange}
          disabled={isDisabled}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Date"
          name="date"
          value={marker.date}
          onChange={handleChange}
          disabled
        />
        <Button onClick={handleSave} variant="contained" sx={{ mt: 2 }} disabled={isDisabled}>
          Save
        </Button>
        <Button onClick={handleDelete} variant="contained" color="error" sx={{ mt: 2, ml: 2 }} disabled={isDisabled}>
          Delete
        </Button>
      </Box>
    </Modal>
  );
};

export default EditMarkerModal;
